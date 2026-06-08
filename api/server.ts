import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';

import { CONFIG } from './_core/config';
import { RiotError } from './_core/riotClient';
import { getAccountByRiotId } from './shared/account/getAccountByRiotId';
import { getSummonerByPuuid } from './lol/profile/getSummonerByPuuid';

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
  res.json(await getAccountByRiotId(gameName, tagLine));
});

// SUMMONER-V4 — GET /api/lol/summoner?puuid=...
app.get('/api/lol/summoner', async (req, res) => {
  const puuid = String(req.query.puuid ?? '').trim();
  if (!puuid) {
    res.status(400).json({ error: 'puuid requis.' });
    return;
  }
  res.json(await getSummonerByPuuid(puuid));
});

// Production (Railway) : sert le front buildé + fallback SPA, même origine que l'API.
const distDir = resolve(process.cwd(), 'dist');
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(join(distDir, 'index.html'));
  });
}

// Gestion d'erreur centralisée (Express 5 capture les rejets async).
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof RiotError) {
    res.status(err.status).json({ error: err.message, detail: err.detail });
    return;
  }
  console.error('[api] erreur:', err);
  res.status(500).json({ error: 'Erreur serveur interne.' });
};
app.use(errorHandler);

app.listen(CONFIG.port, () => {
  console.log(`[api] écoute sur http://localhost:${CONFIG.port} (clé: ${CONFIG.keyMode})`);
});
