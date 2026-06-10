// Correspondances file/rôle Riot → types internes. Partagé par les mappers
// (profil + détail de match) pour éviter la duplication.
import type { QueueKind, RoleKind } from '../profile/profileTypes';

export const QUEUE_IDS: Record<number, QueueKind> = {
  420: 'solo', 440: 'flex', 400: 'normal', 430: 'normal', 490: 'normal', 450: 'aram',
};

const ROLES: RoleKind[] = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];

export function queueKind(queueId: number): QueueKind {
  return QUEUE_IDS[queueId] ?? 'other';
}

export function roleKind(teamPosition: string | null | undefined): RoleKind {
  const p = (teamPosition ?? '').toUpperCase();
  return (ROLES as string[]).includes(p) ? (p as RoleKind) : 'UNKNOWN';
}
