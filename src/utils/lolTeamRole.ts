/**
 * Utilitaire de résolution du rôle de l'utilisateur courant sur une équipe LoL.
 * Se base sur `members[]` (contrat E1+) pour déduire le rôle par userId.
 */
import type { LolApiMember, LolTeamRole } from '../types/lolTeam.types';

/**
 * Détermine le rôle de `userId` dans la liste des membres.
 * Retourne le rôle trouvé ou null (non-membre / non-connecté).
 */
export function getMyRole(
  members: LolApiMember[],
  userId: string | null | undefined,
): LolTeamRole {
  if (!userId) return null;
  const found = members.find((m) => m.userId === userId);
  return found?.role ?? null;
}

/** Retourne true si le rôle permet des actions de gestion (modifier/supprimer l'équipe). */
export function isManager(role: LolTeamRole): role is 'owner' | 'captain' {
  return role === 'owner' || role === 'captain';
}

/** Label lisible en français pour chaque rôle. */
export function roleLabelFr(role: LolTeamRole): string {
  switch (role) {
    case 'owner':   return 'Propriétaire';
    case 'captain': return 'Capitaine';
    case 'manager': return 'Manager';
    case 'coach':   return 'Coach';
    case 'staff':   return 'Staff';
    case 'player':  return 'Joueur';
    default:        return '—';
  }
}
