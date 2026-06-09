// Handler POST /api/auth/register
// Crée un nouveau compte et renvoie le profil public + un JWT.
// Si un riotId est fourni (et noRiotId absent/false), vérifie via l'API Riot,
// crée la user_connection en transaction, puis backfille les rosters existants.

import type { Request, Response } from 'express';

import { query, withTransaction } from '../_core/db.js';
import { hashPassword } from './password.js';
import { signToken } from './jwt.js';
import { registerSchema } from './validation.js';
import { parseRiotId } from './riotIdParser.js';
import { backfillRosterLinks } from './registerBackfill.js';
import { getAccountByRiotId } from '../shared/account/getAccountByRiotId.js';
import { RiotError } from '../_core/riotClient.js';
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
  const { email, password, pseudo, riotId, noRiotId } = parsed.data;

  // 2. Vérification Riot ID AVANT la transaction (appel réseau externe).
  const wantsRiotId = !noRiotId && Boolean(riotId);
  let verifiedGameName: string | null = null;
  let verifiedTagLine: string | null = null;
  let verifiedPuuid: string | null = null;

  if (wantsRiotId && riotId) {
    const parsed_riot = parseRiotId(riotId);
    if (!parsed_riot) {
      res.status(400).json({ error: 'Format de Riot ID invalide — attendu : NomJoueur#TAG (ex: Faker#KR1).' });
      return;
    }

    try {
      const account = await getAccountByRiotId(parsed_riot.gameName, parsed_riot.tagLine);
      verifiedGameName = account.gameName;
      verifiedTagLine = account.tagLine;
      verifiedPuuid = account.puuid;
    } catch (err) {
      if (err instanceof RiotError && err.status === 404) {
        res.status(400).json({ error: 'Riot ID introuvable, vérifie le format pseudo#tag.' });
        return;
      }
      // Erreur Riot inattendue (rate limit, clé invalide…) → ne pas bloquer l'inscription.
      console.error('[auth] register — vérif Riot ID échouée:', err instanceof Error ? err.message : 'unknown');
      res.status(502).json({ error: 'Impossible de vérifier le Riot ID pour le moment. Réessaie.' });
      return;
    }
  }

  // 3. Hachage du mot de passe avant toute interaction DB.
  const passwordHash = await hashPassword(password);

  try {
    // 4. Transaction atomique : profil + user_connection (si Riot ID vérifié).
    const profile = await withTransaction(async (q) => {
      const { rows } = await q<ProfileRow>(
        `INSERT INTO profiles (email, password_hash, pseudo)
         VALUES ($1, $2, $3)
         RETURNING id, email, password_hash, pseudo, avatar_url, created_at, updated_at`,
        [email, passwordHash, pseudo],
      );
      const row = rows[0];
      if (!row) throw new Error('Profil non créé.');

      if (verifiedGameName && verifiedTagLine && verifiedPuuid) {
        await q(
          `INSERT INTO user_connections (user_id, game_name, tag_line, puuid, is_primary)
           VALUES ($1, $2, $3, $4, true)`,
          [row.id, verifiedGameName, verifiedTagLine, verifiedPuuid],
        );
      }
      return row;
    });

    // 5. Backfill hors transaction (lecture + écritures non atomiques avec le profil,
    //    mais une erreur ici ne doit pas annuler la création du compte).
    if (verifiedGameName && verifiedTagLine) {
      await backfillRosterLinks(query, profile.id, verifiedGameName, verifiedTagLine);
    }

    // 6. JWT + réponse.
    const token = signToken({ sub: profile.id, email: profile.email, pseudo: profile.pseudo });
    res.status(201).json({ token, user: toPublicProfile(profile) });

  } catch (err) {
    if (err instanceof Error && err.message.includes('unique')) {
      res.status(409).json({ error: 'Impossible de créer le compte. Vérifie tes informations.' });
      return;
    }
    console.error('[auth] register error:', err instanceof Error ? err.message : 'unknown');
    res.status(500).json({ error: 'Erreur serveur. Réessaie plus tard.' });
  }
}
