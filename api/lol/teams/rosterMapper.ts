// Conversion RosterRow (DB) → RosterPublic (réponse API). Centralisé pour éviter
// la duplication entre addRosterHandler et getTeamHandler.

import type { RosterRow, RosterPublic } from './types.js';

export function toRosterPublic(r: RosterRow): RosterPublic {
  return {
    id: r.id,
    gameName: r.game_name,
    tagLine: r.tag_line,
    puuid: r.puuid,
    roleInGame: r.role_in_game,
    displayName: r.display_name,
    region: r.region,
    secondaryGameName: r.secondary_game_name,
    secondaryTagLine: r.secondary_tag_line,
    isSubstitute: r.is_substitute,
    userId: r.user_id,
    addedAt: r.created_at.toISOString(),
  };
}
