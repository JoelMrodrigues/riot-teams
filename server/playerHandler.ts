import type { Request, Response } from 'express';

import { CONFIG } from './config';
import { buildPlayer } from './riot/buildPlayer';
import { RiotError } from './riot/riotClient';

/** GET /api/lol/player?gameName=...&tagLine=...&platform=euw1&count=20 */
export async function playerHandler(req: Request, res: Response): Promise<void> {
  const gameName = String(req.query.gameName ?? '').trim();
  const tagLine = String(req.query.tagLine ?? '').trim();
  const platform = String(req.query.platform ?? CONFIG.defaultPlatform).trim();
  const count = Math.min(Math.max(Number(req.query.count ?? 20), 1), 50);

  if (!gameName || !tagLine) {
    res.status(400).json({ error: 'Riot ID incomplet (pseudo et tag requis).' });
    return;
  }

  try {
    const profile = await buildPlayer(platform, gameName, tagLine, count);
    res.json(profile);
  } catch (err) {
    if (err instanceof RiotError) {
      res.status(err.status).json({ error: err.message, detail: err.detail });
      return;
    }
    console.error('[player] erreur inattendue:', err);
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
}
