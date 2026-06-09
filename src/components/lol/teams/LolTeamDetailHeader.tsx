import React from 'react';
import { motion } from 'framer-motion';

import type { Team } from '../../../types/team.types';

interface LolTeamDetailHeaderProps {
  team: Team;
  maxMembers: number;
  confirmDelete: boolean;
  onDelete: () => void;
  onDeleteLeave: () => void;
}

/**
 * En-tête de la page détail d'équipe LoL :
 * nom de l'équipe, compteur de joueurs, bouton de suppression avec confirmation.
 * Texte via --lol-* pour la compatibilité clair/sombre.
 */
export function LolTeamDetailHeader({
  team,
  maxMembers,
  confirmDelete,
  onDelete,
  onDeleteLeave,
}: LolTeamDetailHeaderProps): React.JSX.Element {
  return (
    <motion.div
      className="flex items-start justify-between gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <p
          className="text-xs font-bold uppercase tracking-[0.15em]"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)' }}
        >
          League of Legends · Équipe
        </p>
        <h1
          className="truncate text-3xl font-bold md:text-4xl"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
        >
          {team.name}
        </h1>
        <p
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
        >
          LoL · {team.members.length}/{maxMembers} joueurs
        </p>
      </div>

      <button
        type="button"
        onClick={onDelete}
        onMouseLeave={onDeleteLeave}
        className="flex-shrink-0 cursor-pointer rounded-sm border px-4 py-2 text-xs uppercase tracking-widest transition-all duration-150"
        style={{
          fontFamily: 'Rajdhani, sans-serif',
          borderColor: confirmDelete ? 'var(--danger)' : 'var(--lol-border)',
          color: confirmDelete ? 'var(--danger)' : 'var(--lol-text-muted)',
          background: confirmDelete ? 'var(--danger-muted)' : 'transparent',
        }}
      >
        {confirmDelete ? 'Confirmer ?' : 'Supprimer'}
      </button>
    </motion.div>
  );
}
