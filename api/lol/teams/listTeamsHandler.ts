// GET /api/lol/teams
// Liste les équipes où l'utilisateur authentifié est membre (tous rôles confondus).

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';
import type { TeamRow, MemberRole } from './types.js';

interface TeamWithRole extends TeamRow {
  my_role: MemberRole;
  has_logo: boolean;
}

export async function listTeamsHandler(req: Request, res: Response): Promise<void> {
  const userId = req.user!.sub;

  const { rows } = await query<TeamWithRole>(
    `SELECT t.*, m.role AS my_role,
            EXISTS (SELECT 1 FROM lol_team_logos l WHERE l.team_id = t.id) AS has_logo
     FROM lol_teams t
     INNER JOIN lol_team_members m
       ON m.team_id = t.id AND m.user_id = $1
     ORDER BY t.created_at DESC`,
    [userId],
  );

  const teams = rows.map((t) => ({
    id: t.id,
    name: t.name,
    tag: t.tag,
    region: t.region,
    accentColor: t.accent_color,
    description: t.description,
    icon: t.icon_kind ? { kind: t.icon_kind, value: t.icon_value } : null,
    ownerId: t.owner_id,
    myRole: t.my_role,
    hasLogo: t.has_logo,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }));

  res.json({ teams });
}
