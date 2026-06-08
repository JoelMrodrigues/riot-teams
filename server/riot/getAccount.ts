import { riotGet } from './riotClient';
import { regionalHost } from './riotRouting';
import type { RiotAccount } from './riotTypes';

/**
 * ACCOUNT-V1 — résout un Riot ID (gameName#tagLine) en compte + puuid.
 * GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
 */
export function getAccountByRiotId(platform: string, gameName: string, tagLine: string): Promise<RiotAccount> {
  const url = `${regionalHost(platform)}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  return riotGet<RiotAccount>(url);
}
