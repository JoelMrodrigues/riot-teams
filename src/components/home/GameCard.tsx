import React from 'react';
import { motion } from 'framer-motion';

import type { Game } from '../../types/game.types';

interface GameCardProps {
  game: Game;
  isActive: boolean;
  isAnyActive: boolean;
  cardWidth: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export function GameCard({
  game,
  isActive,
  isAnyActive,
  cardWidth,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: GameCardProps): React.JSX.Element {
  return (
    <motion.div
      className="relative h-full cursor-pointer overflow-hidden flex-shrink-0 select-none"
      animate={{ width: cardWidth }}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Background image */}
      <img
        src={game.imagePath}
        alt={game.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: isActive ? 'scale(1.06)' : 'scale(1.01)',
          transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0" style={{ background: game.gradientStyle }} />

      {/* Separator */}
      <div
        className="absolute right-0 top-0 bottom-0 w-px"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-8 pb-10">
        <motion.div
          className="mb-4 self-start"
          animate={{ opacity: isAnyActive && !isActive ? 0.3 : 1 }}
          transition={{ duration: 0.2 }}
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
        </motion.div>

        <motion.h2
          className="font-bold text-white leading-none"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}
          animate={{
            fontSize: isActive ? '3.75rem' : '2.25rem',
            opacity: isAnyActive && !isActive ? 0.35 : 1,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          {game.shortName}
        </motion.h2>
      </div>
    </motion.div>
  );
}
