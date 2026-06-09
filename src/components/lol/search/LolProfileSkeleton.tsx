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

/** Bloc squelette de MasteryStrip. */
function MasterySkeleton(): React.JSX.Element {
  return (
    <div className="rounded-md p-4" style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}>
      <SkeletonBar w="w-20" h="h-2" />
      <div className="mt-3 flex gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-12 w-12 rounded-md animate-pulse" style={{ background: 'var(--lol-border)', animationDelay: `${i * 0.07}s` }} />
            <SkeletonBar w="w-10" h="h-2" />
            <SkeletonBar w="w-8" h="h-2" />
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
      <div className="h-11 w-11 rounded-md animate-pulse shrink-0" style={{ background: 'var(--lol-border)', animationDelay: `${delay}s` }} />
      <div className="flex-1 flex flex-col gap-2">
        <SkeletonBar w="w-24" h="h-3" />
        <SkeletonBar w="w-32" h="h-2" />
      </div>
      <div className="flex flex-col items-end gap-2">
        <SkeletonBar w="w-16" h="h-3" />
        <SkeletonBar w="w-24" h="h-2" />
      </div>
      <div className="h-5 w-6 rounded-sm animate-pulse" style={{ background: 'var(--lol-border)', animationDelay: `${delay}s` }} />
    </div>
  );
}

/**
 * Skeleton complet de la page profil : ProfileHeader + MasteryStrip + liste de matchs.
 * Calqué sur la structure de ProfileView pour une transition naturelle.
 */
export function LolProfileSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Chargement du profil">
      <HeaderSkeleton />
      <MasterySkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* Filtres squelette */}
        <div className="rounded-md p-4 flex flex-col gap-3" style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}>
          {[0, 1, 2, 3].map((i) => <SkeletonBar key={i} w={i % 2 === 0 ? 'w-full' : 'w-3/4'} />)}
        </div>
        {/* Matchs squelette */}
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => <MatchRowSkeleton key={i} delay={i * 0.05} />)}
        </div>
      </div>
    </div>
  );
}
