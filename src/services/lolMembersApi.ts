/**
 * Client HTTP pour les endpoints de gestion des membres d'une équipe LoL.
 * POST   /api/lol/teams/:id/members          — ajoute un membre
 * PATCH  /api/lol/teams/:id/members/:userId  — change son rôle
 * DELETE /api/lol/teams/:id/members/:userId  — retire le membre
 * POST   /api/lol/teams/:id/transfer         — transfère la propriété
 */
import { API_BASE } from './apiBase';
import { authHeaders, extractError } from './apiHelpers';
import type {
  LolAddMemberBody,
  LolUpdateMemberRoleBody,
  LolTransferOwnershipBody,
} from '../types/lolTeam.types';

/** POST /api/lol/teams/:id/members — ajoute un membre (owner/captain). */
export async function addLolMember(
  teamId: string,
  body: LolAddMemberBody,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/members`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractError(res));
}

/** PATCH /api/lol/teams/:id/members/:userId — change le rôle d'un membre. */
export async function updateLolMemberRole(
  teamId: string,
  userId: string,
  body: LolUpdateMemberRoleBody,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/members/${userId}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractError(res));
}

/** DELETE /api/lol/teams/:id/members/:userId — retire un membre. */
export async function removeLolMember(
  teamId: string,
  userId: string,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/members/${userId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await extractError(res));
}

/** POST /api/lol/teams/:id/transfer — transfère la propriété (owner strict). */
export async function transferLolOwnership(
  teamId: string,
  body: LolTransferOwnershipBody,
  token: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/transfer`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractError(res));
}
