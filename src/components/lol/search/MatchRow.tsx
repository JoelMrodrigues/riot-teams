import React from 'react';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_ACCENTS, LOL_LOSS } from '../../../constants/lolTheme';
import type { MatchInfo } from '../../../types/lolApi.types';

interface MatchRowProps {
  match: MatchInfo;
  onClick?: (match: MatchInfo) => void;
}

const QUEUE_LABELS: Record<MatchInfo['queue'], string> = {
  solo: 'SoloQ', flex: 'Flex', normal: 'Normale', aram: 'ARAM', other: 'Autre',
};

/** Ligne d'historique : champion, file, KDA, CS, résultat. Cliquable si `onClick` fourni. */
export function MatchRow({ match, onClick }: MatchRowProps): React.JSX.Element {
  const edge = match.win ? LOL_ACCENTS.solo.color : LOL_LOSS.color;
  const minutes = Math.floor(match.durationSec / 60);
  const isInteractive = typeof onClick === 'function';

  const handleClick = (): void => {
    if (onClick) onClick(match);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(match);
    }
  };

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      aria-label={isInteractive ? `Voir détails : ${match.champion}, ${match.win ? 'victoire' : 'défaite'}` : undefined}
      className="flex items-center gap-4 rounded-md p-3 transition-colors"
      style={{
        background: 'var(--lol-surface)',
        borderLeft: `3px solid ${edge}`,
        cursor: isInteractive ? 'pointer' : 'default',
        outline: 'none',
      }}
      onFocus={isInteractive ? (e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 2px ${edge}55`; } : undefined}
      onBlur={isInteractive ? (e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; } : undefined}
    >
      <ChampionAvatar champKey={match.champion} label={match.champion} size={44} ring={match.win ? LOL_ACCENTS.solo.gradient : LOL_LOSS.ring} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>{match.champion}</p>
        <p className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>{QUEUE_LABELS[match.queue]} · {minutes} min</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold" style={{ color: 'var(--lol-text)' }}>{match.kills}/{match.deaths}/{match.assists}</p>
        <p className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>{match.kda} KDA · {match.csPerMin} cs/min</p>
      </div>
      <span className="w-8 text-center text-sm font-bold" style={{ color: edge, fontFamily: 'Rajdhani, sans-serif' }}>{match.win ? 'V' : 'D'}</span>
    </div>
  );
}
