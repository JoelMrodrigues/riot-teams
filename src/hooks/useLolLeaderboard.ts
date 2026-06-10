/**
 * Classement apex pour l'accueil LoL.
 * Récupère le vrai classement (pseudos résolus côté backend) ; repli sur des
 * données fictives en mode démo ou si le serveur est injoignable.
 */
import { useState, useEffect } from 'react';

import { fetchLeaderboard } from '../services/lolLeaderboardApi';
import { isDemoMode } from '../utils/demoMode';
import { DEMO_LEADERBOARD } from '../data/lolDemoExtras.data';
import type { DemoLeaderEntry } from '../data/lolDemoExtras.data';

export interface UseLolLeaderboardReturn {
  entries: DemoLeaderEntry[];
  loading: boolean;
}

export function useLolLeaderboard(): UseLolLeaderboardReturn {
  const [entries, setEntries] = useState<DemoLeaderEntry[]>(DEMO_LEADERBOARD);
  const [loading, setLoading] = useState(!isDemoMode());

  useEffect(() => {
    if (isDemoMode()) {
      setEntries(DEMO_LEADERBOARD);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchLeaderboard('challenger', 8)
      .then((lb) => {
        if (cancelled) return;
        setEntries(
          lb.entries.map((e) => ({
            name: e.tagLine ? `${e.gameName}#${e.tagLine}` : e.gameName,
            lp: e.leaguePoints,
            wins: e.wins,
            losses: e.losses,
          })),
        );
        setLoading(false);
      })
      .catch(() => {
        // Serveur injoignable (ex. réseau pro) → on garde les données fictives.
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { entries, loading };
}
