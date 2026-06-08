import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

import express from 'express';
import cors from 'cors';

import { CONFIG } from './config';
import { playerHandler } from './playerHandler';

const app = express();
app.use(cors({ origin: CONFIG.webOrigin }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, keyMode: CONFIG.keyMode, platform: CONFIG.defaultPlatform });
});

app.get('/api/lol/player', playerHandler);

// Production (Railway) : sert le front buildé + fallback SPA, même origine que l'API.
const distDir = resolve(process.cwd(), 'dist');
if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(join(distDir, 'index.html'));
  });
}

app.listen(CONFIG.port, () => {
  console.log(`[riot-proxy] écoute sur http://localhost:${CONFIG.port} (clé: ${CONFIG.keyMode})`);
});
