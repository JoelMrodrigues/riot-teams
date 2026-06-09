import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolTeamDetailHeader } from '../../components/lol/teams/LolTeamDetailHeader';
import { LolTeamRoster } from '../../components/lol/teams/LolTeamRoster';
import { LolMembersPanel } from '../../components/lol/teams/LolMembersPanel';
import { LolDeleteTeamModal } from '../../components/lol/teams/LolDeleteTeamModal';
import { LolAddRosterMemberModal } from '../../components/lol/teams/LolAddRosterMemberModal';
import { ApiErrorBanner } from '../../components/feedback/ApiErrorBanner';
import { LolTeamDetailSkeleton } from '../../components/lol/teams/LolTeamDetailSkeleton';
import { useLolTeam } from '../../hooks/useLolTeam';
import { useAuth } from '../../hooks/useAuth';
import { getMyRole, isManager as checkIsManager } from '../../utils/lolTeamRole';
import { resolveAccent } from '../../data/lolTeamAccents.data';
import { GAMES_DATA } from '../../data/games.data';

/**
 * /lol/team/:teamId — page détail d'une équipe LoL, branchée sur l'API backend.
 * Résout le rôle courant via managers[] + userId, gate les actions de gestion.
 */
export function LolTeamDetailPage(): React.JSX.Element {
  const { teamId }  = useParams<{ teamId: string }>();
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const {
    team, members, roster, loading, error, refresh,
    addRosterMember, removeRosterMember, deleteTeam,
    addMember, updateMemberRole, removeMember, transferOwnership,
  } = useLolTeam(teamId);

  const [isAddModalOpen, setIsAddModalOpen]       = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionError, setActionError]             = useState<string | null>(null);

  const game          = GAMES_DATA.find((g) => g.id === 'lol')!;
  const myRole        = getMyRole(members, user?.id);
  const managerAccess = checkIsManager(myRole);

  if (loading) return <LolTeamDetailSkeleton />;

  if (error || !team) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 pb-8 pt-8 md:px-6 lg:px-8">
        <ApiErrorBanner message={error ?? 'Équipe introuvable.'} onRetry={refresh} />
      </div>
    );
  }

  const resolvedAccent = resolveAccent(team.accentColor ?? undefined);

  const handleDeleteConfirm = async () => {
    try {
      await deleteTeam();
      navigate('/lol/teams');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Erreur lors de la suppression.');
      setIsDeleteModalOpen(false);
    }
  };

  const handleAddMember = async (gameName: string, tagLine: string) => {
    try {
      await addRosterMember({ game_name: gameName, tag_line: tagLine });
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Erreur lors de l'ajout.");
    }
  };

  const handleRemoveMember = async (rosterId: string) => {
    try {
      await removeRosterMember(rosterId);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Erreur lors du retrait.');
    }
  };

  return (
    <>
      <motion.div
        className="mx-auto w-full max-w-3xl px-4 pb-8 pt-8 md:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <ApiErrorBanner message={actionError} onRetry={() => setActionError(null)} />

        <div className="flex flex-col gap-8">
          <LolTeamDetailHeader
            team={team}
            rosterCount={roster.length}
            maxMembers={game.maxMembers}
            resolvedAccent={resolvedAccent}
            isManager={managerAccess}
            onDeleteRequest={() => setIsDeleteModalOpen(true)}
          />
          <LolMembersPanel
            members={members}
            ownerId={team.ownerId}
            myRole={myRole}
            onAddMember={addMember}
            onChangeRole={updateMemberRole}
            onRemoveMember={removeMember}
            onTransfer={transferOwnership}
          />
          <LolTeamRoster
            roster={roster}
            maxMembers={game.maxMembers}
            isManager={managerAccess}
            onAddPlayer={() => setIsAddModalOpen(true)}
            onRemoveMember={handleRemoveMember}
          />
        </div>
      </motion.div>

      {managerAccess && (
        <LolAddRosterMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddMember}
        />
      )}

      {managerAccess && (
        <LolDeleteTeamModal
          isOpen={isDeleteModalOpen}
          teamName={team.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
