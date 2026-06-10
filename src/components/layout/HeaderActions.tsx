// Cluster d'actions à droite des headers : bascule de thème + auth.
// Affiche le pseudo + bouton Déconnexion si authentifié, sinon le bouton Sign In.

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

interface HeaderActionsProps {
  /** Taille du bouton Sign In / Déconnexion : `sm` (défaut) ou `md`. */
  buttonSize?: 'sm' | 'md';
}

export function HeaderActions({ buttonSize = 'sm' }: HeaderActionsProps): React.JSX.Element {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  const btnClass = buttonSize === 'md' ? 'btn btn-ghost btn-md' : 'btn btn-ghost btn-sm';

  // Pendant la réhydratation : espace réservé silencieux (évite le flash Sign In).
  if (status === 'loading') {
    return (
      <>
        <ThemeToggle />
        <div className="w-16 h-7 rounded-sm animate-pulse" style={{ background: 'var(--bg-elevated)' }} />
      </>
    );
  }

  if (status === 'authenticated' && user) {
    return (
      <>
        <ThemeToggle />
        <span
          className="text-xs font-semibold uppercase tracking-widest hidden sm:block"
          style={{ color: 'var(--text-secondary)', fontFamily: 'Rajdhani, sans-serif' }}
          title={user.email}
        >
          {user.pseudo}
        </span>
        <button
          className={btnClass}
          onClick={logout}
          aria-label="Se déconnecter"
        >
          Déconnexion
        </button>
      </>
    );
  }

  return (
    <>
      <ThemeToggle />
      <button
        className={btnClass}
        onClick={() => navigate('/login')}
      >
        Connexion
      </button>
    </>
  );
}
