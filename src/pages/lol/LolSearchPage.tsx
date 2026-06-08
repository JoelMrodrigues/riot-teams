import React from 'react';

import { RiotIdSearch } from '../../components/lol/search/RiotIdSearch';
import { SummonerCard } from '../../components/lol/search/SummonerCard';
import { useSummonerSearch } from '../../hooks/useSummonerSearch';

/** Recherche Solo (Étape 3) : Riot ID -> profil via le proxy du site. */
export function LolSearchPage(): React.JSX.Element {
  const { profile, label, loading, error, search } = useSummonerSearch();

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-12">
      <div className="mb-8 flex flex-col items-start gap-3">
        <h1 className="text-3xl font-bold md:text-4xl" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
          Recherche de joueur
        </h1>
        <p className="text-sm" style={{ color: 'var(--lol-text-muted)' }}>
          Entre un Riot ID (pseudo#tag) pour récupérer le profil d'invocateur.
        </p>
        <RiotIdSearch onSearch={search} loading={loading} />
      </div>

      {error && (
        <p className="mb-6 rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(244,63,94,0.12)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}>
          {error}
        </p>
      )}

      {loading && <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>Chargement…</p>}

      {!loading && profile && <SummonerCard profile={profile} label={label} />}
    </div>
  );
}
