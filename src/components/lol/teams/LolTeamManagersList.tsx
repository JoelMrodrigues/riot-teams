import React from 'react';

import type { LolApiManager } from '../../../types/lolTeam.types';

interface LolTeamManagersListProps {
  managers: LolApiManager[];
}

/**
 * Affiche la liste des managers (owner + captains) d'une équipe LoL.
 * Lecture seule — l'UI d'ajout de capitaine est hors périmètre C2.
 */
export function LolTeamManagersList({ managers }: LolTeamManagersListProps): React.JSX.Element | null {
  if (managers.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-xs uppercase tracking-widest"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        Staff
      </span>
      <div className="flex flex-col gap-1.5">
        {managers.map((m) => (
          <div
            key={m.userId}
            className="flex h-10 items-center gap-3 rounded-sm border px-4"
            style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: m.role === 'owner' ? 'var(--lol-violet-soft)' : 'var(--lol-text-muted)',
              }}
            >
              {m.role === 'owner' ? 'Owner' : 'Captain'}
            </span>
            <span
              className="text-xs"
              style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
            >
              {m.userId}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
