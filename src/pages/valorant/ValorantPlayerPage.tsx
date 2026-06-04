import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { GamePageLayout } from '../../components/layout/GamePageLayout';
import { GAMES_DATA } from '../../data/games.data';

const game = GAMES_DATA.find((g) => g.id === 'valorant')!;

interface ValorantPlayerParams {
  gameName: string;
  tagLine: string;
  [key: string]: string | undefined;
}

export function ValorantPlayerPage(): React.JSX.Element {
  const { gameName, tagLine } = useParams<ValorantPlayerParams>();

  const decodedName = decodeURIComponent(gameName ?? '');
  const decodedTag = decodeURIComponent(tagLine ?? '');

  return (
    <GamePageLayout game={game}>
      <div className="flex-1 flex flex-col px-8 py-10 gap-8 overflow-y-auto">
        <motion.div
          className="flex flex-col gap-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <h2
            className="text-4xl font-bold text-white"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {decodedName}
            <span className="text-white/30 font-normal ml-1">#{decodedTag}</span>
          </h2>
          <p
            className="text-white/30 text-xs uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Valorant · Profil joueur
          </p>
        </motion.div>

        <motion.div
          className="flex-1 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div
            className="flex flex-col items-center gap-4 text-center p-12 rounded-sm border"
            style={{ borderColor: `${game.accentColor}20`, background: `${game.accentColor}08` }}
          >
            <div
              className="w-12 h-12 rounded-sm flex items-center justify-center"
              style={{ background: `${game.accentColor}20` }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke={game.accentColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p
              className="text-white/50 text-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Intégration API Riot Games — Phase 4/5
            </p>
            <p
              className="text-white/20 text-xs max-w-xs leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Les statistiques de <span style={{ color: game.accentColor }}>{decodedName}#{decodedTag}</span> seront
              affichées ici après connexion à l'API Riot.
            </p>
          </div>
        </motion.div>
      </div>
    </GamePageLayout>
  );
}
