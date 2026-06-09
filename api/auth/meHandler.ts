// Handlers GET /api/auth/me et POST /api/auth/logout.
//
// GET /me : renvoie le profil frais depuis la DB (pas seulement le JWT)
//   pour que les modifications de pseudo/avatar soient reflétées sans relogin.
//
// POST /logout : stateless côté serveur (JWT sans table de sessions).
//   Renvoie 200 ; le client doit supprimer le token de son côté.
//   Note : si on ajoute une table sessions (révocation immédiate) au Lot E,
//   ce handler devra invalider la session en base.

import type { Request, Response } from 'express';

import { query } from '../_core/db.js';
import type { ProfileRow, PublicProfile } from './types.js';

function toPublicProfile(row: ProfileRow): PublicProfile {
  return {
    id: row.id,
    email: row.email,
    pseudo: row.pseudo,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at.toISOString(),
  };
}

/** GET /api/auth/me — protégé par requireAuth (req.user garanti non null). */
export async function meHandler(req: Request, res: Response): Promise<void> {
  // req.user est garanti par requireAuth, mais on type-guard pour satisfaire TS strict.
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifié.' });
    return;
  }

  try {
    const { rows } = await query<ProfileRow>(
      `SELECT id, email, password_hash, pseudo, avatar_url, created_at, updated_at
       FROM profiles WHERE id = $1`,
      [req.user.sub],
    );

    const profile = rows[0];
    if (!profile) {
      // Le compte a été supprimé après l'émission du token.
      res.status(401).json({ error: 'Compte introuvable.' });
      return;
    }

    res.json({ user: toPublicProfile(profile) });
  } catch (err) {
    console.error('[auth] me error:', err instanceof Error ? err.message : 'unknown');
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

/** POST /api/auth/logout — no-op côté serveur (JWT stateless). */
export function logoutHandler(_req: Request, res: Response): void {
  // Côté serveur, aucune session à invalider (JWT stateless).
  // Le client doit supprimer le token de son stockage.
  res.json({ ok: true, message: 'Déconnecté.' });
}
