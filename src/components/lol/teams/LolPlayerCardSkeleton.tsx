import React from 'react';

/**
 * Skeleton affiché dans une LolPlayerCard pendant le chargement des stats.
 * Occupe la zone rang + champions de la carte.
 */
export function LolPlayerCardSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2 animate-pulse" aria-busy="true" aria-label="Chargement des stats">
      {/* Rang skeleton */}
      <div className="flex items-center gap-2">
        <div
          className="h-5 w-5 rounded-sm flex-shrink-0"
          style={{ background: 'var(--lol-surface)' }}
        />
        <div className="h-3 w-24 rounded-sm" style={{ background: 'var(--lol-surface)' }} />
      </div>

      {/* Champions skeleton — 5 colonnes */}
      <div className="grid grid-cols-5 gap-1.5 pt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-2 w-4 rounded-sm" style={{ background: 'var(--lol-surface)' }} />
            <div className="h-9 w-9 rounded-sm" style={{ background: 'var(--lol-surface)' }} />
            <div className="h-2 w-5 rounded-sm" style={{ background: 'var(--lol-surface)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
