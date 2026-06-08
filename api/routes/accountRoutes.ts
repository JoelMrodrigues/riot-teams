import { Router } from 'express';

import { getAccountByRiotId } from '../shared/account/getAccountByRiotId';

const router = Router();

// ACCOUNT-V1 — GET /api/account?gameName=...&tagLine=...
router.get('/account', async (req, res) => {
  const gameName = String(req.query.gameName ?? '').trim();
  const tagLine = String(req.query.tagLine ?? '').trim();
  if (!gameName || !tagLine) {
    res.status(400).json({ error: 'gameName et tagLine requis.' });
    return;
  }
  res.json(await getAccountByRiotId(gameName, tagLine));
});

export default router;
