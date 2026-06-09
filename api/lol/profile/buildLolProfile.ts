import { getAccountByRiotId } from '../../shared/account/getAccountByRiotId';
import { getSummonerByPuuid } from './getSummonerByPuuid';
import { getLeagueByPuuid } from '../ranked/getLeagueByPuuid';
import { getMatchIds } from '../matches/getMatchIds';
import { getMatch } from '../matches/getMatch';
import { getMasteryByPuuid } from '../mastery/getMasteryByPuuid';
import { toRankInfo, toMatchInfo } from './mappers';
import type { LolProfile, MatchInfo, RankInfo } from './profileTypes';

// Cache mémoire court : évite de re-tirer le même profil (et de spammer Riot)
// quand l'utilisateur recharge la page plusieurs fois d'affilée.
const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { profile: LolProfile; expires: number }>();

/** Exécute `fn` sur `items` avec une concurrence limitée (anti rate-limit 429). */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    out.push(...(await Promise.all(items.slice(i, i + limit).map(fn))));
  }
  return out;
}

/** Agrège compte + invocateur + rangs + matchs détaillés + maîtrise. */
export async function buildLolProfile(
  gameName: string,
  tagLine: string,
  matchCount = 8,
): Promise<LolProfile> {
  const key = `${gameName.toLowerCase()}#${tagLine.toLowerCase()}#${matchCount}`;
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.profile;

  const account = await getAccountByRiotId(gameName, tagLine);
  const { puuid } = account;

  const [summoner, league, ids, mastery] = await Promise.all([
    getSummonerByPuuid(puuid),
    getLeagueByPuuid(puuid),
    getMatchIds(puuid, matchCount),
    getMasteryByPuuid(puuid),
  ]);

  // Détails de match récupérés par lots de 5 pour rester sous la limite Riot.
  const details = await mapLimit(ids, 5, (id) => getMatch(id));

  const ranks = league.map(toRankInfo).filter((r): r is RankInfo => r !== null);
  const matches = details.map((m) => toMatchInfo(m, puuid)).filter((m): m is MatchInfo => m !== null);

  const profile: LolProfile = {
    riotId: account.gameName,
    tagLine: account.tagLine,
    puuid,
    profileIconId: summoner.profileIconId,
    summonerLevel: summoner.summonerLevel,
    platform: 'euw1',
    ranks,
    matches,
    mastery: mastery.slice(0, 8).map((m) => ({ championId: m.championId, level: m.championLevel, points: m.championPoints })),
  };

  cache.set(key, { profile, expires: Date.now() + CACHE_TTL_MS });
  return profile;
}
