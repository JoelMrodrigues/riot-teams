// DELETE /api/lol/teams/:teamId/logo
// Supprime le logo stocké en base et remet icon_kind / icon_value à NULL.
// Réservé aux membres avec capacité canEditTeam (owner | captain | manager).

import type { Request, Response } from 'express';

import { withTransaction } from '../../_core/db.js';

export async function deleteLogoHandler(req: Request, res: Response): Promise<void> {
  const { teamId } = req.params as { teamId: string };

  await withTransaction(async (q) => {
    const { rowCount } = await q(
      'DELETE FROM lol_team_logos WHERE team_id = $1',
      [teamId],
    );

    if (!rowCount || rowCount === 0) {
      res.status(404).json({ error: 'Aucun logo à supprimer pour cette équipe.' });
      return;
    }

    // Remet icon_kind / icon_value à NULL pour signaler qu'aucun logo n'est actif.
    await q(
      `UPDATE lol_teams SET icon_kind = NULL, icon_value = NULL WHERE id = $1`,
      [teamId],
    );
  });

  if (res.headersSent) return;

  res.json({ ok: true, teamId });
}
