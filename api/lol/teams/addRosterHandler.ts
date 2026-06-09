// POST /api/lol/teams/:teamId/roster
// Ajoute un joueur (Riot ID) au roster d'une équipe.
// Réservé aux managers (owner ou captain) — requireManager appliqué dans le router.

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';
import { addRosterSchema } from './validation.js';
import type { RosterRow } from './types.js';

export async function addRosterHandler(req: Request, res: Response): Promise<void> {
  const parsed = addRosterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { teamId } = req.params;
  const { game_name, tag_line, user_id, role_in_game } = parsed.data;

  // Vérifie que l'équipe existe (la FK garantit l'intégrité, mais on veut un 404 clair).
  const { rows: teamCheck } = await query(
    'SELECT id FROM lol_teams WHERE id = $1 LIMIT 1',
    [teamId],
  );
  if (teamCheck.length === 0) {
    res.status(404).json({ error: 'Équipe introuvable.' });
    return;
  }

  try {
    const { rows } = await query<RosterRow>(
      `INSERT INTO lol_rosters (team_id, user_id, game_name, tag_line, role_in_game)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [teamId, user_id ?? null, game_name, tag_line, role_in_game ?? null],
    );

    const entry = rows[0];
    res.status(201).json({
      id: entry.id,
      gameName: entry.game_name,
      tagLine: entry.tag_line,
      puuid: entry.puuid,
      roleInGame: entry.role_in_game,
      userId: entry.user_id,
      addedAt: entry.created_at,
    });
  } catch (err) {
    // Violation de la contrainte UNIQUE (team_id, game_name, tag_line).
    if (err instanceof Error && err.message.includes('lol_rosters_riot_id_per_team_unique')) {
      res.status(409).json({ error: 'Ce Riot ID est déjà dans le roster de cette équipe.' });
      return;
    }
    throw err;
  }
}
