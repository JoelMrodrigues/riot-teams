/** Client pour le classement apex (endpoint public /api/lol/leaderboard). */
import { API_BASE } from './apiBase';
import type { Leaderboard } from '../types/lolLeaderboard.types';

export async function fetchLeaderboard(tier = 'challenger', count = 8): Promise<Leaderboard> {
  const res = await fetch(`${API_BASE}/api/lol/leaderboard?tier=${tier}&count=${count}`);
  if (!res.ok) throw new Error('Classement indisponible.');
  return res.json() as Promise<Leaderboard>;
}
