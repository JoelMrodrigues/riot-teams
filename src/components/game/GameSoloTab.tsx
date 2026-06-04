import React from 'react';
import { motion } from 'framer-motion';

import { PlayerSearchBar } from '../search/PlayerSearchBar';
import { usePlayerSearch } from '../../hooks/usePlayerSearch';
import type { Game } from '../../types/game.types';
import type { GameType } from '../../types/team.types';

interface GameSoloTabProps {
  game: Game;
}

export function GameSoloTab({ game }: GameSoloTabProps): React.JSX.Element {
  const { state, handleInputChange, handleSearch } = usePlayerSearch(game.id as GameType);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-10 px-4 pb-16">
      <motion.div
        className="text-center flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <h1
          className="text-6xl font-bold text-white leading-none"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          {game.name}
        </h1>
        <p
          className="text-white/35 text-sm max-w-xs mx-auto leading-relaxed"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Recherchez un joueur par Riot ID pour afficher ses statistiques.
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
      >
        <PlayerSearchBar
          accentColor={game.accentColor}
          value={state.input}
          error={state.error}
          onChange={handleInputChange}
          onSearch={handleSearch}
        />
      </motion.div>
    </div>
  );
}
