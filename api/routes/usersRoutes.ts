// Router users — monté sur /api/users dans server.ts.
//
// Routes :
//   GET /api/users/search?q=... — recherche d'utilisateurs (auth requise)

import { Router } from 'express';

import { requireAuth } from '../auth/middleware.js';
import { userSearchHandler } from '../users/userSearchHandler.js';

const router = Router();

// GET /api/users/search?q=...
router.get('/search', requireAuth, userSearchHandler);

export default router;
