import React, { useState } from 'react';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_ACCENTS, LOL_LOSS } from '../../../constants/lolTheme';
import { computeTopChampions } from '../../../utils/lolChampionStats';
import type { MatchInfo, QueueKind } from '../../../types/lolApi.types';

interface RecentChampionsCardProps {
  matches: MatchInfo[];
  onShowMore: () => void;
}

const QUEUE_FILTERS: { v: QueueKind | 'all'; l: string }[] = [
  { v: 'all', l: 'Toutes' },
  { v: 'solo', l: 'SoloQ' },
  { v: 'flex', l: 'Flex' },
  { v: 'normal', l: 'Normales' },
];

const optionStyle: React.CSSProperties = {
  background: 'var(--lol-bg-elevated)',
  color: 'var(--lol-text)',
};

/**
 * Carte "Champions récents" (colonne gauche).
 * Top 8 champions agrégés sur les parties chargées, filtrables par file.
 * Libellé honnête : "récents" (20 parties max, pas la saison).
 */
export function RecentChampionsCard({ matches, onShowMore }: RecentChampionsCardProps): React.JSX.Element {
  const [queue, setQueue] = useState<QueueKind | 'all'>('all');
  const champions = computeTopChampions(matches, 8, queue);

  return (
    <section
      className="flex flex-col gap-3 rounded-md p-4"
      style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}
      aria-label="Champions récents"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lol-text-muted)' }}>
          Champions récents
        </p>
        <select
          value={queue}
          onChange={(e) => setQueue(e.target.value as QueueKind | 'all')}
          className="rounded px-2 py-0.5 text-xs outline-none cursor-pointer"
          style={{ background: 'var(--lol-bg-elevated)', border: '1px solid var(--lol-border)', color: 'var(--lol-text)', colorScheme: 'dark' }}
          aria-label="Filtrer par file"
        >
          {QUEUE_FILTERS.map((q) => (
            <option key={q.v} value={q.v} style={optionStyle}>{q.l}</option>
          ))}
        </select>
      </div>

      {champions.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {champions.map((c) => (
            <ChampionStatLine key={c.champion} champion={c} />
          ))}
        </div>
      ) : (
        <p className="py-3 text-center text-xs" style={{ color: 'var(--lol-text-muted)' }}>
          Aucune partie dans ce filtre.
        </p>
      )}

      {matches.length > 0 && (
        <button
          onClick={onShowMore}
          className="mt-1 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            background: 'transparent',
            border: '1px solid var(--lol-border)',
            color: 'var(--lol-violet-soft)',
          }}
        >
          Montrer plus →
        </button>
      )}
    </section>
  );
}

interface ChampionStatLineProps {
  champion: ReturnType<typeof computeTopChampions>[number];
}

function ChampionStatLine({ champion: c }: ChampionStatLineProps): React.JSX.Element {
  const winColor = c.winrate >= 50 ? LOL_ACCENTS.solo.color : LOL_LOSS.color;

  return (
    <div className="flex items-center gap-2 rounded px-2 py-1.5" style={{ background: 'var(--lol-bg-elevated)' }}>
      <ChampionAvatar champKey={c.champion} label={c.champion} size={32} />
      <span className="min-w-0 flex-1 truncate text-xs font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
        {c.champion}
      </span>
      <span className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>{c.games}p</span>
      <span className="w-12 text-right text-xs font-bold" style={{ color: winColor }}>{c.winrate}%</span>
      <span className="w-14 text-right text-xs" style={{ color: 'var(--lol-violet-soft)', fontFamily: 'Rajdhani, sans-serif' }}>{c.kda} KDA</span>
    </div>
  );
}
