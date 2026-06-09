import React from 'react';
import { motion } from 'framer-motion';

import { LolPlayerCard } from './LolPlayerCard';
import { LolTeamRosterSlot } from './LolTeamRosterSlot';
import { LOL_ACCENTS } from '../../../constants/lolTheme';
import type { LolApiRosterMember } from '../../../types/lolTeam.types';
import type { PlayerStatEntry } from '../../../hooks/useTeamPlayerStats';

interface LolRosterGridProps {
  roster:         LolApiRosterMember[];
  maxMembers:     number;
  isManager:      boolean;
  statsLoading:   boolean;
  statsByRosterId: Map<string, PlayerStatEntry>;
  resolvedAccent: string;
  onAddPlayer:    () => void;
  onRemoveMember: (rosterId: string) => void;
}

/**
 * Grille de cartes joueurs enrichies (rang + top champions).
 * Remplace LolTeamRoster sur la page détail.
 * Les slots vides restent sous forme de slots simples (LolTeamRosterSlot).
 */
export function LolRosterGrid({
  roster,
  maxMembers,
  isManager,
  statsLoading,
  statsByRosterId,
  resolvedAccent,
  onAddPlayer,
  onRemoveMember,
}: LolRosterGridProps): React.JSX.Element {
  const accent = LOL_ACCENTS.team.color;
  const emptySlots = maxMembers - roster.length;

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
        {isManager && roster.length < maxMembers && (
          <button
            type="button"
            onClick={onAddPlayer}
            className="cursor-pointer text-xs uppercase tracking-widest transition-opacity duration-150 hover:opacity-75"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: accent }}
          >
            + Ajouter un joueur
          </button>
        )}
      </div>

      {/* Grille 2 colonnes sur md+, 1 colonne sur mobile */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {roster.map((member) => (
          <LolPlayerCard
            key={member.id}
            member={member}
            stats={statsByRosterId.get(member.id) ?? null}
            statsLoading={statsLoading}
            accent={resolvedAccent}
            isManager={isManager}
            onRemove={isManager ? () => onRemoveMember(member.id) : undefined}
          />
        ))}
      </div>

      {/* Slots vides */}
      {isManager && emptySlots > 0 && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: emptySlots }).map((_, i) => (
            <LolTeamRosterSlot
              key={`empty-${i}`}
              member={null}
              slotIndex={roster.length + i}
              isManager={isManager}
              onAdd={onAddPlayer}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
