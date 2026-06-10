import React from 'react';
import { motion } from 'framer-motion';

import { LolTeamDetailIcon } from '../LolTeamDetailIcon';
import { LolTeamLogoUpload } from '../LolTeamLogoUpload';
import { LolTeamStatsBar } from './LolTeamStatsBar';
import { DEMO_TEAM_STATS } from '../../../../data/lolDemoRoster.data';
import type { LolApiTeam } from '../../../../types/lolTeam.types';
import type { UseTeamLogoReturn } from '../../../../hooks/useTeamLogo';

interface LolTeamOverviewHeaderProps {
  team:           LolApiTeam;
  rosterCount:    number;
  resolvedAccent: string;
  isManager:      boolean;
  logoHook:       UseTeamLogoReturn;
  onInvite:       () => void;
}

/** En-tête de l'Aperçu d'équipe : logo, nom, méta, action Inviter, barre de stats. */
export function LolTeamOverviewHeader({
  team, rosterCount, resolvedAccent, isManager, logoHook, onInvite,
}: LolTeamOverviewHeaderProps): React.JSX.Element {
  const createdDate = new Date(team.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  return (
    <motion.div
      className="flex flex-col gap-4 rounded-md border p-5 md:p-6"
      style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex-shrink-0">
            <LolTeamDetailIcon team={team} resolvedAccent={resolvedAccent} logoUrl={logoHook.logoUrl} />
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1
                className="truncate text-2xl font-bold md:text-3xl"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
              >
                {team.name}
              </h1>
              {team.tag && (
                <span
                  className="flex-shrink-0 rounded-sm px-2 py-0.5 text-sm font-bold uppercase"
                  style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    border: `1px solid ${resolvedAccent}40`,
                    background: `${resolvedAccent}10`,
                    color: resolvedAccent,
                  }}
                >
                  {team.tag}
                </span>
              )}
            </div>
            <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
              {team.region ? `${team.region} · ` : ''}Créée le {createdDate} · {rosterCount} joueur{rosterCount > 1 ? 's' : ''}
            </p>
            {isManager && (
              <div className="mt-1">
                <LolTeamLogoUpload logoHook={logoHook} />
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onInvite}
          className="flex-shrink-0 cursor-pointer rounded-sm px-4 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-150 active:scale-95"
          style={{ fontFamily: 'Rajdhani, sans-serif', background: `${resolvedAccent}1A`, border: `1px solid ${resolvedAccent}40`, color: resolvedAccent }}
        >
          Inviter
        </button>
      </div>

      <div className="border-t pt-4" style={{ borderColor: 'var(--lol-border)' }}>
        <LolTeamStatsBar {...DEMO_TEAM_STATS} demo />
      </div>
    </motion.div>
  );
}
