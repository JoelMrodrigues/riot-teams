/** Helpers d'accès aux visuels des champions (dossier local public/). */

/**
 * Icône d'un champion. Normalise la clé en minuscules sans caractères spéciaux
 * pour matcher le nommage du dossier (ex: 'Miss Fortune' -> missfortune.jpg).
 */
export function championIcon(key: string): string {
  const slug = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `/images/champions/${slug}.jpg`;
}

/** Icône de profil d'invocateur (CDN Community Dragon, URL "latest" stable). */
export function profileIcon(iconId: number): string {
  return `https://cdn.communitydragon.org/latest/profile-icon/${iconId}`;
}

/** Carré d'un champion par son ID numérique (CDN Community Dragon). */
export function championSquareById(championId: number): string {
  return `https://cdn.communitydragon.org/latest/champion/${championId}/square`;
}

/** Grande illustration d'un champion (public/images/big-champions). */
export function bigChampionImage(key: string): string {
  const slug = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `/images/big-champions/${slug}.jpg`;
}

/** Tier Riot (GOLD, DIAMOND...) -> fichier de crête (casse spécifique du dossier). */
const RANK_CREST: Record<string, string> = {
  IRON: 'Iron', BRONZE: 'Bronze', SILVER: 'Silver', GOLD: 'Gold',
  PLATINUM: 'Platinum', EMERALD: 'Emerald', DIAMOND: 'diamond',
  MASTER: 'Master', GRANDMASTER: 'Grandmaster', CHALLENGER: 'Challenger',
};
export function rankCrest(tier: string): string | null {
  const file = RANK_CREST[tier.toUpperCase()];
  return file ? `/images/rang/${file}.webp` : null;
}

/** ID de sort d'invocateur -> icône (public/images/summoner-spells). */
const SPELL_BY_ID: Record<number, string> = {
  1: 'cleanse', 3: 'exhaust', 4: 'flash', 6: 'ghost', 7: 'heal',
  11: 'smite', 12: 'teleport', 14: 'ignite', 21: 'barrier',
};
export function summonerSpellIcon(spellId: number): string | null {
  const name = SPELL_BY_ID[spellId];
  return name ? `/images/summoner-spells/${name}.png` : null;
}
