/** Partie en cours — SPECTATOR-V5 (sous-ensemble utile). */
export interface RiotCurrentGameParticipant {
  puuid: string;
  championId: number;
  teamId: number;
  spell1Id: number;
  spell2Id: number;
  riotId?: string;
  summonerName?: string;
}

export interface RiotCurrentGameInfo {
  gameId: number;
  gameType: string;
  gameMode: string;
  gameQueueConfigId: number;
  gameStartTime: number;
  gameLength: number;
  mapId: number;
  participants: RiotCurrentGameParticipant[];
}
