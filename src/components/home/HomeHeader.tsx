import React from 'react';
import { Link } from 'react-router-dom';

import { SwirlBackground } from './SwirlBackground';
import { BrandLogo } from '../layout/BrandLogo';
import { HeaderActions } from '../layout/HeaderActions';

/**
 * En-tête fixe de l'accueil : fond « swirl » de marque, logo + nom void.pro
 * en grand au centre, actions (connexion / thème) à droite.
 */
export function HomeHeader(): React.JSX.Element {
  return (
    <header
      className="sticky top-0 z-50 flex-shrink-0 border-b"
      style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-base)' }}
    >
      <SwirlBackground className="absolute inset-0" />

      <div className="relative z-10 flex items-center justify-end px-4 py-4 sm:px-8">
        <Link
          to="/"
          aria-label="Accueil void.pro"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3"
        >
          <BrandLogo size={34} radius="md" gradient="linear-gradient(135deg, #7C3AED, #A78BFA)" />
          <span
            className="text-2xl font-bold uppercase tracking-[0.18em] sm:text-3xl"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', textShadow: '0 2px 18px rgba(0,0,0,0.5)' }}
          >
            void.pro
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <HeaderActions buttonSize="md" />
        </div>
      </div>
    </header>
  );
}
