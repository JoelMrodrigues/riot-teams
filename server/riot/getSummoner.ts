import { riotGet } from './riotClient';
import { platformHost } from './riotRouting';
import type { RiotSummoner } from './riotTypes';

/**
 * SUMMONER-V4 — données d'invocateur (niveau, icône, summonerId) via puuid.
 * GET /lol/summoner/v4/summoners/by-puuid/{puuid}
 */
export function getSummonerByPuuid(platform: string, puuid: string): Promise<RiotSummoner> {
  const url = `${platformHost(platform)}/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
  return riotGet<RiotSummoner>(url);
}
