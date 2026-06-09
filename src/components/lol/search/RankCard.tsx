import React, { useState } from 'react';

import { LOL_ACCENTS } from '../../../constants/lolTheme';
import { rankCrest } from '../../../utils/lolAssets';
import type { RankInfo } from '../../../types/lolApi.types';

interface RankCardProps {
  ranks: RankInfo[];
}

const LABELS: Record<'solo' | 'flex', string> = { solo: 'Solo/Duo', flex: 'Flex' };

/**
 * Carte de classement (colonne gauche du profil) : Solo/Duo + Flex.
 * Version compacte adaptée à la colonne 320 px (pas de minWidth fixe).
 */
export function RankCard({ ranks }: RankCardProps): React.JSX.Element {
  return (
    <section
      className="flex flex-col gap-3 rounded-md p-4"
      style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}
      aria-label="Classement"
    >
      <p
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--lol-text-muted)' }}
      >
        Classement
      </p>

      {ranks.length > 0 ? (
        <div className="flex flex-col gap-2">
          {ranks.map((r) => <RankRow key={r.queue} entry={r} />)}
        </div>
      ) : (
        <p className="text-sm" style={{ color: 'var(--lol-text-muted)' }}>Non classé</p>
      )}
    </section>
  );
}

function RankRow({ entry }: { entry: RankInfo }): React.JSX.Element {
  const [crestOk, setCrestOk] = useState(true);
  const accent = entry.queue === 'solo' ? LOL_ACCENTS.solo : LOL_ACCENTS.team;
  const games = entry.wins + entry.losses;
  const crest = rankCrest(entry.tier);

  return (
    <div
      className="flex items-center gap-3 rounded-md p-3"
      style={{ background: 'var(--lol-bg-elevated)', border: `1px solid ${accent.color}33` }}
    >
      {crest && crestOk && (
        <img
          src={crest}
          alt={entry.tier}
          onError={() => setCrestOk(false)}
          className="h-12 w-12 flex-shrink-0 object-contain"
        />
      )}
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: accent.soft }}
        >
          {LABELS[entry.queue]}
        </span>
        <p
          className="text-base font-bold"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
        >
          {entry.tier} {entry.rank} · {entry.lp} LP
        </p>
        <div className="flex items-center gap-2 text-xs">
          <span style={{ color: 'var(--lol-text-muted)' }}>{games} parties</span>
          <span className="font-bold" style={{ color: accent.color }}>{entry.winrate}% WR</span>
        </div>
      </div>
    </div>
  );
}
