// Schémas Zod pour les événements d'agenda (lol_events).
import { z } from 'zod';

const EVENT_TYPES = ['scrim', 'training', 'review', 'soloq', 'other'] as const;

export const createEventSchema = z.object({
  type: z.enum(EVENT_TYPES),
  title: z.string().min(1, 'Titre requis.').max(80),
  starts_at: z.string().min(1, 'Date/heure requise.'),
  duration_min: z.number().int().min(0).max(1440).nullable().optional(),
  opponent: z.string().max(80).nullable().optional(),
  bo: z.number().int().min(1).max(9).nullable().optional(),
  result: z.enum(['win', 'loss']).nullable().optional(),
  score: z.string().max(16).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export const patchEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type PatchEventInput = z.infer<typeof patchEventSchema>;

/** Colonnes modifiables via PATCH (mêmes noms côté DB). */
export const EVENT_PATCH_FIELDS = [
  'type', 'title', 'starts_at', 'duration_min', 'opponent', 'bo', 'result', 'score', 'notes',
] as const;
