import React from 'react';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_ACCENTS } from '../../../constants/lolTheme';
import type { MatchSummary } from '../../../types/lolPlayer.types';

interface MatchRowProps {
  match: MatchSummary;
}

const QUEUE_LABELS: Record<MatchSummary['queue'], string> = {
  solo: 'SoloQ', flex: 'Flex', normal: 'Normale', aram: 'ARAM', other: 'Autre',
};

/** Ligne d'historique : champion, file, KDA, CS, durée, résultat. */
export function MatchRow({ match }: MatchRowProps): React.JSX.Element {
  const win = match.win;
  const edge = win ? LOL_ACCENTS.solo.color : '#fb7185';
  const minutes = Math.floor(match.durationSec / 60);

  return (
    <div
      className="flex items-center gap-4 rounded-xl p-3"
      style={{ background: 'var(--lol-surface)', borderLeft: `3px solid ${edge}` }}
    >
      <ChampionAvatar champKey={match.champion} label={match.champion} size={44} ring={win ? LOL_ACCENTS.solo.gradient : 'rgba(244,63,94,0.8)'} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>{match.champion}</p>
        <p className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>{QUEUE_LABELS[match.queue]} · {minutes} min</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold" style={{ color: 'var(--lol-text)' }}>{match.kills}/{match.deaths}/{match.assists}</p>
        <p className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>{match.kda} KDA · {match.csPerMin} cs/min</p>
      </div>

      <span className="w-10 text-center text-sm font-bold uppercase" style={{ color: edge, fontFamily: 'Rajdhani, sans-serif' }}>
        {win ? 'V' : 'D'}
      </span>
    </div>
  );
}
