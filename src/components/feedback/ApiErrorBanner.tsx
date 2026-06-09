import React from 'react';

interface ApiErrorBannerProps {
  message: string | null;
  onRetry?: () => void;
}

/**
 * Bandeau d'erreur API — remplace StorageErrorBanner pour les erreurs réseau/backend.
 * Ne rend rien si message est null.
 */
export function ApiErrorBanner({ message, onRetry }: ApiErrorBannerProps): React.JSX.Element | null {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 flex items-center justify-between gap-4 rounded-sm px-4 py-3"
      style={{ background: 'var(--danger-muted)', border: '1px solid var(--danger)' }}
    >
      <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}>
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex-shrink-0 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-75"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--danger)' }}
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
