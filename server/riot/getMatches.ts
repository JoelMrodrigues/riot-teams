import { riotGet } from './riotClient';
import { regionalHost } from './riotRouting';
import { mapQueue, mapRole } from './queueMap';
import type { RiotMatch, RiotParticipant } from './riotTypes';
import type { MatchSummary } from '../../src/types/lolPlayer.types';

/** MATCH-V5 — liste des IDs de parties récentes via puuid. */
export function getMatchIds(platform: string, puuid: string, count: number): Promise<string[]> {
  const url = `${regionalHost(platform)}/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=0&count=${count}`;
  return riotGet<string[]>(url);
}

function toSummary(match: RiotMatch, me: RiotParticipant): MatchSummary {
  const cs = me.totalMinionsKilled + me.neutralMinionsKilled;
  const minutes = match.info.gameDuration / 60;
  const position = me.teamPosition || me.individualPosition;
  return {
    matchId: match.metadata.matchId,
    queue: mapQueue(match.info.queueId),
    champion: me.championName,
    championId: me.championId,
    role: mapRole(position),
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

/** Détail d'une partie -> résumé centré sur le joueur ciblé (par puuid). */
export async function getMatchSummary(platform: string, matchId: string, puuid: string): Promise<MatchSummary | null> {
  const url = `${regionalHost(platform)}/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
  const match = await riotGet<RiotMatch>(url);
  const me = match.info.participants.find((p) => p.puuid === puuid);
  return me ? toSummary(match, me) : null;
}
