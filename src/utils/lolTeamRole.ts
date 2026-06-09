/**
 * Utilitaire de résolution du rôle de l'utilisateur courant sur une équipe LoL.
 * Ne se fie PAS au champ `myRole` backend (non fiable) — croise managers[] + userId.
 */
import type { LolApiManager, LolTeamRole } from '../types/lolTeam.types';

/**
 * Détermine le rôle de `userId` dans la liste des managers.
 * Retourne 'owner', 'captain' ou null (non-manager / non-connecté).
 */
export function getMyRole(
  managers: LolApiManager[],
  userId: string | null | undefined,
): LolTeamRole {
  if (!userId) return null;
  const found = managers.find((m) => m.userId === userId);
  return found?.role ?? null;
}

/** Retourne true si le rôle permet des actions de gestion. */
export function isManager(role: LolTeamRole): role is 'owner' | 'captain' {
  return role === 'owner' || role === 'captain';
}
