// CRUD des événements d'agenda d'une équipe (lol_events).
// Lecture : tout membre. Écriture : owner|captain|manager|coach (router).

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';
import { createEventSchema, patchEventSchema, EVENT_PATCH_FIELDS } from './eventValidation.js';
import { toEventPublic } from './eventTypes.js';
import type { EventRow } from './eventTypes.js';

export async function listEventsHandler(req: Request, res: Response): Promise<void> {
  const teamId = String(req.params['teamId'] ?? '');
  const { rows } = await query<EventRow>(
    'SELECT * FROM lol_events WHERE team_id = $1 ORDER BY starts_at',
    [teamId],
  );
  res.json({ events: rows.map(toEventPublic) });
}

export async function createEventHandler(req: Request, res: Response): Promise<void> {
  const teamId = String(req.params['teamId'] ?? '');
  const parsed = createEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    return;
  }
  const d = parsed.data;
  const { rows } = await query<EventRow>(
    `INSERT INTO lol_events (team_id, type, title, starts_at, duration_min, opponent, bo, result, score, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [teamId, d.type, d.title, d.starts_at, d.duration_min ?? null, d.opponent ?? null,
      d.bo ?? null, d.result ?? null, d.score ?? null, d.notes ?? null],
  );
  const row = rows[0];
  if (!row) { res.status(500).json({ error: 'Création impossible.' }); return; }
  res.status(201).json(toEventPublic(row));
}

export async function patchEventHandler(req: Request, res: Response): Promise<void> {
  const teamId = String(req.params['teamId'] ?? '');
  const eventId = String(req.params['eventId'] ?? '');
  const parsed = patchEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const data = parsed.data as Record<string, unknown>;
  const sets: string[] = [];
  const vals: unknown[] = [];
  for (const field of EVENT_PATCH_FIELDS) {
    if (data[field] !== undefined) {
      sets.push(`${field} = $${sets.length + 1}`);
      vals.push(data[field]);
    }
  }
  if (sets.length === 0) { res.status(400).json({ error: 'Aucun champ à modifier.' }); return; }

  vals.push(teamId, eventId);
  const { rows } = await query<EventRow>(
    `UPDATE lol_events SET ${sets.join(', ')} WHERE team_id = $${vals.length - 1} AND id = $${vals.length} RETURNING *`,
    vals,
  );
  const row = rows[0];
  if (!row) { res.status(404).json({ error: 'Événement introuvable.' }); return; }
  res.json(toEventPublic(row));
}

export async function deleteEventHandler(req: Request, res: Response): Promise<void> {
  const teamId = String(req.params['teamId'] ?? '');
  const eventId = String(req.params['eventId'] ?? '');
  const { rowCount } = await query(
    'DELETE FROM lol_events WHERE team_id = $1 AND id = $2',
    [teamId, eventId],
  );
  if (!rowCount) { res.status(404).json({ error: 'Événement introuvable.' }); return; }
  res.status(204).end();
}
