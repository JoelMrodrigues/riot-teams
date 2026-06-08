/** Données fictives du dashboard d'équipe affiché dans la démo "Gestion Scrim". */
export type TeamProfile = 'Scrim' | 'Flex' | 'Fun';
export type ScrimResult = 'win' | 'loss';

export interface RosterPlayer {
  name: string;
  role: string;
  champKey: string;
  rank: string;
}

export interface ScrimEntry {
  opponent: string;
  date: string;
  result: ScrimResult;
  score: string;
}

export interface TeamDemo {
  name: string;
  tag: string;
  profile: TeamProfile;
  winrate: number;
  roster: RosterPlayer[];
  scrims: ScrimEntry[];
  nextScrim: string;
}

export const TEAM_DEMO: TeamDemo = {
  name: 'Nightfall Esports',
  tag: 'NF',
  profile: 'Scrim',
  winrate: 74,
  roster: [
    { name: 'Vortex', role: 'TOP', champKey: 'Aatrox', rank: 'Master' },
    { name: 'Echo', role: 'JNG', champKey: 'Viego', rank: 'Diamond I' },
    { name: 'Lumen', role: 'MID', champKey: 'Ahri', rank: 'Grandmaster' },
    { name: 'Frost', role: 'ADC', champKey: 'Jinx', rank: 'Master' },
    { name: 'Halo', role: 'SUP', champKey: 'Thresh', rank: 'Diamond II' },
  ],
  scrims: [
    { opponent: 'Solar Wolves', date: 'Hier', result: 'win', score: '2 - 1' },
    { opponent: 'Iron Phoenix', date: '3 juin', result: 'win', score: '2 - 0' },
    { opponent: 'Azure Kings', date: '1 juin', result: 'loss', score: '1 - 2' },
  ],
  nextScrim: 'Ce soir · 20h00 vs Crimson Vipers',
};
