import React from 'react';

import type { Game } from '../../types/game.types';

interface GameCardProps {
  game: Game;
  isActive: boolean;
  isAnyActive: boolean;
  flexGrow: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const E = 'cubic-bezier(0.65, 0, 0.35, 1)';

export const GameCard = React.memo(function GameCard({
  game,
  isActive,
  isAnyActive,
  flexGrow,
  onMouseEnter,
  onMouseLeave,
}: GameCardProps): React.JSX.Element {
  return (
    <div
      className="relative h-full overflow-hidden select-none"
      style={{
        flexGrow,
        flexShrink: 1,
        flexBasis: 0,
        minWidth: 0,
        transition: `flex-grow 0.55s ${E}`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Background image */}
      <img
        src={game.imagePath}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: isActive ? 'scale(1.07)' : 'scale(1.0)',
          transition: `transform 0.9s ${E}`,
          willChange: 'transform',
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: game.gradientStyle }} />

      {/* Accent tint on hover */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 110%, ${game.accentColor}28 0%, transparent 60%)`,
          opacity: isActive ? 1 : 0,
          transition: `opacity 0.45s ${E}`,
        }}
      />

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '2px',
          background: `linear-gradient(to right, transparent, ${game.accentColor}, transparent)`,
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
          transition: `opacity 0.35s ${E}, transform 0.45s ${E}`,
        }}
      />

      {/* Separator */}
      <div
        className="absolute right-0 top-0 bottom-0 w-px"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-8 pb-10">
        <div
          className="mb-4 self-start"
          style={{
            opacity: isAnyActive && !isActive ? 0.3 : 1,
            transition: `opacity 0.25s ${E}`,
          }}
        >
          <span
            className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-sm border"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: game.accentColor,
              borderColor: `${game.accentColor}50`,
              background: `${game.accentColor}15`,
            }}
          >
            {game.tag}
          </span>
        </div>

        <h2
          className="font-bold text-white leading-none"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            textShadow: '0 2px 24px rgba(0,0,0,0.9)',
            fontSize: isActive ? '3.75rem' : '2.25rem',
            opacity: isAnyActive && !isActive ? 0.35 : 1,
            transition: `font-size 0.55s ${E}, opacity 0.25s ${E}`,
          }}
        >
          {game.shortName}
        </h2>
      </div>
    </div>
  );
});
