/**
 * Types pour les stats joueurs LoL (endpoint player-stats) et le logo d'équipe.
 * Séparé de lolTeam.types.ts pour respecter la limite de 150 lignes.
 */

/** Rang Riot d'un joueur tel que renvoyé par le backend. */
export interface LolPlayerRank {
  tier: string;
  rank: string;
  lp: number;
  winrate: number;
}

/** Champion dans le top du joueur. */
export interface LolTopChampion {
  champion: string;
  championId: number;
  games: number;
  winrate: number;
  kda: number;
}

/** Stats d'un joueur individuel dans la réponse player-stats. */
export interface LolPlayerStat {
  rosterId: string;
  gameName: string;
  tagLine: string;
  rank: LolPlayerRank | null;
  topChampions: LolTopChampion[];
  error?: string;
}

/** Réponse complète de GET /api/lol/teams/:id/player-stats. */
export interface LolPlayerStatsResponse {
  players: LolPlayerStat[];
}

/** Corps de PUT /api/lol/teams/:id/logo. */
export interface LolTeamLogoBody {
  dataBase64: string;
  mime: 'image/png' | 'image/jpeg' | 'image/webp';
}
