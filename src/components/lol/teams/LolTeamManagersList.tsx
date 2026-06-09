/**
 * Liste des membres de l'équipe (tous rôles : owner → player).
 * Affiche pseudo + badge de rôle en lecture seule.
 * L'UI d'attribution / modification de rôle est réservée au Lot E2.
 */
import React from 'react';

import { roleLabelFr } from '../../../utils/lolTeamRole';
import type { LolApiMember, LolTeamRole } from '../../../types/lolTeam.types';

interface LolTeamMembersListProps {
  members: LolApiMember[];
}

/** Couleur d'accent du badge selon le rôle. */
function badgeColor(role: LolTeamRole): string {
  switch (role) {
    case 'owner':   return 'var(--lol-violet-strong)';
    case 'captain': return 'var(--lol-violet-soft)';
    case 'manager': return 'var(--brand-soft)';
    case 'coach':   return 'var(--lol-accent)';
    default:        return 'var(--text-muted)';
  }
}

export function LolTeamManagersList({ members }: LolTeamMembersListProps): React.JSX.Element | null {
  if (members.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-xs uppercase tracking-widest"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        Membres
      </span>
      <div className="flex flex-col gap-1.5">
        {members.map((m) => (
          <div
            key={m.userId}
            className="flex h-10 items-center gap-3 rounded-sm border px-4"
            style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}
          >
            <span
              className="w-24 flex-shrink-0 text-xs font-bold uppercase tracking-widest"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: badgeColor(m.role),
              }}
            >
              {roleLabelFr(m.role)}
            </span>
            <span
              className="truncate text-sm"
              style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text)' }}
            >
              {m.pseudo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
