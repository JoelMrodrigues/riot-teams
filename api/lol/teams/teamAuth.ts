// Middleware de permissions équipe LoL.
//
// getTeamRole   — helper pur (réutilisable dans les handlers pour la logique métier).
// requireManager — autorise owner OU captain (403 sinon).
// requireOwner   — autorise owner strict uniquement (403 sinon).
//
// Doit toujours être précédé de requireAuth sur la route.

import type { Request, Response, NextFunction } from 'express';

import { query } from '../../_core/db.js';
import type { ManagerRow, TeamRole } from './types.js';

/**
 * Récupère le rôle de gestion d'un utilisateur sur une équipe.
 * Renvoie null si l'équipe n'existe pas ou si l'utilisateur n'est pas manager.
 */
export async function getTeamRole(
  userId: string,
  teamId: string,
): Promise<'owner' | 'captain' | null> {
  const { rows } = await query<Pick<ManagerRow, 'role'>>(
    `SELECT role FROM lol_team_managers
     WHERE team_id = $1 AND user_id = $2
     LIMIT 1`,
    [teamId, userId],
  );
  if (rows.length === 0) return null;
  return rows[0].role;
}

/**
 * Résout le teamId depuis req.params, vérifie que l'utilisateur
 * est au moins manager (owner OU captain), et attache le rôle à req.
 * 403 si insuffisant.
 */
export async function requireManager(
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

  if (role === null) {
    res.status(403).json({ error: 'Accès refusé : vous n\'êtes pas manager de cette équipe.' });
    return;
  }

  // Attache le rôle résolu pour que le handler puisse l'utiliser sans re-requêter.
  (req as RequestWithTeamRole).teamRole = role;
  next();
}

/**
 * Autorise uniquement le propriétaire (owner strict).
 * 403 si captain ou absent.
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

/** Extension de Request avec le rôle résolu (évite de re-requêter en handler). */
export interface RequestWithTeamRole extends Request {
  teamRole?: TeamRole;
}
