import React from 'react';
import { NavLink } from 'react-router-dom';

import { LOL_NAV } from '../../../config/lolNav';

/** Liens centraux du header LoL, avec indicateur d'onglet actif. */
export function LolNavLinks(): React.JSX.Element {
  return (
    <nav className="flex items-stretch h-full">
      {LOL_NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className="relative flex items-center px-5 text-sm font-semibold uppercase transition-colors duration-150"
          style={({ isActive }) => ({
            fontFamily: 'Rajdhani, sans-serif',
            letterSpacing: '0.1em',
            color: isActive ? 'var(--lol-text)' : 'var(--lol-text-muted)',
          })}
        >
          {({ isActive }) => (
            <>
              {item.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-3 right-3"
                  style={{
                    height: '2px',
                    borderRadius: '1px 1px 0 0',
                    background: 'var(--lol-violet)',
                    boxShadow: '0 0 12px var(--lol-glow)',
                  }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
