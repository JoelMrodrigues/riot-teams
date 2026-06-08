import type { LolProfile } from '../types/lolApi.types';

interface ApiError {
  error: string;
  detail?: string;
}

/**
 * Récupère le profil LoL complet via le proxy du site (agrégation serveur :
 * compte + invocateur + rangs + matchs détaillés + maîtrise).
 */
export async function fetchLolProfile(gameName: string, tagLine: string): Promise<LolProfile> {
  const query = new URLSearchParams({ gameName, tagLine });
  const res = await fetch(`/api/lol/profile?${query.toString()}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: 'Erreur réseau.' }))) as ApiError;
    throw new Error(body.error ?? 'Erreur inconnue.');
  }
  return (await res.json()) as LolProfile;
}
