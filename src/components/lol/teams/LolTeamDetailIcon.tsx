import React, { useState } from 'react';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_EMBLEMS } from '../../../data/lolEmblems.data';
import type { LolApiTeam } from '../../../types/lolTeam.types';

interface LolTeamDetailIconProps {
  team:           LolApiTeam;
  resolvedAccent: string;
  logoUrl:        string;
}

/**
 * Icône de la carte d'équipe LoL en page détail.
 * Priorité : logo uploadé → champion → emblème → initiale.
 * Fallback sur onError si le logo 404.
 */
export function LolTeamDetailIcon({
  team,
  resolvedAccent,
  logoUrl,
}: LolTeamDetailIconProps): React.JSX.Element {
  const [logoError, setLogoError] = useState(false);

  if (logoUrl && !logoError) {
    return (
      <img
        src={logoUrl}
        alt={`Logo ${team.name}`}
        width={56}
        height={56}
        loading="lazy"
        onError={() => setLogoError(true)}
        className="h-14 w-14 rounded-md object-cover flex-shrink-0"
        style={{ border: `2px solid ${resolvedAccent}40` }}
      />
    );
  }

  if (team.icon?.kind === 'champion') {
    return (
      <ChampionAvatar
        champKey={team.icon.value}
        label={team.icon.value}
        size={56}
        ring={resolvedAccent}
      />
    );
  }

  if (team.icon?.kind === 'emblem') {
    const emblem = LOL_EMBLEMS.find((e) => e.id === team.icon!.value);
    if (emblem) {
      return (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-sm"
          style={{ background: `${resolvedAccent}15`, border: `1px solid ${resolvedAccent}40` }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill={resolvedAccent} aria-hidden="true">
            <path d={emblem.path} />
          </svg>
        </div>
      );
    }
  }

  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-sm text-2xl font-bold flex-shrink-0"
      style={{
        background: `${resolvedAccent}18`,
        border: `1px solid ${resolvedAccent}30`,
        fontFamily: 'Rajdhani, sans-serif',
        color: resolvedAccent,
      }}
    >
      {team.name.charAt(0).toUpperCase()}
    </div>
  );
}
