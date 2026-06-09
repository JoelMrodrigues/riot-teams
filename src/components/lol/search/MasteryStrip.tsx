import React, { useState } from 'react';

import { championSquareById } from '../../../utils/lolAssets';
import type { MasteryInfo } from '../../../types/lolApi.types';

interface MasteryStripProps {
  mastery: MasteryInfo[];
}

function MasteryIcon({ championId }: { championId: number }): React.JSX.Element {
  const [ok, setOk] = useState(true);
  if (!ok) return <div className="h-full w-full" style={{ background: 'var(--lol-violet-strong)' }} />;
  return <img src={championSquareById(championId)} alt="" onError={() => setOk(false)} className="h-full w-full object-cover" />;
}

/** Top maîtrises : icône champion + niveau + points. */
export function MasteryStrip({ mastery }: MasteryStripProps): React.JSX.Element | null {
  if (mastery.length === 0) return null;

  return (
    <div className="rounded-md p-4" style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lol-text-muted)' }}>Maîtrise</p>
      <div className="flex flex-wrap gap-3">
        {mastery.map((m) => (
          <div key={m.championId} className="flex w-16 flex-col items-center gap-1">
            <div className="h-12 w-12 overflow-hidden rounded-md" style={{ border: '1px solid var(--lol-border)' }}>
              <MasteryIcon championId={m.championId} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: 'var(--lol-violet-soft)' }}>Niv. {m.level}</span>
            <span className="text-[10px]" style={{ color: 'var(--lol-text-muted)' }}>{Math.round(m.points / 1000)}k</span>
          </div>
        ))}
      </div>
    </div>
  );
}
