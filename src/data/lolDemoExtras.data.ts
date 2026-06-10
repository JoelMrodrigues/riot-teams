/** Mocks pour les composants « utiles » (classement, live). */

export interface DemoLeaderEntry {
  name: string;
  lp: number;
  wins: number;
  losses: number;
}

export const DEMO_LEADERBOARD: DemoLeaderEntry[] = [
  { name: 'Agurin#EUW', lp: 1632, wins: 412, losses: 271 },
  { name: 'Reckless#EUW', lp: 1488, wins: 388, losses: 254 },
  { name: 'Els#EUW', lp: 1402, wins: 301, losses: 188 },
  { name: 'Nemesis#EUW', lp: 1355, wins: 277, losses: 199 },
  { name: 'Vetheo#EUW', lp: 1290, wins: 244, losses: 162 },
  { name: 'Crownie#EUW', lp: 1241, wins: 233, losses: 178 },
  { name: 'Phantom Roam#EUW', lp: 1188, wins: 210, losses: 151 },
  { name: 'Lone Wolf#EUW', lp: 1142, wins: 198, losses: 149 },
];

export const DEMO_LIVE = { inGame: true, champion: 'Ahri', queue: 'Classé Solo/Duo' };
