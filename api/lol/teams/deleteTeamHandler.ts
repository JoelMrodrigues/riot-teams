// DELETE /api/lol/teams/:teamId
// Supprime une équipe (CASCADE sur managers + roster côté DB).
// Réservé au propriétaire (owner strict) — requireOwner appliqué dans le router.

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';

export async function deleteTeamHandler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params;

  const { rowCount } = await query(
    'DELETE FROM lol_teams WHERE id = $1',
    [teamId],
  );

  if (!rowCount || rowCount === 0) {
    res.status(404).json({ error: 'Équipe introuvable.' });
    return;
  }

  res.status(204).send();
}
