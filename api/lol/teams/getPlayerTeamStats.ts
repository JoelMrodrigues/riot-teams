// Calcule les stats d'un joueur (rang + top champions) pour l'affichage
// dans le roster d'une équipe. Données issues de l'API Riot, cache mémoire 60s.
// Séparé de buildLolProfile : pas de summoner, pas de mastery, périmètre équipe.

import { getAccountByRiotId } from '../../shared/account/getAccountByRiotId.js';
import { getLeagueByPuuid } from '../ranked/getLeagueByPuuid.js';
import { getMatchIds } from '../matches/getMatchIds.js';
import { getMatch } from '../matches/getMatch.js';
import { toRankInfo } from '../profile/mappers.js';
import { aggregateChampions } from './aggregateChampions.js';
import type { PlayerTeamStats } from './types.js';
import type { RankInfo } from '../profile/profileTypes.js';

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { stats: PlayerTeamStats; expires: number }>();

/** Exécute `fn` sur `items` avec une concurrence limitée (anti rate-limit). */
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

/**
 * Résout le rang SoloQ et le top 5 champions d'un joueur sur ses N dernières parties.
 * Retourne null si le Riot ID est introuvable (RiotError 404).
 * Toute autre erreur est propagée.
 */
export async function getPlayerTeamStats(
  gameName: string,
  tagLine: string,
  matchCount = 10,
): Promise<PlayerTeamStats | null> {
  const cacheKey = `${gameName.toLowerCase()}#${tagLine.toLowerCase()}`;
  const hit = cache.get(cacheKey);
  if (hit && hit.expires > Date.now()) return hit.stats;

  const account = await getAccountByRiotId(gameName, tagLine);
  const { puuid } = account;

  const [league, ids] = await Promise.all([
    getLeagueByPuuid(puuid),
    getMatchIds(puuid, matchCount),
  ]);

  // Détails des matchs par lots de 5 pour ménager le rate-limit Riot.
  const details = await mapLimit(ids, 5, (id) => getMatch(id));

  const allRanks = league.map(toRankInfo).filter((r): r is RankInfo => r !== null);
  const soloRank = allRanks.find((r) => r.queue === 'solo') ?? null;
  const topChampions = aggregateChampions(details, puuid, 5);

  const stats: PlayerTeamStats = {
    gameName: account.gameName,
    tagLine: account.tagLine,
    rank: soloRank,
    topChampions,
  };

  cache.set(cacheKey, { stats, expires: Date.now() + CACHE_TTL_MS });
  return stats;
}
