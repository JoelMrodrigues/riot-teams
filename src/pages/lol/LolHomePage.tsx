import React from 'react';
import { motion } from 'framer-motion';

import { GamePageLayout } from '../../components/layout/GamePageLayout';
import { PlayerSearchBar } from '../../components/search/PlayerSearchBar';
import { usePlayerSearch } from '../../hooks/usePlayerSearch';
import { GAMES_DATA } from '../../data/games.data';

const game = GAMES_DATA.find((g) => g.id === 'lol')!;

export function LolHomePage(): React.JSX.Element {
  const { state, handleInputChange, handleSearch } = usePlayerSearch('lol');

  return (
    <GamePageLayout game={game}>
      <div className="flex-1 flex flex-col items-center justify-center gap-10 px-4 pb-20">
        <motion.div
          className="text-center flex flex-col gap-3"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <span
            className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-sm border self-center"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: game.accentColor,
              borderColor: `${game.accentColor}40`,
              background: `${game.accentColor}10`,
            }}
          >
            {game.tag}
          </span>
          <h1
            className="text-6xl font-bold text-white leading-none"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {game.name}
          </h1>
          <p
            className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Entrez un Riot ID pour afficher les statistiques détaillées du joueur.
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
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
    </GamePageLayout>
  );
}
