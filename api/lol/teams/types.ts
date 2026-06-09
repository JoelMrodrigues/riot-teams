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
  userId: string | null;
  addedAt: string;
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
