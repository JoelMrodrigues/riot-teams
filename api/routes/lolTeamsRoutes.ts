// Router équipes LoL — monté sur /api/lol/teams dans server.ts.
//
// Toutes les routes modifiantes sont derrière requireAuth.
// Les routes de modification d'équipe sont en plus derrière requireManager ou requireOwner.

import { Router } from 'express';

import { requireAuth } from '../auth/middleware.js';
import { requireManager, requireOwner } from '../lol/teams/teamAuth.js';
import { createTeamHandler } from '../lol/teams/createTeamHandler.js';
import { listTeamsHandler } from '../lol/teams/listTeamsHandler.js';
import { getTeamHandler } from '../lol/teams/getTeamHandler.js';
import { patchTeamHandler } from '../lol/teams/patchTeamHandler.js';
import { deleteTeamHandler } from '../lol/teams/deleteTeamHandler.js';
import { addRosterHandler } from '../lol/teams/addRosterHandler.js';
import { removeRosterHandler } from '../lol/teams/removeRosterHandler.js';
import { addCaptainHandler, removeCaptainHandler } from '../lol/teams/captainsHandler.js';
import { transferHandler } from '../lol/teams/transferHandler.js';

const router = Router();

// --- Équipes ---
// GET  /api/lol/teams        — liste MES équipes (owner ou captain)
router.get('/', requireAuth, listTeamsHandler);

// POST /api/lol/teams        — créer une équipe (créateur → owner)
router.post('/', requireAuth, createTeamHandler);

// GET  /api/lol/teams/:teamId — détail public (myRole si authentifié)
router.get('/:teamId', getTeamHandler);

// PATCH /api/lol/teams/:teamId — éditer les infos (manager requis)
router.patch('/:teamId', requireAuth, requireManager, patchTeamHandler);

// DELETE /api/lol/teams/:teamId — supprimer (manager : owner OU capitaine, décision « capitaine = quasi-proprio »)
router.delete('/:teamId', requireAuth, requireManager, deleteTeamHandler);

// --- Roster ---
// POST   /api/lol/teams/:teamId/roster             — ajouter un joueur (manager)
router.post('/:teamId/roster', requireAuth, requireManager, addRosterHandler);

// DELETE /api/lol/teams/:teamId/roster/:rosterId   — retirer un joueur (manager)
router.delete('/:teamId/roster/:rosterId', requireAuth, requireManager, removeRosterHandler);

// --- Capitaines ---
// POST   /api/lol/teams/:teamId/captains           — nommer un capitaine (manager)
router.post('/:teamId/captains', requireAuth, requireManager, addCaptainHandler);

// DELETE /api/lol/teams/:teamId/captains/:userId   — révoquer un capitaine (manager)
router.delete('/:teamId/captains/:userId', requireAuth, requireManager, removeCaptainHandler);

// --- Transfert de propriété ---
// POST /api/lol/teams/:teamId/transfer             — owner strict uniquement
router.post('/:teamId/transfer', requireAuth, requireOwner, transferHandler);

export default router;
