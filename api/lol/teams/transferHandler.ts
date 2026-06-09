// POST /api/lol/teams/:teamId/transfer
// Transfère la propriété d'une équipe à un autre utilisateur.
// Réservé au propriétaire strict (requireOwner dans le router).
//
// Stratégie de transfert (atomique) :
//   1. Vérifier que la cible est un utilisateur existant.
//   2. Mettre à jour lol_teams.owner_id vers le nouvel owner.
//   3. Changer le rôle de l'ancien owner en 'captain' dans lol_team_members.
//   4. Upsert le nouvel owner dans lol_team_members avec role 'owner'.
//
// L'ancien propriétaire devient capitaine (pas retiré).

import type { Request, Response } from 'express';

import { withTransaction } from '../../_core/db.js';
import { transferOwnerSchema } from './validation.js';

export async function transferHandler(req: Request, res: Response): Promise<void> {
  const parsed = transferOwnerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { teamId } = req.params;
  const currentOwnerId = req.user!.sub;
  const { user_id: newOwnerId } = parsed.data;

  if (newOwnerId === currentOwnerId) {
    res.status(400).json({ error: 'Vous êtes déjà le propriétaire de cette équipe.' });
    return;
  }

  // Vérifie que la cible existe dans un premier accès hors transaction.
  const { rows: userRows } = await withTransaction(async (q) => {
    return q<{ id: string }>(
      'SELECT id FROM profiles WHERE id = $1 LIMIT 1',
      [newOwnerId],
    );
  });

  if (userRows.length === 0) {
    res.status(404).json({ error: 'Utilisateur cible introuvable.' });
    return;
  }

  await withTransaction(async (q) => {
    // 1. Mettre à jour owner_id dans lol_teams.
    await q(
      'UPDATE lol_teams SET owner_id = $1 WHERE id = $2',
      [newOwnerId, teamId],
    );

    // 2. Ancien propriétaire : passe de 'owner' à 'captain'.
    await q(
      `UPDATE lol_team_members SET role = 'captain'
       WHERE team_id = $1 AND user_id = $2 AND role = 'owner'`,
      [teamId, currentOwnerId],
    );

    // 3. Nouvel owner : upsert (peut être membre existant ou nouvel entrant).
    await q(
      `INSERT INTO lol_team_members (team_id, user_id, role)
       VALUES ($1, $2, 'owner')
       ON CONFLICT (team_id, user_id) DO UPDATE SET role = 'owner'`,
      [teamId, newOwnerId],
    );
  });

  res.json({
    teamId,
    newOwnerId,
    previousOwnerId: currentOwnerId,
    message: 'Propriété transférée. L\'ancien propriétaire est désormais capitaine.',
  });
}
