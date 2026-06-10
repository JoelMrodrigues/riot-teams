// Types + mapper de la table lol_events (agenda d'équipe : scrims, entraînements…).

export type EventType = 'scrim' | 'training' | 'review' | 'soloq' | 'other';

export interface EventRow {
  id: string;
  team_id: string;
  type: EventType;
  title: string;
  starts_at: Date;
  duration_min: number | null;
  opponent: string | null;
  bo: number | null;
  result: string | null;
  score: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface EventPublic {
  id: string;
  teamId: string;
  type: EventType;
  title: string;
  startsAt: string;
  durationMin: number | null;
  opponent: string | null;
  bo: number | null;
  result: 'win' | 'loss' | null;
  score: string | null;
  notes: string | null;
}

export function toEventPublic(r: EventRow): EventPublic {
  return {
    id: r.id,
    teamId: r.team_id,
    type: r.type,
    title: r.title,
    startsAt: r.starts_at.toISOString(),
    durationMin: r.duration_min,
    opponent: r.opponent,
    bo: r.bo,
    result: r.result === 'win' || r.result === 'loss' ? r.result : null,
    score: r.score,
    notes: r.notes,
  };
}
