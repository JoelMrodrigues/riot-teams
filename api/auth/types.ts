// Types partagés du module auth.
// Importés par les handlers, le middleware et les utilitaires JWT/password.

/** Profil public renvoyé au client (jamais password_hash). */
export interface PublicProfile {
  id: string;
  email: string;
  pseudo: string;
  avatarUrl: string | null;
  createdAt: string;
}

/** Ligne brute de la table `profiles` (usage interne uniquement). */
export interface ProfileRow {
  id: string;
  email: string;
  password_hash: string;
  pseudo: string;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

/** Payload encodé dans le JWT. */
export interface JwtPayload {
  sub: string;   // profiles.id (uuid)
  email: string;
  pseudo: string;
  iat?: number;
  exp?: number;
}

/**
 * Enrichit l'objet Request Express avec l'utilisateur authentifié.
 * Déclaré ici pour éviter les imports circulaires.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
