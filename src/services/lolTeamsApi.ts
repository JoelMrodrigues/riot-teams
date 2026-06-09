/**
 * Client HTTP typé pour les endpoints /api/lol/teams.
 * - Corps de requête envoyés en snake_case (contrat backend).
 * - Réponses lues en camelCase (contrat backend).
 * - Header Authorization: Bearer ajouté automatiquement via le token passé en argument.
 * - Aucune dépendance UI.
 */
import { API_BASE } from './apiBase';
import type {
  LolApiTeam,
  LolApiTeamDetail,
  LolApiRosterMember,
  LolCreateTeamBody,
  LolUpdateTeamBody,
  LolAddRosterMemberBody,
} from '../types/lolTeam.types';

/** Extrait le message d'erreur depuis une réponse non-ok. */
async function extractError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? `Erreur HTTP ${res.status}`;
  } catch {
    return `Erreur HTTP ${res.status}`;
  }
}

/** Headers communs authentifiés. */
function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

/** GET /api/lol/teams — liste des équipes de l'utilisateur connecté. */
export async function fetchMyLolTeams(token: string): Promise<LolApiTeam[]> {
  const res = await fetch(`${API_BASE}/api/lol/teams`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await extractError(res));
  const data = (await res.json()) as { teams: LolApiTeam[] };
  return data.teams;
}

/** GET /api/lol/teams/:id — détail + managers + roster. */
export async function fetchLolTeam(id: string, token: string): Promise<LolApiTeamDetail> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${id}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json() as Promise<LolApiTeamDetail>;
}

/** POST /api/lol/teams — crée une équipe. Corps en snake_case. */
export async function createLolTeam(
  body: LolCreateTeamBody,
  token: string,
): Promise<LolApiTeam> {
  const res = await fetch(`${API_BASE}/api/lol/teams`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json() as Promise<LolApiTeam>;
}

/** PATCH /api/lol/teams/:id — mise à jour partielle. Corps en snake_case. */
export async function updateLolTeam(
  id: string,
  body: LolUpdateTeamBody,
  token: string,
): Promise<LolApiTeam> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json() as Promise<LolApiTeam>;
}

/** DELETE /api/lol/teams/:id — supprime l'équipe. */
export async function deleteLolTeam(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await extractError(res));
}

/** POST /api/lol/teams/:id/roster — ajoute un joueur. Corps en snake_case. */
export async function addLolRosterMember(
  teamId: string,
  body: LolAddRosterMemberBody,
  token: string,
): Promise<LolApiRosterMember> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/roster`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json() as Promise<LolApiRosterMember>;
}

/** DELETE /api/lol/teams/:id/roster/:rosterId — retire un joueur. */
export async function removeLolRosterMember(
  teamId: string,
  rosterId: string,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/roster/${rosterId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await extractError(res));
}
