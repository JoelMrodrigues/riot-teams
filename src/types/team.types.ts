export type GameType = 'lol' | 'valorant' | 'tft';

export interface TeamMember {
  id: string;
  gameName: string;
  tagLine: string;
  addedAt: string;
}

/** Type discriminé pour l'icône d'équipe LoL — rétro-compatible (absent = pas d'icône). */
export type LolTeamIcon =
  | { kind: 'champion'; value: string }
  | { kind: 'emblem';   value: string };

/** Régions Riot disponibles. */
export type LolRegion =
  | 'EUW' | 'EUNE' | 'NA' | 'KR' | 'BR'
  | 'LAN' | 'LAS' | 'OCE' | 'JP' | 'TR' | 'RU';

export interface Team {
  id: string;
  name: string;
  game: GameType;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
  /** Champs LoL optionnels — ignorés par les contextes Valorant/TFT */
  tag?:         string;
  region?:      LolRegion;
  accentColor?: string;
  description?: string;
  icon?:        LolTeamIcon;
}
