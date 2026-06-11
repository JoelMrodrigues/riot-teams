/** Timeline de partie fictive (mode démo / sandbox). */
import type { MatchTimeline, TimelineEvent, TimelineFrame } from '../types/lolTimeline.types';

// Événements clés injectés à certaines minutes (équipe bleue plutôt en avance).
const EVENTS_AT: Record<number, TimelineEvent[]> = {
  3:  [{ type: 'CHAMPION_KILL', timestamp: 3 * 60_000 + 12_000, killerId: 3 }],
  8:  [{ type: 'ELITE_MONSTER_KILL', timestamp: 8 * 60_000 + 5_000, killerId: 2, monsterType: 'DRAGON' }],
  10: [{ type: 'ELITE_MONSTER_KILL', timestamp: 10 * 60_000, killerId: 7, monsterType: 'RIFTHERALD' }],
  15: [{ type: 'ELITE_MONSTER_KILL', timestamp: 15 * 60_000, killerId: 2, monsterType: 'DRAGON' }],
  22: [{ type: 'ELITE_MONSTER_KILL', timestamp: 22 * 60_000, killerId: 3, monsterType: 'DRAGON' }],
  24: [{ type: 'ELITE_MONSTER_KILL', timestamp: 24 * 60_000, killerId: 2, monsterType: 'BARON_NASHOR' }],
};

function frame(min: number): TimelineFrame {
  const participantFrames: Record<string, { totalGold: number }> = {};
  for (let p = 1; p <= 10; p += 1) {
    // Or cumulé qui croît ; les bleus (1-5) prennent un léger avantage avec le temps.
    const lead = p <= 5 ? min * 22 : 0;
    participantFrames[String(p)] = { totalGold: Math.round(500 + min * 340 + lead + p * 6) };
  }
  return { timestamp: min * 60_000, participantFrames, events: EVENTS_AT[min] ?? [] };
}

export const DEMO_TIMELINE: MatchTimeline = {
  info: { frameInterval: 60_000, frames: Array.from({ length: 26 }, (_, i) => frame(i)) },
};
