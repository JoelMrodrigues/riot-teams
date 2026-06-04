import React from 'react';

import { ThemeToggle } from './ThemeToggle';

export function Header(): React.JSX.Element {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--brand) 0%, #A78BFA 100%)' }}
        >
          <span
            className="text-white text-xs font-bold"
            style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}
          >
            RT
          </span>
        </div>
        <span
          className="text-white font-bold tracking-widest uppercase"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '1.05rem',
            letterSpacing: '0.18em',
            textShadow: '0 1px 12px rgba(0,0,0,0.6)',
          }}
        >
          Riot Teams
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button className="btn btn-ghost btn-md">Sign In</button>
      </div>
    </header>
  );
}
