import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { Game } from '../../types/game.types';

interface GamePageHeaderProps {
  game: Game;
}

export function GamePageHeader({ game }: GamePageHeaderProps): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <header
      className="relative z-50 flex items-center justify-between px-8 py-5 flex-shrink-0"
      style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/${game.id}`)}
          className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors duration-200 cursor-pointer group"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {game.shortName}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-6 h-6 rounded-sm flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #C89B3C, #FF4655)' }}
        >
          <span
            className="text-white text-[8px] font-bold"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            RT
          </span>
        </div>

        <button
          className="px-5 py-2 text-sm font-medium tracking-widest uppercase text-white/70 border border-white/15 rounded-sm cursor-pointer transition-all duration-200 hover:text-white hover:border-white/35 hover:bg-white/5 active:scale-95"
          style={{ fontFamily: 'Rajdhani, sans-serif' }}
        >
          Sign In
        </button>
      </div>
    </header>
  );
}
