import React from 'react';

import { championSquareById, summonerSpellIcon } from '../../../utils/lolAssets';
import { tierColor, formatRankShort } from '../../../utils/lolRank';
import type { LiveParticipant } from '../../../types/lolLive.types';

interface LolLiveParticipantProps {
  p: LiveParticipant;
  isMe: boolean;
  accent: string;
}

/** Ligne joueur dans la vue live : champion + sorts + Riot ID (surligné si c'est le joueur cherché). */
export function LolLiveParticipant({ p, isMe, accent }: LolLiveParticipantProps): React.JSX.Element {
  const name = p.riotId || p.summonerName || '—';

  return (
    <div
      className="flex items-center gap-2 rounded-sm px-2 py-1.5"
      style={{ background: isMe ? `${accent}1A` : 'transparent', border: `1px solid ${isMe ? `${accent}40` : 'transparent'}` }}
    >
      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-sm" style={{ background: 'var(--lol-bg-elevated)' }}>
        <img
          src={championSquareById(p.championId)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
        />
      </div>

      <div className="flex flex-shrink-0 flex-col gap-0.5">
        {[p.spell1Id, p.spell2Id].map((s, i) => {
          const src = summonerSpellIcon(s);
          return (
            <div key={i} className="h-4 w-4 overflow-hidden rounded-[2px]" style={{ background: 'var(--lol-bg-elevated)' }}>
              {src && <img src={src} alt="" className="h-full w-full object-cover" />}
            </div>
          );
        })}
      </div>

      <span
        className="min-w-0 flex-1 truncate text-sm"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: isMe ? accent : 'var(--lol-text)', fontWeight: isMe ? 700 : 500 }}
      >
        {name}
      </span>

      {p.rank ? (
        <span className="flex-shrink-0 text-right text-xs font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: tierColor(p.rank.tier) }}>
          {formatRankShort(p.rank.tier, p.rank.rank)}
          <span className="ml-1 font-normal" style={{ color: 'var(--lol-text-muted)' }}>{p.rank.lp} LP</span>
        </span>
      ) : (
        <span className="flex-shrink-0 text-xs" style={{ color: 'var(--lol-text-muted)' }}>Non classé</span>
      )}
    </div>
  );
}
