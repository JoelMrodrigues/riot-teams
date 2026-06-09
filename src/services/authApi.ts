// Fonctions d'appel à l'API d'authentification.
// Aucune dépendance UI : uniquement fetch + typage strict.

import { API_BASE } from './apiBase';
import type {
  LoginResponse,
  MeResponse,
  RegisterResponse,
  ApiErrorResponse,
} from '../types/auth';

/** Clé localStorage pour le token JWT. */
export const TOKEN_KEY = 'void-pro:token';

/** Lit le token dans localStorage de façon crash-safe. */
export function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Persiste le token dans localStorage de façon crash-safe. */
export function writeStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Silencieux : storage indisponible (mode privé restreint, quota)
  }
}

/** Supprime le token du localStorage de façon crash-safe. */
export function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Silencieux
  }
}

/** Extrait le message d'erreur depuis une réponse non-ok. */
async function extractError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as ApiErrorResponse;
    return body.error ?? `Erreur HTTP ${res.status}`;
  } catch {
    return `Erreur HTTP ${res.status}`;
  }
}

export interface RegisterParams {
  email: string;
  password: string;
  pseudo: string;
  /** Riot ID au format "gameName#tagLine" — vérifié par le backend via l'API Riot. */
  riotId?: string;
  /** true si l'utilisateur est staff et ne souhaite pas renseigner son Riot ID. */
  noRiotId?: boolean;
}

/** POST /api/auth/register — crée un compte et retourne token + user. */
export async function register(params: RegisterParams): Promise<RegisterResponse> {
  const { email, password, pseudo, riotId, noRiotId } = params;
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, pseudo, riotId, noRiotId }),
  });

  if (!res.ok) {
    throw new Error(await extractError(res));
  }

  return res.json() as Promise<RegisterResponse>;
}

/** POST /api/auth/login — authentifie et retourne token + user. */
export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await extractError(res));
  }

  return res.json() as Promise<LoginResponse>;
}

/** GET /api/auth/me — récupère le profil frais via Bearer token. */
export async function fetchMe(token: string): Promise<MeResponse> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(await extractError(res));
  }

  return res.json() as Promise<MeResponse>;
}
