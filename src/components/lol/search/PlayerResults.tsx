import React from 'react';

import { PlayerHeader } from './PlayerHeader';
import { MatchFilters } from './MatchFilters';
import { MatchList } from './MatchList';
import { useMatchFilters } from '../../../hooks/useMatchFilters';
import type { PlayerProfile } from '../../../types/lolPlayer.types';

interface PlayerResultsProps {
  profile: PlayerProfile;
}

/** Vue résultats complète : en-tête joueur + filtres + historique. */
export function PlayerResults({ profile }: PlayerResultsProps): React.JSX.Element {
  const { filters, setFilter, filtered, champions } = useMatchFilters(profile.matches);

  return (
    <div className="flex flex-col gap-6">
      <PlayerHeader profile={profile} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <MatchFilters filters={filters} setFilter={setFilter} champions={champions} />
        <MatchList matches={filtered} />
      </div>
    </div>
  );
}
