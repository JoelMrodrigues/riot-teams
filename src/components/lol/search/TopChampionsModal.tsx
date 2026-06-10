import React from 'react';

import { BaseModal } from '../../ui/BaseModal';
import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_ACCENTS, LOL_LOSS } from '../../../constants/lolTheme';
import { useLolTheme } from '../../../hooks/useLolTheme';
import { computeTopChampions } from '../../../utils/lolChampionStats';
import type { MatchInfo } from '../../../types/lolApi.types';

interface TopChampionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: MatchInfo[];
}

/** Modal listant le top 10 des champions les plus joués, agrégés sur les matchs. */
export function TopChampionsModal({ isOpen, onClose, matches }: TopChampionsModalProps): React.JSX.Element {
  const { vars } = useLolTheme();
  const champions = computeTopChampions(matches, 10);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg" panelStyle={vars}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2
            className="text-lg font-bold uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
          >
            Top champions
          </h2>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--lol-text-muted)' }}>
            Sur les {matches.length} dernières parties chargées
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-text btn-sm text-lg leading-none"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {champions.map((champ, i) => (
          <ChampionStatRow key={champ.champion} champ={champ} rank={i + 1} />
        ))}
        {champions.length === 0 && (
          <p className="py-6 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>
            Aucune partie disponible.
          </p>
        )}
      </div>
    </BaseModal>
  );
}

interface ChampionStatRowProps {
  champ: ReturnType<typeof computeTopChampions>[number];
  rank: number;
}

function ChampionStatRow({ champ, rank }: ChampionStatRowProps): React.JSX.Element {
  const winColor = champ.winrate >= 50 ? LOL_ACCENTS.solo.color : LOL_LOSS.color;

  return (
    <div
      className="flex items-center gap-3 rounded-md px-3 py-2"
      style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}
    >
      <span
        className="w-5 text-center text-xs font-bold"
        style={{ color: 'var(--lol-text-muted)', fontFamily: 'Rajdhani, sans-serif' }}
      >
        {rank}
      </span>

      <ChampionAvatar champKey={champ.champion} label={champ.champion} size={36} />

      <span
        className="min-w-0 flex-1 truncate text-sm font-bold"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
      >
        {champ.champion}
      </span>

      <div className="flex items-center gap-4 text-xs">
        <span style={{ color: 'var(--lol-text-muted)' }}>
          {champ.games} partie{champ.games > 1 ? 's' : ''}
        </span>
        <span className="font-bold w-12 text-right" style={{ color: winColor }}>
          {champ.winrate}% WR
        </span>
        <span className="w-16 text-right" style={{ color: 'var(--lol-violet-soft)', fontFamily: 'Rajdhani, sans-serif' }}>
          {champ.kda} KDA
        </span>
      </div>
    </div>
  );
}
