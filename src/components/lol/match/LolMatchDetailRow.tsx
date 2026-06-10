import React from 'react';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { summonerSpellIcon } from '../../../utils/lolAssets';
import { itemIcon } from '../../../utils/lolStaticAssets';
import type { MatchDetailParticipant } from '../../../types/lolMatchDetail.types';

interface LolMatchDetailRowProps {
  p: MatchDetailParticipant;
  accent: string;
}

/** Une ligne joueur dans le détail de match : champion, sorts, KDA, CS, items. */
export function LolMatchDetailRow({ p, accent }: LolMatchDetailRowProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 py-1">
      <ChampionAvatar champKey={p.champion} label={p.champion} size={30} ring={accent} />

      <div className="flex flex-shrink-0 flex-col gap-0.5">
        {p.spells.map((s, i) => {
          const src = summonerSpellIcon(s);
          return (
            <div key={i} className="h-3.5 w-3.5 overflow-hidden rounded-[3px]" style={{ background: 'var(--lol-bg-elevated)' }}>
              {src && <img src={src} alt="" className="h-full w-full object-cover" />}
            </div>
          );
        })}
      </div>

      <div className="w-28 min-w-0 flex-shrink-0">
        <p className="truncate text-xs font-semibold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
          {p.riotId}
        </p>
        <p className="text-[10px]" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>Niv. {p.champLevel}</p>
      </div>

      <div className="w-16 flex-shrink-0 text-center">
        <p className="text-xs font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
          {p.kills}/{p.deaths}/{p.assists}
        </p>
        <p className="text-[10px]" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>{p.kda} KDA</p>
      </div>

      <div className="w-12 flex-shrink-0 text-center text-[10px]" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
        {p.cs} CS
      </div>

      <div className="ml-auto flex flex-shrink-0 gap-0.5">
        {p.items.map((id, i) => {
          const src = itemIcon(id);
          return (
            <div key={i} className="h-6 w-6 overflow-hidden rounded-[3px]" style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}>
              {src && (
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
