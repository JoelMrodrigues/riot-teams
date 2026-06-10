// Types partagés du module équipes LoL.
// Utilisés par les handlers, le middleware teamAuth et les schémas de validation.

/** Rôles possibles d'un membre d'équipe. */
export type MemberRole = 'owner' | 'captain' | 'manager' | 'coach' | 'staff' | 'player';

/** Ligne brute de la table lol_teams. */
export interface TeamRow {
  id: string;
  owner_id: string;
  name: string;
  tag: string | null;
  region: string | null;
  accent_color: string | null;
  description: string | null;
  icon_kind: string | null;
  icon_value: string | null;
  created_at: Date;
  updated_at: Date;
}

/** Ligne brute de la table lol_team_members. */
export interface MemberRow {
  team_id: string;
  user_id: string;
  role: MemberRole;
  created_at: Date;
  updated_at: Date;
}

/** Ligne brute de la table lol_rosters. */
export interface RosterRow {
  id: string;
  team_id: string;
  user_id: string | null;
  game_name: string;
  tag_line: string;
  puuid: string | null;
  role_in_game: string | null;
  display_name: string | null;
  region: string | null;
  secondary_game_name: string | null;
  secondary_tag_line: string | null;
  is_substitute: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Rôle effectif de l'utilisateur courant sur une équipe.
 * 'none' = authentifié mais aucun lien de membre.
 * null  = non authentifié (pour GET public).
 */
export type TeamRole = MemberRole | 'none' | null;

/** Représentation publique d'un membre (avec pseudo via JOIN profiles). */
export interface MemberPublic {
  userId: string;
  pseudo: string;
  role: MemberRole;
}

/** Représentation publique d'une entrée roster. */
export interface RosterPublic {
  id: string;
  gameName: string;
  tagLine: string;
  puuid: string | null;
  roleInGame: string | null;
  displayName: string | null;
  region: string | null;
  secondaryGameName: string | null;
  secondaryTagLine: string | null;
  isSubstitute: boolean;
  userId: string | null;
  addedAt: string;
}

/** Ligne brute de la table lol_team_logos. */
export interface LogoRow {
  team_id: string;
  mime: string;
  data: Buffer;
  updated_at: Date;
}

/** Top champion agrégé sur les dernières parties d'un joueur. */
export interface TopChampionStat {
  champion: string;
  championId: number;
  games: number;
  winrate: number;
  kda: number;
}

/** Stats d'un joueur du roster calculées depuis l'API Riot. */
export interface PlayerTeamStats {
  gameName: string;
  tagLine: string;
  rank: import('../profile/profileTypes.js').RankInfo | null;
  topChampions: TopChampionStat[];
}

/** Entrée dans la réponse du endpoint player-stats (avec gestion d'erreur par joueur). */
export interface PlayerStatsEntry {
  rosterId: string;
  gameName: string;
  tagLine: string;
  rank: import('../profile/profileTypes.js').RankInfo | null;
  topChampions: TopChampionStat[];
  error?: string;
}

/** Réponse détail équipe renvoyée au client. */
export interface TeamDetailResponse {
  id: string;
  name: string;
  tag: string | null;
  region: string | null;
  accentColor: string | null;
  description: string | null;
  icon: { kind: string; value: string } | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members: MemberPublic[];
  roster: RosterPublic[];
  /** Rôle de l'utilisateur courant sur l'équipe. null si non authentifié. */
  myRole: TeamRole;
}
