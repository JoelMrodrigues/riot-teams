import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolMembersPanel } from '../../../components/lol/teams/LolMembersPanel';
import { LolDeleteTeamModal } from '../../../components/lol/teams/LolDeleteTeamModal';
import { ApiErrorBanner } from '../../../components/feedback/ApiErrorBanner';
import { useTeamOutlet } from './teamOutletContext';

/** Gestion des membres / staff d'une équipe LoL + zone de suppression. */
export function LolTeamMembersPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { team, actions, myRole, isManager } = useTeamOutlet();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionError, setError]         = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await actions.deleteTeam();
      navigate('/lol/teams');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression.');
      setIsDeleteOpen(false);
    }
  };

  return (
    <>
      <motion.div
        className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <ApiErrorBanner message={actionError} onRetry={() => setError(null)} />

        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
        >
          Membres &amp; staff
        </h1>

        <LolMembersPanel
          members={actions.members}
          ownerId={team.ownerId}
          myRole={myRole}
          onAddMember={actions.addMember}
          onChangeRole={actions.updateMemberRole}
          onRemoveMember={actions.removeMember}
          onTransfer={actions.transferOwnership}
        />

        {isManager && (
          <div className="mt-2 border-t pt-5" style={{ borderColor: 'var(--lol-border)' }}>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="cursor-pointer rounded-sm border px-4 py-2 text-xs uppercase tracking-widest transition-all duration-150 hover:border-[var(--danger)] hover:text-[var(--danger)]"
              style={{ fontFamily: 'Rajdhani, sans-serif', borderColor: 'var(--lol-border)', color: 'var(--lol-text-muted)', background: 'transparent' }}
            >
              Supprimer l'équipe
            </button>
          </div>
        )}
      </motion.div>

      {isManager && (
        <LolDeleteTeamModal
          isOpen={isDeleteOpen}
          teamName={team.name}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </>
  );
}
