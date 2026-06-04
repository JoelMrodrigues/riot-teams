import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import type { Team } from '../../types/team.types';
import { GAMES_DATA } from '../../data/games.data';

interface TeamCardProps {
  team: Team;
}

const GAME_MAX_MEMBERS: Record<string, number> = {
  lol: 5,
  valorant: 5,
  tft: 8,
};

export function TeamCard({ team }: TeamCardProps): React.JSX.Element {
  const navigate = useNavigate();
  const game = GAMES_DATA.find((g) => g.id === team.game)!;
  const maxMembers = GAME_MAX_MEMBERS[team.game] ?? 5;
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
        background: '#111111',
        borderColor: 'rgba(255,255,255,0.07)',
      }}
      whileHover={{ borderColor: `${game.accentColor}50`, background: `${game.accentColor}08` }}
      transition={{ duration: 0.15 }}
      onClick={() => navigate(`/${team.game}/team/${team.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <h3
            className="text-lg font-bold text-white truncate"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {team.name}
          </h3>
          <span
            className="text-xs"
            style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.3)' }}
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
            className="text-xs uppercase tracking-widest text-white/30"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
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
              style={{ background: i < memberCount ? game.accentColor : 'rgba(255,255,255,0.08)' }}
            />
          ))}
        </div>
      </div>

      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-hover:text-white/30 transition-colors duration-200"
        style={{ fontSize: '1.2rem' }}
      >
        →
      </div>
    </motion.div>
  );
}
