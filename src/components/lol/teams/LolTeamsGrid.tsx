import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { TeamCard } from '../../teams/TeamCard';
import { LolMyTeamsEmptyState } from '../home/LolMyTeamsEmptyState';
import type { Team } from '../../../types/team.types';

interface LolTeamsGridProps {
  teams: Team[];
  onCreateEmpty: () => void;
}

/**
 * Grille paginée des équipes LoL (toutes, pas seulement les 3 premières).
 * Réutilise TeamCard (tokens globaux, compatible mode clair/sombre LoL).
 * État vide via LolMyTeamsEmptyState (tokens --lol-*).
 */
export function LolTeamsGrid({ teams, onCreateEmpty }: LolTeamsGridProps): React.JSX.Element {
  return (
    <AnimatePresence mode="wait">
      {teams.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <LolMyTeamsEmptyState onCreate={onCreateEmpty} />
        </motion.div>
      ) : (
        <motion.div
          key="grid"
          className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {teams.map((team, i) => (
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
  );
}
