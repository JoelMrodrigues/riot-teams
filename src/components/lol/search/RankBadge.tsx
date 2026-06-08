import React from 'react';

import { LOL_ACCENTS } from '../../../constants/lolTheme';
import type { RankInfo } from '../../../types/lolApi.types';

interface RankBadgeProps {
  entry: RankInfo;
}

const LABELS: Record<'solo' | 'flex', string> = { solo: 'Solo/Duo', flex: 'Flex' };

/** Carte d'un classement (tier, LP, winrate). */
export function RankBadge({ entry }: RankBadgeProps): React.JSX.Element {
  const accent = entry.queue === 'solo' ? LOL_ACCENTS.solo : LOL_ACCENTS.team;
  const games = entry.wins + entry.losses;

  return (
    <div
      className="flex flex-col gap-1 rounded-2xl p-4"
      style={{ background: 'var(--lol-surface)', border: `1px solid ${accent.color}33`, minWidth: '200px' }}
    >
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent.soft }}>{LABELS[entry.queue]}</span>
      <p className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
        {entry.tier} {entry.rank} · {entry.lp} LP
      </p>
      <div className="flex items-center justify-between text-sm">
        <span style={{ color: 'var(--lol-text-muted)' }}>{games} parties</span>
        <span className="font-bold" style={{ color: accent.color }}>{entry.winrate}% WR</span>
      </div>
    </div>
  );
}
