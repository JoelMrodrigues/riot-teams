import React from 'react';

import type { RecentSearch } from '../../../hooks/useRecentSearches';

interface LolRecentSearchesProps {
  searches: RecentSearch[];
  onSelect: (search: RecentSearch) => void;
  onClear: () => void;
}

/**
 * Zone D — chips horizontales des dernières recherches Riot ID.
 * Retourne null si la liste est vide (aucune zone réservée visible).
 */
export function LolRecentSearches({
  searches,
  onSelect,
  onClear,
}: LolRecentSearchesProps): React.JSX.Element | null {
  if (searches.length === 0) return null;

  return (
    <section aria-label="Recherches récentes">
      <div className="mb-2 flex items-center justify-between">
        <p
          className="text-xs font-bold uppercase tracking-[0.12em]"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
        >
          Recherches récentes
        </p>
        <button
          type="button"
          onClick={onClear}
          className="btn btn-text btn-sm"
          style={{ color: 'var(--lol-text-muted)' }}
        >
          Effacer
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {searches.map((s) => (
          <button
            key={`${s.riotId}#${s.tagLine}-${s.addedAt}`}
            type="button"
            onClick={() => onSelect(s)}
            className="shrink-0 rounded-sm border px-3 py-1.5 text-xs font-semibold transition-colors duration-150"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: 'var(--lol-text)',
              background: 'var(--lol-surface)',
              borderColor: 'var(--lol-border)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--lol-violet)';
              e.currentTarget.style.color = 'var(--lol-violet-soft)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--lol-border)';
              e.currentTarget.style.color = 'var(--lol-text)';
            }}
          >
            {s.riotId}#{s.tagLine}
          </button>
        ))}
      </div>
    </section>
  );
}
