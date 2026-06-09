import React from 'react';

import { LolFeatureIcon } from './LolFeatureIcon';

interface LolMyTeamsEmptyStateProps {
  onCreate: () => void;
}

/**
 * État vide de la zone "Mes équipes LoL".
 * Compact (max ~120px), centré, icône monochrome muted.
 */
export function LolMyTeamsEmptyState({ onCreate }: LolMyTeamsEmptyStateProps): React.JSX.Element {
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-md p-8 text-center"
      style={{
        background: 'var(--lol-surface)',
        border: '1px solid var(--lol-border)',
      }}
    >
      <span style={{ color: 'var(--lol-text-muted)' }}>
        <LolFeatureIcon icon="team" />
      </span>

      <p
        className="text-sm font-bold"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
      >
        Aucune équipe LoL
      </p>

      <p className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>
        Crée ton premier roster pour commencer.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="btn btn-ghost btn-sm mt-1"
      >
        Créer une équipe →
      </button>
    </div>
  );
}
