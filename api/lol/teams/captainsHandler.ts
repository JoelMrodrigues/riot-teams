// POST   /api/lol/teams/:teamId/captains — nommer un capitaine
// DELETE /api/lol/teams/:teamId/captains/:userId — révoquer un capitaine
//
// @deprecated Ces routes sont remplacées par /members (POST/DELETE).
// Conservées pour la compatibilité le temps de la migration front (Lot C).
// Elles délèguent désormais sur la table lol_team_members.
//
// Règles :
//   - Un capitaine peut nommer/révoquer d'autres capitaines (MAIS pas le propriétaire).
//   - Refus si la cible est le propriétaire (owner).
//   - Un capitaine peut se révoquer lui-même.

import type { Request, Response } from 'express';

import { query } from '../../_core/db.js';
import { addCaptainSchema } from './validation.js';

export async function addCaptainHandler(req: Request, res: Response): Promise<void> {
  const parsed = addCaptainSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { teamId } = req.params;
  const { user_id: targetUserId } = parsed.data;

  // Vérifie que l'équipe existe et récupère l'owner_id.
  const { rows: teamRows } = await query<{ owner_id: string }>(
    'SELECT owner_id FROM lol_teams WHERE id = $1 LIMIT 1',
    [teamId],
  );
  if (teamRows.length === 0) {
    res.status(404).json({ error: 'Équipe introuvable.' });
    return;
  }

  // Interdit de nommer le propriétaire comme capitaine.
  if (teamRows[0].owner_id === targetUserId) {
    res.status(409).json({ error: 'Le propriétaire ne peut pas être nommé capitaine.' });
    return;
  }

  // Vérifie que l'utilisateur cible existe.
  const { rows: userRows } = await query<{ id: string }>(
    'SELECT id FROM profiles WHERE id = $1 LIMIT 1',
    [targetUserId],
  );
  if (userRows.length === 0) {
    res.status(404).json({ error: 'Utilisateur introuvable.' });
    return;
  }

  await query(
    `INSERT INTO lol_team_members (team_id, user_id, role)
     VALUES ($1, $2, 'captain')
     ON CONFLICT (team_id, user_id) DO NOTHING`,
    [teamId, targetUserId],
  );
  res.status(201).json({ teamId, userId: targetUserId, role: 'captain' });
}

export async function removeCaptainHandler(req: Request, res: Response): Promise<void> {
  const { teamId, userId: targetUserId } = req.params;

  // Vérifie que l'équipe existe et récupère l'owner_id.
  const { rows: teamRows } = await query<{ owner_id: string }>(
    'SELECT owner_id FROM lol_teams WHERE id = $1 LIMIT 1',
    [teamId],
  );
  if (teamRows.length === 0) {
    res.status(404).json({ error: 'Équipe introuvable.' });
    return;
  }

  // Interdit de rétrograder le propriétaire.
  if (teamRows[0].owner_id === targetUserId) {
    res.status(403).json({ error: 'Impossible de révoquer le propriétaire de l\'équipe.' });
    return;
  }

  const { rowCount } = await query(
    `DELETE FROM lol_team_members
     WHERE team_id = $1 AND user_id = $2 AND role = 'captain'`,
    [teamId, targetUserId],
  );

  if (!rowCount || rowCount === 0) {
    res.status(404).json({ error: 'Capitaine introuvable sur cette équipe.' });
    return;
  }

  res.status(204).send();
}
