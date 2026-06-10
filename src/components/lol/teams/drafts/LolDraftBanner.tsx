import React from 'react';

interface LolDraftBannerProps {
  title:    string;
  subtitle: string;
  accent:   string;
}

/**
 * En-tête commun aux pages « brouillon » (Scrims, Statistiques, Calendrier).
 * Affiche un badge « Brouillon » pour rappeler que la mise en page est une
 * proposition de design (données fictives, à brancher plus tard).
 */
export function LolDraftBanner({ title, subtitle, accent }: LolDraftBannerProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h1
          className="text-2xl font-bold md:text-3xl"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
        >
          {title}
        </h1>
        <p className="max-w-xl text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
          {subtitle}
        </p>
      </div>
      <span
        className="flex-shrink-0 rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest"
        style={{ fontFamily: 'Rajdhani, sans-serif', background: `${accent}1A`, border: `1px solid ${accent}40`, color: accent }}
        title="Maquette de design — données fictives"
      >
        Brouillon
      </span>
    </div>
  );
}
