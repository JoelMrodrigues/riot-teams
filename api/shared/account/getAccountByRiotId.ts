import { riotGet } from '../../_core/riotClient';
import { regionalHost, type RegionalCluster } from '../../_core/routing';
import type { RiotAccount } from './types';

/**
 * ACCOUNT-V1 — résout un Riot ID (gameName#tagLine) en compte + PUUID.
 * GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
 */
export function getAccountByRiotId(
  gameName: string,
  tagLine: string,
  cluster: RegionalCluster = 'europe',
): Promise<RiotAccount> {
  const url = `${regionalHost(cluster)}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  return riotGet<RiotAccount>(url);
}
