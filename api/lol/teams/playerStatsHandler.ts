// GET /api/lol/teams/:teamId/player-stats
// Stats Riot (rang SoloQ + top champions) par joueur du roster, avec cache en
// base (lol_roster_stats) : 1 requête par joueur pour détecter une nouvelle game,
// refresh complet uniquement si nécessaire. Auth requise.

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';
import { syncTeamStats } from './syncRosterStats.js';

export async function playerStatsHandler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params as { teamId: string };

  const { rows: teamCheck } = await query('SELECT id FROM lol_teams WHERE id = $1 LIMIT 1', [teamId]);
  if (teamCheck.length === 0) {
    res.status(404).json({ error: 'Équipe introuvable.' });
    return;
  }

  const players = await syncTeamStats(teamId);
  res.json({ players });
}
