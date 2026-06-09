export interface GameStat {
  label: string;
  value: string;
}

export interface Game {
  id: string;
  name: string;
  shortName: string;
  tag: string;
  description: string;
  accentColor: string;
  darkColor: string;
  midColor: string;
  gradientStyle: string;
  imagePath: string;
  ctaLabel: string;
  previewStats: GameStat[];
  /** Nombre maximum de joueurs titulaires dans un roster pour ce jeu. */
  maxMembers: number;
}
