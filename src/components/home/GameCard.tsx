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
      {/* Background image */}
      <img
        src={game.imagePath}
        alt={game.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: isActive ? 'scale(1.07)' : 'scale(1.01)',
          transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />

      {/* Dark gradient overlay — always present, stronger at bottom */}
      <div
        className="absolute inset-0"
        style={{ background: game.gradientStyle }}
      />

      {/* Game-color tint — subtle vignette */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${game.accentColor}22 0%, transparent 65%)`,
          opacity: isActive ? 1 : 0.5,
        }}
      />

      {/* Vertical separator */}
      <div
        className="absolute right-0 top-0 bottom-0 w-px"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      />

      {/* Bottom accent line on hover */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(to right, transparent, ${game.accentColor}, transparent)` }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-8 pb-10">

        {/* Tag badge */}
        <motion.div
          className="mb-5 self-start"
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
              backdropFilter: 'blur(4px)',
            }}
          >
            {game.tag}
          </span>
        </motion.div>

        {/* Game name */}
        <motion.h2
          className="font-bold text-white leading-none"
          style={{ fontFamily: 'Rajdhani, sans-serif', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
          animate={{
            fontSize: isActive ? '3.75rem' : '2.25rem',
            opacity: isAnyActive && !isActive ? 0.35 : 1,
            marginBottom: isActive ? '1.25rem' : '0',
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          {game.shortName}
        </motion.h2>

        {/* Expandable content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, delay: 0.06 }}
              className="flex flex-col gap-5"
            >
              {/* Description */}
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: 'rgba(255,255,255,0.55)',
                  textShadow: '0 1px 8px rgba(0,0,0,0.8)',
                }}
              >
                {game.description}
              </p>

              {/* Stats preview */}
              <div
                className="flex gap-5 pb-1"
                style={{ borderBottom: `1px solid ${game.accentColor}25` }}
              >
                {game.previewStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-0.5">
                    <span
                      className="text-xs uppercase tracking-widest"
                      style={{
                        color: `${game.accentColor}80`,
                        fontFamily: 'Rajdhani, sans-serif',
                      }}
                    >
                      {stat.label}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.75)' }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Access hint */}
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: game.accentColor }}
                >
                  Accéder
                </span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7h10M8 3.5L11.5 7 8 10.5"
                    stroke={game.accentColor}
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
