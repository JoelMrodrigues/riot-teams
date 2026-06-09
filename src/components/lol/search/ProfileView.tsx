import React, { useState } from 'react';

import { ProfileHeader } from './ProfileHeader';
import { MasteryStrip } from './MasteryStrip';
import { MatchFilters } from './MatchFilters';
import { MatchRow } from './MatchRow';
import { TopChampionsModal } from './TopChampionsModal';
import { MatchDetailModal } from './MatchDetailModal';
import { useMatchFilters } from '../../../hooks/useMatchFilters';
import type { LolProfile, MatchInfo } from '../../../types/lolApi.types';

interface ProfileViewProps {
  profile: LolProfile;
}

/** Vue profil complète : en-tête + maîtrise + historique filtrable + modals. */
export function ProfileView({ profile }: ProfileViewProps): React.JSX.Element {
  const { filters, setFilter, filtered, champions } = useMatchFilters(profile.matches);
  const [topChampionsOpen, setTopChampionsOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchInfo | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader profile={profile} />

      <MasteryStrip
        mastery={profile.mastery}
        onTopChampionsClick={() => setTopChampionsOpen(true)}
      />

      <div className="flex flex-col gap-3">
        <MatchFilters filters={filters} setFilter={setFilter} champions={champions} />

        <div className="flex flex-col gap-2">
          {filtered.length > 0 ? (
            filtered.map((m) => (
              <MatchRow key={m.matchId} match={m} onClick={setSelectedMatch} />
            ))
          ) : (
            <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>
              Aucune partie ne correspond à ces filtres.
            </p>
          )}
        </div>
      </div>

      <TopChampionsModal
        isOpen={topChampionsOpen}
        onClose={() => setTopChampionsOpen(false)}
        matches={profile.matches}
      />

      <MatchDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
      />
    </div>
  );
}
