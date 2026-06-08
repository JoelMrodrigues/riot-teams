/** Helpers d'accès aux visuels des champions (dossier local public/). */

/**
 * Icône d'un champion. Normalise la clé en minuscules sans caractères spéciaux
 * pour matcher le nommage du dossier (ex: 'Miss Fortune' -> missfortune.jpg).
 */
export function championIcon(key: string): string {
  const slug = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `/images/champions/${slug}.jpg`;
}
