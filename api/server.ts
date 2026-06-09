import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';

import { CONFIG } from './_core/config';
import { RiotError } from './_core/riotClient';
import accountRoutes from './routes/accountRoutes';
import lolRoutes from './routes/lolRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(cors());
// Parsing JSON global — nécessaire pour les routes auth (et futures routes métier).
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, keyMode: CONFIG.keyMode, platform: CONFIG.defaultPlatform });
});

app.use('/api/auth', authRoutes);
app.use('/api', accountRoutes);
app.use('/api/lol', lolRoutes);

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
