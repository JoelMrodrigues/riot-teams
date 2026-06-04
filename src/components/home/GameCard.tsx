import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div
        className="absolute inset-0 transition-transform duration-700"
        style={{
          background: game.gradientStyle,
          transform: isActive ? 'scale(1.04)' : 'scale(1)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />

      <div
        className="absolute right-0 top-0 bottom-0 w-px"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      />

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: game.accentColor }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col justify-end h-full p-8">
        <motion.div
          className="mb-4 self-start"
          animate={{ opacity: isAnyActive && !isActive ? 0.35 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <span
            className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-sm border"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: game.accentColor,
              borderColor: `${game.accentColor}40`,
              background: `${game.accentColor}10`,
            }}
          >
            {game.tag}
          </span>
        </motion.div>

        <motion.h2
          className="font-bold text-white leading-none mb-2"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
          animate={{
            fontSize: isActive ? '3.5rem' : '2rem',
            opacity: isAnyActive && !isActive ? 0.4 : 1,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          {game.shortName}
        </motion.h2>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22, delay: 0.05 }}
              className="flex flex-col gap-4"
            >
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}
              >
                {game.description}
              </p>

              <div className="flex gap-6">
                {game.previewStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-0.5">
                    <span
                      className="text-xs uppercase tracking-widest"
                      style={{
                        color: `${game.accentColor}90`,
                        fontFamily: 'Rajdhani, sans-serif',
                      }}
                    >
                      {stat.label}
                    </span>
                    <span
                      className="text-sm font-semibold text-white/70"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: `${game.accentColor}80` }}
                >
                  Accéder
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6h8M7 3l3 3-3 3"
                    stroke={game.accentColor}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
