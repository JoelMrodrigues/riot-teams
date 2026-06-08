import React from 'react';

import { LOL_ACCENTS } from '../../../constants/lolTheme';
import type { RankedEntry } from '../../../types/lolPlayer.types';

interface RankCardProps {
  entry: RankedEntry;
}

const LABELS: Record<'solo' | 'flex', string> = { solo: 'Classée Solo/Duo', flex: 'Classée Flex' };

/** Carte d'un classement (tier, LP, ratio victoires). */
export function RankCard({ entry }: RankCardProps): React.JSX.Element {
  const accent = entry.queue === 'solo' ? LOL_ACCENTS.solo : LOL_ACCENTS.team;
  const games = entry.wins + entry.losses;

  return (
    <div
      className="flex flex-col gap-2 rounded-2xl p-5"
      style={{ background: 'var(--lol-surface)', border: `1px solid ${accent.color}33`, minWidth: '220px' }}
    >
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent.soft }}>
        {LABELS[entry.queue]}
      </span>
      <p className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
        {entry.tier} {entry.rank}
      </p>
      <p className="text-sm" style={{ color: 'var(--lol-text-muted)' }}>{entry.lp} LP</p>
      <div className="mt-1 flex items-center justify-between text-sm">
        <span style={{ color: 'var(--lol-text-muted)' }}>{games} parties</span>
        <span className="font-bold" style={{ color: accent.color }}>{entry.winrate}% WR</span>
      </div>
    </div>
  );
}
