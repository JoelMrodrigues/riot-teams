/** Classement apex (Challenger / Grandmaster / Master) — LEAGUE-V4. */
export interface RiotLeagueItem {
  summonerId: string;
  puuid?: string;
  leaguePoints: number;
  rank: string;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export interface RiotLeagueList {
  tier: string;
  leagueId: string;
  queue: string;
  name: string;
  entries: RiotLeagueItem[];
}

/** Tiers apex acceptés par getApexLeague. */
export type ApexTier = 'challenger' | 'grandmaster' | 'master';
