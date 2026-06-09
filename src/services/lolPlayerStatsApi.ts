/**
 * Client HTTP pour les endpoints stats joueurs et logo d'équipe LoL.
 * - GET  /api/lol/teams/:id/player-stats — stats individuelles (rang + top champions)
 * - PUT  /api/lol/teams/:id/logo         — upload logo (manager)
 * - DELETE /api/lol/teams/:id/logo       — supprime le logo (manager)
 */
import { API_BASE } from './apiBase';
import { authHeaders, extractError } from './apiHelpers';
import type {
  LolPlayerStatsResponse,
  LolTeamLogoBody,
} from '../types/lolTeam.types';

/** GET /api/lol/teams/:id/player-stats — renvoie les stats de tous les joueurs du roster. */
export async function fetchTeamPlayerStats(
  teamId: string,
  token: string,
): Promise<LolPlayerStatsResponse> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/player-stats`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json() as Promise<LolPlayerStatsResponse>;
}

/** PUT /api/lol/teams/:id/logo — envoie le logo encodé en base64. */
export async function uploadTeamLogo(
  teamId: string,
  body: LolTeamLogoBody,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/logo`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractError(res));
}

/** DELETE /api/lol/teams/:id/logo — supprime le logo de l'équipe. */
export async function deleteTeamLogo(
  teamId: string,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/logo`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await extractError(res));
}

/** URL publique du logo d'équipe (cache-bust via timestamp optionnel). */
export function teamLogoUrl(teamId: string, cacheBust?: number): string {
  const ts = cacheBust !== undefined ? `?t=${cacheBust}` : '';
  return `${API_BASE}/api/lol/teams/${teamId}/logo${ts}`;
}
