// Types d'authentification partagés côté client.
// Miroir de `api/auth/types.ts` (PublicProfile) — sans dépendance sur le backend.

/** Profil utilisateur public renvoyé par l'API. */
export interface User {
  id: string;
  email: string;
  pseudo: string;
  avatarUrl: string | null;
  createdAt: string;
}

/** Statut du contexte d'authentification. */
export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

/** Réponse de POST /api/auth/register */
export interface RegisterResponse {
  token: string;
  user: User;
}

/** Réponse de POST /api/auth/login */
export interface LoginResponse {
  token: string;
  user: User;
}

/** Réponse de GET /api/auth/me */
export interface MeResponse {
  user: User;
}

/** Réponse d'erreur générique du backend */
export interface ApiErrorResponse {
  error: string;
}
