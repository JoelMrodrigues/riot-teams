import React from 'react';

import { HomeHeader } from '../components/home/HomeHeader';
import { HeroSection } from '../components/home/HeroSection';
import { HomeSummary } from '../components/home/HomeSummary';
import { HomeGameSection } from '../components/home/HomeGameSection';
import { HomeOutro } from '../components/home/HomeOutro';
import { SwirlBackground } from '../components/home/SwirlBackground';
import { HOME_GAME_SECTIONS } from '../data/homeSections.data';

/**
 * Accueil « exploration » : header fixe (logo + swirl) → 3 cartes de jeu →
 * sections à découvrir au scroll (résumé, jeux, mot de fin).
 */
export function HomePage(): React.JSX.Element {
  return (
    <div className="relative h-full w-full overflow-y-auto" style={{ background: 'var(--bg-base)' }}>
      {/* Fil conducteur swirl, très discret, derrière tout le contenu. */}
      <SwirlBackground className="fixed inset-0 opacity-[0.05]" />

      <div className="relative z-10 flex min-h-full flex-col">
        <HomeHeader />

        {/* Hero : les 3 cartes occupent ~tout l'écran sous le header fixe.
            Hauteur DÉFINIE (pas min-h) pour que le `h-full` des cartes se résolve. */}
        <section className="relative h-[calc(100vh-72px)] min-h-[440px] w-full flex-shrink-0">
          <HeroSection />
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1">
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'rgba(255,255,255,0.7)' }}
            >
              En savoir plus
            </span>
            <span className="animate-bounce text-lg leading-none text-white/70" aria-hidden>↓</span>
          </div>
        </section>

        <HomeSummary />
        {HOME_GAME_SECTIONS.map((g) => (
          <HomeGameSection key={g.id} data={g} />
        ))}
        <HomeOutro />
      </div>
    </div>
  );
}
