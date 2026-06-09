import React from 'react';

/** Skeleton de chargement pour la page détail d'une équipe LoL. */
export function LolTeamDetailSkeleton(): React.JSX.Element {
  return (
    <div
      className="mx-auto w-full max-w-3xl px-4 pb-8 pt-8 md:px-6 lg:px-8 animate-pulse"
      aria-busy="true"
      aria-label="Chargement de l'équipe"
    >
      <div className="flex flex-col gap-8">
        {/* Header skeleton */}
        <div className="flex items-start gap-3">
          <div
            className="h-14 w-14 flex-shrink-0 rounded-sm"
            style={{ background: 'var(--lol-surface)' }}
          />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <div className="h-3 w-1/4 rounded-sm" style={{ background: 'var(--lol-surface)' }} />
            <div className="h-8 w-2/3 rounded-sm" style={{ background: 'var(--lol-surface)' }} />
            <div className="h-3 w-1/3 rounded-sm" style={{ background: 'var(--lol-surface)' }} />
          </div>
        </div>

        {/* Roster skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-3 w-16 rounded-sm" style={{ background: 'var(--lol-surface)' }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-14 w-full rounded-sm"
              style={{ background: 'var(--lol-surface)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
