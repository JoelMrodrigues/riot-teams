import { riotGet } from '../../_core/riotClient';
import { regionalHost, platformToRegional } from '../../_core/routing';
import { CONFIG } from '../../_core/config';

/**
 * MATCH-V5 — IDs des parties récentes via PUUID (host régional).
 * GET /lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count={count}
 */
export function getMatchIds(
  puuid: string,
  count = 10,
  platform: string = CONFIG.defaultPlatform,
): Promise<string[]> {
  const host = regionalHost(platformToRegional(platform));
  const url = `${host}/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=0&count=${count}`;
  return riotGet<string[]>(url);
}
