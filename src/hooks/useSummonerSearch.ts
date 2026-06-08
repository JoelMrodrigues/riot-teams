import { useState, useCallback } from 'react';

import { fetchSummonerByRiotId } from '../services/lolApi';
import { parseRiotId } from '../utils/riotId';
import type { SummonerProfile } from '../types/lolApi.types';

interface UseSummonerSearchReturn {
  profile: SummonerProfile | null;
  label: string;
  loading: boolean;
  error: string | null;
  search: (riotId: string) => Promise<void>;
}

/** Recherche d'invocateur via le proxy du site : loading / error / data. */
export function useSummonerSearch(): UseSummonerSearchReturn {
  const [profile, setProfile] = useState<SummonerProfile | null>(null);
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (riotId: string) => {
    const parsed = parseRiotId(riotId);
    if (!parsed) {
      setError('Format invalide. Utilise pseudo#tag (ex: Marcel le Zgeg#BACK).');
      return;
    }
    setLabel(`${parsed.gameName} #${parsed.tagLine}`);
    setLoading(true);
    setError(null);
    try {
      setProfile(await fetchSummonerByRiotId(parsed.gameName, parsed.tagLine));
    } catch (err) {
      setProfile(null);
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, label, loading, error, search };
}
