import React from 'react';

import { LolTeamNavLink } from './LolTeamNavLink';
import { LolTeamDetailIcon } from '../LolTeamDetailIcon';
import { LOL_TEAM_NAV } from '../../../../data/lolTeamNav.data';
import type { LolApiTeam } from '../../../../types/lolTeam.types';

interface LolTeamSidebarProps {
  teamId:         string;
  team:           LolApiTeam;
  logoUrl:        string;
  isManager:      boolean;
  resolvedAccent: string;
}

/** Sidebar verticale (desktop) de navigation dans une équipe LoL. */
export function LolTeamSidebar({
  teamId, team, logoUrl, isManager, resolvedAccent,
}: LolTeamSidebarProps): React.JSX.Element {
  const base = `/lol/team/${teamId}`;

  return (
    <aside
      className="sticky top-0 hidden h-[calc(100vh-60px)] w-56 flex-shrink-0 flex-col gap-5 overflow-y-auto border-r px-3 py-5 md:flex"
      style={{ borderColor: 'var(--lol-border)', background: 'var(--lol-bg-elevated)' }}
    >
      <div className="flex items-center gap-3 px-1">
        <div className="flex-shrink-0 scale-90 origin-left">
          <LolTeamDetailIcon team={team} resolvedAccent={resolvedAccent} logoUrl={logoUrl} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
            {team.name}
          </p>
          {team.tag && (
            <p className="truncate text-xs" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
              {team.tag}
            </p>
          )}
        </div>
      </div>

      <nav className="flex flex-col gap-5">
        {LOL_TEAM_NAV.map((group) => {
          const items = group.items.filter((it) => !it.managerOnly || isManager);
          if (items.length === 0) return null;
          return (
            <div key={group.group} className="flex flex-col gap-1">
              <p
                className="px-3 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)', opacity: 0.7 }}
              >
                {group.group}
              </p>
              {items.map((item) => (
                <LolTeamNavLink key={item.id} item={item} base={base} accent={resolvedAccent} />
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
