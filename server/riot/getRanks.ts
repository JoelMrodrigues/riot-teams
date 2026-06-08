import { riotGet } from './riotClient';
import { platformHost } from './riotRouting';
import type { RiotLeagueEntry } from './riotTypes';
import type { RankedEntry } from '../../src/types/lolPlayer.types';

const QUEUE_MAP: Record<string, 'solo' | 'flex'> = {
  RANKED_SOLO_5x5: 'solo',
  RANKED_FLEX_SR: 'flex',
};

function toRankedEntry(e: RiotLeagueEntry, queue: 'solo' | 'flex'): RankedEntry {
  const total = e.wins + e.losses;
  return {
    queue,
    tier: e.tier,
    rank: e.rank,
    lp: e.leaguePoints,
    wins: e.wins,
    losses: e.losses,
    winrate: total > 0 ? Math.round((e.wins / total) * 100) : 0,
  };
}

/**
 * LEAGUE-V4 — classements (SoloQ + Flex) via summonerId.
 * GET /lol/league/v4/entries/by-summoner/{summonerId}
 */
export async function getRanksBySummonerId(platform: string, summonerId: string): Promise<RankedEntry[]> {
  const url = `${platformHost(platform)}/lol/league/v4/entries/by-summoner/${encodeURIComponent(summonerId)}`;
  const entries = await riotGet<RiotLeagueEntry[]>(url);
  return entries
    .map((e) => {
      const queue = QUEUE_MAP[e.queueType];
      return queue ? toRankedEntry(e, queue) : null;
    })
    .filter((e): e is RankedEntry => e !== null);
}
