import { useMemo, useState } from 'react';

import type { MatchSummary, QueueType, Role } from '../types/lolPlayer.types';

export interface MatchFilters {
  queue: QueueType | 'all';
  champion: string | 'all';
  result: 'all' | 'win' | 'loss';
  role: Role | 'all';
}

const DEFAULT_FILTERS: MatchFilters = { queue: 'all', champion: 'all', result: 'all', role: 'all' };

interface UseMatchFiltersReturn {
  filters: MatchFilters;
  setFilter: <K extends keyof MatchFilters>(key: K, value: MatchFilters[K]) => void;
  reset: () => void;
  filtered: MatchSummary[];
  champions: string[];
}

/** Gère les filtres (file, champion, résultat, rôle) et la liste filtrée. */
export function useMatchFilters(matches: MatchSummary[]): UseMatchFiltersReturn {
  const [filters, setFilters] = useState<MatchFilters>(DEFAULT_FILTERS);

  const setFilter = <K extends keyof MatchFilters>(key: K, value: MatchFilters[K]): void => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const champions = useMemo(
    () => Array.from(new Set(matches.map((m) => m.champion))).sort(),
    [matches],
  );

  const filtered = useMemo(
    () =>
      matches.filter((m) => {
        if (filters.queue !== 'all' && m.queue !== filters.queue) return false;
        if (filters.champion !== 'all' && m.champion !== filters.champion) return false;
        if (filters.result === 'win' && !m.win) return false;
        if (filters.result === 'loss' && m.win) return false;
        if (filters.role !== 'all' && m.role !== filters.role) return false;
        return true;
      }),
    [matches, filters],
  );

  return { filters, setFilter, reset: () => setFilters(DEFAULT_FILTERS), filtered, champions };
}
