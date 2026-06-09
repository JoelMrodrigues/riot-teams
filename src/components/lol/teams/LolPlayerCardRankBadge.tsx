import React, { useState } from 'react';

import { rankCrest } from '../../../utils/lolAssets';
import type { LolPlayerRank } from '../../../types/lolTeam.types';

interface LolPlayerCardRankBadgeProps {
  rank: LolPlayerRank;
}

/** Couleur d'accent par tier (tokens ou couleurs palette LoL). */
function tierColor(tier: string): string {
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

/**
 * Badge rang compact : crête (image) + tier+rank + LP + winrate.
 * Fallback texte si l'image de crête n'existe pas.
 */
export function LolPlayerCardRankBadge({ rank }: LolPlayerCardRankBadgeProps): React.JSX.Element {
  const [imgOk, setImgOk] = useState(true);
  const crestSrc = rankCrest(rank.tier);
  const color = tierColor(rank.tier);
  const label = `${rank.tier} ${rank.rank}`;

  return (
    <div className="flex items-center gap-1.5">
      {crestSrc && imgOk ? (
        <img
          src={crestSrc}
          alt={rank.tier}
          width={20}
          height={20}
          loading="lazy"
          onError={() => setImgOk(false)}
          className="h-5 w-5 object-contain flex-shrink-0"
        />
      ) : (
        <span
          className="text-[10px] font-bold uppercase flex-shrink-0"
          style={{ fontFamily: 'Rajdhani, sans-serif', color }}
        >
          {rank.tier.slice(0, 1)}
        </span>
      )}

      <span
        className="text-xs font-bold uppercase tracking-wide"
        style={{ fontFamily: 'Rajdhani, sans-serif', color }}
      >
        {label}
      </span>

      <span
        className="text-xs"
        style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        {rank.lp} LP
      </span>

      <span
        className="ml-auto text-xs font-semibold"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: rank.winrate >= 55 ? 'var(--lol-emerald, #34D399)' : 'var(--lol-text-muted)',
        }}
      >
        {rank.winrate}%
      </span>
    </div>
  );
}
