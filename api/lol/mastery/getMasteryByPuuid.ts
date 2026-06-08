import { riotGet } from '../../_core/riotClient';
import { platformHost } from '../../_core/routing';
import { CONFIG } from '../../_core/config';
import type { RiotChampionMastery } from './types';

/**
 * CHAMPION-MASTERY-V4 — maîtrises par champion via PUUID (triées desc.).
 * GET /lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}
 */
export function getMasteryByPuuid(
  puuid: string,
  platform: string = CONFIG.defaultPlatform,
): Promise<RiotChampionMastery[]> {
  const url = `${platformHost(platform)}/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(puuid)}`;
  return riotGet<RiotChampionMastery[]>(url);
}
