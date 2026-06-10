import { riotGet } from '../../_core/riotClient';
import { regionalHost, platformToRegional } from '../../_core/routing';
import { CONFIG } from '../../_core/config';
import { cached } from '../../_core/cache';
import type { RiotMatchTimeline } from './timelineTypes';

/**
 * MATCH-V5 — timeline d'une partie (or/xp/cs par minute + événements).
 * Immuable une fois la partie jouée → cache 24 h.
 * GET /lol/match/v5/matches/{matchId}/timeline
 */
export function getMatchTimeline(
  matchId: string,
  platform: string = CONFIG.defaultPlatform,
): Promise<RiotMatchTimeline> {
  const host = regionalHost(platformToRegional(platform));
  const url = `${host}/lol/match/v5/matches/${encodeURIComponent(matchId)}/timeline`;
  return cached(`timeline:${matchId}`, 24 * 60 * 60_000, () => riotGet<RiotMatchTimeline>(url));
}
