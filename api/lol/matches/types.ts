/** Sous-ensemble utile d'une partie MATCH-V5. */
export interface RiotMatchParticipant {
  puuid: string;
  riotIdGameName: string;
  championName: string;
  championId: number;
  teamPosition: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
}

export interface RiotMatch {
  metadata: { matchId: string; participants: string[] };
  info: {
    queueId: number;
    gameMode: string;
    gameDuration: number;
    gameEndTimestamp: number;
    participants: RiotMatchParticipant[];
  };
}
