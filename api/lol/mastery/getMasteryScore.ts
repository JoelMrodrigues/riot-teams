import { riotGet } from '../../_core/riotClient';
import { platformHost } from '../../_core/routing';
import { CONFIG } from '../../_core/config';

/**
 * CHAMPION-MASTERY-V4 — score total de maîtrise (somme des niveaux).
 * GET /lol/champion-mastery/v4/scores/by-puuid/{puuid}
 */
export function getMasteryScore(
  puuid: string,
  platform: string = CONFIG.defaultPlatform,
): Promise<number> {
  const url = `${platformHost(platform)}/lol/champion-mastery/v4/scores/by-puuid/${encodeURIComponent(puuid)}`;
  return riotGet<number>(url);
}
