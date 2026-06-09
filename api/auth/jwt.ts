// Signature et vérification des JWT via jsonwebtoken.
// Le secret est lu depuis JWT_SECRET (variable d'environnement obligatoire).
// Durée de validité : 7 jours (MVP). Migrer vers cookie httpOnly + Secure
// quand HTTPS + domaine propre sera disponible sur Hetzner.
//
// ATTENTION : actuellement le token est renvoyé dans le corps de la réponse
// (Authorization: Bearer) car le front est cross-origin en HTTP et les cookies
// httpOnly cross-site exigent Secure+HTTPS. Voir docs/auth-teams-cadrage.md §3.4.

import jwt from 'jsonwebtoken';

import type { JwtPayload } from './types.js';

const JWT_EXPIRY = '7d';

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('[jwt] JWT_SECRET manquant. Vérifie ton .env.');
  return secret;
}

/**
 * Crée un JWT signé pour l'utilisateur.
 * Le payload ne contient jamais password_hash ni données sensibles.
 */
export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  // `sub` est déjà présent dans le payload ; ne PAS repasser `subject` en option
  // (jsonwebtoken refuse les deux à la fois).
  return jwt.sign(payload, getSecret(), {
    expiresIn: JWT_EXPIRY,
  });
}

/**
 * Vérifie et décode un JWT.
 * Lève une erreur si le token est invalide ou expiré.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}
