// Router auth — monte les 4 endpoints de la surface API auth :
//   POST /api/auth/register
//   POST /api/auth/login
//   POST /api/auth/logout  (protégé)
//   GET  /api/auth/me      (protégé)
//
// Les handlers sont dans api/auth/* (1 fichier = 1 responsabilité).

import { Router } from 'express';

import { requireAuth } from '../auth/middleware.js';
import { registerHandler } from '../auth/registerHandler.js';
import { loginHandler } from '../auth/loginHandler.js';
import { meHandler, logoutHandler } from '../auth/meHandler.js';

const router = Router();

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.post('/logout', requireAuth, logoutHandler);
router.get('/me', requireAuth, meHandler);

export default router;
