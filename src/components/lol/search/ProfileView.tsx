import React from 'react';

import { ProfileHeader } from './ProfileHeader';
import { MasteryStrip } from './MasteryStrip';
import { MatchFilters } from './MatchFilters';
import { MatchRow } from './MatchRow';
import { useMatchFilters } from '../../../hooks/useMatchFilters';
import type { LolProfile } from '../../../types/lolApi.types';

interface ProfileViewProps {
  profile: LolProfile;
}

/** Vue profil complète : en-tête + maîtrise + historique filtrable. */
export function ProfileView({ profile }: ProfileViewProps): React.JSX.Element {
  const { filters, setFilter, filtered, champions } = useMatchFilters(profile.matches);

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader profile={profile} />
      <MasteryStrip mastery={profile.mastery} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <MatchFilters filters={filters} setFilter={setFilter} champions={champions} />
        <div className="flex flex-col gap-2">
          {filtered.length > 0 ? (
            filtered.map((m) => <MatchRow key={m.matchId} match={m} />)
          ) : (
            <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>
              Aucune partie ne correspond à ces filtres.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
