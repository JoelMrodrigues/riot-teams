/** Partie en cours (miroir front de Spectator-V5 via /api/lol/live). */
export interface LiveRank {
  tier: string;
  rank: string;
  lp: number;
  winrate: number;
}

export interface LiveParticipant {
  puuid: string;
  championId: number;
  teamId: number;
  spell1Id: number;
  spell2Id: number;
  riotId?: string;
  summonerName?: string;
  rank?: LiveRank | null;
}

export interface LiveGame {
  gameMode: string;
  gameQueueConfigId: number;
  gameLength: number;
  gameStartTime: number;
  participants: LiveParticipant[];
}
