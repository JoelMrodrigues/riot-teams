/**
 * Types API pour les équipes LoL.
 * Reflète les réponses camelCase du backend (GET /api/lol/teams, GET /api/lol/teams/:id).
 * Les corps de requête (snake_case) sont définis dans lolTeamsApi.ts.
 */
import type { LolTeamIcon, LolRegion } from './team.types';

/** Manager d'une équipe — owner ou captain. */
export interface LolApiManager {
  userId: string;
  role: 'owner' | 'captain';
}

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
}

/** Réponse complète de GET /api/lol/teams/:id */
export interface LolApiTeamDetail extends LolApiTeam {
  managers: LolApiManager[];
  roster: LolApiRosterMember[];
}

/** Rôle de l'utilisateur courant sur une équipe — null = non-manager. */
export type LolTeamRole = 'owner' | 'captain' | null;

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
