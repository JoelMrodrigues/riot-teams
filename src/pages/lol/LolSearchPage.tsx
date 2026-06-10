import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

import { RiotIdSearch } from '../../components/lol/search/RiotIdSearch';
import { ProfileView } from '../../components/lol/search/ProfileView';
import { LolProfileSkeleton } from '../../components/lol/search/LolProfileSkeleton';
import { LolSearchEmptyState } from '../../components/lol/search/LolSearchEmptyState';
import { useLolProfile } from '../../hooks/useLolProfile';
import { useRecentSearches } from '../../hooks/useRecentSearches';
import { parseRiotId } from '../../utils/riotId';

/**
 * Page Solo — recherche Riot ID → profil complet via proxy.
 * Gère 4 états : vide / loading (skeleton) / erreur / profil chargé.
 * Lance la recherche automatiquement depuis ?riotId= (hub ou redirect).
 */
export function LolSearchPage(): React.JSX.Element {
  const { profile, loading, error, search } = useLolProfile();
  const { searches, addSearch, clearAll } = useRecentSearches();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const riotId = searchParams.get('riotId');
    if (riotId) void search(riotId);
    // Rejoue uniquement si le paramètre change (navigation hub / redirect).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (input: string): void => {
    const parsed = parseRiotId(input);
    if (parsed) addSearch(parsed.gameName, parsed.tagLine);
    void search(input);
  };

  const handleSelectRecent = (s: { gameName: string; tagLine: string }): void => {
    addSearch(s.gameName, s.tagLine);
    void search(`${s.gameName}#${s.tagLine}`);
  };

  const isIdle = !loading && !error && !profile;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      {/* En-tête : retour hub + barre de recherche */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/lol"
            className="text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-150"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--lol-violet-soft)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--lol-text-muted)'; }}
          >
            ← Hub LoL
          </Link>
          <span style={{ color: 'var(--lol-border)' }}>/</span>
          <span
            className="text-xs font-bold uppercase tracking-[0.12em]"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)' }}
          >
            Solo
          </span>
        </div>
        <RiotIdSearch onSearch={handleSearch} loading={loading} />
      </div>

      {/* État erreur */}
      {error && !loading && (
        <div
          className="mb-6 rounded-md px-4 py-3 text-sm"
          role="alert"
          style={{
            background: 'var(--danger-muted)',
            color: 'var(--danger)',
            border: '1px solid var(--danger)',
          }}
        >
          {error}
        </div>
      )}

      {/* État chargement — skeleton */}
      {loading && <LolProfileSkeleton />}

      {/* État vide — invite + recherches récentes */}
      {isIdle && (
        <LolSearchEmptyState
          searches={searches}
          onSelectRecent={handleSelectRecent}
          onClearRecent={clearAll}
        />
      )}

      {/* État profil chargé */}
      {!loading && !error && profile && <ProfileView profile={profile} />}
    </div>
  );
}
