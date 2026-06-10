import React from 'react';
import { motion } from 'framer-motion';

import { LolTeamOverviewHeader } from '../../../components/lol/teams/overview/LolTeamOverviewHeader';
import { LolRosterByRole } from '../../../components/lol/teams/overview/LolRosterByRole';
import { DEMO_TEAM, DEMO_ROSTER, DEMO_STATS } from '../../../data/lolDemoTeam.data';
import { resolveAccent } from '../../../data/lolTeamAccents.data';
import { LOL_ACCENTS } from '../../../constants/lolTheme';
import type { UseTeamLogoReturn } from '../../../hooks/useTeamLogo';

const STUB_LOGO: UseTeamLogoReturn = {
  logoUrl: '',
  uploading: false,
  uploadError: null,
  upload: async () => { /* démo : no-op */ },
  removeLogo: async () => { /* démo : no-op */ },
};

/** Espace test — Aperçu d'équipe (mock) : en-tête + roster par rôle. */
export function LolTestTeamPage(): React.JSX.Element {
  const accent = resolveAccent(DEMO_TEAM.accentColor ?? undefined);

  return (
    <motion.div
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 lg:px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
    >
      <span
        className="w-fit rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest"
        style={{ fontFamily: 'Rajdhani, sans-serif', background: `${LOL_ACCENTS.team.color}1A`, border: `1px solid ${LOL_ACCENTS.team.color}40`, color: LOL_ACCENTS.team.color }}
      >
        Espace test · Team
      </span>

      <LolTeamOverviewHeader
        team={DEMO_TEAM}
        rosterCount={DEMO_ROSTER.length}
        resolvedAccent={accent}
        isManager
        logoHook={STUB_LOGO}
        onInvite={() => { /* démo */ }}
      />

      <LolRosterByRole
        roster={DEMO_ROSTER}
        statsByRosterId={DEMO_STATS}
        statsLoading={false}
        maxMembers={5}
        isManager
        accent={accent}
        onAddPlayer={() => { /* démo */ }}
        onRemoveMember={() => { /* démo */ }}
      />
    </motion.div>
  );
}
