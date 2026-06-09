import React from 'react';

import { ThemeToggle } from './ThemeToggle';

interface HeaderActionsProps {
  /** Taille du bouton « Sign In » : `sm` (défaut) ou `md`. */
  buttonSize?: 'sm' | 'md';
}

/** Cluster d'actions à droite des headers : bascule de thème + connexion. */
export function HeaderActions({ buttonSize = 'sm' }: HeaderActionsProps): React.JSX.Element {
  return (
    <>
      <ThemeToggle />
      <button className={buttonSize === 'md' ? 'btn btn-ghost btn-md' : 'btn btn-ghost btn-sm'}>
        Sign In
      </button>
    </>
  );
}
