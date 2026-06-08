import { riotGet } from '../../_core/riotClient';
import { platformHost } from '../../_core/routing';
import { CONFIG } from '../../_core/config';
import type { RiotSummoner } from './types';

/**
 * SUMMONER-V4 — invocateur (niveau, icône) via PUUID.
 * GET /lol/summoner/v4/summoners/by-puuid/{puuid}
 */
export function getSummonerByPuuid(
  puuid: string,
  platform: string = CONFIG.defaultPlatform,
): Promise<RiotSummoner> {
  const url = `${platformHost(platform)}/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
  return riotGet<RiotSummoner>(url);
}
