import React from 'react';

/** Barre squelette réutilisable. */
function SkeletonBar({ w, h = 'h-3' }: { w: string; h?: string }): React.JSX.Element {
  return (
    <div
      className={`${h} ${w} rounded-sm animate-pulse`}
      style={{ background: 'var(--lol-surface)' }}
    />
  );
}

/** Bloc squelette de ProfileHeader. */
function HeaderSkeleton(): React.JSX.Element {
  return (
    <div
      className="rounded-md p-6 flex flex-col lg:flex-row lg:items-center gap-6"
      style={{ background: 'var(--lol-bg-elevated)', border: '1px solid var(--lol-border)' }}
    >
      <div className="flex items-center gap-4">
        <div
          className="h-20 w-20 rounded-md animate-pulse shrink-0"
          style={{ background: 'var(--lol-surface)' }}
        />
        <div className="flex flex-col gap-2">
          <SkeletonBar w="w-40" h="h-5" />
          <SkeletonBar w="w-28" />
        </div>
      </div>
      <div className="lg:ml-auto flex gap-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="rounded-md p-4 flex gap-3 items-center"
            style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)', minWidth: '200px' }}
          >
            <div className="h-12 w-12 rounded-sm animate-pulse" style={{ background: 'var(--lol-border)' }} />
            <div className="flex flex-col gap-2">
              <SkeletonBar w="w-20" h="h-2" />
              <SkeletonBar w="w-32" h="h-4" />
              <SkeletonBar w="w-24" h="h-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Carte squelette générique (colonne gauche). */
function CardSkeleton({ rows, rowWidths }: { rows: number; rowWidths?: string[] }): React.JSX.Element {
  return (
    <div
      className="rounded-md p-4 flex flex-col gap-3"
      style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}
    >
      <SkeletonBar w="w-24" h="h-2" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 rounded px-2 py-1.5"
            style={{ background: 'var(--lol-bg-elevated)' }}
          >
            <div className="h-8 w-8 rounded animate-pulse shrink-0" style={{ background: 'var(--lol-border)' }} />
            <SkeletonBar w={rowWidths?.[i % rowWidths.length] ?? 'w-full'} h="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Ligne squelette de MatchRow. */
function MatchRowSkeleton({ delay }: { delay: number }): React.JSX.Element {
  return (
    <div
      className="flex items-center gap-4 rounded-md p-3"
      style={{ background: 'var(--lol-surface)', borderLeft: '3px solid var(--lol-border)' }}
    >
      <div
        className="h-11 w-11 rounded-md animate-pulse shrink-0"
        style={{ background: 'var(--lol-border)', animationDelay: `${delay}s` }}
      />
      <div className="flex-1 flex flex-col gap-2">
        <SkeletonBar w="w-24" h="h-3" />
        <SkeletonBar w="w-32" h="h-2" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <SkeletonBar w="w-16" h="h-3" />
        <SkeletonBar w="w-24" h="h-2" />
      </div>
      <div
        className="h-5 w-6 rounded-sm animate-pulse"
        style={{ background: 'var(--lol-border)', animationDelay: `${delay}s` }}
      />
    </div>
  );
}

/** Squelette de la barre de filtres (MatchFilters). */
function FilterBarSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-7 rounded-md animate-pulse"
          style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)', width: i === 3 ? '140px' : '120px' }}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton complet calqué sur le layout 2 colonnes de ProfileView :
 * en-tête pleine largeur, puis lg:grid-cols-[320px_1fr].
 * Gauche : classement, champions récents, maîtrise, winrate 7j.
 * Droite : titre + filtres + 6 lignes de matchs.
 */
export function LolProfileSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Chargement du profil">
      <HeaderSkeleton />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        {/* Colonne gauche */}
        <div className="flex flex-col gap-4">
          <CardSkeleton rows={2} rowWidths={['w-3/4', 'w-2/3']} />
          <CardSkeleton rows={5} rowWidths={['w-full', 'w-4/5', 'w-3/4', 'w-4/5', 'w-full']} />
          <CardSkeleton rows={5} rowWidths={['w-full', 'w-4/5', 'w-3/4', 'w-2/3', 'w-4/5']} />
          <CardSkeleton rows={3} rowWidths={['w-full', 'w-3/4', 'w-2/3']} />
        </div>

        {/* Colonne droite */}
        <div className="flex flex-col gap-3">
          <SkeletonBar w="w-32" h="h-2" />
          <FilterBarSkeleton />
          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <MatchRowSkeleton key={i} delay={i * 0.05} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
