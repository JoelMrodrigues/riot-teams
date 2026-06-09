// DELETE /api/lol/teams/:teamId/members/:userId
// Retire un membre de l'équipe.
//
// Règles :
//   - requireCanManageRoles dans le router (owner | captain).
//   - Impossible de retirer le propriétaire (invariant absolu).
//   - Le membre doit exister.

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';

export async function removeMemberHandler(req: Request, res: Response): Promise<void> {
  const { teamId, userId: targetUserId } = req.params;

  // Récupère le propriétaire pour appliquer l'invariant.
  const { rows: teamRows } = await query<{ owner_id: string }>(
    'SELECT owner_id FROM lol_teams WHERE id = $1 LIMIT 1',
    [teamId],
  );
  if (teamRows.length === 0) {
    res.status(404).json({ error: 'Équipe introuvable.' });
    return;
  }

  // L'owner ne peut jamais être retiré via cet endpoint.
  if (teamRows[0].owner_id === targetUserId) {
    res.status(403).json({ error: 'Impossible de retirer le propriétaire de l\'équipe.' });
    return;
  }

  const { rowCount } = await query(
    `DELETE FROM lol_team_members
     WHERE team_id = $1 AND user_id = $2 AND role != 'owner'`,
    [teamId, targetUserId],
  );

  if (!rowCount || rowCount === 0) {
    res.status(404).json({ error: 'Membre introuvable sur cette équipe.' });
    return;
  }

  res.status(204).send();
}
