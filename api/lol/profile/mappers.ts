import type { RiotLeagueEntry } from '../ranked/types';
import type { RiotMatch } from '../matches/types';
import type { MatchInfo, QueueKind, RankInfo, RoleKind } from './profileTypes';

const QUEUE_IDS: Record<number, QueueKind> = {
  420: 'solo', 440: 'flex', 400: 'normal', 430: 'normal', 490: 'normal', 450: 'aram',
};
const ROLES: RoleKind[] = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];
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
  const pos = me.teamPosition.toUpperCase();
  return {
    matchId: match.metadata.matchId,
    queue: QUEUE_IDS[match.info.queueId] ?? 'other',
    champion: me.championName,
    championId: me.championId,
    role: (ROLES as string[]).includes(pos) ? (pos as RoleKind) : 'UNKNOWN',
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
