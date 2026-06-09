/** Liens de navigation du header dédié LoL. */
export interface LolNavItem {
  label: string;
  to: string;
  /** true = correspondance exacte (route index), pour l'état actif. */
  end: boolean;
}

export const LOL_NAV: LolNavItem[] = [
  { label: 'Accueil', to: '/lol', end: true },
  { label: 'Solo', to: '/lol/search', end: false },
  { label: 'Équipes', to: '/lol/teams', end: false },
  { label: 'Stats', to: '/lol/stats', end: false },
];
