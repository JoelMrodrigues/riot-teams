/**
 * Hook pour les stats joueurs d'une équipe LoL.
 * Appelle GET /api/lol/teams/:id/player-stats et expose une Map
 * rosterId → { rank, topChampions, error? } pour un accès O(1) par carte.
 *
 * Charge uniquement si teamId et token sont disponibles.
 */
import { useState, useEffect, useCallback } from 'react';

import { fetchTeamPlayerStats } from '../services/lolPlayerStatsApi';
import { useAuth } from './useAuth';
import type { LolPlayerRank, LolTopChampion } from '../types/lolTeam.types';

export interface PlayerStatEntry {
  rank: LolPlayerRank | null;
  topChampions: LolTopChampion[];
  error?: string;
}

export interface UseTeamPlayerStatsReturn {
  statsByRosterId: Map<string, PlayerStatEntry>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTeamPlayerStats(
  teamId: string | undefined,
): UseTeamPlayerStatsReturn {
  const { token } = useAuth();
  const [statsByRosterId, setStatsByRosterId] = useState<Map<string, PlayerStatEntry>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rev, setRev] = useState(0);

  useEffect(() => {
    if (!teamId || !token) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchTeamPlayerStats(teamId, token)
      .then((data) => {
        if (cancelled) return;
        const map = new Map<string, PlayerStatEntry>();
        for (const p of data.players) {
          map.set(p.rosterId, {
            rank: p.rank,
            topChampions: p.topChampions,
            error: p.error,
          });
        }
        setStatsByRosterId(map);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Erreur stats joueurs');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [teamId, token, rev]);

  const refresh = useCallback(() => setRev((v) => v + 1), []);

  return { statsByRosterId, loading, error, refresh };
}
