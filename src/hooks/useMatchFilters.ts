import { useMemo, useState } from 'react';

import type { MatchInfo, QueueKind, RoleKind } from '../types/lolApi.types';

export interface MatchFilters {
  queue: QueueKind | 'all';
  champion: string | 'all';
  result: 'all' | 'win' | 'loss';
  role: RoleKind | 'all';
}

const DEFAULT: MatchFilters = { queue: 'all', champion: 'all', result: 'all', role: 'all' };

interface UseMatchFiltersReturn {
  filters: MatchFilters;
  setFilter: <K extends keyof MatchFilters>(key: K, value: MatchFilters[K]) => void;
  filtered: MatchInfo[];
  champions: string[];
}

/** Filtres de l'historique : file, champion, résultat, rôle. */
export function useMatchFilters(matches: MatchInfo[]): UseMatchFiltersReturn {
  const [filters, setFilters] = useState<MatchFilters>(DEFAULT);

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

  return { filters, setFilter, filtered, champions };
}
