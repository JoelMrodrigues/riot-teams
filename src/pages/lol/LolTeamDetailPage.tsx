import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolTeamDetailHeader } from '../../components/lol/teams/LolTeamDetailHeader';
import { LolTeamRoster } from '../../components/lol/teams/LolTeamRoster';
import { AddPlayerModal } from '../../components/teams/AddPlayerModal';
import { StorageErrorBanner } from '../../components/feedback/StorageErrorBanner';
import { useTeams } from '../../hooks/useTeams';
import { GAMES_DATA } from '../../data/games.data';

/**
 * /lol/team/:teamId — page détail d'une équipe LoL, rendue dans LolLayout.
 * Habillée exclusivement en tokens --lol-* (clair + sombre).
 */
export function LolTeamDetailPage(): React.JSX.Element {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { getTeamById, addMember, removeMember, deleteTeam, storageError, dismissStorageError } =
    useTeams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const game = GAMES_DATA.find((g) => g.id === 'lol')!;
  const team = teamId ? getTeamById(teamId) : undefined;

  if (!team) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p
          className="text-sm"
          style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
        >
          Équipe introuvable.
        </p>
      </div>
    );
  }

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    deleteTeam(team.id);
    navigate('/lol/teams');
  };

  return (
    <>
      <motion.div
        className="mx-auto w-full max-w-3xl px-4 pb-8 pt-8 md:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <StorageErrorBanner message={storageError} onDismiss={dismissStorageError} />

        <div className="flex flex-col gap-8">
          <LolTeamDetailHeader
            team={team}
            maxMembers={game.maxMembers}
            confirmDelete={confirmDelete}
            onDelete={handleDelete}
            onDeleteLeave={() => setConfirmDelete(false)}
          />
          <LolTeamRoster
            team={team}
            maxMembers={game.maxMembers}
            onAddPlayer={() => setIsAddModalOpen(true)}
            onRemoveMember={(memberId) => removeMember(team.id, memberId)}
          />
        </div>
      </motion.div>

      <AddPlayerModal
        isOpen={isAddModalOpen}
        game={game}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(gameName, tagLine) => addMember(team.id, gameName, tagLine)}
      />
    </>
  );
}
