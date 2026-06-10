import { riotGet } from '../../_core/riotClient';
import { platformHost } from '../../_core/routing';
import { CONFIG } from '../../_core/config';
import type { RiotChampionMastery } from './types';

/**
 * CHAMPION-MASTERY-V4 — maîtrise d'un joueur sur un champion précis.
 * GET /lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}/by-champion/{championId}
 */
export function getMasteryByChampion(
  puuid: string,
  championId: number,
  platform: string = CONFIG.defaultPlatform,
): Promise<RiotChampionMastery> {
  const url = `${platformHost(platform)}/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(puuid)}/by-champion/${championId}`;
  return riotGet<RiotChampionMastery>(url);
}
