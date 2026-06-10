/** Timeline d'une partie — MATCH-V5 (sous-ensemble utile pour l'analyse). */
export interface RiotTimelineParticipantFrame {
  participantId: number;
  currentGold: number;
  totalGold: number;
  level: number;
  xp: number;
  minionsKilled: number;
  jungleMinionsKilled: number;
  position?: { x: number; y: number };
}

export interface RiotTimelineEvent {
  type: string;
  timestamp: number;
  participantId?: number;
  killerId?: number;
  victimId?: number;
  assistingParticipantIds?: number[];
  itemId?: number;
  skillSlot?: number;
  monsterType?: string;
  buildingType?: string;
  laneType?: string;
}

export interface RiotTimelineFrame {
  timestamp: number;
  participantFrames: Record<string, RiotTimelineParticipantFrame>;
  events: RiotTimelineEvent[];
}

export interface RiotMatchTimeline {
  metadata: { matchId: string; participants: string[] };
  info: { frameInterval: number; frames: RiotTimelineFrame[] };
}
