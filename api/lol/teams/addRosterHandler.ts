// POST /api/lol/teams/:teamId/roster
// Ajoute un joueur (Riot ID) au roster d'une équipe.
// Après insertion, cherche automatiquement un compte void.pro correspondant
// via user_connections et crée l'entrée lol_team_members 'player' si trouvé.
// Réservé aux managers (owner ou captain) — requireManager appliqué dans le router.

import type { Request, Response } from 'express';

import { withTransaction } from '../../_core/db.js';
import { addRosterSchema } from './validation.js';
import type { RosterRow } from './types.js';

interface UserConnectionRow {
  user_id: string;
}

export async function addRosterHandler(req: Request, res: Response): Promise<void> {
  const parsed = addRosterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { teamId } = req.params as { teamId: string };
  const { game_name, tag_line, user_id, role_in_game } = parsed.data;

  try {
    const entry = await withTransaction(async (q) => {
      // 1. Vérifie que l'équipe existe (FK garantit l'intégrité, mais on veut un 404 clair).
      const { rows: teamCheck } = await q('SELECT id FROM lol_teams WHERE id = $1 LIMIT 1', [teamId]);
      if (teamCheck.length === 0) return null;

      // 2. Insère l'entrée roster. user_id explicite si fourni, sinon on tentera l'auto-lien.
      const { rows } = await q<RosterRow>(
        `INSERT INTO lol_rosters (team_id, user_id, game_name, tag_line, role_in_game)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [teamId, user_id ?? null, game_name, tag_line, role_in_game ?? null],
      );
      const roster = rows[0];
      if (!roster) throw new Error('Entrée roster non créée.');

      // 3. Auto-lien : cherche un compte via user_connections (insensible à la casse).
      //    Ne tente l'auto-lien que si user_id n'a pas déjà été fourni manuellement.
      let linkedUserId = roster.user_id;
      if (!linkedUserId) {
        const { rows: connRows } = await q<UserConnectionRow>(
          `SELECT user_id FROM user_connections
            WHERE LOWER(game_name) = LOWER($1)
              AND LOWER(tag_line)  = LOWER($2)
            LIMIT 1`,
          [game_name, tag_line],
        );
        const conn = connRows[0];
        if (conn) {
          linkedUserId = conn.user_id;
          // 4. Mets à jour l'entrée roster avec le user_id trouvé.
          await q(
            'UPDATE lol_rosters SET user_id = $1 WHERE id = $2',
            [linkedUserId, roster.id],
          );
          // 5. Ajoute le membre 'player' — ON CONFLICT DO NOTHING pour ne pas dégrader.
          await q(
            `INSERT INTO lol_team_members (team_id, user_id, role)
             VALUES ($1, $2, 'player')
             ON CONFLICT (team_id, user_id) DO NOTHING`,
            [teamId, linkedUserId],
          );
        }
      }

      return { ...roster, user_id: linkedUserId };
    });

    if (entry === null) {
      res.status(404).json({ error: 'Équipe introuvable.' });
      return;
    }

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
