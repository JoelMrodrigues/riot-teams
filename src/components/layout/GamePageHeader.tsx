import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ThemeToggle } from './ThemeToggle';
import type { Game } from '../../types/game.types';

interface GamePageHeaderProps {
  game: Game;
}

export function GamePageHeader({ game }: GamePageHeaderProps): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <header
      className="relative z-50 flex items-center justify-between px-8 flex-shrink-0"
      style={{
        height: '60px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(0,0,0,0.40)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <button
        onClick={() => navigate(`/${game.id}`)}
        className="btn btn-text btn-sm flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ letterSpacing: '0.08em' }}>{game.shortName}</span>
      </button>

      <div className="flex items-center gap-3">
        <div
          className="w-6 h-6 rounded-sm flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--brand), #A78BFA)' }}
        >
          <span className="text-white font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '8px' }}>
            RT
          </span>
        </div>
        <ThemeToggle />
        <button className="btn btn-ghost btn-sm">Sign In</button>
      </div>
    </header>
  );
}
