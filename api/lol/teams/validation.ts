// Schémas Zod pour valider les entrées des routes équipes LoL.
// Miroir fidèle des contraintes CHECK de la DB (longueurs, valeurs autorisées).

import { z } from 'zod';

const LOL_REGIONS = [
  'EUW', 'EUNE', 'NA', 'KR', 'BR', 'LAN', 'LAS', 'OCE', 'JP', 'TR', 'RU',
] as const;

const LOL_ROLES = ['Top', 'Jungle', 'Mid', 'ADC', 'Support', 'Fill'] as const;

const iconSchema = z
  .object({
    kind: z.enum(['champion', 'emblem']),
    value: z.string().min(1, "La valeur de l'icône est requise."),
  })
  .optional();

/** Corps attendu pour POST /api/lol/teams. */
export const createTeamSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères.')
    .max(40, 'Le nom ne peut pas dépasser 40 caractères.'),
  tag: z
    .string()
    .regex(/^[A-Z0-9]{2,4}$/, 'Le tag doit contenir 2 à 4 caractères majuscules/chiffres.')
    .optional(),
  region: z.enum(LOL_REGIONS).optional(),
  accent_color: z.string().max(32).optional(),
  description: z
    .string()
    .max(200, 'La description ne peut pas dépasser 200 caractères.')
    .optional(),
  icon: iconSchema,
});

/** Corps attendu pour PATCH /api/lol/teams/:teamId. */
export const patchTeamSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Le nom doit contenir au moins 2 caractères.')
      .max(40, 'Le nom ne peut pas dépasser 40 caractères.'),
    tag: z
      .string()
      .regex(/^[A-Z0-9]{2,4}$/, 'Le tag doit contenir 2 à 4 caractères majuscules/chiffres.')
      .nullable(),
    region: z.enum(LOL_REGIONS).nullable(),
    accent_color: z.string().max(32).nullable(),
    description: z.string().max(200).nullable(),
    icon: z
      .object({
        kind: z.enum(['champion', 'emblem']),
        value: z.string().min(1),
      })
      .nullable(),
  })
  .partial();

/** Corps attendu pour POST /api/lol/teams/:teamId/roster. */
export const addRosterSchema = z.object({
  game_name: z.string().min(1, 'game_name requis.').max(64),
  tag_line: z.string().min(1, 'tag_line requis.').max(8),
  user_id: z.string().uuid('user_id doit être un UUID valide.').optional(),
  role_in_game: z.enum(LOL_ROLES).optional(),
});

/** Corps attendu pour POST /api/lol/teams/:teamId/captains. */
export const addCaptainSchema = z.object({
  user_id: z.string().uuid('user_id doit être un UUID valide.'),
});

/** Corps attendu pour POST /api/lol/teams/:teamId/transfer. */
export const transferOwnerSchema = z.object({
  user_id: z.string().uuid('user_id doit être un UUID valide.'),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type PatchTeamInput = z.infer<typeof patchTeamSchema>;
export type AddRosterInput = z.infer<typeof addRosterSchema>;
export type AddCaptainInput = z.infer<typeof addCaptainSchema>;
export type TransferOwnerInput = z.infer<typeof transferOwnerSchema>;
