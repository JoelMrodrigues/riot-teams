import React from 'react';

import { GamePageHeader } from './GamePageHeader';
import type { Game } from '../../types/game.types';

interface GamePageLayoutProps {
  game: Game;
  children: React.ReactNode;
}

export function GamePageLayout({ game, children }: GamePageLayoutProps): React.JSX.Element {
  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ background: game.darkColor }}
    >
      <div className="absolute inset-0" style={{ background: game.gradientStyle, opacity: 0.5 }} />
      <GamePageHeader game={game} />
      <main className="relative z-10 flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
