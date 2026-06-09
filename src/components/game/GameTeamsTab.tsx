import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { TeamCard } from '../teams/TeamCard';
import { CreateTeamModal } from '../teams/CreateTeamModal';
import { StorageErrorBanner } from '../feedback/StorageErrorBanner';
import { useTeams } from '../../hooks/useTeams';
import type { Game } from '../../types/game.types';

interface GameTeamsTabProps {
  game: Game;
}

export function GameTeamsTab({ game }: GameTeamsTabProps): React.JSX.Element {
  const navigate = useNavigate();
  const { teams, createTeam, storageError, dismissStorageError } = useTeams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const gameTeams = teams.filter((t) => t.game === game.id);

  return (
    <>
      <div className="flex-1 flex flex-col px-8 py-8 gap-6 overflow-y-auto">
        <StorageErrorBanner message={storageError} onDismiss={dismissStorageError} />

        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-0.5">
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Équipes {game.shortName}
            </h2>
            <p
              className="text-white/30 text-xs"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {gameTeams.length} équipe{gameTeams.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 text-sm font-bold tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:opacity-85 active:scale-95"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              background: game.accentColor,
              color: game.darkColor,
            }}
          >
            + Nouvelle équipe
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {gameTeams.length === 0 ? (
            <motion.div
              key="empty"
              className="flex-1 flex flex-col items-center justify-center gap-4 py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="w-14 h-14 rounded-sm flex items-center justify-center"
                style={{ background: `${game.accentColor}15` }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                    stroke={game.accentColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                </svg>
              </div>
              <p
                className="text-white/25 text-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Aucune équipe {game.shortName} pour le moment.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-xs uppercase tracking-widest cursor-pointer transition-colors hover:opacity-80"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: game.accentColor }}
              >
                Créer une équipe →
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid gap-3"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {gameTeams.map((team, i) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.04 }}
                >
                  <TeamCard team={team} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(name, gameType) => {
          const team = createTeam(name, gameType);
          navigate(`/${team.game}/team/${team.id}`);
        }}
      />
    </>
  );
}
