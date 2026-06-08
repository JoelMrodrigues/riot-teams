import { getAccountByRiotId } from '../../shared/account/getAccountByRiotId';
import { getSummonerByPuuid } from './getSummonerByPuuid';
import { getLeagueByPuuid } from '../ranked/getLeagueByPuuid';
import { getMatchIds } from '../matches/getMatchIds';
import { getMatch } from '../matches/getMatch';
import { getMasteryByPuuid } from '../mastery/getMasteryByPuuid';
import { toRankInfo, toMatchInfo } from './mappers';
import type { LolProfile, MatchInfo, RankInfo } from './profileTypes';

/** Agrège compte + invocateur + rangs + matchs détaillés + maîtrise. */
export async function buildLolProfile(
  gameName: string,
  tagLine: string,
  matchCount = 8,
): Promise<LolProfile> {
  const account = await getAccountByRiotId(gameName, tagLine);
  const { puuid } = account;

  const [summoner, league, ids, mastery] = await Promise.all([
    getSummonerByPuuid(puuid),
    getLeagueByPuuid(puuid),
    getMatchIds(puuid, matchCount),
    getMasteryByPuuid(puuid),
  ]);

  const details = await Promise.all(ids.map((id) => getMatch(id)));

  const ranks = league.map(toRankInfo).filter((r): r is RankInfo => r !== null);
  const matches = details.map((m) => toMatchInfo(m, puuid)).filter((m): m is MatchInfo => m !== null);

  return {
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
}
