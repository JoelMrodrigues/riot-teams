// PATCH /api/lol/teams/:teamId
// Mise à jour partielle des infos d'une équipe.
// Réservé aux managers (owner ou captain) — requireManager appliqué dans le router.

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';
import { patchTeamSchema } from './validation.js';
import type { TeamRow } from './types.js';

export async function patchTeamHandler(req: Request, res: Response): Promise<void> {
  const parsed = patchTeamSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { teamId } = req.params;
  const data = parsed.data;

  // Construit les SET dynamiques uniquement sur les champs fournis.
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  const addField = (col: string, val: unknown): void => {
    setClauses.push(`${col} = $${idx++}`);
    params.push(val);
  };

  if ('name' in data)         addField('name', data.name);
  if ('tag' in data)          addField('tag', data.tag);
  if ('region' in data)       addField('region', data.region);
  if ('accent_color' in data) addField('accent_color', data.accent_color);
  if ('description' in data)  addField('description', data.description);
  if ('icon' in data) {
    addField('icon_kind', data.icon?.kind ?? null);
    addField('icon_value', data.icon?.value ?? null);
  }

  if (setClauses.length === 0) {
    res.status(400).json({ error: 'Aucun champ à mettre à jour.' });
    return;
  }

  params.push(teamId);
  const { rows } = await query<TeamRow>(
    `UPDATE lol_teams SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`,
    params,
  );

  if (rows.length === 0) {
    res.status(404).json({ error: 'Équipe introuvable.' });
    return;
  }

  const team = rows[0];
  res.json({
    id: team.id,
    name: team.name,
    tag: team.tag,
    region: team.region,
    accentColor: team.accent_color,
    description: team.description,
    icon: team.icon_kind ? { kind: team.icon_kind, value: team.icon_value } : null,
    ownerId: team.owner_id,
    updatedAt: team.updated_at,
  });
}
