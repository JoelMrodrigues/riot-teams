import { queueKind, roleKind } from '../matches/queueMap';
import type { RiotLeagueEntry } from '../ranked/types';
import type { RiotMatch } from '../matches/types';
import type { MatchInfo, RankInfo } from './profileTypes';

const RANK_QUEUES: Record<string, 'solo' | 'flex'> = {
  RANKED_SOLO_5x5: 'solo', RANKED_FLEX_SR: 'flex',
};

export function toRankInfo(e: RiotLeagueEntry): RankInfo | null {
  const queue = RANK_QUEUES[e.queueType];
  if (!queue) return null;
  const total = e.wins + e.losses;
  return {
    queue,
    tier: e.tier,
    rank: e.rank,
    lp: e.leaguePoints,
    wins: e.wins,
    losses: e.losses,
    winrate: total > 0 ? Math.round((e.wins / total) * 100) : 0,
  };
}

export function toMatchInfo(match: RiotMatch, puuid: string): MatchInfo | null {
  const me = match.info.participants.find((p) => p.puuid === puuid);
  if (!me) return null;
  const cs = me.totalMinionsKilled + me.neutralMinionsKilled;
  const minutes = match.info.gameDuration / 60;
  return {
    matchId: match.metadata.matchId,
    queue: queueKind(match.info.queueId),
    champion: me.championName,
    championId: me.championId,
    role: roleKind(me.teamPosition),
    win: me.win,
    kills: me.kills,
    deaths: me.deaths,
    assists: me.assists,
    kda: Math.round(((me.kills + me.assists) / Math.max(1, me.deaths)) * 100) / 100,
    cs,
    csPerMin: minutes > 0 ? Math.round((cs / minutes) * 10) / 10 : 0,
    durationSec: match.info.gameDuration,
    gameEndUnix: match.info.gameEndTimestamp,
  };
}
