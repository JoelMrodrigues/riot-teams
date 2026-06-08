import type { PlayerProfile } from '../types/lolPlayer.types';

export interface FetchPlayerParams {
  gameName: string;
  tagLine: string;
  platform?: string;
  count?: number;
}

interface ApiError {
  error: string;
}

/**
 * Point d'accès unique au profil joueur. Appelle le proxy /api/lol/player.
 * C'est LE seul endroit à modifier pour brancher une autre source de données.
 */
export async function fetchPlayer(params: FetchPlayerParams): Promise<PlayerProfile> {
  const query = new URLSearchParams({ gameName: params.gameName, tagLine: params.tagLine });
  if (params.platform) query.set('platform', params.platform);
  if (params.count) query.set('count', String(params.count));

  const res = await fetch(`/api/lol/player?${query.toString()}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: 'Erreur réseau.' }))) as ApiError;
    throw new Error(body.error ?? 'Erreur inconnue.');
  }
  return (await res.json()) as PlayerProfile;
}
