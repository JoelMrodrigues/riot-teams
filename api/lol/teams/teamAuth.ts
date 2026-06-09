// Middleware de permissions équipe LoL — matrice de capacités.
//
// getTeamRole       — helper pur réutilisable dans les handlers.
// requireCanEditTeam    — owner | captain | manager
// requireCanManageRoster — owner | captain | manager | coach
// requireCanManageRoles  — owner | captain
// requireCanDelete       — owner | captain
// requireOwner           — owner strict (transfert)
//
// Chaque middleware exige que requireAuth ait été appliqué avant.

import type { Request, Response, NextFunction } from 'express';

import { query } from '../../_core/db.js';
import type { MemberRole, TeamRole } from './types.js';

/** Extension de Request avec le rôle résolu (évite de re-requêter dans le handler). */
export interface RequestWithTeamRole extends Request {
  teamRole?: MemberRole;
}

/**
 * Récupère le rôle d'un utilisateur dans lol_team_members.
 * Renvoie null si l'équipe n'existe pas ou si l'utilisateur n'est pas membre.
 */
export async function getTeamRole(
  userId: string,
  teamId: string,
): Promise<MemberRole | null> {
  const { rows } = await query<{ role: MemberRole }>(
    `SELECT role FROM lol_team_members
     WHERE team_id = $1 AND user_id = $2
     LIMIT 1`,
    [teamId, userId],
  );
  return rows.length === 0 ? null : rows[0].role;
}

/** Rôles autorisés par capacité. */
const CAN_EDIT_TEAM: ReadonlySet<MemberRole> = new Set(['owner', 'captain', 'manager']);
const CAN_MANAGE_ROSTER: ReadonlySet<MemberRole> = new Set(['owner', 'captain', 'manager', 'coach']);
const CAN_MANAGE_ROLES: ReadonlySet<MemberRole> = new Set(['owner', 'captain']);
const CAN_DELETE: ReadonlySet<MemberRole> = new Set(['owner', 'captain']);

/** Fabrique un middleware de vérification de capacité. */
function buildCapabilityMiddleware(
  allowed: ReadonlySet<MemberRole>,
  errorMsg: string,
) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.user?.sub;
    const teamId = String(req.params['teamId'] ?? '');

    if (!userId || !teamId) {
      res.status(403).json({ error: 'Accès refusé.' });
      return;
    }

    const role = await getTeamRole(userId, teamId);

    if (role === null || !allowed.has(role)) {
      res.status(403).json({ error: errorMsg });
      return;
    }

    (req as RequestWithTeamRole).teamRole = role;
    next();
  };
}

/** Autorise owner | captain | manager — édition des infos équipe. */
export const requireCanEditTeam = buildCapabilityMiddleware(
  CAN_EDIT_TEAM,
  'Accès refusé : rôle owner, captain ou manager requis.',
);

/** Autorise owner | captain | manager | coach — gestion du roster. */
export const requireCanManageRoster = buildCapabilityMiddleware(
  CAN_MANAGE_ROSTER,
  'Accès refusé : rôle owner, captain, manager ou coach requis.',
);

/** Autorise owner | captain — assigner/changer/retirer des rôles membres. */
export const requireCanManageRoles = buildCapabilityMiddleware(
  CAN_MANAGE_ROLES,
  'Accès refusé : rôle owner ou captain requis.',
);

/** Autorise owner | captain — suppression d'équipe. */
export const requireCanDelete = buildCapabilityMiddleware(
  CAN_DELETE,
  'Accès refusé : rôle owner ou captain requis.',
);

/**
 * Autorise uniquement le propriétaire (owner strict) — transfert de propriété.
 * Utilise la même signature que les autres middlewares mais sans la fabrique
 * pour renvoyer un message plus précis.
 */
export async function requireOwner(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = req.user?.sub;
  const teamId = String(req.params['teamId'] ?? '');

  if (!userId || !teamId) {
    res.status(403).json({ error: 'Accès refusé.' });
    return;
  }

  const role = await getTeamRole(userId, teamId);

  if (role !== 'owner') {
    res.status(403).json({ error: 'Action réservée au propriétaire de l\'équipe.' });
    return;
  }

  (req as RequestWithTeamRole).teamRole = 'owner';
  next();
}

/** @deprecated Utiliser requireCanEditTeam, requireCanDelete, etc. */
export async function requireManager(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  return requireCanEditTeam(req, res, next);
}

/** Type export pour la compatibilité avec les handlers existants. */
export type { TeamRole };
