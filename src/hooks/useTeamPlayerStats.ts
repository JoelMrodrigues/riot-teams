/**
 * Hook pour les stats joueurs d'une équipe LoL (rang + top champions).
 * Appelle GET /api/lol/teams/:id/player-stats → Map rosterId → { rank, topChampions }.
 *
 * Remontée automatique des rangs : re-fetch au retour sur l'onglet (après une
 * game) + à intervalle régulier, avec anti-spam. Expose aussi `refresh` manuel
 * et `lastUpdated`. (Le backend cache 60 s → les rafraîchissements rapprochés
 * tapent le cache, pas Riot.)
 */
import { useState, useEffect, useCallback, useRef } from 'react';

import { fetchTeamPlayerStats } from '../services/lolPlayerStatsApi';
import { useAuth } from './useAuth';
import { isDemoMode } from '../utils/demoMode';
import { DEMO_STATS } from '../data/lolDemoTeam.data';
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
  lastUpdated: number | null;
  refresh: () => void;
}

const AUTO_REFRESH_MS = 120_000; // remontée auto toutes les 2 min
const MIN_GAP_MS = 30_000; // anti-spam au focus

export function useTeamPlayerStats(teamId: string | undefined): UseTeamPlayerStatsReturn {
  const { token } = useAuth();
  const [statsByRosterId, setStatsByRosterId] = useState<Map<string, PlayerStatEntry>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [rev, setRev] = useState(0);
  const lastFetchRef = useRef(0);

  useEffect(() => {
    if (isDemoMode()) {
      setStatsByRosterId(DEMO_STATS);
      setLoading(false);
      setError(null);
      setLastUpdated(Date.now());
      return;
    }
    if (!teamId || !token) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTeamPlayerStats(teamId, token)
      .then((data) => {
        if (cancelled) return;
        const map = new Map<string, PlayerStatEntry>();
        for (const p of data.players) {
          map.set(p.rosterId, { rank: p.rank, topChampions: p.topChampions, error: p.error });
        }
        setStatsByRosterId(map);
        setLastUpdated(Date.now());
        lastFetchRef.current = Date.now();
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

  // Remontée automatique : retour sur l'onglet + intervalle (anti-spam).
  useEffect(() => {
    if (isDemoMode() || !teamId || !token) return;
    const maybe = () => { if (Date.now() - lastFetchRef.current > MIN_GAP_MS) setRev((v) => v + 1); };
    const onVisible = () => { if (document.visibilityState === 'visible') maybe(); };
    window.addEventListener('focus', maybe);
    document.addEventListener('visibilitychange', onVisible);
    const id = setInterval(() => setRev((v) => v + 1), AUTO_REFRESH_MS);
    return () => {
      window.removeEventListener('focus', maybe);
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(id);
    };
  }, [teamId, token]);

  return { statsByRosterId, loading, error, lastUpdated, refresh };
}
