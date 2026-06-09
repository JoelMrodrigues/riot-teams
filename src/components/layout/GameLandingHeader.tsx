import React from 'react';
import { useNavigate } from 'react-router-dom';

import { BrandLogo } from './BrandLogo';
import { HeaderActions } from './HeaderActions';
import type { Game } from '../../types/game.types';
import type { GameTab } from '../../types/gameTab.types';

const TABS: { key: GameTab; label: string }[] = [
  { key: 'solo',  label: 'Solo'    },
  { key: 'teams', label: 'Équipes' },
  { key: 'stats', label: 'Stats'   },
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
      className="relative z-50 flex items-center justify-between px-8 flex-shrink-0"
      style={{
        height: '60px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(0,0,0,0.40)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 w-44">
        <button
          onClick={() => navigate('/')}
          className="btn btn-text btn-sm flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <BrandLogo size={20} />
        </button>

        <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.65rem' }}>|</span>

        <span
          className="text-sm font-bold tracking-widest uppercase"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: game.accentColor }}
        >
          {game.tag}
        </span>
      </div>

      {/* Center — tabs */}
      <nav className="flex items-stretch" style={{ height: '60px' }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className="relative px-6 flex items-center text-sm font-semibold tracking-wider uppercase cursor-pointer transition-colors duration-150"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.32)',
                letterSpacing: '0.1em',
              }}
            >
              {tab.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-3 right-3"
                  style={{ height: '2px', background: game.accentColor, borderRadius: '1px 1px 0 0' }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right */}
      <div className="flex items-center justify-end gap-3 w-44">
        <HeaderActions />
      </div>
    </header>
  );
}
