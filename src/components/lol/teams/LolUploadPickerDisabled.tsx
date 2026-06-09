import React from 'react';

/** Onglet Upload désactivé — aucune logique, purement déclaratif. */
export function LolUploadPickerDisabled(): React.JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 rounded-sm py-8"
      style={{
        background: 'var(--lol-surface)',
        border: '1px dashed var(--lol-border)',
      }}
      aria-label="Upload non disponible"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: 'var(--lol-text-muted)' }}
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p
        className="text-sm font-bold uppercase tracking-wider"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        Bientôt disponible
      </p>
      <p
        className="max-w-[200px] text-center text-xs"
        style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        Cette fonctionnalité sera disponible une fois la base de données connectée.
      </p>
    </div>
  );
}
