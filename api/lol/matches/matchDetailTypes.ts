// Détail de match « propre » destiné au front (rendu de la partie complète).
import type { QueueKind, RoleKind } from '../profile/profileTypes';

export interface MatchDetailParticipant {
  puuid: string;
  riotId: string;
  champion: string;
  championId: number;
  teamId: number;
  role: RoleKind;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  cs: number;
  csPerMin: number;
  goldEarned: number;
  damageToChampions: number;
  visionScore: number;
  champLevel: number;
  spells: [number, number];
  items: number[];
}

export interface MatchDetailTeam {
  teamId: number;
  win: boolean;
  bans: number[];
  objectives: {
    baron: number;
    dragon: number;
    tower: number;
    inhibitor: number;
    riftHerald: number;
    champion: number;
  };
}

export interface MatchDetail {
  matchId: string;
  queue: QueueKind;
  gameMode: string;
  durationSec: number;
  gameEndUnix: number;
  teams: MatchDetailTeam[];
  participants: MatchDetailParticipant[];
}
