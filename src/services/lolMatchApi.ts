/** Client pour le détail + la timeline d'une partie LoL (endpoints publics). */
import { API_BASE } from './apiBase';
import type { MatchDetail } from '../types/lolMatchDetail.types';
import type { MatchTimeline } from '../types/lolTimeline.types';

export async function fetchMatchDetail(matchId: string): Promise<MatchDetail> {
  const res = await fetch(`${API_BASE}/api/lol/match/detail?id=${encodeURIComponent(matchId)}`);
  if (!res.ok) throw new Error('Détail de match indisponible.');
  return res.json() as Promise<MatchDetail>;
}

export async function fetchMatchTimeline(matchId: string): Promise<MatchTimeline> {
  const res = await fetch(`${API_BASE}/api/lol/match/timeline?id=${encodeURIComponent(matchId)}`);
  if (!res.ok) throw new Error('Timeline indisponible.');
  return res.json() as Promise<MatchTimeline>;
}
