/**
 * Client HTTP pour les endpoints d'utilisateurs void.pro.
 * GET /api/users/search?q=... — recherche d'utilisateurs (max ~10).
 */
import { API_BASE } from './apiBase';
import { authHeaders, extractError } from './apiHelpers';
import type { UserSearchResult } from '../types/lolTeam.types';

/** GET /api/users/search?q=... — recherche d'utilisateurs par pseudo (max ~10). */
export async function searchUsers(
  q: string,
  token: string,
): Promise<UserSearchResult[]> {
  const params = new URLSearchParams({ q });
  const res = await fetch(`${API_BASE}/api/users/search?${params.toString()}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await extractError(res));
  const data = (await res.json()) as { users: UserSearchResult[] };
  return data.users;
}
