/** Helpers d'affichage du rang LoL : couleur par tier, couleur de winrate, label court. */

/** Couleur d'accent par tier Riot (apex = couleurs spécifiques, sinon palette LoL). */
export function tierColor(tier: string): string {
  const t = tier.toUpperCase();
  if (t === 'CHALLENGER')  return '#F4C542';
  if (t === 'GRANDMASTER') return '#CD4444';
  if (t === 'MASTER')      return '#9B72CF';
  if (t === 'DIAMOND')     return '#57A8FF';
  if (t === 'EMERALD')     return '#2AC679';
  if (t === 'PLATINUM')    return '#3BBFC9';
  if (t === 'GOLD')        return 'var(--lol-accent)';
  if (t === 'SILVER')      return '#9EAAB8';
  if (t === 'BRONZE')      return '#C9834A';
  return 'var(--lol-text-muted)';
}

/** Couleur d'un pourcentage de winrate (tokens charte). */
export function winrateColor(wr: number): string {
  if (wr >= 60) return 'var(--lol-emerald, #34D399)';
  if (wr >= 50) return 'var(--lol-amber, #FBBF24)';
  if (wr >= 40) return '#F97316';
  return 'var(--danger)';
}

/** Tiers sans division (apex) : on n'affiche pas le chiffre romain. */
const APEX = new Set(['MASTER', 'GRANDMASTER', 'CHALLENGER']);

/** Label lisible : "Master", "Diamond II"… */
export function formatRank(tier: string, rank: string): string {
  const t = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
  return APEX.has(tier.toUpperCase()) ? t : `${t} ${rank}`;
}
