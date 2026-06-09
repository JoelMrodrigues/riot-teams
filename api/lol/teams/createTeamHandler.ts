// POST /api/lol/teams
// Crée une équipe et inscrit le créateur comme propriétaire (owner).
// Les deux INSERTs sont dans une transaction atomique (withTransaction).

import type { Request, Response } from 'express';

import { withTransaction } from '../../_core/db.js';
import { createTeamSchema } from './validation.js';
import type { TeamRow } from './types.js';

export async function createTeamHandler(req: Request, res: Response): Promise<void> {
  const parsed = createTeamSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const userId = req.user!.sub;
  const { name, tag, region, accent_color, description, icon } = parsed.data;

  const team = await withTransaction(async (q) => {
    // 1. Créer l'équipe.
    const { rows } = await q<TeamRow>(
      `INSERT INTO lol_teams
         (owner_id, name, tag, region, accent_color, description, icon_kind, icon_value)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        name,
        tag ?? null,
        region ?? null,
        accent_color ?? null,
        description ?? null,
        icon?.kind ?? null,
        icon?.value ?? null,
      ],
    );
    const newTeam = rows[0];

    // 2. Inscrire le créateur comme propriétaire dans lol_team_members.
    await q(
      `INSERT INTO lol_team_members (team_id, user_id, role)
       VALUES ($1, $2, 'owner')`,
      [newTeam.id, userId],
    );

    return newTeam;
  });

  res.status(201).json({
    id: team.id,
    name: team.name,
    tag: team.tag,
    region: team.region,
    accentColor: team.accent_color,
    description: team.description,
    icon: team.icon_kind ? { kind: team.icon_kind, value: team.icon_value } : null,
    ownerId: team.owner_id,
    createdAt: team.created_at,
    updatedAt: team.updated_at,
  });
}
