/**
 * Utilitaires partagés entre les modules de services HTTP.
 * - authHeaders : headers JSON + Authorization: Bearer
 * - extractError : extrait le message d'erreur d'une réponse non-ok
 */

/** Extrait le message d'erreur depuis une réponse non-ok. */
export async function extractError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? `Erreur HTTP ${res.status}`;
  } catch {
    return `Erreur HTTP ${res.status}`;
  }
}

/** Headers communs authentifiés. */
export function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}
