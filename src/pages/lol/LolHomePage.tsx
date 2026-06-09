import React from 'react';
import { useNavigate } from 'react-router-dom';

import { LolSearchHero } from '../../components/lol/home/LolSearchHero';
import { LolQuickAccess } from '../../components/lol/home/LolQuickAccess';
import { LolMyTeamsPreview } from '../../components/lol/home/LolMyTeamsPreview';
import { LolRecentSearches } from '../../components/lol/home/LolRecentSearches';
import { LolUpcomingBanner } from '../../components/lol/home/LolUpcomingBanner';
import { useTeams } from '../../hooks/useTeams';
import { useRecentSearches } from '../../hooks/useRecentSearches';
import type { RecentSearch } from '../../hooks/useRecentSearches';

/**
 * Hub LoL — conteneur/layout uniquement.
 * Compose les 5 zones (A→E) définies dans docs/lol-accueil-spec.md.
 */
export function LolHomePage(): React.JSX.Element {
  const navigate = useNavigate();
  const { teams } = useTeams();
  const { searches, addSearch, clearAll } = useRecentSearches();

  const lolTeams = teams.filter((t) => t.game === 'lol');

  const handleSearch = (riotId: string, tagLine: string): void => {
    addSearch(riotId, tagLine);
  };

  const handleSelectRecent = (s: RecentSearch): void => {
    addSearch(s.riotId, s.tagLine);
    const encoded = encodeURIComponent(`${s.riotId}#${s.tagLine}`);
    navigate(`/lol/search?riotId=${encoded}`);
  };

  const handleCreateTeam = (): void => {
    navigate('/lol/teams');
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-8 md:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <LolSearchHero onSearch={handleSearch} />
        <LolQuickAccess />
        <LolMyTeamsPreview teams={lolTeams} onCreate={handleCreateTeam} />
        <LolRecentSearches
          searches={searches}
          onSelect={handleSelectRecent}
          onClear={clearAll}
        />
        <LolUpcomingBanner />
      </div>
    </div>
  );
}
