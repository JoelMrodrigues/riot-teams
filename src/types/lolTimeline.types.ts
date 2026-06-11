/** Timeline d'une partie (miroir front de /api/lol/match/timeline). */
export interface TimelineParticipantFrame {
  totalGold: number;
}

export interface TimelineEvent {
  type: string;
  timestamp: number;
  killerId?: number;
  monsterType?: string;
  monsterSubType?: string;
  buildingType?: string;
  teamId?: number;
}

export interface TimelineFrame {
  timestamp: number;
  participantFrames: Record<string, TimelineParticipantFrame>;
  events: TimelineEvent[];
}

export interface MatchTimeline {
  info: { frameInterval: number; frames: TimelineFrame[] };
}
