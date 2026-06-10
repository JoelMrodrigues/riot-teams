/** Client pour le détail d'une partie LoL (endpoint public /api/lol/match/detail). */
import { API_BASE } from './apiBase';
import type { MatchDetail } from '../types/lolMatchDetail.types';

export async function fetchMatchDetail(matchId: string): Promise<MatchDetail> {
  const res = await fetch(`${API_BASE}/api/lol/match/detail?id=${encodeURIComponent(matchId)}`);
  if (!res.ok) throw new Error('Détail de match indisponible.');
  return res.json() as Promise<MatchDetail>;
}
