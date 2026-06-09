import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { TeamCard } from './TeamCard';
import type { FilterTab } from './TeamsFilterTabs';
import type { Team } from '../../types/team.types';

interface TeamsGridProps {
  teams: Team[];
  activeFilter: FilterTab;
  onCreateClick: () => void;
}

/** Grille des équipes filtrées, avec état vide contextuel. */
export function TeamsGrid({ teams, activeFilter, onCreateClick }: TeamsGridProps): React.JSX.Element {
  return (
    <AnimatePresence mode="wait">
      {teams.length === 0 ? (
        <motion.div
          key="empty"
          className="flex-1 flex flex-col items-center justify-center gap-3 py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
            {activeFilter === 'all'
              ? 'Aucune équipe créée pour le moment.'
              : `Aucune équipe ${activeFilter.toUpperCase()} créée.`}
          </p>
          <button
            onClick={onCreateClick}
            className="btn btn-text btn-sm"
            style={{ color: 'var(--brand)' }}
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
          {teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <TeamCard team={team} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
