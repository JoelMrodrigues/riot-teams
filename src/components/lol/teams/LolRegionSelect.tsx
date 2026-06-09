import React from 'react';

import type { LolRegion } from '../../../types/team.types';

const REGIONS: LolRegion[] = ['EUW', 'EUNE', 'NA', 'KR', 'BR', 'LAN', 'LAS', 'OCE', 'JP', 'TR', 'RU'];

interface LolRegionSelectProps {
  value:    LolRegion | '';
  onChange: (region: LolRegion) => void;
}

/** Select natif stylé pour choisir la région Riot d'une équipe LoL. */
export function LolRegionSelect({ value, onChange }: LolRegionSelectProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="lol-region-select"
        className="text-xs font-bold uppercase tracking-[0.15em]"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        Région / Serveur
      </label>
      <select
        id="lol-region-select"
        value={value}
        onChange={(e) => onChange(e.target.value as LolRegion)}
        aria-required="true"
        className="rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--lol-text)',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 600,
          letterSpacing: '0.05em',
          cursor: 'pointer',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--lol-violet)')}
        onBlur={(e)  => (e.currentTarget.style.borderColor = 'var(--border-default)')}
      >
        {REGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
}
