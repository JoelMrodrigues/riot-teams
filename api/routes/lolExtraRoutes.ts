// Endpoints LoL complémentaires (rotation, live, statut, détail/timeline de match,
// maîtrise top/score/par-champion, classements apex). Monté sur /api/lol.

import { Router, type Request } from 'express';

import { resolvePuuid } from '../_core/resolvePuuid';
import { getChampionRotations } from '../lol/champion/getChampionRotations';
import { buildLiveGame } from '../lol/spectator/buildLiveGame';
import { getPlatformStatus } from '../lol/status/getPlatformStatus';
import { getMatch } from '../lol/matches/getMatch';
import { mapMatchDetail } from '../lol/matches/mapMatchDetail';
import { getMatchTimeline } from '../lol/matches/getMatchTimeline';
import { getTopMastery } from '../lol/mastery/getTopMastery';
import { getMasteryScore } from '../lol/mastery/getMasteryScore';
import { getMasteryByChampion } from '../lol/mastery/getMasteryByChampion';
import { buildLeaderboard } from '../lol/ranked/buildLeaderboard';
import type { ApexTier } from '../lol/ranked/apexTypes';

const router = Router();

const puuidOf = (req: Request): Promise<string> =>
  resolvePuuid(
    String(req.query.puuid ?? '').trim(),
    String(req.query.gameName ?? '').trim(),
    String(req.query.tagLine ?? '').trim(),
  );

const requireId = (req: Request, res: import('express').Response): string | null => {
  const id = String(req.query.id ?? '').trim();
  if (!id) { res.status(400).json({ error: 'id requis.' }); return null; }
  return id;
};

// CHAMPION-V3 — rotation gratuite
router.get('/rotation', async (_req, res) => { res.json(await getChampionRotations()); });

// LOL-STATUS-V4 — statut serveur
router.get('/status', async (_req, res) => { res.json(await getPlatformStatus()); });

// SPECTATOR-V5 — partie en cours (inGame:false si hors-partie)
router.get('/live', async (req, res) => {
  const game = await buildLiveGame(await puuidOf(req));
  res.json({ inGame: game !== null, game });
});

// MATCH-V5 — détail mappé (rendu complet de la partie)
router.get('/match/detail', async (req, res) => {
  const id = requireId(req, res);
  if (id) res.json(mapMatchDetail(await getMatch(id)));
});

// MATCH-V5 — timeline (or/xp/cs par minute + événements)
router.get('/match/timeline', async (req, res) => {
  const id = requireId(req, res);
  if (id) res.json(await getMatchTimeline(id));
});

// CHAMPION-MASTERY-V4 — top / score / par champion
router.get('/mastery/top', async (req, res) => {
  const count = Math.min(Math.max(Number(req.query.count ?? 5), 1), 20);
  res.json(await getTopMastery(await puuidOf(req), count));
});
router.get('/mastery/score', async (req, res) => {
  res.json({ score: await getMasteryScore(await puuidOf(req)) });
});
router.get('/mastery/champion', async (req, res) => {
  const championId = Number(req.query.championId);
  if (!Number.isFinite(championId)) { res.status(400).json({ error: 'championId requis.' }); return; }
  res.json(await getMasteryByChampion(await puuidOf(req), championId));
});

// LEAGUE-V4 — classement apex (challenger | grandmaster | master)
router.get('/leaderboard', async (req, res) => {
  const tier = String(req.query.tier ?? 'challenger').toLowerCase();
  if (!['challenger', 'grandmaster', 'master'].includes(tier)) {
    res.status(400).json({ error: 'tier doit être challenger, grandmaster ou master.' });
    return;
  }
  const queue = String(req.query.queue ?? 'RANKED_SOLO_5x5');
  const count = Math.min(Math.max(Number(req.query.count ?? 20), 1), 50);
  res.json(await buildLeaderboard(tier as ApexTier, queue, count));
});

export default router;
