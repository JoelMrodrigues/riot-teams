/** Configuration de la sidebar d'une équipe LoL (sections + entrées « Bientôt »). */
export interface LolTeamNavItem {
  id: string;
  label: string;
  /** Sous-segment relatif à /lol/team/:id ('' = Aperçu, null = pas de page → Bientôt). */
  sub: string | null;
  end?: boolean;
  managerOnly?: boolean;
  soon?: boolean;
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
    group: 'Bientôt',
    items: [
      { id: 'scrims',   label: 'Scrims',       sub: null, soon: true },
      { id: 'stats',    label: 'Statistiques', sub: null, soon: true },
      { id: 'calendar', label: 'Calendrier',   sub: null, soon: true },
    ],
  },
];
