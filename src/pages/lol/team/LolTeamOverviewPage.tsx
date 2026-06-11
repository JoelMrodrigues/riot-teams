import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolTeamOverviewHeader } from '../../../components/lol/teams/overview/LolTeamOverviewHeader';
import { LolRosterByRole } from '../../../components/lol/teams/overview/LolRosterByRole';
import { LolAddRosterMemberModal } from '../../../components/lol/teams/LolAddRosterMemberModal';
import { LolStatsRefresh } from '../../../components/lol/teams/LolStatsRefresh';
import { ApiErrorBanner } from '../../../components/feedback/ApiErrorBanner';
import { GAMES_DATA } from '../../../data/games.data';
import { useTeamOutlet } from './teamOutletContext';
import type { LolAddRosterMemberBody } from '../../../types/lolTeam.types';
import type { LolRegion } from '../../../types/team.types';

/** Aperçu d'une équipe LoL : en-tête + roster par rôle. */
export function LolTeamOverviewPage(): React.JSX.Element {
  const navigate = useNavigate();
  const {
    teamId, team, actions, isManager, statsByRosterId, statsLoading,
    statsUpdatedAt, refreshStats, resolvedAccent, logoHook,
  } = useTeamOutlet();

  const [isAddOpen, setIsAddOpen]   = useState(false);
  const [actionError, setError]     = useState<string | null>(null);

  const maxMembers = GAMES_DATA.find((g) => g.id === 'lol')!.maxMembers;

  const handleAdd = async (body: LolAddRosterMemberBody) => {
    try {
      await actions.addRosterMember(body);
      setIsAddOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout.");
    }
  };

  const handleRemove = async (rosterId: string) => {
    try {
      await actions.removeRosterMember(rosterId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors du retrait.');
    }
  };

  return (
    <>
      <motion.div
        className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <ApiErrorBanner message={actionError} onRetry={() => setError(null)} />

        <LolTeamOverviewHeader
          team={team}
          rosterCount={actions.roster.length}
          resolvedAccent={resolvedAccent}
          isManager={isManager}
          logoHook={logoHook}
          onInvite={() => navigate(`/lol/team/${teamId}/membres`)}
        />

        <div className="-mb-2 flex justify-end">
          <LolStatsRefresh updatedAt={statsUpdatedAt} loading={statsLoading} onRefresh={refreshStats} />
        </div>

        <LolRosterByRole
          roster={actions.roster}
          statsByRosterId={statsByRosterId}
          statsLoading={statsLoading}
          maxMembers={maxMembers}
          isManager={isManager}
          accent={resolvedAccent}
          onAddPlayer={() => setIsAddOpen(true)}
          onRemoveMember={handleRemove}
        />
      </motion.div>

      {isManager && (
        <LolAddRosterMemberModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAdd}
          defaultRegion={(team.region as LolRegion) ?? 'EUW'}
        />
      )}
    </>
  );
}
