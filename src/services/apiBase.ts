/**
 * Base des appels API.
 * - Vide → chemin relatif `/api/...` (proxy Vite en dev, ou build servi par l'API en prod, même origine).
 * - Définie via `VITE_API_URL` → backend distant (ex. Hetzner) pour contourner un blocage réseau local.
 */
export const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
