import React from 'react';

interface LolLiveBadgeProps {
  inGame: boolean;
  label?: string;
}

/** Pastille « en partie » (pulsation) — masquée si le joueur n'est pas en jeu. */
export function LolLiveBadge({ inGame, label = 'En partie' }: LolLiveBadgeProps): React.JSX.Element | null {
  if (!inGame) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider"
      style={{
        fontFamily: 'Rajdhani, sans-serif',
        background: 'rgba(52, 211, 153, 0.12)',
        border: '1px solid rgba(52, 211, 153, 0.4)',
        color: 'var(--lol-emerald, #34D399)',
      }}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full" style={{ background: 'var(--lol-emerald, #34D399)', opacity: 0.6 }} />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--lol-emerald, #34D399)' }} />
      </span>
      {label}
    </span>
  );
}
