import { riotGet } from '../../_core/riotClient';
import { platformHost } from '../../_core/routing';
import { CONFIG } from '../../_core/config';
import { cached } from '../../_core/cache';
import type { RiotPlatformStatus } from './types';

/**
 * LOL-STATUS-V4 — maintenances et incidents de la plateforme (cache 5 min).
 * GET /lol/status/v4/platform-data
 */
export function getPlatformStatus(
  platform: string = CONFIG.defaultPlatform,
): Promise<RiotPlatformStatus> {
  const url = `${platformHost(platform)}/lol/status/v4/platform-data`;
  return cached(`status:${platform}`, 5 * 60_000, () => riotGet<RiotPlatformStatus>(url));
}
