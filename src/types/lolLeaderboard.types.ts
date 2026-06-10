/** Classement apex « prêt à afficher » (miroir front de /api/lol/leaderboard). */
export interface LeaderboardEntry {
  gameName: string;
  tagLine: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export interface Leaderboard {
  tier: string;
  queue: string;
  entries: LeaderboardEntry[];
}
