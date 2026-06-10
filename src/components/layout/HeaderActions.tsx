// Cluster d'actions à droite des headers : bascule de thème + auth.
// Connecté : menu utilisateur (Mes équipes / Déconnexion). Anonyme : bouton Connexion
// qui mémorise la page d'origine via ?redirect= pour y revenir après login.

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { useAuth } from '../../hooks/useAuth';

interface HeaderActionsProps {
  /** Taille du bouton Connexion : `sm` (défaut) ou `md`. */
  buttonSize?: 'sm' | 'md';
}

export function HeaderActions({ buttonSize = 'sm' }: HeaderActionsProps): React.JSX.Element {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const btnClass = buttonSize === 'md' ? 'btn btn-ghost btn-md' : 'btn btn-ghost btn-sm';

  const goToLogin = (): void => {
    const here = `${location.pathname}${location.search}`;
    navigate(`/login?redirect=${encodeURIComponent(here)}`);
  };

  // Pendant la réhydratation : espace réservé silencieux (évite le flash Connexion).
  if (status === 'loading') {
    return (
      <>
        <ThemeToggle />
        <div className="h-7 w-16 animate-pulse rounded-sm" style={{ background: 'var(--bg-elevated)' }} />
      </>
    );
  }

  if (status === 'authenticated' && user) {
    return (
      <>
        <ThemeToggle />
        <UserMenu user={user} onLogout={logout} />
      </>
    );
  }

  return (
    <>
      <ThemeToggle />
      <button className={btnClass} onClick={goToLogin}>
        Connexion
      </button>
    </>
  );
}
