import type { QueueType, Role } from '../../src/types/lolPlayer.types';

/** Mappe un queueId Riot vers notre type de file simplifié. */
const QUEUE_IDS: Record<number, QueueType> = {
  420: 'solo',
  440: 'flex',
  400: 'normal',
  430: 'normal',
  490: 'normal',
  450: 'aram',
};

export function mapQueue(queueId: number): QueueType {
  return QUEUE_IDS[queueId] ?? 'other';
}

const ROLES: Role[] = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];

/** Normalise la position Riot (teamPosition/individualPosition) en rôle. */
export function mapRole(position: string): Role {
  const p = position.toUpperCase();
  return (ROLES as string[]).includes(p) ? (p as Role) : 'UNKNOWN';
}
