// PUT /api/lol/teams/:teamId/logo
// Upload ou remplacement du logo d'une équipe (stockage binaire en base).
// Corps JSON : { dataBase64: string, mime: 'image/png'|'image/jpeg'|'image/webp' }
// Plafond : 512 Ko décodés. Réservé aux membres avec capacité canEditTeam.

import type { Request, Response } from 'express';

import { withTransaction } from '../../_core/db.js';
import { uploadLogoSchema } from './validation.js';

/** Taille maximale autorisée pour le logo (512 Ko en octets). */
const MAX_LOGO_BYTES = 512 * 1024;

export async function uploadLogoHandler(req: Request, res: Response): Promise<void> {
  const parsed = uploadLogoSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    return;
  }

  const { teamId } = req.params as { teamId: string };
  const { dataBase64, mime } = parsed.data;

  let buffer: Buffer;
  try {
    buffer = Buffer.from(dataBase64, 'base64');
  } catch {
    res.status(400).json({ error: 'dataBase64 invalide : décodage impossible.' });
    return;
  }

  if (buffer.byteLength > MAX_LOGO_BYTES) {
    res.status(413).json({
      error: `Logo trop lourd : ${Math.round(buffer.byteLength / 1024)} Ko reçus, 512 Ko maximum.`,
    });
    return;
  }

  await withTransaction(async (q) => {
    // Vérifie que l'équipe existe avant d'insérer.
    const { rows: teamCheck } = await q('SELECT id FROM lol_teams WHERE id = $1 LIMIT 1', [teamId]);
    if (teamCheck.length === 0) {
      res.status(404).json({ error: 'Équipe introuvable.' });
      return;
    }

    // Upsert du logo.
    await q(
      `INSERT INTO lol_team_logos (team_id, mime, data)
       VALUES ($1, $2, $3)
       ON CONFLICT (team_id) DO UPDATE SET mime = $2, data = $3, updated_at = now()`,
      [teamId, mime, buffer],
    );

    // Met à jour icon_kind / icon_value sur lol_teams.
    await q(
      `UPDATE lol_teams SET icon_kind = 'upload', icon_value = 'stored' WHERE id = $1`,
      [teamId],
    );
  });

  // res peut déjà avoir été envoyé en cas de 404 dans la transaction.
  if (res.headersSent) return;

  res.json({ ok: true, teamId, mime, sizeBytes: buffer.byteLength });
}
