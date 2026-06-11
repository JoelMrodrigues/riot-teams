// Synchro des stats d'une équipe via la table joueurs centrale (lol_players).
// Pour chaque joueur : 1 requête getMatchIds (signal "nouvelle game"). Si le
// dernier match est inchangé et qu'on a un cache → on renvoie le cache (0 requête
// de plus). Sinon refresh complet (rang + top champions) puis update du cache.
// Cache PARTAGÉ par puuid → un joueur dans N équipes = 1 seule remontée.

import { query } from '../../_core/db.js';
import { getLeagueByPuuid } from '../ranked/getLeagueByPuuid.js';
import { getMatchIds } from '../matches/getMatchIds.js';
import { getMatch } from '../matches/getMatch.js';
import { toRankInfo } from '../profile/mappers.js';
import { aggregateChampions } from './aggregateChampions.js';
import { ensurePlayerByRiotId, savePlayerStats, healPuuid, type PlayerRow } from './lolPlayersRepo.js';
import { RiotError } from '../../_core/riotClient.js';
import type { RankInfo } from '../profile/profileTypes.js';
import type { PlayerStatsEntry, TopChampionStat } from './types.js';

interface SyncRow {
  roster_id: string;
  game_name: string;
  tag_line: string;
  player_pk: string | null;
  puuid: string | null;
  rank: RankInfo | null;
  champions: TopChampionStat[] | null;
  last_match_id: string | null;
}

const MATCH_COUNT = 10;
const CONCURRENCY = 3;

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    out.push(...(await Promise.all(items.slice(i, i + limit).map(fn))));
  }
  return out;
}

/** getMatchIds avec self-heal : sur 404 (puuid périmé), re-résout puis réessaie. */
async function matchIdsHealed(playerId: string, puuid: string, gameName: string, tagLine: string): Promise<{ puuid: string; ids: string[] }> {
  try {
    return { puuid, ids: await getMatchIds(puuid, MATCH_COUNT) };
  } catch (err) {
    if (err instanceof RiotError && err.status === 404) {
      const fresh = await healPuuid(playerId, gameName, tagLine);
      return { puuid: fresh, ids: await getMatchIds(fresh, MATCH_COUNT) };
    }
    throw err;
  }
}

async function syncOne(row: SyncRow): Promise<PlayerStatsEntry> {
  const base = { rosterId: row.roster_id, gameName: row.game_name, tagLine: row.tag_line };
  try {
    let player: PlayerRow;
    if (row.player_pk && row.puuid) {
      player = { id: row.player_pk, puuid: row.puuid, rank: row.rank, champions: row.champions, last_match_id: row.last_match_id };
    } else {
      player = await ensurePlayerByRiotId(row.game_name, row.tag_line);
      await query('UPDATE lol_rosters SET player_id = $1 WHERE id = $2', [player.id, row.roster_id]);
    }

    const { puuid, ids } = await matchIdsHealed(player.id, player.puuid, row.game_name, row.tag_line);
    const latest = ids[0] ?? null;

    // Pas de nouvelle game + déjà synchronisé → on renvoie le cache.
    if (latest === player.last_match_id && player.champions !== null) {
      return { ...base, rank: player.rank, topChampions: player.champions };
    }

    const league = await getLeagueByPuuid(puuid);
    const details = await mapLimit(ids, 5, (id) => getMatch(id));
    const soloRank = league.map(toRankInfo).filter((r): r is RankInfo => r !== null).find((r) => r.queue === 'solo') ?? null;
    const champions = aggregateChampions(details, puuid, 5);

    await savePlayerStats(player.id, soloRank, champions, latest);
    return { ...base, rank: soloRank, topChampions: champions };
  } catch (err) {
    if (row.champions !== null) return { ...base, rank: row.rank, topChampions: row.champions };
    const message = err instanceof RiotError
      ? (err.status === 404 ? 'Riot ID introuvable.' : err.message)
      : 'Erreur lors de la récupération des stats.';
    return { ...base, rank: null, topChampions: [], error: message };
  }
}

/** Synchronise (cache partagé par puuid) les stats de tous les joueurs d'une équipe. */
export async function syncTeamStats(teamId: string): Promise<PlayerStatsEntry[]> {
  const { rows } = await query<SyncRow>(
    `SELECT r.id AS roster_id, r.game_name, r.tag_line,
            p.id AS player_pk, p.puuid, p.rank, p.champions, p.last_match_id
     FROM lol_rosters r
     LEFT JOIN lol_players p ON p.id = r.player_id
     WHERE r.team_id = $1
     ORDER BY r.created_at`,
    [teamId],
  );
  return mapLimit(rows, CONCURRENCY, syncOne);
}
