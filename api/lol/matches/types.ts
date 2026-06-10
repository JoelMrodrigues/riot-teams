/** Participant d'une partie MATCH-V5 (champs de base + détail optionnel). */
export interface RiotMatchParticipant {
  puuid: string;
  riotIdGameName: string;
  riotIdTagline?: string;
  summonerName?: string;
  championName: string;
  championId: number;
  teamId?: number;
  teamPosition: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  champLevel?: number;
  goldEarned?: number;
  totalDamageDealtToChampions?: number;
  visionScore?: number;
  summoner1Id?: number;
  summoner2Id?: number;
  item0?: number;
  item1?: number;
  item2?: number;
  item3?: number;
  item4?: number;
  item5?: number;
  item6?: number;
}

export interface RiotMatchTeamObjective {
  first: boolean;
  kills: number;
}

export interface RiotMatchTeam {
  teamId: number;
  win: boolean;
  bans: { championId: number; pickTurn: number }[];
  objectives: Record<string, RiotMatchTeamObjective>;
}

export interface RiotMatch {
  metadata: { matchId: string; participants: string[] };
  info: {
    queueId: number;
    gameMode: string;
    gameDuration: number;
    gameCreation?: number;
    gameEndTimestamp: number;
    gameVersion?: string;
    participants: RiotMatchParticipant[];
    teams?: RiotMatchTeam[];
  };
}
