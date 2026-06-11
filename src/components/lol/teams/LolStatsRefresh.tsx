import React from 'react';

interface LolStatsRefreshProps {
  updatedAt: number | null;
  loading: boolean;
  onRefresh: () => void;
}

/** Indicateur « rangs mis à jour à … » + bouton de rafraîchissement manuel. */
export function LolStatsRefresh({ updatedAt, loading, onRefresh }: LolStatsRefreshProps): React.JSX.Element {
  const time = updatedAt
    ? new Date(updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={loading}
      title="Rafraîchir les rangs"
      className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest transition-opacity hover:opacity-80 disabled:opacity-50"
      style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
    >
      <span className={loading ? 'inline-block animate-spin' : 'inline-block'} aria-hidden>↻</span>
      Rangs maj {time}
    </button>
  );
}
