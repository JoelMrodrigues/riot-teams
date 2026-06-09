import React, { useState, useMemo } from 'react';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_CHAMPIONS } from '../../../data/lolChampions.data';

interface LolChampionPickerProps {
  selected:    string | null;
  accentColor: string;
  onChange:    (champKey: string) => void;
}

/** Onglet Champion : champ de recherche + grille filtrée de champions. */
export function LolChampionPicker({ selected, accentColor, onChange }: LolChampionPickerProps): React.JSX.Element {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => LOL_CHAMPIONS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: 'var(--lol-text-muted)' }}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un champion…"
          autoFocus
          aria-label="Rechercher un champion"
          className="w-full rounded-sm py-2 pl-8 pr-3 text-sm outline-none transition-colors"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--lol-text)',
            fontFamily: 'Inter, sans-serif',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--lol-violet)')}
          onBlur={(e)  => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        />
      </div>

      <div
        role="grid"
        aria-label="Grille de champions"
        className="grid grid-cols-6 gap-1.5 overflow-y-auto sm:grid-cols-8"
        style={{ maxHeight: '13rem' }}
      >
        {filtered.length === 0 ? (
          <p
            className="col-span-6 py-4 text-center text-xs sm:col-span-8"
            style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
          >
            Aucun champion trouvé
          </p>
        ) : (
          filtered.map((champ) => {
            const isSelected = champ.key === selected;
            return (
              <div key={champ.key} role="gridcell" aria-label={champ.label}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onChange(champ.key)}
                  className="cursor-pointer rounded-sm transition-all duration-150"
                  style={{ opacity: isSelected ? 1 : 0.65 }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--lol-violet)';
                    e.currentTarget.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => { e.currentTarget.style.outline = 'none'; }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.opacity = '0.65'; }}
                >
                  <ChampionAvatar
                    champKey={champ.key}
                    label={champ.label}
                    size={40}
                    ring={isSelected ? accentColor : undefined}
                  />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
