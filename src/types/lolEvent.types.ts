/** Événement d'agenda d'équipe (miroir front de lol_events). */
export type LolEventType = 'scrim' | 'training' | 'review' | 'soloq' | 'other';

export interface LolEvent {
  id: string;
  teamId: string;
  type: LolEventType;
  title: string;
  startsAt: string;
  durationMin: number | null;
  opponent: string | null;
  bo: number | null;
  result: 'win' | 'loss' | null;
  score: string | null;
  notes: string | null;
}

/** Corps envoyé au backend (snake_case). */
export interface LolEventBody {
  type: LolEventType;
  title: string;
  starts_at: string;
  duration_min?: number | null;
  opponent?: string | null;
  bo?: number | null;
  result?: 'win' | 'loss' | null;
  score?: string | null;
  notes?: string | null;
}
