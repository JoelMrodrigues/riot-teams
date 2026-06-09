// Handler POST /api/auth/register
// Crée un nouveau compte et renvoie le profil public + un JWT.
// Les messages d'erreur sont génériques pour éviter l'énumération de comptes.

import type { Request, Response } from 'express';

import { query } from '../_core/db.js';
import { hashPassword } from './password.js';
import { signToken } from './jwt.js';
import { registerSchema } from './validation.js';
import type { ProfileRow, PublicProfile } from './types.js';

/** Transforme une ligne DB en objet public (sans password_hash). */
function toPublicProfile(row: ProfileRow): PublicProfile {
  return {
    id: row.id,
    email: row.email,
    pseudo: row.pseudo,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at.toISOString(),
  };
}

export async function registerHandler(req: Request, res: Response): Promise<void> {
  // 1. Validation et nettoyage des entrées.
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Données invalides.' });
    return;
  }
  const { email, password, pseudo } = parsed.data;

  // 2. Hachage du mot de passe avant toute interaction DB.
  const passwordHash = await hashPassword(password);

  try {
    // 3. INSERT — la contrainte UNIQUE(email) en base rejette un doublon.
    const { rows } = await query<ProfileRow>(
      `INSERT INTO profiles (email, password_hash, pseudo)
       VALUES ($1, $2, $3)
       RETURNING id, email, password_hash, pseudo, avatar_url, created_at, updated_at`,
      [email, passwordHash, pseudo],
    );

    const profile = rows[0];
    if (!profile) {
      res.status(500).json({ error: 'Erreur lors de la création du compte.' });
      return;
    }

    // 4. Générer le JWT et renvoyer le profil public.
    const token = signToken({ sub: profile.id, email: profile.email, pseudo: profile.pseudo });

    res.status(201).json({ token, user: toPublicProfile(profile) });
  } catch (err) {
    // Contrainte unique violée (email déjà utilisé) → message générique.
    if (err instanceof Error && err.message.includes('unique')) {
      res.status(409).json({ error: 'Impossible de créer le compte. Vérifie tes informations.' });
      return;
    }
    console.error('[auth] register error:', err instanceof Error ? err.message : 'unknown');
    res.status(500).json({ error: 'Erreur serveur. Réessaie plus tard.' });
  }
}
