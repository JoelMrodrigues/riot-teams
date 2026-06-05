import React from 'react';
import { Outlet } from 'react-router-dom';

import { LolHeader } from '../header/LolHeader';
import { useLolTheme } from '../../../hooks/useLolTheme';

/**
 * Shell de l'écosystème LoL : applique la palette violette (CSS vars scopées),
 * un fond ambiant lumineux, le header dédié et rend les sous-pages via Outlet.
 */
export function LolLayout(): React.JSX.Element {
  const { vars } = useLolTheme();

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ ...vars, background: 'var(--lol-bg)', color: 'var(--lol-text)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'var(--lol-hero-gradient)' }}
      />
      <LolHeader />
      <main className="relative z-10 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
