import { CONFIG } from '../config';

/** Erreur typée d'un appel Riot, avec code HTTP pour la réponse au client. */
export class RiotError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'RiotError';
    this.status = status;
  }
}

/**
 * GET authentifié vers l'API Riot. Gère les statuts courants (404, 429, 5xx)
 * et renvoie le JSON typé via le paramètre générique.
 */
export async function riotGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'X-Riot-Token': CONFIG.riotKey } });

  if (res.ok) return (await res.json()) as T;

  if (res.status === 404) throw new RiotError(404, 'Introuvable (Riot ID ou données inexistantes).');
  if (res.status === 401 || res.status === 403) throw new RiotError(403, 'Clé API invalide ou expirée.');
  if (res.status === 429) throw new RiotError(429, 'Trop de requêtes (rate limit Riot). Réessaie dans un instant.');
  throw new RiotError(502, `Erreur Riot (${res.status}).`);
}
