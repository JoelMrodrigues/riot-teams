import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { TeamCard } from '../components/teams/TeamCard';
import { CreateTeamModal } from '../components/teams/CreateTeamModal';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import { useTeams } from '../hooks/useTeams';
import type { GameType } from '../types/team.types';
import { GAMES_DATA } from '../data/games.data';

type FilterTab = 'all' | GameType;

export function TeamsPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { teams, createTeam } = useTeams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredTeams = activeFilter === 'all'
    ? teams
    : teams.filter((t) => t.game === activeFilter);

  const tabs: { key: FilterTab; label: string; color?: string }[] = [
    { key: 'all', label: 'Toutes' },
    ...GAMES_DATA.map((g) => ({ key: g.id as FilterTab, label: g.tag, color: g.accentColor })),
  ];

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

      {/* Header */}
      <header
        className="relative z-50 flex items-center justify-between px-8 flex-shrink-0"
        style={{
          height: '60px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="btn btn-text btn-sm flex items-center gap-2"
          >
            <div
              className="w-6 h-6 rounded-sm flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--brand), #A78BFA)' }}
            >
              <span className="text-white text-[9px] font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>RT</span>
            </div>
            <span
              className="font-semibold tracking-wider uppercase"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', fontSize: '0.85rem' }}
            >
              Riot Teams
            </span>
          </button>

          <span style={{ color: 'var(--border-strong)', fontSize: '0.6rem' }}>|</span>

          <span
            className="text-sm font-semibold tracking-wider uppercase"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-muted)' }}
          >
            Équipes
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button className="btn btn-ghost btn-sm">Sign In</button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col px-8 py-8 gap-6 overflow-y-auto">
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

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-solid btn-md"
          >
            + Nouvelle équipe
          </button>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className="px-4 py-1.5 text-xs uppercase tracking-widest rounded-sm border cursor-pointer transition-all duration-150"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                borderColor: activeFilter === tab.key
                  ? (tab.color ?? 'var(--brand)')
                  : 'var(--border-default)',
                color: activeFilter === tab.key
                  ? (tab.color ?? 'var(--brand)')
                  : 'var(--text-muted)',
                background: activeFilter === tab.key && tab.color
                  ? `${tab.color}15`
                  : activeFilter === tab.key
                  ? 'var(--brand-muted)'
                  : 'transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Teams grid */}
        <AnimatePresence mode="wait">
          {filteredTeams.length === 0 ? (
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
                onClick={() => setIsCreateModalOpen(true)}
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
              {filteredTeams.map((team, i) => (
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
