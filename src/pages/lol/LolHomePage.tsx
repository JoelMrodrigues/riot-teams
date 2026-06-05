import React from 'react';

import { LolHero } from '../../components/lol/home/LolHero';
import { LolFeatureGrid } from '../../components/lol/home/LolFeatureGrid';

/** Page d'accueil vitrine de l'écosystème LoL (rendue dans LolLayout). */
export function LolHomePage(): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-6xl px-8 pb-20">
      <LolHero />
      <LolFeatureGrid />
    </div>
  );
}
