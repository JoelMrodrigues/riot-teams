import React from 'react';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { winrateColor } from '../../../utils/lolRank';
import type { LolTopChampion } from '../../../types/lolTeam.types';

interface LolPlayerCardChampionsProps {
  champions: LolTopChampion[];
  accent: string;
  /** Taille de l'avatar champion (px). Défaut 36 (carte compacte). */
  size?: number;
}

/**
 * Mini-grille Top 5 champions : nb de games au-dessus de l'avatar,
 * winrate coloré en dessous. Taille d'avatar paramétrable.
 */
export function LolPlayerCardChampions({
  champions,
  accent,
  size = 36,
}: LolPlayerCardChampionsProps): React.JSX.Element {
  if (champions.length === 0) {
    return (
      <p
        className="text-center text-xs"
        style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        Aucune donnée
      </p>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {champions.slice(0, 5).map((champ) => (
        <div
          key={champ.champion}
          className="flex flex-col items-center gap-1"
          title={`${champ.champion} — ${champ.games} games, ${champ.winrate}%`}
        >
          <span
            className="text-[11px] font-semibold leading-none"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
          >
            {champ.games}
          </span>

          <ChampionAvatar champKey={champ.champion} label={champ.champion} size={size} ring={accent} />

          <span
            className="text-[11px] font-semibold leading-none"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: winrateColor(champ.winrate) }}
          >
            {champ.winrate}%
          </span>
        </div>
      ))}
    </div>
  );
}
