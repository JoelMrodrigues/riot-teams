import React from 'react';
import { motion } from 'framer-motion';

import { LolTeamRosterSlot } from './LolTeamRosterSlot';
import { LOL_ACCENTS } from '../../../constants/lolTheme';
import type { Team } from '../../../types/team.types';

interface LolTeamRosterProps {
  team: Team;
  maxMembers: number;
  onAddPlayer: () => void;
  onRemoveMember: (memberId: string) => void;
}

/**
 * Section roster de la page détail LoL.
 * Utilise LolTeamRosterSlot (--lol-*) pour garantir la cohérence clair/sombre.
 */
export function LolTeamRoster({
  team,
  maxMembers,
  onAddPlayer,
  onRemoveMember,
}: LolTeamRosterProps): React.JSX.Element {
  const accent = LOL_ACCENTS.team;
  const slots = Array.from({ length: maxMembers }).map((_, i) => team.members[i] ?? null);

  return (
    <motion.div
      className="flex flex-col gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
        >
          Roster
        </span>
        {team.members.length < maxMembers && (
          <button
            type="button"
            onClick={onAddPlayer}
            className="cursor-pointer text-xs uppercase tracking-widest transition-opacity duration-150 hover:opacity-75"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: accent.color }}
          >
            + Ajouter un joueur
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {slots.map((member, i) => (
          <LolTeamRosterSlot
            key={member?.id ?? `empty-${i}`}
            member={member}
            slotIndex={i}
            onRemove={member ? () => onRemoveMember(member.id) : undefined}
            onAdd={!member ? onAddPlayer : undefined}
          />
        ))}
      </div>
    </motion.div>
  );
}
