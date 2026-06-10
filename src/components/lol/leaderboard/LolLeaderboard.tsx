import React from 'react';

import { winrateColor } from '../../../utils/lolRank';
import type { DemoLeaderEntry } from '../../../data/lolDemoExtras.data';

interface LolLeaderboardProps {
  entries: DemoLeaderEntry[];
  accent: string;
  title?: string;
}

/** Classement (apex) : rang, joueur, LP, winrate. */
export function LolLeaderboard({ entries, accent, title = 'Classement Challenger' }: LolLeaderboardProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2 rounded-md border p-4" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
        {title}
      </span>
      <div className="flex flex-col">
        {entries.map((e, i) => {
          const games = e.wins + e.losses;
          const wr = games ? Math.round((e.wins / games) * 100) : 0;
          return (
            <div key={e.name} className="flex items-center gap-3 border-b py-1.5 last:border-b-0" style={{ borderColor: 'var(--lol-border)' }}>
              <span className="w-5 flex-shrink-0 text-center text-xs font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: i < 3 ? accent : 'var(--lol-text-muted)' }}>
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
                {e.name}
              </span>
              <span className="flex-shrink-0 text-xs font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: accent }}>
                {e.lp} LP
              </span>
              <span className="w-10 flex-shrink-0 text-right text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: winrateColor(wr) }}>
                {wr}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
