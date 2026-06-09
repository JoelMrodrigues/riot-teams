import React from 'react';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_EMBLEMS } from '../../../data/lolEmblems.data';
import type { LolTeamIcon, LolRegion } from '../../../types/team.types';

interface LolTeamPreviewProps {
  name:        string;
  tag:         string;
  region:      LolRegion | '';
  accentColor: string;
  icon:        LolTeamIcon | null;
}

/** Aperçu live sticky de l'équipe pendant la saisie du formulaire. */
export function LolTeamPreview({ name, tag, region, accentColor, icon }: LolTeamPreviewProps): React.JSX.Element {
  const displayName = name.trim() || null;

  const renderIcon = () => {
    if (icon?.kind === 'champion') {
      return <ChampionAvatar champKey={icon.value} label={icon.value} size={48} ring={accentColor} />;
    }
    if (icon?.kind === 'emblem') {
      const emblem = LOL_EMBLEMS.find((e) => e.id === icon.value);
      if (emblem) {
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill={accentColor} aria-hidden="true">
            <path d={emblem.path} />
          </svg>
        );
      }
    }
    return (
      <span
        className="text-xl font-bold"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: accentColor }}
      >
        {displayName ? displayName.charAt(0).toUpperCase() : '?'}
      </span>
    );
  };

  return (
    <div
      className="flex items-center gap-3 rounded-md px-4 py-3"
      style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}
      aria-label="Aperçu de l'équipe"
    >
      <div
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm overflow-hidden"
        style={{
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}30`,
        }}
      >
        {renderIcon()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="truncate text-lg font-bold uppercase"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: displayName ? 'var(--lol-text)' : 'var(--lol-text-muted)',
            }}
          >
            {displayName ?? 'NOM DE L\'ÉQUIPE'}
          </span>
          {tag && (
            <span
              className="flex-shrink-0 rounded-sm px-2 py-0.5 text-xs font-bold uppercase"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                border: `1px solid ${accentColor}40`,
                background: `${accentColor}10`,
                color: accentColor,
              }}
            >
              {tag}
            </span>
          )}
        </div>
        <p
          className="text-xs"
          style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
        >
          {region || '—'} · League of Legends
        </p>
      </div>
    </div>
  );
}
