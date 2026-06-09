// POST /api/lol/teams/:teamId/members
// Ajoute un membre à l'équipe avec un rôle assignable.
//
// Règles :
//   - requireCanManageRoles dans le router (owner | captain).
//   - Le rôle 'owner' et 'player' sont refusés (jamais via cet endpoint).
//   - Impossible de cibler le propriétaire actuel de l'équipe.
//   - Vérifie que l'utilisateur cible existe dans profiles.
//   - Un utilisateur déjà membre voit son rôle inchangé (ON CONFLICT DO NOTHING).

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';
import { addMemberSchema } from './validation.js';

export async function addMemberHandler(req: Request, res: Response): Promise<void> {
  const parsed = addMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { teamId } = req.params;
  const { user_id: targetUserId, role } = parsed.data;

  // Récupère le propriétaire de l'équipe.
  const { rows: teamRows } = await query<{ owner_id: string }>(
    'SELECT owner_id FROM lol_teams WHERE id = $1 LIMIT 1',
    [teamId],
  );
  if (teamRows.length === 0) {
    res.status(404).json({ error: 'Équipe introuvable.' });
    return;
  }

  // Refuse de modifier le propriétaire (invariant absolu).
  if (teamRows[0].owner_id === targetUserId) {
    res.status(409).json({ error: 'Le propriétaire ne peut pas être ciblé par cette action.' });
    return;
  }

  // Vérifie que l'utilisateur cible existe.
  const { rows: userRows } = await query<{ id: string }>(
    'SELECT id FROM profiles WHERE id = $1 LIMIT 1',
    [targetUserId],
  );
  if (userRows.length === 0) {
    res.status(404).json({ error: 'Utilisateur introuvable.' });
    return;
  }

  // Insert — si déjà membre (PK conflict), on ne modifie rien (appelant doit utiliser PATCH).
  const { rowCount } = await query(
    `INSERT INTO lol_team_members (team_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (team_id, user_id) DO NOTHING`,
    [teamId, targetUserId, role],
  );

  if (!rowCount || rowCount === 0) {
    res.status(409).json({ error: 'Cet utilisateur est déjà membre de l\'équipe.' });
    return;
  }

  res.status(201).json({ teamId, userId: targetUserId, role });
}
