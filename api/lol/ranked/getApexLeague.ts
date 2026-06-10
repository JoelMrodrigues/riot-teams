import { riotGet } from '../../_core/riotClient';
import { platformHost } from '../../_core/routing';
import { CONFIG } from '../../_core/config';
import { cached } from '../../_core/cache';
import type { RiotLeagueList, ApexTier } from './apexTypes';

/**
 * LEAGUE-V4 — classement apex (challenger/grandmaster/master) pour une file,
 * trié par LP décroissant (cache 5 min). Ex. queue = RANKED_SOLO_5x5.
 * GET /lol/league/v4/{tier}leagues/by-queue/{queue}
 */
export async function getApexLeague(
  tier: ApexTier,
  queue = 'RANKED_SOLO_5x5',
  platform: string = CONFIG.defaultPlatform,
): Promise<RiotLeagueList> {
  const url = `${platformHost(platform)}/lol/league/v4/${tier}leagues/by-queue/${encodeURIComponent(queue)}`;
  const data = await cached(`apex:${platform}:${tier}:${queue}`, 5 * 60_000, () =>
    riotGet<RiotLeagueList>(url),
  );
  return { ...data, entries: [...data.entries].sort((a, b) => b.leaguePoints - a.leaguePoints) };
}
