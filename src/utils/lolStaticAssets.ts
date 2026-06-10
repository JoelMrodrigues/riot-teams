/** Accès aux visuels statiques Riot (Data Dragon) par identifiant numérique. */

// Version Data Dragon — à incrémenter ponctuellement (les patchs ajoutent des items).
export const DDRAGON_VERSION = '15.1.1';

/** Icône d'un objet par son ID. null pour un emplacement vide (id 0). */
export function itemIcon(itemId: number): string | null {
  if (!itemId) return null;
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${itemId}.png`;
}

/** Icône d'un sort d'invocateur par son nom Data Dragon (ex: SummonerFlash). */
export function summonerSpellIconByName(name: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${name}.png`;
}
