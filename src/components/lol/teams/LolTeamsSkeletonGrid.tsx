import React from 'react';

/** Grille de squelettes animés pendant le chargement des équipes LoL. */
export function LolTeamsSkeletonGrid(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Chargement des équipes">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-sm border p-5 animate-pulse"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="h-10 w-10 flex-shrink-0 rounded-sm"
              style={{ background: 'var(--lol-surface)' }}
            />
            <div className="flex flex-1 flex-col gap-2">
              <div
                className="h-4 w-3/4 rounded-sm"
                style={{ background: 'var(--lol-surface)' }}
              />
              <div
                className="h-3 w-1/2 rounded-sm"
                style={{ background: 'var(--lol-surface)' }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-1/4 rounded-sm" style={{ background: 'var(--lol-surface)' }} />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((__, j) => (
                <div key={j} className="h-1 flex-1 rounded-full" style={{ background: 'var(--lol-surface)' }} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
