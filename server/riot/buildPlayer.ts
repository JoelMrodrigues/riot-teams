import { getAccountByRiotId } from './getAccount';
import { getSummonerByPuuid } from './getSummoner';
import { getRanksBySummonerId } from './getRanks';
import { getMatchIds, getMatchSummary } from './getMatches';
import type { MatchSummary, PlayerProfile } from '../../src/types/lolPlayer.types';

/** Orchestration complète : Riot ID -> profil agrégé (compte, rang, matchs). */
export async function buildPlayer(
  platform: string,
  gameName: string,
  tagLine: string,
  count: number,
): Promise<PlayerProfile> {
  const account = await getAccountByRiotId(platform, gameName, tagLine);
  const summoner = await getSummonerByPuuid(platform, account.puuid);
  const ranks = await getRanksBySummonerId(platform, summoner.id);

  const ids = await getMatchIds(platform, account.puuid, count);
  const settled = await Promise.all(ids.map((id) => getMatchSummary(platform, id, account.puuid)));
  const matches = settled.filter((m): m is MatchSummary => m !== null);

  return {
    riotId: account.gameName,
    tagLine: account.tagLine,
    puuid: account.puuid,
    profileIconId: summoner.profileIconId,
    summonerLevel: summoner.summonerLevel,
    platform,
    ranks,
    matches,
  };
}
