/** Sous-ensembles typés des réponses brutes de l'API Riot utilisés ici. */

export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface RiotSummoner {
  id: string;
  profileIconId: number;
  summonerLevel: number;
}

export interface RiotLeagueEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export interface RiotParticipant {
  puuid: string;
  championName: string;
  championId: number;
  teamPosition: string;
  individualPosition: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
}

export interface RiotMatch {
  metadata: { matchId: string };
  info: {
    queueId: number;
    gameDuration: number;
    gameEndTimestamp: number;
    participants: RiotParticipant[];
  };
}
