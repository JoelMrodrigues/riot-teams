export interface ParsedRiotId {
  gameName: string;
  tagLine: string;
}

export interface PlayerSearchState {
  input: string;
  error: string | null;
}
