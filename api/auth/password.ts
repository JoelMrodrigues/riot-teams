// Hachage et vérification des mots de passe avec bcryptjs.
// bcryptjs est une implémentation pure JavaScript — pas de compilation native
// requise sur le serveur Hetzner (contrairement à bcrypt ou argon2 natifs).
// Coût (saltRounds) = 12 : bon équilibre sécurité / performance sur hardware modeste.

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hache un mot de passe en clair.
 * Ne jamais stocker la valeur brute en base.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

/**
 * Compare un mot de passe en clair avec un hash stocké.
 * Retourne true si correspondance, false sinon.
 */
export async function verifyPassword(
  plaintext: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}
