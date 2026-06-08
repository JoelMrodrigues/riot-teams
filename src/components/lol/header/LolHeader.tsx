import React from 'react';
import { Link } from 'react-router-dom';

import { LolNavLinks } from './LolNavLinks';
import { ThemeToggle } from '../../layout/ThemeToggle';

/** Header dédié à l'écosystème LoL : retour accueil global + nav + thème. */
export function LolHeader(): React.JSX.Element {
  return (
    <header
      className="relative z-50 flex items-center justify-between px-8 flex-shrink-0"
      style={{
        height: '60px',
        borderBottom: '1px solid var(--lol-border)',
        background: 'var(--lol-header)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Gauche — logo + retour multi-jeux */}
      <Link to="/" className="flex items-center gap-3 w-48 group">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-50 group-hover:opacity-90 transition-opacity">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--lol-violet-strong), var(--lol-violet-soft))' }}
        >
          <span className="text-white font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '8px' }}>
            RT
          </span>
        </div>
        <span
          className="text-sm font-bold tracking-widest uppercase"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)' }}
        >
          League
        </span>
      </Link>

      {/* Centre — navigation */}
      <LolNavLinks />

      {/* Droite — thème + auth */}
      <div className="flex items-center justify-end gap-3 w-48">
        <ThemeToggle />
        <button className="btn btn-ghost btn-sm">Sign In</button>
      </div>
    </header>
  );
}
