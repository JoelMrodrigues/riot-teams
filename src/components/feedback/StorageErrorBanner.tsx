import React from 'react';

interface StorageErrorBannerProps {
  message: string | null;
  onDismiss: () => void;
}

/**
 * Bandeau d'alerte non bloquant affiché quand la persistance locale échoue.
 * Ne rend rien tant qu'il n'y a pas de message.
 */
export function StorageErrorBanner({ message, onDismiss }: StorageErrorBannerProps): React.JSX.Element | null {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-4 rounded-sm px-4 py-3"
      style={{ background: 'var(--danger-muted)', border: '1px solid var(--danger)' }}
    >
      <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}>
        {message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fermer l'alerte"
        className="btn btn-text btn-sm text-lg leading-none"
        style={{ color: 'var(--danger)' }}
      >
        ✕
      </button>
    </div>
  );
}
