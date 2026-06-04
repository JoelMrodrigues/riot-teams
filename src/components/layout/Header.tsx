import React from 'react';

export function Header(): React.JSX.Element {
  return (
    <header
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{
        background:
          'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-sm flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #C89B3C, #FF4655)' }}
        >
          <span
            className="text-white text-xs font-bold tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            RT
          </span>
        </div>
        <span
          className="text-white text-lg font-semibold tracking-wider uppercase"
          style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.15em' }}
        >
          Riot Teams
        </span>
      </div>

      <button
        className="relative px-5 py-2 text-sm font-medium tracking-widest uppercase text-white/80 border border-white/15 rounded-sm cursor-pointer transition-all duration-200 hover:text-white hover:border-white/40 hover:bg-white/5 active:scale-95"
        style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.12em' }}
      >
        Sign In
      </button>
    </header>
  );
}
