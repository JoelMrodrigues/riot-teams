import type { SummonerProfile } from '../types/lolApi.types';

interface ApiError {
  error: string;
  detail?: string;
}

/**
 * Récupère le profil d'invocateur via le proxy du site (résout le PUUID
 * côté serveur avec la bonne clé, puis appelle SUMMONER-V4).
 */
export async function fetchSummonerByRiotId(gameName: string, tagLine: string): Promise<SummonerProfile> {
  const query = new URLSearchParams({ gameName, tagLine });
  const res = await fetch(`/api/lol/summoner?${query.toString()}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: 'Erreur réseau.' }))) as ApiError;
    throw new Error(body.error ?? 'Erreur inconnue.');
  }
  return (await res.json()) as SummonerProfile;
}
