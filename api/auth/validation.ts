// Schémas Zod pour valider et assainir les entrées des routes d'authentification.
// Centralise toutes les règles de validation auth en un seul endroit (DRY).

import { z } from 'zod';

/** Règles partagées sur le mot de passe. */
const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
  .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères.');

/** Corps attendu pour POST /api/auth/register. */
export const registerSchema = z.object({
  email: z
    .string()
    .email('Email invalide.')
    .max(254, "L'email ne peut pas dépasser 254 caractères.")
    .transform((v: string) => v.toLowerCase().trim()),
  password: passwordSchema,
  pseudo: z
    .string()
    .min(2, 'Le pseudo doit contenir au moins 2 caractères.')
    .max(32, 'Le pseudo ne peut pas dépasser 32 caractères.')
    .trim(),
});

/** Corps attendu pour POST /api/auth/login. */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Email invalide.')
    .transform((v: string) => v.toLowerCase().trim()),
  password: z.string().min(1, 'Mot de passe requis.'),
});

/** Type inféré du schéma register (après transformation). */
export type RegisterInput = z.infer<typeof registerSchema>;

/** Type inféré du schéma login (après transformation). */
export type LoginInput = z.infer<typeof loginSchema>;
