import React from 'react';

interface LolRosterStatusToggleProps {
  /** true = remplaçant (Sub), false = titulaire. */
  isSub:    boolean;
  onChange: (isSub: boolean) => void;
}

/** Bascule Titulaire / Sub (segmenté). */
export function LolRosterStatusToggle({ isSub, onChange }: LolRosterStatusToggleProps): React.JSX.Element {
  const options: { sub: boolean; label: string }[] = [
    { sub: false, label: 'Titulaire' },
    { sub: true,  label: 'Sub' },
  ];

  return (
    <div
      className="inline-flex rounded-sm p-0.5"
      style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}
    >
      {options.map((opt) => {
        const active = isSub === opt.sub;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.sub)}
            aria-pressed={active}
            className="cursor-pointer rounded-sm px-5 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-150"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              background: active ? 'var(--lol-emerald, #10B981)' : 'transparent',
              color: active ? '#0A1428' : 'var(--lol-text-muted)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
