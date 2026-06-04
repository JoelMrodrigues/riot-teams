import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { TeamCard } from '../components/teams/TeamCard';
import { CreateTeamModal } from '../components/teams/CreateTeamModal';
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
      style={{ background: '#0a0a0a' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% -10%, rgba(200,155,60,0.07) 0%, transparent 55%)',
        }}
      />

      {/* Header */}
      <header
        className="relative z-50 flex items-center justify-between px-8 py-5 flex-shrink-0 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C89B3C, #FF4655)' }}
            >
              <span
                className="text-white text-[9px] font-bold"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}
              >
                RT
              </span>
            </div>
            <span
              className="text-white/60 group-hover:text-white/90 text-sm font-semibold tracking-wider uppercase transition-colors duration-150"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Riot Teams
            </span>
          </button>

          <span className="text-white/15 text-xs">/</span>
          <span
            className="text-sm font-semibold tracking-wider uppercase text-white/60"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            Équipes
          </span>
        </div>

        <button
          className="px-5 py-2 text-sm font-medium tracking-widest uppercase text-white/80 border border-white/15 rounded-sm cursor-pointer transition-all duration-200 hover:text-white hover:border-white/40 hover:bg-white/5 active:scale-95"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          Sign In
        </button>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col px-8 py-8 gap-6 overflow-y-auto">
        {/* Page title + CTA */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-0.5">
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Mes Équipes
            </h1>
            <p
              className="text-white/30 text-xs"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {teams.length} équipe{teams.length !== 1 ? 's' : ''} enregistrée{teams.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 text-sm font-bold tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:opacity-85 active:scale-95"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              background: '#C89B3C',
              color: '#0A1428',
            }}
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
                  ? (tab.color ?? 'rgba(255,255,255,0.5)')
                  : 'rgba(255,255,255,0.1)',
                color: activeFilter === tab.key
                  ? (tab.color ?? 'white')
                  : 'rgba(255,255,255,0.35)',
                background: activeFilter === tab.key && tab.color
                  ? `${tab.color}15`
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
              <p
                className="text-white/20 text-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {activeFilter === 'all'
                  ? 'Aucune équipe créée pour le moment.'
                  : `Aucune équipe ${activeFilter.toUpperCase()} créée.`}
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-xs uppercase tracking-widest cursor-pointer transition-colors hover:opacity-80"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: '#C89B3C' }}
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
