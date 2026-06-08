import React from 'react';

import { MatchRow } from './MatchRow';
import type { MatchSummary } from '../../../types/lolPlayer.types';

interface MatchListProps {
  matches: MatchSummary[];
}

/** Liste filtrée des parties (ou message si aucune). */
export function MatchList({ matches }: MatchListProps): React.JSX.Element {
  if (matches.length === 0) {
    return (
      <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>
        Aucune partie ne correspond à ces filtres.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {matches.map((m) => <MatchRow key={m.matchId} match={m} />)}
    </div>
  );
}
