import React, { useState } from 'react';

import { championSquareById } from '../../../utils/lolAssets';
import type { MasteryInfo } from '../../../types/lolApi.types';

interface MasteryCardProps {
  mastery: MasteryInfo[];
}

interface MasteryIconProps {
  championId: number;
}

function MasteryIcon({ championId }: MasteryIconProps): React.JSX.Element {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return <div className="h-full w-full rounded" style={{ background: 'var(--lol-violet-strong)' }} />;
  }
  return (
    <img
      src={championSquareById(championId)}
      alt=""
      onError={() => setOk(false)}
      className="h-full w-full rounded object-cover"
    />
  );
}

/**
 * Carte "Maîtrise" (colonne gauche du profil).
 * Affiche les top 5 champions de maîtrise en liste compacte.
 */
export function MasteryCard({ mastery }: MasteryCardProps): React.JSX.Element | null {
  if (mastery.length === 0) return null;

  const top5 = mastery.slice(0, 5);

  return (
    <section
      className="flex flex-col gap-3 rounded-md p-4"
      style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}
      aria-label="Maîtrise des champions"
    >
      <p
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--lol-text-muted)' }}
      >
        Maîtrise
      </p>

      <div className="flex flex-col gap-1.5">
        {top5.map((m, i) => (
          <MasteryRow key={m.championId} mastery={m} rank={i + 1} />
        ))}
      </div>
    </section>
  );
}

interface MasteryRowProps {
  mastery: MasteryInfo;
  rank: number;
}

function MasteryRow({ mastery, rank }: MasteryRowProps): React.JSX.Element {
  return (
    <div
      className="flex items-center gap-2 rounded px-2 py-1.5"
      style={{ background: 'var(--lol-bg-elevated)' }}
    >
      <span
        className="w-4 text-center text-xs"
        style={{ color: 'var(--lol-text-muted)', fontFamily: 'Rajdhani, sans-serif' }}
      >
        {rank}
      </span>
      <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded" style={{ border: '1px solid var(--lol-border)' }}>
        <MasteryIcon championId={mastery.championId} />
      </div>
      <div className="flex flex-1 items-center justify-between gap-2">
        <span
          className="text-xs font-bold"
          style={{ color: 'var(--lol-violet-soft)', fontFamily: 'Rajdhani, sans-serif' }}
        >
          Niv. {mastery.level}
        </span>
        <span className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>
          {(mastery.points / 1000).toFixed(0)}k pts
        </span>
      </div>
    </div>
  );
}
