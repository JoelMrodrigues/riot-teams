/** Contrat de données du profil joueur LoL (réponse de /api/lol/player). */

export type QueueType = 'solo' | 'flex' | 'normal' | 'aram' | 'other';
export type Role = 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY' | 'UNKNOWN';

export interface RankedEntry {
  queue: 'solo' | 'flex';
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
  winrate: number;
}

export interface MatchSummary {
  matchId: string;
  queue: QueueType;
  champion: string;
  championId: number;
  role: Role;
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

export interface PlayerProfile {
  riotId: string;
  tagLine: string;
  puuid: string;
  profileIconId: number;
  summonerLevel: number;
  platform: string;
  ranks: RankedEntry[];
  matches: MatchSummary[];
}
