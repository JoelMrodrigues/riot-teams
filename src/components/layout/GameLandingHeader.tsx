import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { Game } from '../../types/game.types';
import type { GameTab } from '../../types/gameTab.types';

const TABS: { key: GameTab; label: string }[] = [
  { key: 'solo', label: 'Solo' },
  { key: 'teams', label: 'Équipes' },
  { key: 'stats', label: 'Stats' },
];

interface GameLandingHeaderProps {
  game: Game;
  activeTab: GameTab;
  onTabChange: (tab: GameTab) => void;
}

export function GameLandingHeader({
  game,
  activeTab,
  onTabChange,
}: GameLandingHeaderProps): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <header
      className="relative z-50 flex items-center justify-between px-8 py-4 flex-shrink-0 border-b"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      {/* Left — back + logo */}
      <div className="flex items-center gap-4 w-48">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/35 hover:text-white/70 transition-colors duration-200 cursor-pointer group"
        >
          <svg
            width="14"
            height="14"
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
        </button>

        <span className="text-white/15 text-xs">/</span>

        <span
          className="text-sm font-bold tracking-wider uppercase"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: game.accentColor }}
        >
          {game.tag}
        </span>
      </div>

      {/* Center — tabs */}
      <nav className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className="relative px-5 py-2 text-sm font-semibold tracking-wider uppercase cursor-pointer transition-colors duration-150"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.3)',
            }}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span
                className="absolute bottom-0 left-3 right-3 h-px"
                style={{ background: game.accentColor }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Right — sign in */}
      <div className="flex justify-end w-48">
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
