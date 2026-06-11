/** Partie en cours fictive (mode démo) — 5v5 avec rangs, le joueur démo surligné. */
import type { LiveGame } from '../types/lolLive.types';

// riotId, championId, spell1, spell2, teamId, tier, division, lp
type P = [string, number, number, number, number, string, string, number];

function mk(rows: P[]): LiveGame['participants'] {
  return rows.map(([riotId, championId, spell1Id, spell2Id, teamId, tier, rank, lp], i) => ({
    puuid: `demo-live-${i}`,
    riotId,
    championId,
    spell1Id,
    spell2Id,
    teamId,
    rank: { tier, rank, lp, winrate: 50 + ((i * 3) % 12) },
  }));
}

export const DEMO_LIVE_GAME: LiveGame = {
  gameMode: 'CLASSIC',
  gameQueueConfigId: 420,
  gameLength: 932,
  gameStartTime: Date.now() - 932_000,
  participants: mk([
    ['Shyvana Diff#EUW', 58, 4, 12, 100, 'MASTER', 'I', 124],
    ['Lone Wolf#EUW', 64, 11, 4, 100, 'GRANDMASTER', 'I', 612],
    ['Phantom Roam#EUW', 103, 4, 14, 100, 'CHALLENGER', 'I', 1042],
    ['Crit Happens#EUW', 222, 4, 7, 100, 'MASTER', 'I', 233],
    ['Ward Andrews#EUW', 412, 4, 3, 100, 'DIAMOND', 'I', 88],
    ['Toplaner#EUW', 266, 4, 12, 200, 'MASTER', 'I', 76],
    ['Junglvirtuose#EUW', 234, 11, 4, 200, 'GRANDMASTER', 'I', 433],
    ['MidDiff#EUW', 238, 4, 14, 200, 'MASTER', 'I', 301],
    ['ADCarry#EUW', 51, 4, 7, 200, 'DIAMOND', 'II', 54],
    ['SupportMain#EUW', 117, 4, 3, 200, 'MASTER', 'I', 142],
  ]),
};
