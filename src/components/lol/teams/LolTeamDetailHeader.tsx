import React from 'react';
import { motion } from 'framer-motion';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_EMBLEMS } from '../../../data/lolEmblems.data';
import type { LolApiTeam } from '../../../types/lolTeam.types';

interface LolTeamDetailHeaderProps {
  team:            LolApiTeam;
  rosterCount:     number;
  maxMembers:      number;
  resolvedAccent:  string;
  isManager:       boolean;
  onDeleteRequest: () => void;
}

/**
 * En-tête de la page détail d'équipe LoL.
 * Bouton supprimer visible uniquement si isManager === true.
 */
export function LolTeamDetailHeader({
  team,
  rosterCount,
  maxMembers,
  resolvedAccent,
  isManager,
  onDeleteRequest,
}: LolTeamDetailHeaderProps): React.JSX.Element {
  const renderIcon = () => {
    if (team.icon?.kind === 'champion') {
      return <ChampionAvatar champKey={team.icon.value} label={team.icon.value} size={56} ring={resolvedAccent} />;
    }
    if (team.icon?.kind === 'emblem') {
      const emblem = LOL_EMBLEMS.find((e) => e.id === team.icon!.value);
      if (emblem) {
        return (
          <div
            className="flex h-14 w-14 items-center justify-center rounded-sm"
            style={{ background: `${resolvedAccent}15`, border: `1px solid ${resolvedAccent}40` }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill={resolvedAccent} aria-hidden="true">
              <path d={emblem.path} />
            </svg>
          </div>
        );
      }
    }
    return (
      <div
        className="flex h-14 w-14 items-center justify-center rounded-sm text-2xl font-bold"
        style={{
          background: `${resolvedAccent}18`,
          border: `1px solid ${resolvedAccent}30`,
          fontFamily: 'Rajdhani, sans-serif',
          color: resolvedAccent,
        }}
      >
        {team.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <motion.div
      className="flex items-start justify-between gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{renderIcon()}</div>

        <div className="flex min-w-0 flex-col gap-1">
          <p
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)' }}
          >
            {team.region ? `${team.region} · ` : ''}League of Legends · Équipe
          </p>
          <div className="flex items-center gap-2">
            <h1
              className="truncate text-3xl font-bold md:text-4xl"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
            >
              {team.name}
            </h1>
            {team.tag && (
              <span
                className="flex-shrink-0 rounded-sm px-2 py-0.5 text-sm font-bold uppercase"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  border: `1px solid ${resolvedAccent}40`,
                  background: `${resolvedAccent}10`,
                  color: resolvedAccent,
                }}
              >
                {team.tag}
              </span>
            )}
          </div>
          <p
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
          >
            LoL · {rosterCount}/{maxMembers} joueurs
          </p>
        </div>
      </div>

      {isManager && (
        <button
          type="button"
          onClick={onDeleteRequest}
          className="flex-shrink-0 cursor-pointer rounded-sm border px-4 py-2 text-xs uppercase tracking-widest transition-all duration-150 hover:border-[var(--danger)] hover:text-[var(--danger)]"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            borderColor: 'var(--lol-border)',
            color: 'var(--lol-text-muted)',
            background: 'transparent',
          }}
        >
          Supprimer
        </button>
      )}
    </motion.div>
  );
}
