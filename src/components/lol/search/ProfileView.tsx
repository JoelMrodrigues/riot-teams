import React, { useState } from 'react';

import { ProfileHeader } from './ProfileHeader';
import { RankCard } from './RankCard';
import { RecentChampionsCard } from './RecentChampionsCard';
import { MasteryCard } from './MasteryCard';
import { WinrateLast7Card } from './WinrateLast7Card';
import { MatchFilters } from './MatchFilters';
import { LolMatchHistory } from './LolMatchHistory';
import { TopChampionsModal } from './TopChampionsModal';
import { useMatchFilters } from '../../../hooks/useMatchFilters';
import type { LolProfile } from '../../../types/lolApi.types';
import type { MatchDetail } from '../../../types/lolMatchDetail.types';

interface ProfileViewProps {
  profile: LolProfile;
  /** Chargeur de détail de match injectable (mock en sandbox). */
  loadDetail?: (matchId: string) => Promise<MatchDetail>;
}

/**
 * Vue profil LoL — layout 2 colonnes (lg) / 1 colonne (mobile) :
 * - Gauche (320 px) : classement, champions récents, maîtrise, winrate 7j.
 * - Droite : historique filtrable des 20 dernières parties.
 */
export function ProfileView({ profile, loadDetail }: ProfileViewProps): React.JSX.Element {
  const { filters, setFilter, filtered, champions } = useMatchFilters(profile.matches);
  const [topChampionsOpen, setTopChampionsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* En-tête pleine largeur */}
      <ProfileHeader profile={profile} />

      {/* Grille principale */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">

        {/* ── Colonne gauche : stats ── */}
        <aside className="flex flex-col gap-4">
          <RankCard ranks={profile.ranks} />
          <RecentChampionsCard
            matches={profile.matches}
            onShowMore={() => setTopChampionsOpen(true)}
          />
          <MasteryCard mastery={profile.mastery} />
          <WinrateLast7Card matches={profile.matches} />
        </aside>

        {/* ── Colonne droite : historique ── */}
        <section className="flex flex-col gap-3" aria-label="Parties récentes">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--lol-text-muted)' }}
          >
            Parties récentes
            <span className="ml-2 normal-case font-normal" style={{ color: 'var(--lol-text-muted)' }}>
              ({profile.matches.length} chargées)
            </span>
          </p>

          <MatchFilters filters={filters} setFilter={setFilter} champions={champions} />

          <LolMatchHistory matches={filtered} loadDetail={loadDetail} />
        </section>
      </div>

      <TopChampionsModal
        isOpen={topChampionsOpen}
        onClose={() => setTopChampionsOpen(false)}
        matches={profile.matches}
      />
    </div>
  );
}
