/**
 * Types API pour les équipes LoL.
 * Reflète les réponses camelCase du backend (GET /api/lol/teams, GET /api/lol/teams/:id).
 * Les corps de requête (snake_case) sont définis dans lolTeamsApi.ts.
 */
import type { LolTeamIcon, LolRegion } from './team.types';

/**
 * Membre de l'équipe côté gestion (liste `members` du détail).
 * role : owner | captain | manager | coach | staff | player
 */
export interface LolApiMember {
  userId: string;
  pseudo: string;
  role: LolTeamRole;
}

/**
 * @deprecated Utiliser LolApiMember — conservé le temps de la migration E1.
 */
export type LolApiManager = LolApiMember;

/** Membre du roster d'une équipe. */
export interface LolApiRosterMember {
  id: string;
  gameName: string;
  tagLine: string;
  puuid: string | null;
  roleInGame: string | null;
  userId: string | null;
  addedAt: string;
}

/** Équipe LoL telle que renvoyée par l'API (liste ou détail). */
export interface LolApiTeam {
  id: string;
  name: string;
  tag: string | null;
  region: LolRegion | null;
  accentColor: string | null;
  description: string | null;
  icon: LolTeamIcon | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  /** Rôle de l'utilisateur courant sur cette équipe (présent dans GET /api/lol/teams). */
  myRole?: LolTeamRole;
}

/** Réponse complète de GET /api/lol/teams/:id */
export interface LolApiTeamDetail extends LolApiTeam {
  members: LolApiMember[];
  roster: LolApiRosterMember[];
}

/**
 * Rôle de l'utilisateur courant sur une équipe.
 * null = non-membre ou non-connecté.
 */
export type LolTeamRole =
  | 'owner'
  | 'captain'
  | 'manager'
  | 'coach'
  | 'staff'
  | 'player'
  | null;

/** Corps de POST /api/lol/teams (snake_case, envoyé au backend). */
export interface LolCreateTeamBody {
  name: string;
  tag?: string;
  region?: LolRegion;
  accent_color?: string;
  description?: string;
  icon?: LolTeamIcon;
}

/** Corps de PATCH /api/lol/teams/:id (tous les champs optionnels). */
export interface LolUpdateTeamBody {
  name?: string;
  tag?: string;
  region?: LolRegion;
  accent_color?: string;
  description?: string;
  icon?: LolTeamIcon;
}

/** Corps de POST /api/lol/teams/:id/roster (snake_case). */
export interface LolAddRosterMemberBody {
  game_name: string;
  tag_line: string;
  role_in_game?: string;
  user_id?: string;
}

/**
 * Rôles attribuables manuellement (owner exclu — il est propriétaire ;
 * player exclu — il vient du roster automatiquement).
 */
export type LolAssignableRole = 'captain' | 'manager' | 'coach' | 'staff';

/** Corps de POST /api/lol/teams/:id/members (snake_case). */
export interface LolAddMemberBody {
  user_id: string;
  role: LolAssignableRole;
}

/** Corps de PATCH /api/lol/teams/:id/members/:userId (snake_case). */
export interface LolUpdateMemberRoleBody {
  role: LolAssignableRole;
}

/** Corps de POST /api/lol/teams/:id/transfer (snake_case). */
export interface LolTransferOwnershipBody {
  user_id: string;
}

/** Résultat d'un utilisateur renvoyé par GET /api/users/search. */
export interface UserSearchResult {
  id: string;
  pseudo: string;
  riotId: string | null;
}

// Re-export pour compatibilité (player stats + logo dans leur propre fichier).
export type {
  LolPlayerRank,
  LolTopChampion,
  LolPlayerStat,
  LolPlayerStatsResponse,
  LolTeamLogoBody,
} from './lolPlayerStats.types';
