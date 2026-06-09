// GET /api/lol/teams/:teamId
// Lecture publique : renvoie l'équipe, ses managers et son roster.
// Si l'utilisateur est authentifié, renvoie aussi son rôle effectif (myRole).

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';
import { getTeamRole } from './teamAuth.js';
import type { TeamRow, ManagerRow, RosterRow, TeamDetailResponse } from './types.js';

export async function getTeamHandler(req: Request, res: Response): Promise<void> {
  const teamId = String(req.params['teamId'] ?? '');

  const { rows: teamRows } = await query<TeamRow>(
    'SELECT * FROM lol_teams WHERE id = $1 LIMIT 1',
    [teamId],
  );

  if (teamRows.length === 0) {
    res.status(404).json({ error: 'Équipe introuvable.' });
    return;
  }
  const team = teamRows[0];

  const [{ rows: managers }, { rows: roster }] = await Promise.all([
    query<ManagerRow>(
      'SELECT * FROM lol_team_managers WHERE team_id = $1 ORDER BY created_at',
      [teamId],
    ),
    query<RosterRow>(
      'SELECT * FROM lol_rosters WHERE team_id = $1 ORDER BY created_at',
      [teamId],
    ),
  ]);

  // Rôle de l'utilisateur courant (null si non authentifié).
  const userId = req.user?.sub ?? null;
  const myRole = userId ? (await getTeamRole(userId, teamId)) ?? 'none' : null;

  const response: TeamDetailResponse = {
    id: team.id,
    name: team.name,
    tag: team.tag,
    region: team.region,
    accentColor: team.accent_color,
    description: team.description,
    icon: team.icon_kind ? { kind: team.icon_kind, value: team.icon_value! } : null,
    ownerId: team.owner_id,
    createdAt: team.created_at.toISOString(),
    updatedAt: team.updated_at.toISOString(),
    managers: managers.map((m) => ({ userId: m.user_id, role: m.role })),
    roster: roster.map((r) => ({
      id: r.id,
      gameName: r.game_name,
      tagLine: r.tag_line,
      puuid: r.puuid,
      roleInGame: r.role_in_game,
      userId: r.user_id,
      addedAt: r.created_at.toISOString(),
    })),
    myRole,
  };

  res.json(response);
}
