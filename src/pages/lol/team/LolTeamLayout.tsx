import React from 'react';
import { useParams, Outlet } from 'react-router-dom';

import { LolTeamSidebar } from '../../../components/lol/teams/sidebar/LolTeamSidebar';
import { LolTeamMobileNav } from '../../../components/lol/teams/sidebar/LolTeamMobileNav';
import { ApiErrorBanner } from '../../../components/feedback/ApiErrorBanner';
import { LolTeamDetailSkeleton } from '../../../components/lol/teams/LolTeamDetailSkeleton';
import { useLolTeam } from '../../../hooks/useLolTeam';
import { useTeamPlayerStats } from '../../../hooks/useTeamPlayerStats';
import { useTeamLogo } from '../../../hooks/useTeamLogo';
import { useAuth } from '../../../hooks/useAuth';
import { getMyRole, isManager as checkIsManager } from '../../../utils/lolTeamRole';
import { resolveAccent } from '../../../data/lolTeamAccents.data';
import type { TeamOutletContext } from './teamOutletContext';

/**
 * /lol/team/:teamId — coquille d'équipe : charge les données une fois et les
 * partage avec les sous-pages (Aperçu, Membres) via le contexte d'Outlet.
 */
export function LolTeamLayout(): React.JSX.Element {
  const { teamId } = useParams<{ teamId: string }>();
  const { user }   = useAuth();
  const actions    = useLolTeam(teamId);
  const { statsByRosterId, loading: statsLoading } = useTeamPlayerStats(teamId);
  const logoHook   = useTeamLogo(teamId);

  if (actions.loading) return <LolTeamDetailSkeleton />;

  if (actions.error || !actions.team || !teamId) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 pb-8 pt-8 md:px-6 lg:px-8">
        <ApiErrorBanner message={actions.error ?? 'Équipe introuvable.'} onRetry={actions.refresh} />
      </div>
    );
  }

  const myRole         = getMyRole(actions.members, user?.id);
  const isManager      = checkIsManager(myRole);
  const resolvedAccent = resolveAccent(actions.team.accentColor ?? undefined);

  const ctx: TeamOutletContext = {
    teamId, team: actions.team, actions, myRole, isManager,
    logoHook, statsByRosterId, statsLoading, resolvedAccent,
  };

  return (
    <div className="flex w-full">
      <LolTeamSidebar
        teamId={teamId}
        team={actions.team}
        logoUrl={logoHook.logoUrl}
        isManager={isManager}
        resolvedAccent={resolvedAccent}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <LolTeamMobileNav teamId={teamId} isManager={isManager} resolvedAccent={resolvedAccent} />
        <Outlet context={ctx} />
      </div>
    </div>
  );
}
