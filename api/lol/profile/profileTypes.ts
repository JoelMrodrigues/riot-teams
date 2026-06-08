/** Profil LoL agrégé renvoyé par /api/lol/profile (contrat front ↔ back). */
export type QueueKind = 'solo' | 'flex' | 'normal' | 'aram' | 'other';
export type RoleKind = 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY' | 'UNKNOWN';

export interface RankInfo {
  queue: 'solo' | 'flex';
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
  winrate: number;
}

export interface MatchInfo {
  matchId: string;
  queue: QueueKind;
  champion: string;
  championId: number;
  role: RoleKind;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  cs: number;
  csPerMin: number;
  durationSec: number;
  gameEndUnix: number;
}

export interface MasteryInfo {
  championId: number;
  level: number;
  points: number;
}

export interface LolProfile {
  riotId: string;
  tagLine: string;
  puuid: string;
  profileIconId: number;
  summonerLevel: number;
  platform: string;
  ranks: RankInfo[];
  matches: MatchInfo[];
  mastery: MasteryInfo[];
}
