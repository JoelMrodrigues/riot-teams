import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { RiotIdSearch } from '../../components/lol/search/RiotIdSearch';
import { ProfileView } from '../../components/lol/search/ProfileView';
import { useLolProfile } from '../../hooks/useLolProfile';

/**
 * Recherche Solo : Riot ID -> profil complet via le proxy.
 * Si le query param `riotId` est présent (venant du hub), lance la recherche automatiquement.
 */
export function LolSearchPage(): React.JSX.Element {
  const { profile, loading, error, search } = useLolProfile();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const riotId = searchParams.get('riotId');
    if (riotId) {
      void search(riotId);
    }
    // On ne rejoue que si le param change (navigation depuis le hub).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-12">
      <div className="mb-8 flex flex-col items-start gap-3">
        <h1
          className="text-3xl font-bold md:text-4xl"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
        >
          Recherche de joueur
        </h1>
        <p className="text-sm" style={{ color: 'var(--lol-text-muted)' }}>
          Entre un Riot ID (pseudo#tag) pour voir rang, historique et maîtrise.
        </p>
        <RiotIdSearch onSearch={search} loading={loading} />
      </div>

      {error && (
        <p
          className="mb-6 rounded-md px-4 py-3 text-sm"
          style={{
            background: 'var(--danger-muted)',
            color: 'var(--danger)',
            border: '1px solid var(--danger)',
          }}
        >
          {error}
        </p>
      )}

      {loading && (
        <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>
          Chargement du profil…
        </p>
      )}

      {!loading && profile && <ProfileView profile={profile} />}
    </div>
  );
}
