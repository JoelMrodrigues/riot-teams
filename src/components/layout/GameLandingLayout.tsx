import React from 'react';

import { GameLandingHeader } from './GameLandingHeader';
import type { Game } from '../../types/game.types';
import type { GameTab } from '../../types/gameTab.types';

interface GameLandingLayoutProps {
  game: Game;
  activeTab: GameTab;
  onTabChange: (tab: GameTab) => void;
  children: React.ReactNode;
}

export function GameLandingLayout({
  game,
  activeTab,
  onTabChange,
  children,
}: GameLandingLayoutProps): React.JSX.Element {
  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ background: game.darkColor }}
    >
      <div className="absolute inset-0" style={{ background: game.gradientStyle, opacity: 0.4 }} />
      <GameLandingHeader game={game} activeTab={activeTab} onTabChange={onTabChange} />
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
