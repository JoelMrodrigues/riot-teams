import React from 'react';

import { LolComingSoon } from '../../components/lol/home/LolComingSoon';

/** Gestion Équipe (Étape 4) — placeholder dans LolLayout. */
export function LolTeamsHomePage(): React.JSX.Element {
  return (
    <LolComingSoon
      step="Étape 4"
      title="Gestion Équipe"
      description="Bientôt : création d'équipe (Scrim / Flex / Fun), dashboard SoloQ des joueurs et historique des scrims."
    />
  );
}
