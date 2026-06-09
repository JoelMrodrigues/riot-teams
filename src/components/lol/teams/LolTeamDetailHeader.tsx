import React from 'react';
import { motion } from 'framer-motion';

import { LolTeamDetailIcon } from './LolTeamDetailIcon';
import { LolTeamLogoUpload } from './LolTeamLogoUpload';
import type { LolApiTeam } from '../../../types/lolTeam.types';
import type { UseTeamLogoReturn } from '../../../hooks/useTeamLogo';

interface LolTeamDetailHeaderProps {
  team:            LolApiTeam;
  rosterCount:     number;
  maxMembers:      number;
  resolvedAccent:  string;
  isManager:       boolean;
  logoHook:        UseTeamLogoReturn;
  onDeleteRequest: () => void;
}

/**
 * En-tête de la page détail d'équipe LoL.
 * Affiche le logo uploadé (via LolTeamDetailIcon) + contrôle upload si manager.
 * Bouton supprimer visible uniquement si isManager === true.
 */
export function LolTeamDetailHeader({
  team,
  rosterCount,
  maxMembers,
  resolvedAccent,
  isManager,
  logoHook,
  onDeleteRequest,
}: LolTeamDetailHeaderProps): React.JSX.Element {
  return (
    <motion.div
      className="flex items-start justify-between gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <LolTeamDetailIcon
            team={team}
            resolvedAccent={resolvedAccent}
            logoUrl={logoHook.logoUrl}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <p
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)' }}
          >
            {team.region ? `${team.region} · ` : ''}League of Legends · Équipe
          </p>
          <div className="flex items-center gap-2">
            <h1
              className="truncate text-3xl font-bold md:text-4xl"
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
          <p
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
          >
            LoL · {rosterCount}/{maxMembers} joueurs
          </p>

          {isManager && (
            <div className="mt-1">
              <LolTeamLogoUpload logoHook={logoHook} />
            </div>
          )}
        </div>
      </div>

      {isManager && (
        <button
          type="button"
          onClick={onDeleteRequest}
          className="flex-shrink-0 cursor-pointer rounded-sm border px-4 py-2 text-xs uppercase tracking-widest transition-all duration-150 hover:border-[var(--danger)] hover:text-[var(--danger)]"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            borderColor: 'var(--lol-border)',
            color: 'var(--lol-text-muted)',
            background: 'transparent',
          }}
        >
          Supprimer
        </button>
      )}
    </motion.div>
  );
}
