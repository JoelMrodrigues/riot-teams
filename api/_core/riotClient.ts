import { CONFIG } from './config';

/** Erreur typée d'un appel Riot (statut réel conservé pour diagnostic). */
export class RiotError extends Error {
  status: number;
  detail: string;
  constructor(status: number, message: string, detail = '') {
    super(message);
    this.name = 'RiotError';
    this.status = status;
    this.detail = detail;
  }
}

function humanMessage(status: number): string {
  if (status === 404) return 'Introuvable (Riot ID ou données inexistantes).';
  if (status === 401) return 'Clé API absente ou malformée (401).';
  if (status === 403) return 'Clé API rejetée par Riot (403) — invalide, expirée ou sans accès.';
  if (status === 429) return 'Rate limit Riot (429). Réessaie dans un instant.';
  return `Erreur Riot (${status}).`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MAX_RETRIES = 3;

/**
 * GET authentifié vers l'API Riot. Sur 429 (rate limit) ou 503, respecte le
 * header `Retry-After` et réessaie (jusqu'à MAX_RETRIES). Journalise statut +
 * endpoint + corps d'erreur (jamais la clé) et renvoie le JSON typé en cas de succès.
 */
export async function riotGet<T>(url: string): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    const res = await fetch(url, { headers: { 'X-Riot-Token': CONFIG.riotKey } });
    if (res.ok) return (await res.json()) as T;

    if ((res.status === 429 || res.status === 503) && attempt < MAX_RETRIES) {
      const ra = Number(res.headers.get('retry-after'));
      const waitMs = Math.min((Number.isFinite(ra) && ra > 0 ? ra : attempt + 1) * 1000, 5000);
      await sleep(waitMs);
      continue;
    }

    const body = await res.text().catch(() => '');
    let path = url;
    try {
      path = new URL(url).pathname;
    } catch {
      /* url déjà lisible */
    }
    console.error(`[riot] ${res.status} ${path} :: ${body.slice(0, 300)}`);
    throw new RiotError(res.status, humanMessage(res.status), body.slice(0, 200));
  }
}
