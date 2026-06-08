import express from 'express';
import cors from 'cors';

import { CONFIG } from './_core/config';
import { RiotError } from './_core/riotClient';
import { getAccountByRiotId } from './shared/account/getAccountByRiotId';

const app = express();
app.use(cors());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, keyMode: CONFIG.keyMode, platform: CONFIG.defaultPlatform });
});

// ACCOUNT-V1 — GET /api/account?gameName=...&tagLine=...
app.get('/api/account', async (req, res) => {
  const gameName = String(req.query.gameName ?? '').trim();
  const tagLine = String(req.query.tagLine ?? '').trim();
  if (!gameName || !tagLine) {
    res.status(400).json({ error: 'gameName et tagLine requis.' });
    return;
  }
  try {
    res.json(await getAccountByRiotId(gameName, tagLine));
  } catch (err) {
    if (err instanceof RiotError) {
      res.status(err.status).json({ error: err.message, detail: err.detail });
      return;
    }
    console.error('[account] erreur:', err);
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
});

app.listen(CONFIG.port, () => {
  console.log(`[api] écoute sur http://localhost:${CONFIG.port} (clé: ${CONFIG.keyMode})`);
});
