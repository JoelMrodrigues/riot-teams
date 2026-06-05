import React from 'react';

import { GameCard } from './GameCard';
import { useGameAccordion } from '../../hooks/useGameAccordion';
import { GAMES_DATA } from '../../data/games.data';

export function HeroSection(): React.JSX.Element {
  const { activeId, handleMouseEnter, handleMouseLeave, getFlexGrow } = useGameAccordion();

  return (
    <section className="flex w-full h-full overflow-hidden">
      {GAMES_DATA.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          isActive={activeId === game.id}
          isAnyActive={activeId !== null}
          flexGrow={getFlexGrow(game.id)}
          onMouseEnter={() => handleMouseEnter(game.id)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </section>
  );
}
