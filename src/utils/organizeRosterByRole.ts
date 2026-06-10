/**
 * Range un roster d'équipe LoL en 5 colonnes ordonnées TOP → SUPPORT.
 * Place d'abord les joueurs dont le rôle est connu, puis remplit les colonnes
 * restantes avec les joueurs sans rôle, dans l'ordre canonique.
 */
import type { LolApiRosterMember } from '../types/lolTeam.types';

export type CanonicalRole = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';

export const ROLE_ORDER: CanonicalRole[] = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];

export const ROLE_LABEL: Record<CanonicalRole, string> = {
  TOP: 'Top', JUNGLE: 'Jungle', MID: 'Mid', ADC: 'ADC', SUPPORT: 'Support',
};

/** Normalise une chaîne de rôle libre vers un rôle canonique (ou null). */
export function normalizeRole(raw: string | null | undefined): CanonicalRole | null {
  if (!raw) return null;
  const r = raw.toLowerCase();
  if (r.includes('top')) return 'TOP';
  if (r.startsWith('jg') || r.includes('jun') || r.includes('jng') || r.includes('jgl')) return 'JUNGLE';
  if (r.includes('mid')) return 'MID';
  if (r.includes('adc') || r.includes('bot') || r.includes('carry')) return 'ADC';
  if (r.includes('sup')) return 'SUPPORT';
  return null;
}

export interface RoleSlot {
  role: CanonicalRole;
  member: LolApiRosterMember | null;
}

export function organizeRosterByRole(roster: LolApiRosterMember[]): RoleSlot[] {
  const slots = new Map<CanonicalRole, LolApiRosterMember | null>(
    ROLE_ORDER.map((r) => [r, null]),
  );
  const leftover: LolApiRosterMember[] = [];

  for (const m of roster) {
    const role = normalizeRole(m.roleInGame);
    if (role && slots.get(role) === null) slots.set(role, m);
    else leftover.push(m);
  }

  for (const role of ROLE_ORDER) {
    if (slots.get(role) === null && leftover.length > 0) {
      slots.set(role, leftover.shift()!);
    }
  }

  return ROLE_ORDER.map((role) => ({ role, member: slots.get(role) ?? null }));
}
