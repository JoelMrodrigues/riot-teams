import React from 'react';

import { LolAuroraBackground } from '../../components/lol/home/LolAuroraBackground';
import { LolHero } from '../../components/lol/home/LolHero';
import { LolSoloShowcase } from '../../components/lol/home/LolSoloShowcase';
import { LolTeamShowcase } from '../../components/lol/home/LolTeamShowcase';
import { LolSectionHeading } from '../../components/lol/home/LolSectionHeading';
import { LolFeatureGrid } from '../../components/lol/home/LolFeatureGrid';
import { LolCtaBanner } from '../../components/lol/home/LolCtaBanner';

/** Page d'accueil vitrine de l'écosystème LoL (rendue dans LolLayout). */
export function LolHomePage(): React.JSX.Element {
  return (
    <div className="relative">
      <LolAuroraBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-8 pb-20">
        <LolHero />
        <LolSoloShowcase />
        <LolTeamShowcase />

        <div className="flex flex-col items-center py-12">
          <LolSectionHeading
            eyebrow="Tout-en-un"
            title="Un écosystème pensé pour grimper."
            subtitle="Des outils précis, un design clair, une seule plateforme pour ta progression solo et collective."
            accent="var(--lol-violet)"
            align="center"
          />
          <div className="mt-12 w-full">
            <LolFeatureGrid />
          </div>
        </div>

        <LolCtaBanner />
      </div>
    </div>
  );
}
