import { riotGet } from '../../_core/riotClient';
import { platformHost } from '../../_core/routing';
import { CONFIG } from '../../_core/config';
import { cached } from '../../_core/cache';
import type { RiotChampionRotation } from './types';

/**
 * CHAMPION-V3 — rotation gratuite de la semaine (cache 1 h).
 * GET /lol/platform/v3/champion-rotations
 */
export function getChampionRotations(
  platform: string = CONFIG.defaultPlatform,
): Promise<RiotChampionRotation> {
  const url = `${platformHost(platform)}/lol/platform/v3/champion-rotations`;
  return cached(`rotation:${platform}`, 60 * 60_000, () => riotGet<RiotChampionRotation>(url));
}
