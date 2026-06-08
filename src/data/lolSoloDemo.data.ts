/** Données fictives du profil joueur affiché dans la démo "Recherche Solo". */
export interface DemoChampion {
  key: string;
  label: string;
  games: number;
  winrate: number;
  kda: string;
}

export interface DemoMatch {
  key: string;
  label: string;
  result: 'V' | 'D';
  kda: string;
}

export interface SoloDemoProfile {
  riotId: string;
  tag: string;
  rank: string;
  lp: number;
  winrate: number;
  level: number;
  topChampions: DemoChampion[];
  recentMatches: DemoMatch[];
}

export const SOLO_DEMO: SoloDemoProfile = {
  riotId: 'Hide on bush',
  tag: 'KR1',
  rank: 'Challenger',
  lp: 1248,
  winrate: 67,
  level: 542,
  topChampions: [
    { key: 'Ahri', label: 'Ahri', games: 92, winrate: 71, kda: '4.8' },
    { key: 'Azir', label: 'Azir', games: 64, winrate: 66, kda: '3.9' },
    { key: 'Sylas', label: 'Sylas', games: 48, winrate: 63, kda: '3.5' },
  ],
  recentMatches: [
    { key: 'Ahri', label: 'Ahri', result: 'V', kda: '11/2/8' },
    { key: 'Azir', label: 'Azir', result: 'V', kda: '7/1/12' },
    { key: 'Sylas', label: 'Sylas', result: 'D', kda: '5/6/4' },
    { key: 'Orianna', label: 'Orianna', result: 'V', kda: '9/3/10' },
    { key: 'Viktor', label: 'Viktor', result: 'V', kda: '14/4/6' },
  ],
};
