import React from 'react';

import { LolComingSoon } from '../../components/lol/home/LolComingSoon';

/** Recherche Solo (Étape 3) — placeholder dans LolLayout. */
export function LolSearchPage(): React.JSX.Element {
  return (
    <LolComingSoon
      step="Étape 3"
      title="Recherche Solo"
      description="Bientôt : recherche par Riot ID, profil joueur, historique de parties et statistiques globales."
    />
  );
}
