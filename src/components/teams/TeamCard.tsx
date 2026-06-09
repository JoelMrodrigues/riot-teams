import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import type { Team } from '../../types/team.types';
import { GAMES_DATA } from '../../data/games.data';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps): React.JSX.Element {
  const navigate = useNavigate();
  const game = GAMES_DATA.find((g) => g.id === team.game)!;
  const maxMembers = game.maxMembers;
  const memberCount = team.members.length;

  const createdDate = new Date(team.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      className="group relative flex flex-col gap-4 p-5 rounded-sm border cursor-pointer transition-colors duration-200"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
      whileHover={{ borderColor: `${game.accentColor}50`, background: `${game.accentColor}08` }}
      transition={{ duration: 0.15 }}
      onClick={() => navigate(`/${team.game}/team/${team.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <h3
            className="text-lg font-bold truncate"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}
          >
            {team.name}
          </h3>
          <span
            className="text-xs"
            style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-muted)' }}
          >
            Créée le {createdDate}
          </span>
        </div>

        <span
          className="flex-shrink-0 text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm border"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            color: game.accentColor,
            borderColor: `${game.accentColor}40`,
            background: `${game.accentColor}10`,
          }}
        >
          {game.tag}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-muted)' }}
          >
            Roster
          </span>
          <span
            className="text-xs font-semibold"
            style={{ fontFamily: 'Inter, sans-serif', color: game.accentColor }}
          >
            {memberCount} / {maxMembers}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: maxMembers }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-colors duration-200"
              style={{ background: i < memberCount ? game.accentColor : 'var(--border-default)' }}
            />
          ))}
        </div>
      </div>

      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-30 group-hover:opacity-70 transition-opacity duration-200"
        style={{ color: 'var(--text-muted)' }}
      >
        →
      </div>
    </motion.div>
  );
}
