import React from 'react';

/**
 * Zone E — bandeau discret signalant les fonctionnalités à venir.
 * Statique, pas de props. Masqué sur mobile xs, visible sm+.
 */
export function LolUpcomingBanner(): React.JSX.Element {
  return (
    <aside
      className="hidden sm:flex items-center gap-3 rounded-sm px-4 py-2.5"
      style={{
        background: 'var(--lol-surface)',
        border: '1px solid var(--lol-border)',
      }}
      aria-label="Fonctionnalités à venir"
    >
      <span
        className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full"
        style={{ background: 'var(--lol-violet)' }}
      />
      <p className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>
        <span
          className="font-bold uppercase tracking-wider"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)' }}
        >
          Bientôt
        </span>{' '}
        : Tier list LoL · Meta hebdomadaire
      </p>
    </aside>
  );
}
