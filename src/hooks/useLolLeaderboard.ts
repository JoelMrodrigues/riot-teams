/**
 * Classement apex pour l'accueil LoL.
 *
 * Pour l'instant : données fictives (le serveur n'est pas joignable en réseau pro).
 * TODO (backend déployé) : fetch `/api/lol/leaderboard?tier=challenger` + résoudre
 * les pseudos (l'endpoint Riot ne renvoie que `summonerId`, pas le Riot ID).
 */
import { DEMO_LEADERBOARD } from '../data/lolDemoExtras.data';
import type { DemoLeaderEntry } from '../data/lolDemoExtras.data';

export interface UseLolLeaderboardReturn {
  entries: DemoLeaderEntry[];
  loading: boolean;
}

export function useLolLeaderboard(): UseLolLeaderboardReturn {
  return { entries: DEMO_LEADERBOARD, loading: false };
}
