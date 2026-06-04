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
  ctaLabel: string;
  previewStats: GameStat[];
}
