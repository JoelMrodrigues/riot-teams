// Router équipes LoL — monté sur /api/lol/teams dans server.ts.
//
// Matrice de permissions appliquée par route :
//   PATCH  équipe       → requireCanEditTeam    (owner | captain | manager)
//   DELETE équipe       → requireCanDelete       (owner | captain)
//   roster POST/DELETE  → requireCanManageRoster (owner | captain | manager | coach)
//   members CRUD        → requireCanManageRoles  (owner | captain)
//   transfer            → requireOwner           (owner strict)
//   logo PUT/DELETE     → requireCanEditTeam    (owner | captain | manager)
//   logo GET            → public
//   player-stats GET    → requireAuth (tout membre authentifié)

import { Router } from 'express';

import { requireAuth } from '../auth/middleware.js';
import {
  requireCanEditTeam,
  requireCanManageRoster,
  requireCanManageRoles,
  requireCanDelete,
  requireOwner,
} from '../lol/teams/teamAuth.js';
import { createTeamHandler } from '../lol/teams/createTeamHandler.js';
import { listTeamsHandler } from '../lol/teams/listTeamsHandler.js';
import { getTeamHandler } from '../lol/teams/getTeamHandler.js';
import { patchTeamHandler } from '../lol/teams/patchTeamHandler.js';
import { deleteTeamHandler } from '../lol/teams/deleteTeamHandler.js';
import { addRosterHandler } from '../lol/teams/addRosterHandler.js';
import { removeRosterHandler } from '../lol/teams/removeRosterHandler.js';
import { addMemberHandler } from '../lol/teams/addMemberHandler.js';
import { patchMemberHandler } from '../lol/teams/patchMemberHandler.js';
import { removeMemberHandler } from '../lol/teams/removeMemberHandler.js';
import { transferHandler } from '../lol/teams/transferHandler.js';
import { uploadLogoHandler } from '../lol/teams/uploadLogoHandler.js';
import { serveLogoHandler } from '../lol/teams/serveLogoHandler.js';
import { deleteLogoHandler } from '../lol/teams/deleteLogoHandler.js';
import { playerStatsHandler } from '../lol/teams/playerStatsHandler.js';

const router = Router();

// --- Équipes ---
// GET  /api/lol/teams        — liste MES équipes (tous rôles)
router.get('/', requireAuth, listTeamsHandler);

// POST /api/lol/teams        — créer une équipe (créateur → owner)
router.post('/', requireAuth, createTeamHandler);

// GET  /api/lol/teams/:teamId — détail public (myRole si authentifié)
router.get('/:teamId', getTeamHandler);

// PATCH /api/lol/teams/:teamId — éditer les infos (owner | captain | manager)
router.patch('/:teamId', requireAuth, requireCanEditTeam, patchTeamHandler);

// DELETE /api/lol/teams/:teamId — supprimer (owner | captain)
router.delete('/:teamId', requireAuth, requireCanDelete, deleteTeamHandler);

// --- Roster ---
// POST   /api/lol/teams/:teamId/roster           — ajouter un joueur
router.post('/:teamId/roster', requireAuth, requireCanManageRoster, addRosterHandler);

// DELETE /api/lol/teams/:teamId/roster/:rosterId — retirer un joueur
router.delete('/:teamId/roster/:rosterId', requireAuth, requireCanManageRoster, removeRosterHandler);

// --- Membres / rôles ---
// POST   /api/lol/teams/:teamId/members          — ajouter un membre avec rôle
router.post('/:teamId/members', requireAuth, requireCanManageRoles, addMemberHandler);

// PATCH  /api/lol/teams/:teamId/members/:userId  — changer le rôle d'un membre
router.patch('/:teamId/members/:userId', requireAuth, requireCanManageRoles, patchMemberHandler);

// DELETE /api/lol/teams/:teamId/members/:userId  — retirer un membre
router.delete('/:teamId/members/:userId', requireAuth, requireCanManageRoles, removeMemberHandler);

// --- Transfert de propriété ---
// POST /api/lol/teams/:teamId/transfer           — owner strict uniquement
router.post('/:teamId/transfer', requireAuth, requireOwner, transferHandler);

// --- Logo d'équipe ---
// PUT    /api/lol/teams/:teamId/logo  — upload / remplacement (owner | captain | manager)
router.put('/:teamId/logo', requireAuth, requireCanEditTeam, uploadLogoHandler);

// GET    /api/lol/teams/:teamId/logo  — serve le logo (public)
router.get('/:teamId/logo', serveLogoHandler);

// DELETE /api/lol/teams/:teamId/logo  — suppression (owner | captain | manager)
router.delete('/:teamId/logo', requireAuth, requireCanEditTeam, deleteLogoHandler);

// --- Stats joueurs du roster ---
// GET /api/lol/teams/:teamId/player-stats — rang + top champions (auth requise)
router.get('/:teamId/player-stats', requireAuth, playerStatsHandler);

export default router;
