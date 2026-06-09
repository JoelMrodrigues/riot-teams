import React from 'react';

import { RiotIdSearch } from '../../components/lol/search/RiotIdSearch';
import { ProfileView } from '../../components/lol/search/ProfileView';
import { useLolProfile } from '../../hooks/useLolProfile';

/** Recherche Solo (Étape 3) : Riot ID -> profil complet via le proxy du site. */
export function LolSearchPage(): React.JSX.Element {
  const { profile, loading, error, search } = useLolProfile();

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-12">
      <div className="mb-8 flex flex-col items-start gap-3">
        <h1 className="text-3xl font-bold md:text-4xl" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
          Recherche de joueur
        </h1>
        <p className="text-sm" style={{ color: 'var(--lol-text-muted)' }}>
          Entre un Riot ID (pseudo#tag) pour voir rang, historique et maîtrise.
        </p>
        <RiotIdSearch onSearch={search} loading={loading} />
      </div>

      {error && (
        <p className="mb-6 rounded-md px-4 py-3 text-sm" style={{ background: 'var(--danger-muted)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
          {error}
        </p>
      )}

      {loading && <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>Chargement du profil…</p>}

      {!loading && profile && <ProfileView profile={profile} />}
    </div>
  );
}
