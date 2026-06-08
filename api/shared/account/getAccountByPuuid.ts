import { riotGet } from '../../_core/riotClient';
import { regionalHost, type RegionalCluster } from '../../_core/routing';
import type { RiotAccount } from './types';

/**
 * ACCOUNT-V1 — résout un PUUID en compte (gameName#tagLine).
 * GET /riot/account/v1/accounts/by-puuid/{puuid}
 */
export function getAccountByPuuid(
  puuid: string,
  cluster: RegionalCluster = 'europe',
): Promise<RiotAccount> {
  const url = `${regionalHost(cluster)}/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}`;
  return riotGet<RiotAccount>(url);
}
