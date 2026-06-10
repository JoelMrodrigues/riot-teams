// Construit un classement apex « prêt à afficher » : top N + pseudos résolus
// (l'endpoint LEAGUE-V4 ne renvoie que le puuid). Résultat caché 5 min pour
// éviter de re-résoudre les comptes à chaque requête.

import { CONFIG } from '../../_core/config';
import { platformToRegional } from '../../_core/routing';
import { cached } from '../../_core/cache';
import { getApexLeague } from './getApexLeague';
import { getAccountByPuuid } from '../../shared/account/getAccountByPuuid';
import type { ApexTier, RiotLeagueItem } from './apexTypes';

export interface LeaderboardEntry {
  gameName: string;
  tagLine: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export interface Leaderboard {
  tier: string;
  queue: string;
  entries: LeaderboardEntry[];
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    out.push(...(await Promise.all(items.slice(i, i + limit).map(fn))));
  }
  return out;
}

async function resolveEntry(e: RiotLeagueItem, cluster: ReturnType<typeof platformToRegional>): Promise<LeaderboardEntry> {
  const base = { leaguePoints: e.leaguePoints, wins: e.wins, losses: e.losses };
  if (!e.puuid) return { gameName: 'Joueur', tagLine: '', ...base };
  try {
    const acc = await getAccountByPuuid(e.puuid, cluster);
    return { gameName: acc.gameName, tagLine: acc.tagLine, ...base };
  } catch {
    return { gameName: 'Joueur', tagLine: '', ...base };
  }
}

export function buildLeaderboard(
  tier: ApexTier,
  queue = 'RANKED_SOLO_5x5',
  count = 20,
  platform: string = CONFIG.defaultPlatform,
): Promise<Leaderboard> {
  return cached(`leaderboard:${platform}:${tier}:${queue}:${count}`, 5 * 60_000, async () => {
    const list = await getApexLeague(tier, queue, platform); // déjà trié par LP desc.
    const cluster = platformToRegional(platform);
    const entries = await mapLimit(list.entries.slice(0, count), 5, (e) => resolveEntry(e, cluster));
    return { tier: list.tier, queue: list.queue, entries };
  });
}
