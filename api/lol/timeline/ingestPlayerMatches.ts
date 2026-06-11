// Ingestion (best-effort, bornée) des stats par tranche dans lol_match_brackets.
// Pour les parties pas encore ingérées (max MAX_PER_RUN par appel), on récupère
// détail + timeline, on extrait les tranches et on insère. Immuable → fait une
// seule fois par (joueur, partie). S'accumule au fil des visites.

import { query } from '../../_core/db.js';
import { getMatch } from '../matches/getMatch.js';
import { getMatchTimeline } from '../matches/getMatchTimeline.js';
import { ensurePlayerByRiotId } from '../teams/lolPlayersRepo.js';
import { extractBrackets } from './extractBrackets.js';

const MAX_PER_RUN = 10;

export async function ingestPlayerMatches(gameName: string, tagLine: string, matchIds: string[]): Promise<void> {
  if (matchIds.length === 0) return;

  const player = await ensurePlayerByRiotId(gameName, tagLine);

  const { rows } = await query<{ match_id: string }>(
    'SELECT DISTINCT match_id FROM lol_match_brackets WHERE player_id = $1 AND match_id = ANY($2::text[])',
    [player.id, matchIds],
  );
  const done = new Set(rows.map((r) => r.match_id));
  const todo = matchIds.filter((id) => !done.has(id)).slice(0, MAX_PER_RUN);

  for (const matchId of todo) {
    try {
      const [detail, timeline] = await Promise.all([getMatch(matchId), getMatchTimeline(matchId)]);
      const brackets = extractBrackets(detail, timeline, player.puuid);
      for (const b of brackets) {
        await query(
          `INSERT INTO lol_match_brackets
             (player_id, match_id, champion_id, role, win, game_creation, bracket_min,
              my_gold, my_cs, my_xp, diff_gold, diff_cs, diff_xp)
           VALUES ($1,$2,$3,$4,$5, to_timestamp($6 / 1000.0), $7,$8,$9,$10,$11,$12,$13)
           ON CONFLICT (player_id, match_id, bracket_min) DO NOTHING`,
          [player.id, matchId, b.championId, b.role, b.win, b.gameCreationMs, b.bracketMin, b.myGold, b.myCs, b.myXp, b.diffGold, b.diffCs, b.diffXp],
        );
      }
    } catch {
      /* best-effort : on ignore une partie en erreur et on continue */
    }
  }
}
