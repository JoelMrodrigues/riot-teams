/**
 * Données fictives pour les BROUILLONS de design des pages d'équipe LoL
 * (Scrims, Statistiques, Calendrier). Aucune logique réelle — uniquement
 * destinées à visualiser des idées de mise en page. À remplacer par l'API.
 */

export interface DraftScrim {
  opponent: string;
  date:     string;
  result:   'win' | 'loss';
  score:    string;
}

export const NEXT_SCRIM = { opponent: 'Crimson Vipers', when: 'Ce soir · 20h00', bo: 'BO3' };

export const DRAFT_SCRIMS: DraftScrim[] = [
  { opponent: 'Solar Wolves',  date: 'Hier',    result: 'win',  score: '2 - 1' },
  { opponent: 'Iron Phoenix',  date: '7 juin',  result: 'win',  score: '2 - 0' },
  { opponent: 'Azure Kings',   date: '5 juin',  result: 'loss', score: '1 - 2' },
  { opponent: 'Night Owls',    date: '3 juin',  result: 'win',  score: '2 - 1' },
  { opponent: 'Void Hunters',  date: '1 juin',  result: 'loss', score: '0 - 2' },
];

/** Synthèse de stats d'équipe (mock) — complète DEMO_TEAM_STATS côté roster. */
export const DRAFT_TEAM_STATS = {
  blueWinrate: 71,
  redWinrate:  58,
  avgGameDuration: '31:24',
  firstBlood: 62,
};

export interface DraftTopChamp {
  champion: string;
  games:    number;
  winrate:  number;
}

export const DRAFT_TEAM_TOP_CHAMPS: DraftTopChamp[] = [
  { champion: 'Ahri',     games: 24, winrate: 67 },
  { champion: 'Jinx',     games: 21, winrate: 62 },
  { champion: 'Viego',    games: 19, winrate: 58 },
  { champion: 'Renekton', games: 16, winrate: 50 },
  { champion: 'Thresh',   games: 15, winrate: 60 },
];

/** Forme récente : true = victoire. */
export const DRAFT_RECENT_FORM: boolean[] = [true, true, false, true, true, false, true, true];

export type DraftEventType = 'scrim' | 'training' | 'review' | 'soloq';

export interface DraftEvent {
  day:   number; // 0 = Lundi … 6 = Dimanche
  time:  string;
  label: string;
  type:  DraftEventType;
}

export const DRAFT_WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const DRAFT_EVENTS: DraftEvent[] = [
  { day: 0, time: '20:00', label: 'Entraînement',     type: 'training' },
  { day: 1, time: '20:00', label: 'Scrim vs Vipers',  type: 'scrim' },
  { day: 2, time: '19:00', label: 'Review VOD',       type: 'review' },
  { day: 3, time: '20:00', label: 'Scrim vs Wolves',  type: 'scrim' },
  { day: 4, time: '21:00', label: 'SoloQ groupée',    type: 'soloq' },
  { day: 5, time: '18:00', label: 'Scrim vs Kings',   type: 'scrim' },
  { day: 6, time: '—',     label: 'Repos',            type: 'training' },
];

export const DRAFT_EVENT_COLORS: Record<DraftEventType, string> = {
  scrim:    '#F472B6',
  training: '#22D3EE',
  review:   '#FBBF24',
  soloq:    '#A78BFA',
};
