import React from 'react';

import { LolTeamNavLink } from './LolTeamNavLink';
import { LOL_TEAM_NAV } from '../../../../data/lolTeamNav.data';

interface LolTeamMobileNavProps {
  teamId:         string;
  isManager:      boolean;
  resolvedAccent: string;
}

/** Barre de navigation horizontale (mobile) — alternative à la sidebar. */
export function LolTeamMobileNav({ teamId, isManager, resolvedAccent }: LolTeamMobileNavProps): React.JSX.Element {
  const base  = `/lol/team/${teamId}`;
  const items = LOL_TEAM_NAV.flatMap((g) => g.items).filter((it) => !it.managerOnly || isManager);

  return (
    <div
      className="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b px-3 py-2 md:hidden"
      style={{ borderColor: 'var(--lol-border)', background: 'var(--lol-bg-elevated)' }}
    >
      {items.map((item) => (
        <div key={item.id} className="flex-shrink-0">
          <LolTeamNavLink item={item} base={base} accent={resolvedAccent} />
        </div>
      ))}
    </div>
  );
}
