import { Router, type Request } from 'express';

import { resolvePuuid } from '../_core/resolvePuuid';
import { buildLolProfile } from '../lol/profile/buildLolProfile';
import { getSummonerByPuuid } from '../lol/profile/getSummonerByPuuid';
import { getLeagueByPuuid } from '../lol/ranked/getLeagueByPuuid';
import { getMatchIds } from '../lol/matches/getMatchIds';
import { getMatch } from '../lol/matches/getMatch';
import { getMasteryByPuuid } from '../lol/mastery/getMasteryByPuuid';
import { ingestPlayerMatches } from '../lol/timeline/ingestPlayerMatches';

const router = Router();

/** PUUID depuis ?puuid= ou ?gameName=&tagLine= (résolu avec la clé courante). */
const puuidOf = (req: Request): Promise<string> =>
  resolvePuuid(
    String(req.query.puuid ?? '').trim(),
    String(req.query.gameName ?? '').trim(),
    String(req.query.tagLine ?? '').trim(),
  );

// Profil agrégé (compte + rangs + matchs + maîtrise) — /api/lol/profile
router.get('/profile', async (req, res) => {
  const gameName = String(req.query.gameName ?? '').trim();
  const tagLine = String(req.query.tagLine ?? '').trim();
  if (!gameName || !tagLine) {
    res.status(400).json({ error: 'gameName et tagLine requis.' });
    return;
  }
  const count = Math.min(Math.max(Number(req.query.count ?? 8), 1), 20);
  const profile = await buildLolProfile(gameName, tagLine, count);
  res.json(profile);

  // Ingestion en arrière-plan (non bloquant) des tranches pour la timeline agrégée.
  void ingestPlayerMatches(profile.riotId, profile.tagLine, profile.matches.map((m) => m.matchId))
    .catch(() => { /* best-effort */ });
});

// SUMMONER-V4 — /api/lol/summoner
router.get('/summoner', async (req, res) => {
  res.json(await getSummonerByPuuid(await puuidOf(req)));
});

// LEAGUE-V4 — /api/lol/ranked
router.get('/ranked', async (req, res) => {
  res.json(await getLeagueByPuuid(await puuidOf(req)));
});

// MATCH-V5 (ids) — /api/lol/matches?...&count=10
router.get('/matches', async (req, res) => {
  const count = Math.min(Math.max(Number(req.query.count ?? 10), 1), 50);
  res.json(await getMatchIds(await puuidOf(req), count));
});

// MATCH-V5 (détail) — /api/lol/match?id=EUW1_...
router.get('/match', async (req, res) => {
  const id = String(req.query.id ?? '').trim();
  if (!id) {
    res.status(400).json({ error: 'id requis.' });
    return;
  }
  res.json(await getMatch(id));
});

// CHAMPION-MASTERY-V4 — /api/lol/mastery
router.get('/mastery', async (req, res) => {
  res.json(await getMasteryByPuuid(await puuidOf(req)));
});

export default router;
