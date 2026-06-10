/**
 * Hook pour la LISTE des équipes LoL de l'utilisateur connecté.
 * État : { teams, loading, error, refresh, createTeam }
 * Dépend de useAuth pour le token — ne fait rien si non connecté.
 */
import { useState, useEffect, useCallback } from 'react';

import { fetchMyLolTeams, createLolTeam } from '../services/lolTeamsApi';
import { useAuth } from './useAuth';
import { isDemoMode } from '../utils/demoMode';
import { DEMO_TEAMS_LIST } from '../data/lolDemoTeam.data';
import type { LolApiTeam, LolCreateTeamBody } from '../types/lolTeam.types';

export interface UseLolTeamsReturn {
  teams: LolApiTeam[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  createTeam: (body: LolCreateTeamBody) => Promise<LolApiTeam>;
}

export function useLolTeams(): UseLolTeamsReturn {
  const { token, status } = useAuth();
  const [teams, setTeams]     = useState<LolApiTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [rev, setRev]         = useState(0);

  useEffect(() => {
    if (isDemoMode()) {
      setTeams(DEMO_TEAMS_LIST);
      setLoading(false);
      setError(null);
      return;
    }

    if (status !== 'authenticated' || !token) {
      setTeams([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMyLolTeams(token)
      .then((data) => { if (!cancelled) { setTeams(data); setLoading(false); } })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [token, status, rev]);

  const refresh = useCallback(() => setRev((v) => v + 1), []);

  const createTeam = useCallback(
    async (body: LolCreateTeamBody): Promise<LolApiTeam> => {
      if (!token) throw new Error('Non connecté');
      const created = await createLolTeam(body, token);
      setRev((v) => v + 1);
      return created;
    },
    [token],
  );

  return { teams, loading, error, refresh, createTeam };
}
