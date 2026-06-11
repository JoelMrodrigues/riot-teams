/**
 * Statut « en partie » d'un joueur + détail de la partie (Spectator-V5).
 * Démo-aware : en ?demo=1, renvoie une partie fictive.
 */
import { useState, useEffect } from 'react';

import { fetchLiveGame } from '../services/lolLiveApi';
import { isDemoMode } from '../utils/demoMode';
import { DEMO_LIVE_GAME } from '../data/lolDemoLive.data';
import type { LiveGame } from '../types/lolLive.types';

export interface UseLiveGameReturn {
  inGame: boolean;
  game: LiveGame | null;
  loading: boolean;
}

export function useLiveGame(gameName?: string, tagLine?: string): UseLiveGameReturn {
  const [state, setState] = useState<UseLiveGameReturn>({ inGame: false, game: null, loading: false });

  useEffect(() => {
    if (isDemoMode()) { setState({ inGame: true, game: DEMO_LIVE_GAME, loading: false }); return; }
    if (!gameName || !tagLine) { setState({ inGame: false, game: null, loading: false }); return; }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));
    fetchLiveGame(gameName, tagLine)
      .then((r) => { if (!cancelled) setState({ inGame: r.inGame, game: r.game, loading: false }); })
      .catch(() => { if (!cancelled) setState({ inGame: false, game: null, loading: false }); });
    return () => { cancelled = true; };
  }, [gameName, tagLine]);

  return state;
}
