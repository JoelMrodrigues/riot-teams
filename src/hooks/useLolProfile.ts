import { useState, useCallback } from 'react';

import { fetchLolProfile } from '../services/lolApi';
import { parseRiotId } from '../utils/riotId';
import type { LolProfile } from '../types/lolApi.types';

interface UseLolProfileReturn {
  profile: LolProfile | null;
  loading: boolean;
  error: string | null;
  search: (riotId: string) => Promise<void>;
}

/** Recherche de profil LoL complet : loading / error / data. */
export function useLolProfile(): UseLolProfileReturn {
  const [profile, setProfile] = useState<LolProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (riotId: string) => {
    const parsed = parseRiotId(riotId);
    if (!parsed) {
      setError('Format invalide. Utilise pseudo#tag (ex: Marcel le Zgeg#BACK).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setProfile(await fetchLolProfile(parsed.gameName, parsed.tagLine));
    } catch (err) {
      setProfile(null);
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, search };
}
