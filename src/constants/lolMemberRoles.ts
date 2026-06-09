/**
 * Options de rôle attribuables manuellement sur une équipe LoL.
 * N'inclut PAS 'owner' (propriété) ni 'player' (géré par le roster).
 */
import type { LolAssignableRole } from '../types/lolTeam.types';

export interface RoleOption {
  value: LolAssignableRole;
  label: string;
}

export const ASSIGNABLE_ROLE_OPTIONS: RoleOption[] = [
  { value: 'captain', label: 'Capitaine' },
  { value: 'manager', label: 'Manager' },
  { value: 'coach',   label: 'Coach' },
  { value: 'staff',   label: 'Staff' },
];
