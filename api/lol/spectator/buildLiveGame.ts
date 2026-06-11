// Partie en cours enrichie du rang SoloQ de chaque joueur (façon porofessor).
// 1 appel spectator + 1 appel league par joueur (concurrence limitée), le tout
// caché 30 s par puuid pour ne pas spammer Riot lors des rafraîchissements.

import { getActiveGame } from './getActiveGame';
import { getLeagueByPuuid } from '../ranked/getLeagueByPuuid';
import { cached } from '../../_core/cache';
import { CONFIG } from '../../_core/config';
import type { RiotCurrentGameInfo, RiotCurrentGameParticipant } from './types';

export interface LiveRank {
  tier: string;
  rank: string;
  lp: number;
  winrate: number;
}

export interface LiveParticipantEnriched extends RiotCurrentGameParticipant {
  rank: LiveRank | null;
}

export interface LiveGameEnriched extends Omit<RiotCurrentGameInfo, 'participants'> {
  participants: LiveParticipantEnriched[];
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    out.push(...(await Promise.all(items.slice(i, i + limit).map(fn))));
  }
  return out;
}

async function rankOf(puuid: string, platform: string): Promise<LiveRank | null> {
  try {
    const entries = await getLeagueByPuuid(puuid, platform);
    const solo = entries.find((e) => e.queueType === 'RANKED_SOLO_5x5');
    if (!solo) return null;
    const total = solo.wins + solo.losses;
    return { tier: solo.tier, rank: solo.rank, lp: solo.leaguePoints, winrate: total ? Math.round((solo.wins / total) * 100) : 0 };
  } catch {
    return null;
  }
}

export function buildLiveGame(puuid: string, platform: string = CONFIG.defaultPlatform): Promise<LiveGameEnriched | null> {
  return cached(`live:${puuid}`, 30_000, async () => {
    const game = await getActiveGame(puuid, platform);
    if (!game) return null;
    const participants = await mapLimit(game.participants, 5, async (p) => ({ ...p, rank: await rankOf(p.puuid, platform) }));
    return { ...game, participants };
  });
}
