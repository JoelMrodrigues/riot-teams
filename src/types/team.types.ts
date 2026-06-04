export type GameType = 'lol' | 'valorant' | 'tft';

export interface TeamMember {
  id: string;
  gameName: string;
  tagLine: string;
  addedAt: string;
}

export interface Team {
  id: string;
  name: string;
  game: GameType;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}
