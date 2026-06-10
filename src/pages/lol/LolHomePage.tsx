import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LolSearchHero } from '../../components/lol/home/LolSearchHero';
import { LolQuickAccess } from '../../components/lol/home/LolQuickAccess';
import { LolMyTeamsPreview } from '../../components/lol/home/LolMyTeamsPreview';
import { LolRecentSearches } from '../../components/lol/home/LolRecentSearches';
import { LolUpcomingBanner } from '../../components/lol/home/LolUpcomingBanner';
import { LolLeaderboard } from '../../components/lol/leaderboard/LolLeaderboard';
import { LolCreateTeamModal } from '../../components/lol/teams/LolCreateTeamModal';
import { useLolTeams } from '../../hooks/useLolTeams';
import { useRecentSearches } from '../../hooks/useRecentSearches';
import { useLolLeaderboard } from '../../hooks/useLolLeaderboard';
import { LOL_ACCENTS } from '../../constants/lolTheme';
import type { RecentSearch } from '../../hooks/useRecentSearches';
import type { LolCreateTeamBody } from '../../types/lolTeam.types';

/**
 * Hub LoL — conteneur/layout uniquement.
 * LolMyTeamsPreview gère elle-même l'état auth/chargement via useLolTeams.
 */
export function LolHomePage(): React.JSX.Element {
  const navigate = useNavigate();
  const { createTeam } = useLolTeams();
  const { searches, addSearch, clearAll } = useRecentSearches();
  const { entries: leaderboard } = useLolLeaderboard();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSearch = (riotId: string, tagLine: string): void => {
    addSearch(riotId, tagLine);
  };

  const handleSelectRecent = (s: RecentSearch): void => {
    addSearch(s.gameName, s.tagLine);
    const encoded = encodeURIComponent(`${s.gameName}#${s.tagLine}`);
    navigate(`/lol/search?riotId=${encoded}`);
  };

  const handleCreateTeam = async (body: LolCreateTeamBody): Promise<void> => {
    const created = await createTeam(body);
    setIsCreateOpen(false);
    navigate(`/lol/team/${created.id}`);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 pb-8 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <LolSearchHero onSearch={handleSearch} />
          <LolQuickAccess />
          <LolMyTeamsPreview onCreate={() => setIsCreateOpen(true)} />
          <LolRecentSearches
            searches={searches}
            onSelect={handleSelectRecent}
            onClear={clearAll}
          />
          <LolLeaderboard
            entries={leaderboard}
            accent={LOL_ACCENTS.stats.color}
            title="Classement Challenger · EUW"
          />
          <LolUpcomingBanner />
        </div>
      </div>

      <LolCreateTeamModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateTeam}
      />
    </>
  );
}
