// Backfill post-inscription : relie les entrées lol_rosters existantes dont le
// Riot ID correspond au nouveau compte, et ajoute ce compte en tant que 'player'
// dans les équipes concernées.
//
// Cas couvert : un joueur est ajouté au roster d'une équipe AVANT d'avoir un compte
// void.pro. Dès son inscription, il est reconnu et lié rétroactivement.

import type { QueryResult } from '../_core/db.js';
import type { QueryResultRow } from 'pg';

/** Signature du helper de requête (pool global ou client de transaction). */
type QueryFn = <T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params?: unknown[],
) => Promise<QueryResult<T>>;

interface RosterBackfillRow {
  id: string;
  team_id: string;
}

/**
 * Met à jour tous les lol_rosters dont (game_name, tag_line) correspondent
 * (insensible à la casse) et dont user_id est NULL, puis crée les entrées
 * lol_team_members 'player' correspondantes.
 *
 * ON CONFLICT DO NOTHING : n'écrase pas un rôle existant plus élevé.
 */
export async function backfillRosterLinks(
  q: QueryFn,
  userId: string,
  gameName: string,
  tagLine: string,
): Promise<void> {
  // 1. Récupère les entrées roster orphelines qui correspondent.
  const { rows } = await q<RosterBackfillRow>(
    `UPDATE lol_rosters
        SET user_id = $1
      WHERE user_id IS NULL
        AND LOWER(game_name) = LOWER($2)
        AND LOWER(tag_line)  = LOWER($3)
      RETURNING id, team_id`,
    [userId, gameName, tagLine],
  );

  if (rows.length === 0) return;

  // 2. Déduplique les team_id (un joueur peut être dans plusieurs équipes).
  const teamIds = [...new Set(rows.map((r) => r.team_id))];

  // 3. Insère un membre 'player' pour chaque équipe concernée.
  //    ON CONFLICT DO NOTHING : ne dégrade pas captain/manager/coach/staff/owner.
  for (const teamId of teamIds) {
    await q(
      `INSERT INTO lol_team_members (team_id, user_id, role)
       VALUES ($1, $2, 'player')
       ON CONFLICT (team_id, user_id) DO NOTHING`,
      [teamId, userId],
    );
  }
}
