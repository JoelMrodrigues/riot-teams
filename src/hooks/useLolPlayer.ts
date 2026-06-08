import { useState, useCallback } from 'react';

import { fetchPlayer } from '../services/lolPlayerApi';
import { parseRiotId } from '../utils/riotId';
import type { PlayerProfile } from '../types/lolPlayer.types';

interface UseLolPlayerReturn {
  profile: PlayerProfile | null;
  loading: boolean;
  error: string | null;
  search: (riotId: string, platform?: string) => Promise<void>;
}

/** État de la recherche joueur : loading / error / data. */
export function useLolPlayer(): UseLolPlayerReturn {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (riotId: string, platform?: string) => {
    const parsed = parseRiotId(riotId);
    if (!parsed) {
      setError('Format invalide. Utilise pseudo#tag (ex: Faker#KR1).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlayer({ ...parsed, platform });
      setProfile(data);
    } catch (err) {
      setProfile(null);
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, search };
}
