// Handler POST /api/auth/login
// Vérifie email + mot de passe et renvoie un JWT si valide.
// Réponse identique (message générique + délai similaire) qu'email soit absent
// ou que le mot de passe soit incorrect — anti-énumération de comptes.

import type { Request, Response } from 'express';

import { query } from '../_core/db.js';
import { verifyPassword } from './password.js';
import { signToken } from './jwt.js';
import { loginSchema } from './validation.js';
import type { ProfileRow, PublicProfile } from './types.js';

const GENERIC_ERROR = 'Email ou mot de passe incorrect.';

function toPublicProfile(row: ProfileRow): PublicProfile {
  return {
    id: row.id,
    email: row.email,
    pseudo: row.pseudo,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at.toISOString(),
  };
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  // 1. Validation des entrées.
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Email ou mot de passe manquant.' });
    return;
  }
  const { email, password } = parsed.data;

  try {
    // 2. Chercher le profil par email.
    const { rows } = await query<ProfileRow>(
      `SELECT id, email, password_hash, pseudo, avatar_url, created_at, updated_at
       FROM profiles WHERE email = $1`,
      [email],
    );

    const profile = rows[0];

    // 3. Toujours vérifier le hash, même si le profil est absent, pour éviter
    //    une différence de temps de réponse qui trahirait l'existence du compte.
    const hashToVerify = profile?.password_hash ?? '$2a$12$invalidhashplaceholderXXXXXXXXXXXXXXXXXXXXXX';
    const valid = await verifyPassword(password, hashToVerify);

    if (!profile || !valid) {
      res.status(401).json({ error: GENERIC_ERROR });
      return;
    }

    // 4. Renvoyer le JWT + profil public.
    const token = signToken({ sub: profile.id, email: profile.email, pseudo: profile.pseudo });
    res.json({ token, user: toPublicProfile(profile) });
  } catch (err) {
    console.error('[auth] login error:', err instanceof Error ? err.message : 'unknown');
    res.status(500).json({ error: 'Erreur serveur. Réessaie plus tard.' });
  }
}
