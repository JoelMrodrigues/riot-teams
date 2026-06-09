import React from 'react';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_ACCENTS, LOL_LOSS } from '../../../constants/lolTheme';
import { computeTopWinrateLast7Days } from '../../../utils/lolChampionStats';
import type { MatchInfo } from '../../../types/lolApi.types';

interface WinrateLast7CardProps {
  matches: MatchInfo[];
}

/**
 * Carte "Winrate 7 derniers jours" (colonne gauche).
 * Top 5 champions par winrate sur les parties des 7 jours passés.
 * Si aucune partie récente : état vide discret.
 */
export function WinrateLast7Card({ matches }: WinrateLast7CardProps): React.JSX.Element {
  const stats = computeTopWinrateLast7Days(matches, 5);

  return (
    <section
      className="flex flex-col gap-3 rounded-md p-4"
      style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}
      aria-label="Meilleur winrate sur 7 jours"
    >
      <p
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--lol-text-muted)' }}
      >
        Winrate — 7 derniers jours
      </p>

      {stats.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {stats.map((s) => {
            const winColor = s.winrate >= 50 ? LOL_ACCENTS.solo.color : LOL_LOSS.color;
            return (
              <div
                key={s.champion}
                className="flex items-center gap-2 rounded px-2 py-1.5"
                style={{ background: 'var(--lol-bg-elevated)' }}
              >
                <ChampionAvatar champKey={s.champion} label={s.champion} size={30} />
                <span
                  className="min-w-0 flex-1 truncate text-xs font-bold"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
                >
                  {s.champion}
                </span>
                <span className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>
                  {s.games}p
                </span>
                <span
                  className="w-12 text-right text-xs font-bold"
                  style={{ color: winColor }}
                >
                  {s.winrate}%
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>
          Aucune partie dans les 7 derniers jours.
        </p>
      )}
    </section>
  );
}
