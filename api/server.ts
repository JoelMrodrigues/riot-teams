import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';

import { CONFIG } from './_core/config';
import { RiotError } from './_core/riotClient';
import accountRoutes from './routes/accountRoutes';
import lolRoutes from './routes/lolRoutes';
import authRoutes from './routes/authRoutes';
import lolTeamsRoutes from './routes/lolTeamsRoutes';
import usersRoutes from './routes/usersRoutes';

const app = express();
app.use(cors());
// Parsing JSON global — limite à 1 Mo pour autoriser l'upload d'un logo en base64.
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, keyMode: CONFIG.keyMode, platform: CONFIG.defaultPlatform });
});

app.use('/api/auth', authRoutes);
app.use('/api', accountRoutes);
app.use('/api/lol', lolRoutes);
app.use('/api/lol/teams', lolTeamsRoutes);
app.use('/api/users', usersRoutes);

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
  // JSON malformé (body-parser) : err.status ou err.statusCode = 400, type entity.parse.failed.
  const bodyParserStatus = (err as { status?: number; statusCode?: number; type?: string }).status
    ?? (err as { statusCode?: number }).statusCode;
  const bodyParserType = (err as { type?: string }).type;
  if (bodyParserStatus === 400 && bodyParserType === 'entity.parse.failed') {
    res.status(400).json({ error: 'Corps de requête JSON invalide.' });
    return;
  }

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
