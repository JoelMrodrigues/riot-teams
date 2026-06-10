import React from 'react';
import { NavLink } from 'react-router-dom';

import type { LolTeamNavItem } from '../../../../data/lolTeamNav.data';

interface LolTeamNavLinkProps {
  item:   LolTeamNavItem;
  base:   string;
  accent: string;
}

/** Entrée de navigation d'équipe : lien actif/inactif, ou libellé grisé « Bientôt ». */
export function LolTeamNavLink({ item, base, accent }: LolTeamNavLinkProps): React.JSX.Element {
  if (item.soon || item.sub === null) {
    return (
      <span
        className="flex items-center justify-between gap-2 rounded-sm px-3 py-2 text-sm"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)', opacity: 0.6 }}
      >
        {item.label}
        <span
          className="rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}
        >
          Bientôt
        </span>
      </span>
    );
  }

  const to = item.sub === '' ? base : `${base}/${item.sub}`;

  return (
    <NavLink
      to={to}
      end={item.end}
      className="flex items-center justify-between gap-2 rounded-sm px-3 py-2 text-sm font-semibold transition-colors duration-150"
      style={({ isActive }) => ({
        fontFamily: 'Rajdhani, sans-serif',
        color: isActive ? accent : 'var(--lol-text-muted)',
        background: isActive ? `${accent}14` : 'transparent',
        borderLeft: `2px solid ${isActive ? accent : 'transparent'}`,
      })}
    >
      {item.label}
      {item.draft && (
        <span
          className="rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{ background: `${accent}1A`, border: `1px solid ${accent}40`, color: accent }}
        >
          Brouillon
        </span>
      )}
    </NavLink>
  );
}
