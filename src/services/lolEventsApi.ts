/** Client HTTP pour l'agenda d'équipe (/api/lol/teams/:id/events). */
import { API_BASE } from './apiBase';
import { authHeaders, extractError } from './apiHelpers';
import type { LolEvent, LolEventBody } from '../types/lolEvent.types';

export async function fetchTeamEvents(teamId: string, token: string): Promise<LolEvent[]> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/events`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error(await extractError(res));
  return ((await res.json()) as { events: LolEvent[] }).events;
}

export async function createTeamEvent(teamId: string, body: LolEventBody, token: string): Promise<LolEvent> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/events`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json() as Promise<LolEvent>;
}

export async function updateTeamEvent(teamId: string, eventId: string, body: Partial<LolEventBody>, token: string): Promise<LolEvent> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/events/${eventId}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await extractError(res));
  return res.json() as Promise<LolEvent>;
}

export async function deleteTeamEvent(teamId: string, eventId: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/lol/teams/${teamId}/events/${eventId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(await extractError(res));
}
