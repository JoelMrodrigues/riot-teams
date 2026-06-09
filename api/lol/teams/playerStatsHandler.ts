// GET /api/lol/teams/:teamId/player-stats
// Retourne les stats Riot (rang SoloQ + top champions) pour chaque joueur du roster.
// Auth requise (toute personne authentifiée peut consulter les stats de son équipe).
// Concurrence : 3 joueurs en parallèle max pour ménager le rate-limit Riot.
// Un joueur en erreur (Riot ID invalide) renvoie { error } dans son entrée.

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';
import { getPlayerTeamStats } from './getPlayerTeamStats.js';
import { RiotError } from '../../_core/riotClient.js';
import type { RosterRow } from './types.js';
import type { PlayerStatsEntry } from './types.js';

const PLAYER_CONCURRENCY = 3;

/** Exécute `fn` sur `items` par lots de `limit` (même pattern que buildLolProfile). */
async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    out.push(...(await Promise.all(items.slice(i, i + limit).map(fn))));
  }
  return out;
}

export async function playerStatsHandler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params as { teamId: string };

  // Vérifie que l'équipe existe.
  const { rows: teamCheck } = await query('SELECT id FROM lol_teams WHERE id = $1 LIMIT 1', [teamId]);
  if (teamCheck.length === 0) {
    res.status(404).json({ error: 'Équipe introuvable.' });
    return;
  }

  // Lit tous les joueurs du roster.
  const { rows: rosterRows } = await query<RosterRow>(
    'SELECT id, game_name, tag_line FROM lol_rosters WHERE team_id = $1',
    [teamId],
  );

  // Calcule les stats par joueur avec concurrence limitée.
  const players = await mapLimit<RosterRow, PlayerStatsEntry>(
    rosterRows,
    PLAYER_CONCURRENCY,
    async (player) => {
      try {
        const stats = await getPlayerTeamStats(player.game_name, player.tag_line);
        if (!stats) {
          return {
            rosterId: player.id,
            gameName: player.game_name,
            tagLine: player.tag_line,
            rank: null,
            topChampions: [],
            error: 'Riot ID introuvable.',
          };
        }
        return {
          rosterId: player.id,
          gameName: stats.gameName,
          tagLine: stats.tagLine,
          rank: stats.rank,
          topChampions: stats.topChampions,
        };
      } catch (err) {
        const message = err instanceof RiotError ? err.message : 'Erreur lors de la récupération des stats.';
        return {
          rosterId: player.id,
          gameName: player.game_name,
          tagLine: player.tag_line,
          rank: null,
          topChampions: [],
          error: message,
        };
      }
    },
  );

  res.json({ players });
}
