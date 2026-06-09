import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { RosterSlot } from './RosterSlot';
import { AddPlayerModal } from './AddPlayerModal';
import { StorageErrorBanner } from '../feedback/StorageErrorBanner';
import { useTeams } from '../../hooks/useTeams';
import type { Game } from '../../types/game.types';
import type { GameType } from '../../types/team.types';

interface TeamDetailViewProps {
  game: Game;
  teamId: string;
}

export function TeamDetailView({ game, teamId }: TeamDetailViewProps): React.JSX.Element {
  const navigate = useNavigate();
  const { getTeamById, addMember, removeMember, deleteTeam, storageError, dismissStorageError } = useTeams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const team = getTeamById(teamId);
  const maxMembers = game.maxMembers;

  if (!team) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/30 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
          Équipe introuvable.
        </p>
      </div>
    );
  }

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    deleteTeam(team.id);
    navigate(`/${game.id}`);
  };

  const slots = Array.from({ length: maxMembers }).map((_, i) => team.members[i] ?? null);

  return (
    <>
      <div className="flex-1 flex flex-col px-8 py-8 gap-8 overflow-y-auto">
        <StorageErrorBanner message={storageError} onDismiss={dismissStorageError} />

        <motion.div
          className="flex items-start justify-between gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-1">
            <h2
              className="text-4xl font-bold text-white"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {team.name}
            </h2>
            <p
              className="text-white/30 text-xs uppercase tracking-widest"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              {game.shortName} · {team.members.length}/{maxMembers} joueurs
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="flex-shrink-0 px-4 py-2 text-xs uppercase tracking-widest rounded-sm border cursor-pointer transition-all duration-150"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              borderColor: confirmDelete ? 'var(--danger)' : 'rgba(255,255,255,0.1)',
              color: confirmDelete ? 'var(--danger)' : 'rgba(255,255,255,0.3)',
              background: confirmDelete ? 'var(--danger-muted)' : 'transparent',
            }}
            onMouseLeave={() => setConfirmDelete(false)}
          >
            {confirmDelete ? 'Confirmer ?' : 'Supprimer'}
          </button>
        </motion.div>

        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs uppercase tracking-widest text-white/30"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}
            >
              Roster
            </span>
            {team.members.length < maxMembers && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs uppercase tracking-widest cursor-pointer transition-colors duration-150 hover:opacity-80"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: game.accentColor }}
              >
                + Ajouter un joueur
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {slots.map((member, i) => (
              <RosterSlot
                key={member?.id ?? `empty-${i}`}
                member={member}
                slotIndex={i}
                accentColor={game.accentColor}
                gameRoute={game.id as GameType}
                onRemove={member ? () => removeMember(team.id, member.id) : undefined}
                onAdd={!member ? () => setIsAddModalOpen(true) : undefined}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <AddPlayerModal
        isOpen={isAddModalOpen}
        game={game}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(gameName, tagLine) => addMember(team.id, gameName, tagLine)}
      />
    </>
  );
}
