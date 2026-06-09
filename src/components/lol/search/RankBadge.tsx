import React, { useState } from 'react';

import { LOL_ACCENTS } from '../../../constants/lolTheme';
import { rankCrest } from '../../../utils/lolAssets';
import type { RankInfo } from '../../../types/lolApi.types';

interface RankBadgeProps {
  entry: RankInfo;
}

const LABELS: Record<'solo' | 'flex', string> = { solo: 'Solo/Duo', flex: 'Flex' };

/** Carte d'un classement : crête de rang + tier, LP, winrate. */
export function RankBadge({ entry }: RankBadgeProps): React.JSX.Element {
  const accent = entry.queue === 'solo' ? LOL_ACCENTS.solo : LOL_ACCENTS.team;
  const games = entry.wins + entry.losses;
  const crest = rankCrest(entry.tier);
  const [crestOk, setCrestOk] = useState(true);

  return (
    <div
      className="flex items-center gap-3 rounded-md p-4"
      style={{ background: 'var(--lol-surface)', border: `1px solid ${accent.color}33`, minWidth: '230px' }}
    >
      {crest && crestOk && (
        <img src={crest} alt={entry.tier} onError={() => setCrestOk(false)} className="h-14 w-14 flex-shrink-0 object-contain" />
      )}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent.soft }}>{LABELS[entry.queue]}</span>
        <p className="text-lg font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
          {entry.tier} {entry.rank} · {entry.lp} LP
        </p>
        <div className="flex items-center gap-3 text-sm">
          <span style={{ color: 'var(--lol-text-muted)' }}>{games} parties</span>
          <span className="font-bold" style={{ color: accent.color }}>{entry.winrate}% WR</span>
        </div>
      </div>
    </div>
  );
}
