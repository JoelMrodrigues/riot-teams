// DELETE /api/lol/teams/:teamId/roster/:rosterId
// Retire un joueur du roster.
// Réservé aux managers (owner ou captain) — requireManager appliqué dans le router.

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';

export async function removeRosterHandler(req: Request, res: Response): Promise<void> {
  const { teamId, rosterId } = req.params;

  const { rowCount } = await query(
    'DELETE FROM lol_rosters WHERE id = $1 AND team_id = $2',
    [rosterId, teamId],
  );

  if (!rowCount || rowCount === 0) {
    res.status(404).json({ error: 'Entrée roster introuvable.' });
    return;
  }

  res.status(204).send();
}
