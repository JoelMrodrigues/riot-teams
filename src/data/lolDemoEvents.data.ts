/** Événements d'agenda fictifs pour le mode démo (?demo=1) / sandbox. */
import type { LolEvent } from '../types/lolEvent.types';

function iso(daysFromNow: number, hour: number, min = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

export const DEMO_LOL_EVENTS: LolEvent[] = [
  { id: 'demo-e1', teamId: 'demo', type: 'scrim', title: 'Scrim vs Crimson Vipers', startsAt: iso(0, 20), durationMin: 120, opponent: 'Crimson Vipers', bo: 3, result: null, score: null, notes: null },
  { id: 'demo-e2', teamId: 'demo', type: 'scrim', title: 'Scrim vs Solar Wolves', startsAt: iso(-1, 20), durationMin: 90, opponent: 'Solar Wolves', bo: 3, result: 'win', score: '2-1', notes: null },
  { id: 'demo-e3', teamId: 'demo', type: 'scrim', title: 'Scrim vs Azure Kings', startsAt: iso(-3, 18), durationMin: 90, opponent: 'Azure Kings', bo: 2, result: 'loss', score: '0-2', notes: null },
  { id: 'demo-e4', teamId: 'demo', type: 'training', title: 'Entraînement', startsAt: iso(1, 20), durationMin: 120, opponent: null, bo: null, result: null, score: null, notes: null },
  { id: 'demo-e5', teamId: 'demo', type: 'review', title: 'Review VOD', startsAt: iso(2, 19), durationMin: 60, opponent: null, bo: null, result: null, score: null, notes: null },
  { id: 'demo-e6', teamId: 'demo', type: 'soloq', title: 'SoloQ groupée', startsAt: iso(4, 21), durationMin: 120, opponent: null, bo: null, result: null, score: null, notes: null },
];
