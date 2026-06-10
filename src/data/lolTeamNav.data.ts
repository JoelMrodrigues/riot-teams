/** Configuration de la sidebar d'une équipe LoL (sections + brouillons). */
export interface LolTeamNavItem {
  id: string;
  label: string;
  /** Sous-segment relatif à /lol/team/:id ('' = Aperçu, null = pas de page → Bientôt). */
  sub: string | null;
  end?: boolean;
  managerOnly?: boolean;
  soon?: boolean;
  /** Page de maquette (design en cours) → lien cliquable + badge « Brouillon ». */
  draft?: boolean;
}

export interface LolTeamNavGroup {
  group: string;
  items: LolTeamNavItem[];
}

export const LOL_TEAM_NAV: LolTeamNavGroup[] = [
  {
    group: 'Équipe',
    items: [
      { id: 'overview', label: 'Aperçu',  sub: '',        end: true },
      { id: 'members',  label: 'Membres', sub: 'membres', managerOnly: true },
    ],
  },
  {
    group: 'Brouillons',
    items: [
      { id: 'scrims',   label: 'Scrims',       sub: 'scrims',     draft: true },
      { id: 'stats',    label: 'Statistiques', sub: 'stats',      draft: true },
      { id: 'calendar', label: 'Calendrier',   sub: 'calendrier', draft: true },
    ],
  },
];
