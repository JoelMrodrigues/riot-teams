import React from 'react';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import type { LolTopChampion } from '../../../types/lolTeam.types';

interface LolPlayerCardChampionsProps {
  champions: LolTopChampion[];
  accent: string;
}

/** Retourne la couleur CSS du winrate selon sa valeur (tokens charte). */
function winrateColor(wr: number): string {
  if (wr >= 60) return 'var(--lol-emerald, #34D399)';
  if (wr >= 50) return 'var(--lol-amber, #FBBF24)';
  if (wr >= 40) return '#F97316'; // orange
  return 'var(--danger)';
}

/**
 * Mini-grille Top 5 champions dans une LolPlayerCard.
 * Nb de games au-dessus de l'avatar, winrate coloré en dessous.
 */
export function LolPlayerCardChampions({
  champions,
  accent,
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
    <div className="grid grid-cols-5 gap-1">
      {champions.slice(0, 5).map((champ) => (
        <div
          key={champ.champion}
          className="flex flex-col items-center gap-0.5"
          title={`${champ.champion} — ${champ.games} games, ${champ.winrate}%`}
        >
          <span
            className="text-[10px] font-semibold leading-none"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
          >
            {champ.games}
          </span>

          <ChampionAvatar
            champKey={champ.champion}
            label={champ.champion}
            size={36}
            ring={accent}
          />

          <span
            className="text-[10px] font-semibold leading-none"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: winrateColor(champ.winrate) }}
          >
            {champ.winrate}%
          </span>
        </div>
      ))}
    </div>
  );
}
