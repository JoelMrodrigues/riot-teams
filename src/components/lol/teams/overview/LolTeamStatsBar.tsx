import React from 'react';

interface LolTeamStatsBarProps {
  winrate: number;
  wins:    number;
  losses:  number;
  matches: number;
  avgKda:  number;
  /** Indique des données de démonstration (placeholder). */
  demo?:   boolean;
}

/** Ligne de stats d'équipe : winrate, bilan V/D, nb de matchs, KDA moyen. */
export function LolTeamStatsBar({ winrate, wins, losses, matches, avgKda, demo }: LolTeamStatsBarProps): React.JSX.Element {
  const wrColor = winrate >= 50 ? 'var(--lol-emerald, #34D399)' : 'var(--danger)';

  return (
    <div
      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
      style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
    >
      <span className="font-bold" style={{ color: wrColor }}>{winrate}%</span>
      <span>winrate —</span>
      <span className="font-semibold" style={{ color: 'var(--lol-emerald, #34D399)' }}>{wins}V</span>
      <span>/</span>
      <span className="font-semibold" style={{ color: 'var(--danger)' }}>{losses}D</span>
      <span>sur {matches} matchs</span>
      <span aria-hidden className="opacity-40">·</span>
      <span>KDA moy. <span className="font-bold" style={{ color: 'var(--lol-text)' }}>{avgKda}</span></span>
      {demo && (
        <span
          className="rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={{ fontFamily: 'Rajdhani, sans-serif', background: 'var(--lol-surface)', color: 'var(--lol-text-muted)' }}
          title="Données de démonstration (à brancher sur les matchs d'équipe)"
        >
          démo
        </span>
      )}
    </div>
  );
}
