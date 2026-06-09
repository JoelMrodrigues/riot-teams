/** Palette d'accents disponibles pour les équipes LoL. La clé est stockée dans Team.accentColor. */

export interface LolTeamAccentEntry {
  key:   string;
  label: string;
  hex:   string;
}

export const LOL_TEAM_ACCENTS: LolTeamAccentEntry[] = [
  { key: 'violet',  label: 'Violet',   hex: '#8B5CF6' },
  { key: 'cyan',    label: 'Cyan',     hex: '#22D3EE' },
  { key: 'pink',    label: 'Rose',     hex: '#F472B6' },
  { key: 'gold',    label: 'Or',       hex: '#C89B3C' },
  { key: 'amber',   label: 'Ambre',    hex: '#FBBF24' },
  { key: 'emerald', label: 'Émeraude', hex: '#34D399' },
  { key: 'rose',    label: 'Cramoisi', hex: '#FB7185' },
  { key: 'sky',     label: 'Ciel',     hex: '#38BDF8' },
];

/** Résout une clé de couleur vers son hexadécimal. Repli : violet LoL. */
export function resolveAccent(key: string | undefined): string {
  const found = LOL_TEAM_ACCENTS.find((a) => a.key === key);
  return found?.hex ?? '#8B5CF6';
}

/** Clé d'accent par défaut pour une nouvelle équipe LoL. */
export const DEFAULT_ACCENT_KEY = 'violet';
