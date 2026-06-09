import React from 'react';
import { useNavigate } from 'react-router-dom';

import { BrandLogo } from '../layout/BrandLogo';
import { HeaderActions } from '../layout/HeaderActions';

/** Barre supérieure de la page Équipes : retour accueil + marque + actions. */
export function TeamsHeader(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <header
      className="relative z-50 flex items-center justify-between px-8 flex-shrink-0"
      style={{
        height: '60px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="btn btn-text btn-sm flex items-center gap-2"
        >
          <BrandLogo size={24} />
          <span
            className="font-semibold tracking-wider uppercase"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', fontSize: '0.85rem' }}
          >
            void.pro
          </span>
        </button>

        <span style={{ color: 'var(--border-strong)', fontSize: '0.6rem' }}>|</span>

        <span
          className="text-sm font-semibold tracking-wider uppercase"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-muted)' }}
        >
          Équipes
        </span>
      </div>

      <div className="flex items-center gap-3">
        <HeaderActions />
      </div>
    </header>
  );
}
