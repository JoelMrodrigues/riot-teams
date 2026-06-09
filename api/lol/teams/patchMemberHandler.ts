// PATCH /api/lol/teams/:teamId/members/:userId
// Change le rôle d'un membre existant.
//
// Règles :
//   - requireCanManageRoles dans le router (owner | captain).
//   - Le rôle cible 'owner' et 'player' sont refusés (jamais via cet endpoint).
//   - Impossible de cibler le propriétaire actuel.
//   - Le membre doit exister dans lol_team_members.

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';
import { patchMemberSchema } from './validation.js';

export async function patchMemberHandler(req: Request, res: Response): Promise<void> {
  const parsed = patchMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { teamId, userId: targetUserId } = req.params;
  const { role } = parsed.data;

  // Récupère le propriétaire de l'équipe.
  const { rows: teamRows } = await query<{ owner_id: string }>(
    'SELECT owner_id FROM lol_teams WHERE id = $1 LIMIT 1',
    [teamId],
  );
  if (teamRows.length === 0) {
    res.status(404).json({ error: 'Équipe introuvable.' });
    return;
  }

  // Invariant : l'owner ne peut jamais être ciblé.
  if (teamRows[0].owner_id === targetUserId) {
    res.status(403).json({ error: 'Le propriétaire ne peut pas être ciblé par cette action.' });
    return;
  }

  const { rowCount } = await query(
    `UPDATE lol_team_members SET role = $1
     WHERE team_id = $2 AND user_id = $3 AND role != 'owner'`,
    [role, teamId, targetUserId],
  );

  if (!rowCount || rowCount === 0) {
    res.status(404).json({ error: 'Membre introuvable sur cette équipe.' });
    return;
  }

  res.json({ teamId, userId: targetUserId, role });
}
