/** Statut + détail « en partie » d'un joueur (endpoint public /api/lol/live). */
import { API_BASE } from './apiBase';
import type { LiveGame } from '../types/lolLive.types';

export interface LiveStatus {
  inGame: boolean;
  game: LiveGame | null;
}

export async function fetchLiveGame(gameName: string, tagLine: string): Promise<LiveStatus> {
  const res = await fetch(
    `${API_BASE}/api/lol/live?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`,
  );
  if (!res.ok) throw new Error('Statut live indisponible.');
  const data = (await res.json()) as { inGame?: boolean; game?: LiveGame | null };
  return { inGame: data.inGame === true, game: data.game ?? null };
}
