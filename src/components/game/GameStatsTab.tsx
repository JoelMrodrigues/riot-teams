import React from 'react';
import { motion } from 'framer-motion';

import type { Game } from '../../types/game.types';

interface GameStatsTabProps {
  game: Game;
}

export function GameStatsTab({ game }: GameStatsTabProps): React.JSX.Element {
  return (
    <div className="flex-1 flex items-center justify-center pb-16">
      <motion.div
        className="flex flex-col items-center gap-5 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div
          className="w-16 h-16 rounded-sm flex items-center justify-center"
          style={{ background: `${game.accentColor}15` }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 20V10M12 20V4M6 20v-6"
              stroke={game.accentColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <p
            className="text-white/40 text-sm font-semibold"
            style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}
          >
            Statistiques {game.shortName} — Phase 4
          </p>
          <p
            className="text-white/20 text-xs max-w-xs leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Classement, historique de parties, performances par champion/agent.
            Disponible après intégration de l'API Riot Games.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
