import { riotGet } from '../../_core/riotClient';
import { regionalHost, platformToRegional } from '../../_core/routing';
import { CONFIG } from '../../_core/config';
import type { RiotMatch } from './types';

/**
 * MATCH-V5 — détail d'une partie via son ID (host régional).
 * GET /lol/match/v5/matches/{matchId}
 */
export function getMatch(matchId: string, platform: string = CONFIG.defaultPlatform): Promise<RiotMatch> {
  const host = regionalHost(platformToRegional(platform));
  const url = `${host}/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
  return riotGet<RiotMatch>(url);
}
