// Accès à la table lol_players (compte Riot canonique + cache stats par puuid).
import { query } from '../../_core/db.js';
import { getAccountByRiotId } from '../../shared/account/getAccountByRiotId.js';
import type { RankInfo } from '../profile/profileTypes.js';
import type { TopChampionStat } from './types.js';

export interface PlayerRow {
  id: string;
  puuid: string;
  rank: RankInfo | null;
  champions: TopChampionStat[] | null;
  last_match_id: string | null;
}

/** Trouve (par puuid) ou crée le joueur Riot canonique pour un Riot ID. */
export async function ensurePlayerByRiotId(gameName: string, tagLine: string): Promise<PlayerRow> {
  const account = await getAccountByRiotId(gameName, tagLine);

  const found = await query<PlayerRow>(
    'SELECT id, puuid, rank, champions, last_match_id FROM lol_players WHERE puuid = $1',
    [account.puuid],
  );
  const existing = found.rows[0];
  if (existing) {
    // Met à jour le pseudo si le joueur s'est renommé.
    await query('UPDATE lol_players SET game_name = $1, tag_line = $2 WHERE id = $3', [account.gameName, account.tagLine, existing.id]);
    return existing;
  }

  const created = await query<PlayerRow>(
    `INSERT INTO lol_players (puuid, game_name, tag_line) VALUES ($1, $2, $3)
     RETURNING id, puuid, rank, champions, last_match_id`,
    [account.puuid, account.gameName, account.tagLine],
  );
  return created.rows[0]!;
}

/** Met à jour le cache stats d'un joueur. */
export async function savePlayerStats(
  id: string,
  rank: RankInfo | null,
  champions: TopChampionStat[],
  lastMatchId: string | null,
): Promise<void> {
  await query(
    'UPDATE lol_players SET rank = $1, champions = $2, last_match_id = $3, synced_at = now() WHERE id = $4',
    [JSON.stringify(rank), JSON.stringify(champions), lastMatchId, id],
  );
}

/** Self-heal : re-résout le puuid depuis le Riot ID et le met à jour. Retourne le nouveau puuid. */
export async function healPuuid(id: string, gameName: string, tagLine: string): Promise<string> {
  const account = await getAccountByRiotId(gameName, tagLine);
  await query('UPDATE lol_players SET puuid = $1, game_name = $2, tag_line = $3 WHERE id = $4', [account.puuid, account.gameName, account.tagLine, id]);
  return account.puuid;
}
