// Middleware requireAuth : vérifie le JWT dans le header Authorization: Bearer.
// Attache req.user = JwtPayload si valide, renvoie 401 sinon.
//
// Utilisé par toutes les routes privées (Lot B et suivants).
// Conçu pour être réutilisable sans modification quand on migrera
// vers cookie httpOnly (il suffira de lire req.cookies à la place).

import type { Request, Response, NextFunction } from 'express';

import { verifyToken } from './jwt.js';

/**
 * Extrait le token depuis le header Authorization: Bearer <token>.
 * Retourne null si absent ou mal formé.
 */
function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
}

/**
 * Middleware d'authentification.
 * Toute route protégée doit le déclarer avant son handler.
 *
 * Exemple : router.get('/me', requireAuth, meHandler)
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = extractBearerToken(req);

  if (!token) {
    res.status(401).json({ error: 'Authentification requise.' });
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    // Ne pas exposer le détail de l'erreur JWT (expiration, signature…).
    res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
}
