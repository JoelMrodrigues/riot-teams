import type { ParsedRiotId } from '../types/player.types';

/** Message affiché quand un Riot ID saisi est invalide (format attendu : NomJoueur#TAG). */
export const RIOT_ID_ERROR = 'Format invalide — utilisez : NomJoueur#TAG (ex: Faker#KR1)';

export function parseRiotId(input: string): ParsedRiotId | null {
  const trimmed = input.trim();
  const hashIndex = trimmed.lastIndexOf('#');

  if (hashIndex <= 0 || hashIndex === trimmed.length - 1) return null;

  const gameName = trimmed.slice(0, hashIndex).trim();
  const tagLine = trimmed.slice(hashIndex + 1).trim();

  if (!gameName || !tagLine || tagLine.length > 5) return null;

  return { gameName, tagLine };
}
