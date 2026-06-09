/**
 * Dropdown des résultats de recherche d'utilisateurs (inline, sous le champ).
 * Accessible : role="listbox" + role="option" sur chaque bouton.
 */
import React from 'react';

import type { UserSearchResult } from '../../../types/lolTeam.types';

interface LolUserSearchResultsProps {
  results:   UserSearchResult[];
  onSelect:  (user: UserSearchResult) => void;
}

export function LolUserSearchResults({
  results,
  onSelect,
}: LolUserSearchResultsProps): React.JSX.Element | null {
  if (results.length === 0) return null;

  return (
    <ul
      role="listbox"
      aria-label="Résultats de recherche"
      className="absolute left-0 top-full z-10 mt-1 w-full rounded-sm border"
      style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}
    >
      {results.map((u) => (
        <li key={u.id}>
          <button
            type="button"
            role="option"
            aria-selected={false}
            onClick={() => onSelect(u)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
            style={{ color: 'var(--lol-text)', fontFamily: 'Inter, sans-serif' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--lol-surface-hover)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
          >
            <span className="font-medium">{u.pseudo}</span>
            {u.riotId && (
              <span className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>
                {u.riotId}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
