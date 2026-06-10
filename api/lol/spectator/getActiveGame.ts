import { riotGet, RiotError } from '../../_core/riotClient';
import { platformHost } from '../../_core/routing';
import { CONFIG } from '../../_core/config';
import type { RiotCurrentGameInfo } from './types';

/**
 * SPECTATOR-V5 — partie en cours d'un joueur, ou `null` s'il n'est pas en jeu.
 * GET /lol/spectator/v5/active-games/by-summoner/{puuid}
 */
export async function getActiveGame(
  puuid: string,
  platform: string = CONFIG.defaultPlatform,
): Promise<RiotCurrentGameInfo | null> {
  const url = `${platformHost(platform)}/lol/spectator/v5/active-games/by-summoner/${encodeURIComponent(puuid)}`;
  try {
    return await riotGet<RiotCurrentGameInfo>(url);
  } catch (err) {
    // 404 = le joueur n'est pas en partie : cas normal, pas une erreur.
    if (err instanceof RiotError && err.status === 404) return null;
    throw err;
  }
}
