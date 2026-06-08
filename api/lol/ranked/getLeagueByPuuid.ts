import { riotGet } from '../../_core/riotClient';
import { platformHost } from '../../_core/routing';
import { CONFIG } from '../../_core/config';
import type { RiotLeagueEntry } from './types';

/**
 * LEAGUE-V4 — classements (SoloQ / Flex...) via PUUID.
 * GET /lol/league/v4/entries/by-puuid/{puuid}
 */
export function getLeagueByPuuid(
  puuid: string,
  platform: string = CONFIG.defaultPlatform,
): Promise<RiotLeagueEntry[]> {
  const url = `${platformHost(platform)}/lol/league/v4/entries/by-puuid/${encodeURIComponent(puuid)}`;
  return riotGet<RiotLeagueEntry[]>(url);
}
