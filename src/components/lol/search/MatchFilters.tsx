import React from 'react';

import { useTheme } from '../../../context/ThemeContext';
import type { MatchFilters as Filters } from '../../../hooks/useMatchFilters';
import type { QueueKind, RoleKind } from '../../../types/lolApi.types';

interface MatchFiltersProps {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  champions: string[];
}

const QUEUES: { v: QueueKind | 'all'; l: string }[] = [
  { v: 'all', l: 'Toutes les files' }, { v: 'solo', l: 'SoloQ' }, { v: 'flex', l: 'Flex' },
  { v: 'normal', l: 'Normales' }, { v: 'aram', l: 'ARAM' },
];
const RESULTS: { v: 'all' | 'win' | 'loss'; l: string }[] = [
  { v: 'all', l: 'Tous résultats' }, { v: 'win', l: 'Victoires' }, { v: 'loss', l: 'Défaites' },
];
const ROLES: { v: RoleKind | 'all'; l: string }[] = [
  { v: 'all', l: 'Tous rôles' }, { v: 'TOP', l: 'Top' }, { v: 'JUNGLE', l: 'Jungle' },
  { v: 'MIDDLE', l: 'Mid' }, { v: 'BOTTOM', l: 'ADC' }, { v: 'UTILITY', l: 'Support' },
];

const optionStyle: React.CSSProperties = {
  background: 'var(--lol-bg-elevated)',
  color: 'var(--lol-text)',
};

/**
 * Barre de filtres compacte (selects) pour l'historique de matchs.
 * Le colorScheme du <select> suit le thème courant pour que la liste native
 * soit lisible aussi bien en clair qu'en sombre.
 * Le fond solide --lol-bg-elevated (déjà thème-aware) complète le dispositif.
 */
export function MatchFilters({ filters, setFilter, champions }: MatchFiltersProps): React.JSX.Element {
  const { theme } = useTheme();

  const selectStyle: React.CSSProperties = {
    fontFamily: 'Rajdhani, sans-serif',
    background: 'var(--lol-bg-elevated)',
    border: '1px solid var(--lol-border)',
    color: 'var(--lol-text)',
    colorScheme: theme === 'light' ? 'light' : 'dark',
  };

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={filters.queue}
        onChange={(e) => setFilter('queue', e.target.value as Filters['queue'])}
        className="rounded-md px-3 py-1.5 text-xs outline-none cursor-pointer"
        style={selectStyle}
        aria-label="Filtrer par file"
      >
        {QUEUES.map((q) => <option key={q.v} value={q.v} style={optionStyle}>{q.l}</option>)}
      </select>

      <select
        value={filters.result}
        onChange={(e) => setFilter('result', e.target.value as Filters['result'])}
        className="rounded-md px-3 py-1.5 text-xs outline-none cursor-pointer"
        style={selectStyle}
        aria-label="Filtrer par résultat"
      >
        {RESULTS.map((r) => <option key={r.v} value={r.v} style={optionStyle}>{r.l}</option>)}
      </select>

      <select
        value={filters.role}
        onChange={(e) => setFilter('role', e.target.value as Filters['role'])}
        className="rounded-md px-3 py-1.5 text-xs outline-none cursor-pointer"
        style={selectStyle}
        aria-label="Filtrer par rôle"
      >
        {ROLES.map((r) => <option key={r.v} value={r.v} style={optionStyle}>{r.l}</option>)}
      </select>

      <select
        value={filters.champion}
        onChange={(e) => setFilter('champion', e.target.value)}
        className="rounded-md px-3 py-1.5 text-xs outline-none cursor-pointer"
        style={selectStyle}
        aria-label="Filtrer par champion"
      >
        <option value="all" style={optionStyle}>Tous champions</option>
        {champions.map((c) => <option key={c} value={c} style={optionStyle}>{c}</option>)}
      </select>
    </div>
  );
}
