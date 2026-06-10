import React from 'react';
import { motion } from 'framer-motion';

import { LolRosterPlayerCard } from './LolRosterPlayerCard';
import { organizeRosterByRole, ROLE_LABEL } from '../../../../utils/organizeRosterByRole';
import { demoFillFor, DEMO_FILL_EMPTY_ROLES } from '../../../../data/lolDemoRoster.data';
import type { LolApiRosterMember } from '../../../../types/lolTeam.types';
import type { PlayerStatEntry } from '../../../../hooks/useTeamPlayerStats';

interface LolRosterByRoleProps {
  roster:          LolApiRosterMember[];
  statsByRosterId: Map<string, PlayerStatEntry>;
  statsLoading:    boolean;
  maxMembers:      number;
  isManager:       boolean;
  accent:          string;
  onAddPlayer:     () => void;
  onRemoveMember:  (rosterId: string) => void;
}

/** Roster affiché en 5 colonnes de rôle (TOP → SUPPORT), avec remplissage démo. */
export function LolRosterByRole({
  roster, statsByRosterId, statsLoading, maxMembers, isManager, accent, onAddPlayer, onRemoveMember,
}: LolRosterByRoleProps): React.JSX.Element {
  const slots = organizeRosterByRole(roster);

  return (
    <motion.section
      className="flex flex-col gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.08 }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
        >
          Roster · {roster.length}/{maxMembers}
        </span>
        {isManager && roster.length < maxMembers && (
          <button
            type="button"
            onClick={onAddPlayer}
            className="cursor-pointer text-xs uppercase tracking-widest transition-opacity duration-150 hover:opacity-75"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: accent }}
          >
            + Ajouter un joueur
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {slots.map(({ role, member }) => {
          const real  = member !== null;
          const demo  = !real && DEMO_FILL_EMPTY_ROLES ? demoFillFor(role) : null;
          const shown = member ?? demo?.member ?? null;
          const stats = real ? statsByRosterId.get(member!.id) ?? null : demo?.stats ?? null;

          return (
            <div key={role} className="flex flex-col gap-1.5">
              <span
                className="px-0.5 text-[11px] font-bold uppercase tracking-[0.15em]"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
              >
                {ROLE_LABEL[role]}
              </span>
              {shown ? (
                <LolRosterPlayerCard
                  member={shown}
                  stats={stats}
                  statsLoading={real ? statsLoading : false}
                  accent={accent}
                  isManager={isManager}
                  isDemo={!real}
                  onRemove={real ? () => onRemoveMember(member!.id) : undefined}
                />
              ) : (
                <EmptyRoleSlot accent={accent} isManager={isManager} onAdd={onAddPlayer} />
              )}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

function EmptyRoleSlot({ accent, isManager, onAdd }: { accent: string; isManager: boolean; onAdd: () => void }): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={isManager ? onAdd : undefined}
      disabled={!isManager}
      className="flex min-h-[180px] flex-1 items-center justify-center rounded-md border border-dashed text-xs uppercase tracking-widest transition-colors duration-150 disabled:cursor-default"
      style={{ borderColor: `${accent}33`, color: 'var(--lol-text-muted)', fontFamily: 'Rajdhani, sans-serif' }}
    >
      {isManager ? '+ Ajouter' : 'Libre'}
    </button>
  );
}
