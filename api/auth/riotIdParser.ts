// Parsing d'un Riot ID au format "gameName#tagLine" — usage backend uniquement.
// Miroir strict de src/utils/riotId.ts (côté client) pour éviter tout import
// croisé entre la couche API et le code React.

/** Résultat d'un parsing réussi. */
export interface ParsedRiotId {
  gameName: string;
  tagLine: string;
}

/**
 * Découpe une chaîne "gameName#tagLine" en ses deux composantes.
 * Retourne null si le format est invalide (pas de #, gameName vide, tagLine vide
 * ou tag supérieur à 5 caractères).
 */
export function parseRiotId(input: string): ParsedRiotId | null {
  const trimmed = input.trim();
  const hashIndex = trimmed.lastIndexOf('#');

  if (hashIndex <= 0 || hashIndex === trimmed.length - 1) return null;

  const gameName = trimmed.slice(0, hashIndex).trim();
  const tagLine = trimmed.slice(hashIndex + 1).trim();

  if (!gameName || !tagLine || tagLine.length > 5) return null;

  return { gameName, tagLine };
}
