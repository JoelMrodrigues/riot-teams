/** Liens de navigation du header dédié LoL. */
export interface LolNavItem {
  label: string;
  to: string;
  /** true = correspondance exacte (route index), pour l'état actif. */
  end: boolean;
}

export const LOL_NAV: LolNavItem[] = [
  { label: 'Accueil LoL', to: '/lol', end: true },
  { label: 'Recherche Solo', to: '/lol/search', end: false },
  { label: 'Gestion Équipe', to: '/lol/teams', end: false },
];
