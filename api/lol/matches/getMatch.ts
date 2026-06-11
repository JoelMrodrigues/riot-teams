import { riotGet } from '../../_core/riotClient';
import { regionalHost, platformToRegional } from '../../_core/routing';
import { CONFIG } from '../../_core/config';
import { cached } from '../../_core/cache';
import type { RiotMatch } from './types';

/**
 * MATCH-V5 — détail d'une partie via son ID (host régional).
 * Immuable une fois jouée → cache 24 h (réutilisé par profil, stats, ingestion).
 * GET /lol/match/v5/matches/{matchId}
 */
export function getMatch(matchId: string, platform: string = CONFIG.defaultPlatform): Promise<RiotMatch> {
  const host = regionalHost(platformToRegional(platform));
  const url = `${host}/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
  return cached(`match:${matchId}`, 24 * 60 * 60_000, () => riotGet<RiotMatch>(url));
}
