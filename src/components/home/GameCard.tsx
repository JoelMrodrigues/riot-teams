import React from 'react';
import { useNavigate } from 'react-router-dom';

import { LolSplash } from './lol-splash/LolSplash';
import type { Game } from '../../types/game.types';

interface GameCardProps {
  game: Game;
  isActive: boolean;
  isAnyActive: boolean;
  flexGrow: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const E = 'cubic-bezier(0.65, 0, 0.35, 1)';

export const GameCard = React.memo(function GameCard({
  game,
  isActive,
  isAnyActive,
  flexGrow,
  onMouseEnter,
  onMouseLeave,
}: GameCardProps): React.JSX.Element {
  const navigate = useNavigate();
  const open = (): void => { void navigate(`/${game.id}`); };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Ouvrir ${game.name}`}
      className="relative h-full cursor-pointer select-none overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
      style={{ flexGrow, flexShrink: 1, flexBasis: 0, minWidth: 0, transition: `flex-grow 0.55s ${E}` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
    >
      {/* Fond : splash animé pour LoL, image statique sinon */}
      {game.id === 'lol' ? (
        <LolSplash active={isActive} />
      ) : (
        <img
          src={game.imagePath}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: isActive ? 'scale(1.07)' : 'scale(1.0)', transition: `transform 0.9s ${E}`, willChange: 'transform' }}
        />
      )}

      <div className="absolute inset-0" style={{ background: game.gradientStyle }} />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 110%, ${game.accentColor}28 0%, transparent 60%)`,
          opacity: isActive ? 1 : 0,
          transition: `opacity 0.45s ${E}`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '2px',
          background: `linear-gradient(to right, transparent, ${game.accentColor}, transparent)`,
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
          transition: `opacity 0.35s ${E}, transform 0.45s ${E}`,
        }}
      />
      <div className="absolute right-0 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

      {/* Contenu */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 pb-8 sm:p-8 sm:pb-10">
        <div className="mb-3 self-start" style={{ opacity: isAnyActive && !isActive ? 0.3 : 1, transition: `opacity 0.25s ${E}` }}>
          <span
            className="rounded-sm border px-3 py-1 text-xs font-bold uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: game.accentColor, borderColor: `${game.accentColor}50`, background: `${game.accentColor}15` }}
          >
            {game.tag}
          </span>
        </div>

        {/* Label fixe en bas → se fond au survol pour révéler l'invite à scroller */}
        <div className="relative min-h-[3.5rem]">
          <h2
            className="text-4xl font-bold leading-none text-white sm:text-5xl"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              textShadow: '0 2px 24px rgba(0,0,0,0.9)',
              opacity: isActive ? 0 : isAnyActive ? 0.35 : 1,
              transition: `opacity 0.3s ${E}`,
            }}
          >
            {game.shortName}
          </h2>
          <span
            className="absolute bottom-1 left-0 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              textShadow: '0 2px 18px rgba(0,0,0,0.9)',
              opacity: isActive ? 1 : 0,
              transition: `opacity 0.3s ${E}`,
            }}
          >
            <span aria-hidden>↓</span> voir les infos en dessous
          </span>
        </div>
      </div>
    </div>
  );
});
