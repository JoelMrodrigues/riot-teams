import React from 'react';

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

/** Bouton-pilule réutilisable pour les filtres. */
export function FilterChip({ label, active, onClick }: FilterChipProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
      style={{
        fontFamily: 'Rajdhani, sans-serif',
        color: active ? '#fff' : 'var(--lol-text-muted)',
        background: active ? 'var(--lol-violet-strong)' : 'var(--lol-surface)',
        border: '1px solid var(--lol-border)',
      }}
    >
      {label}
    </button>
  );
}
