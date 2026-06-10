import React from 'react';
import { Link } from 'react-router-dom';

import { LolNavLinks } from './LolNavLinks';
import { BrandLogo } from '../../layout/BrandLogo';
import { HeaderActions } from '../../layout/HeaderActions';
import { isDemoMode } from '../../../utils/demoMode';

/**
 * Header dédié à l'écosystème LoL : retour accueil global + nav + thème.
 * Responsive : sur mobile la nav passe en barre horizontale scrollable
 * sous la barre principale (logo + actions restent sur une ligne).
 */
export function LolHeader(): React.JSX.Element {
  const barStyle: React.CSSProperties = {
    borderBottom: '1px solid var(--lol-border)',
    background: 'var(--lol-header)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  };

  return (
    <div className="relative z-50 flex-shrink-0">
      <header
        className="flex items-center justify-between gap-2 px-4 sm:px-6 lg:px-8"
        style={{ height: '60px', ...barStyle }}
      >
        {/* Gauche — logo + retour multi-jeux */}
        <Link to="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 opacity-50 transition-opacity group-hover:opacity-90">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <BrandLogo
            size={24}
            radius="md"
            gradient="linear-gradient(135deg, var(--lol-violet-strong), var(--lol-violet-soft))"
          />
          <span
            className="hidden text-sm font-bold uppercase tracking-widest sm:inline"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)' }}
          >
            League
          </span>
        </Link>

        {/* Centre — navigation (desktop) */}
        <div className="hidden md:flex md:h-full">
          <LolNavLinks />
        </div>

        {/* Droite — thème + auth */}
        <div className="flex flex-shrink-0 items-center justify-end gap-2 sm:gap-3">
          {isDemoMode() && (
            <span
              className="hidden rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest sm:inline"
              style={{ fontFamily: 'Rajdhani, sans-serif', background: 'var(--lol-surface)', border: '1px solid var(--lol-border)', color: 'var(--lol-violet-soft)' }}
              title="Données fictives — aucun serveur"
            >
              Démo
            </span>
          )}
          <HeaderActions />
        </div>
      </header>

      {/* Navigation mobile — barre scrollable sous le header */}
      <div className="md:hidden" style={barStyle}>
        <LolNavLinks mobile />
      </div>
    </div>
  );
}
