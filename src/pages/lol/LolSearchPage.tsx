import React from 'react';

import { PlayerSearchInput } from '../../components/lol/search/PlayerSearchInput';
import { PlayerResults } from '../../components/lol/search/PlayerResults';
import { useLolPlayer } from '../../hooks/useLolPlayer';

/** Recherche Solo (Étape 3) : barre Riot ID + profil, stats et historique filtrable. */
export function LolSearchPage(): React.JSX.Element {
  const { profile, loading, error, search } = useLolPlayer();

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-12">
      <div className="mb-8 flex flex-col items-start gap-3">
        <h1 className="text-3xl font-bold md:text-4xl" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
          Recherche de joueur
        </h1>
        <p className="text-sm" style={{ color: 'var(--lol-text-muted)' }}>
          Entre un Riot ID (pseudo#tag) pour voir le rang, les stats et l'historique de parties.
        </p>
        <PlayerSearchInput onSearch={(id) => search(id)} loading={loading} />
      </div>

      {error && (
        <p className="mb-6 rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(244,63,94,0.12)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}>
          {error}
        </p>
      )}

      {loading && (
        <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>Chargement du profil…</p>
      )}

      {!loading && profile && <PlayerResults profile={profile} />}
    </div>
  );
}
