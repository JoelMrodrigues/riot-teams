// GET /api/lol/teams/:teamId/logo
// Sert le logo binaire d'une équipe avec le bon Content-Type.
// Route publique (pas d'auth requise).
// Cache navigateur : 5 minutes (300 s).

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';
import type { LogoRow } from './types.js';

export async function serveLogoHandler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params as { teamId: string };

  const { rows } = await query<LogoRow>(
    'SELECT mime, data FROM lol_team_logos WHERE team_id = $1 LIMIT 1',
    [teamId],
  );

  if (rows.length === 0) {
    res.status(404).json({ error: 'Aucun logo stocké pour cette équipe.' });
    return;
  }

  const logo = rows[0];

  res.setHeader('Content-Type', logo.mime);
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.send(logo.data);
}
