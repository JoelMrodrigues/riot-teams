import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { TeamsHeader } from '../components/teams/TeamsHeader';
import { TeamsFilterTabs } from '../components/teams/TeamsFilterTabs';
import { TeamsGrid } from '../components/teams/TeamsGrid';
import { CreateTeamModal } from '../components/teams/CreateTeamModal';
import { StorageErrorBanner } from '../components/feedback/StorageErrorBanner';
import { useTeams } from '../hooks/useTeams';
import type { FilterTab } from '../components/teams/TeamsFilterTabs';

export function TeamsPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { teams, createTeam, storageError, dismissStorageError } = useTeams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredTeams = activeFilter === 'all'
    ? teams
    : teams.filter((t) => t.game === activeFilter);

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Subtle brand glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% -5%, rgba(124,58,237,0.08) 0%, transparent 55%)' }}
      />

      <TeamsHeader />

      <main className="relative z-10 flex-1 flex flex-col px-8 py-8 gap-6 overflow-y-auto">
        <StorageErrorBanner message={storageError} onDismiss={dismissStorageError} />

        {/* Title + CTA */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-0.5">
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}
            >
              Mes Équipes
            </h1>
            <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-muted)' }}>
              {teams.length} équipe{teams.length !== 1 ? 's' : ''} enregistrée{teams.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-solid btn-md">
            + Nouvelle équipe
          </button>
        </motion.div>

        <TeamsFilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        <TeamsGrid
          teams={filteredTeams}
          activeFilter={activeFilter}
          onCreateClick={() => setIsCreateModalOpen(true)}
        />
      </main>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(name, game) => {
          const team = createTeam(name, game);
          navigate(`/${team.game}/team/${team.id}`);
        }}
      />
    </div>
  );
}
