import { useState, useCallback } from 'react';

const STORAGE_KEY = 'lol:recent-searches';
const MAX_ENTRIES = 5;

export interface RecentSearch {
  riotId: string;
  tagLine: string;
  addedAt: string;
}

interface UseRecentSearchesReturn {
  searches: RecentSearch[];
  addSearch: (riotId: string, tagLine: string) => void;
  clearAll: () => void;
}

function readFromStorage(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentSearch[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(entries: RecentSearch[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('[useRecentSearches] Échec de la sauvegarde locale :', err);
  }
}

/**
 * Lit et écrit les 5 derniers Riot ID recherchés dans localStorage.
 * Crash-safe : toute erreur de parsing/quota est silencieuse.
 * La plus récente entrée est en tête de liste (LIFO).
 */
export function useRecentSearches(): UseRecentSearchesReturn {
  const [searches, setSearches] = useState<RecentSearch[]>(readFromStorage);

  const addSearch = useCallback((riotId: string, tagLine: string) => {
    setSearches((prev) => {
      const deduped = prev.filter(
        (s) => !(s.riotId === riotId && s.tagLine === tagLine),
      );
      const updated = [
        { riotId, tagLine, addedAt: new Date().toISOString() },
        ...deduped,
      ].slice(0, MAX_ENTRIES);
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('[useRecentSearches] Échec de la suppression locale :', err);
    }
  }, []);

  return { searches, addSearch, clearAll };
}
