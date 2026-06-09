import React from 'react';

import { BaseModal } from '../../ui/BaseModal';
import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_ACCENTS, LOL_LOSS } from '../../../constants/lolTheme';
import { useLolTheme } from '../../../hooks/useLolTheme';
import type { MatchInfo } from '../../../types/lolApi.types';

interface MatchDetailModalProps {
  match: MatchInfo | null;
  onClose: () => void;
}

const QUEUE_LABELS: Record<MatchInfo['queue'], string> = {
  solo: 'SoloQ', flex: 'Flex', normal: 'Normale', aram: 'ARAM', other: 'Autre',
};

const ROLE_LABELS: Record<MatchInfo['role'], string> = {
  TOP: 'Top', JUNGLE: 'Jungle', MIDDLE: 'Mid', BOTTOM: 'ADC', UTILITY: 'Support', UNKNOWN: '—',
};

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

function formatDate(unix: number): string {
  return new Date(unix).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Modal de détail d'un match : stats disponibles + placeholder stats complètes. */
export function MatchDetailModal({ match, onClose }: MatchDetailModalProps): React.JSX.Element {
  const { vars } = useLolTheme();
  const isOpen = match !== null;

  if (!match) {
    return <BaseModal isOpen={false} onClose={onClose} panelStyle={vars}><></></BaseModal>;
  }

  const accent = match.win ? LOL_ACCENTS.solo : LOL_LOSS;
  const resultLabel = match.win ? 'Victoire' : 'Défaite';
  const resultColor = match.win ? LOL_ACCENTS.solo.color : LOL_LOSS.color;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" panelStyle={vars}>
      {/* En-tête champion + résultat */}
      <div className="flex items-center gap-4">
        <ChampionAvatar
          champKey={match.champion}
          label={match.champion}
          size={56}
          ring={match.win ? LOL_ACCENTS.solo.gradient : LOL_LOSS.ring}
        />
        <div>
          <p className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
            {match.champion}
          </p>
          <p className="text-sm font-bold uppercase tracking-wider" style={{ color: resultColor }}>
            {resultLabel}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto rounded-md p-1.5 transition-colors"
          style={{ color: 'var(--lol-text-muted)', background: 'transparent', border: '1px solid var(--lol-border)' }}
          aria-label="Fermer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Infos contextuelles */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <StatCell label="File" value={QUEUE_LABELS[match.queue]} />
        <StatCell label="Rôle" value={ROLE_LABELS[match.role]} />
        <StatCell label="Durée" value={formatDuration(match.durationSec)} />
        <StatCell label="Date" value={formatDate(match.gameEndUnix)} />
      </div>

      {/* KDA + CS */}
      <div className="mt-2 grid grid-cols-3 gap-2">
        <StatCell label="KDA" value={`${match.kda}`} highlight={accent} />
        <StatCell label="K / D / A" value={`${match.kills} / ${match.deaths} / ${match.assists}`} />
        <StatCell label="CS / min" value={`${match.cs} (${match.csPerMin})`} />
      </div>

      {/* Placeholder stats complètes */}
      <div
        className="mt-2 rounded-md px-4 py-3"
        style={{ background: 'var(--lol-surface)', border: '1px dashed var(--lol-border)' }}
      >
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lol-text-muted)', fontFamily: 'Rajdhani, sans-serif' }}>
          Statistiques détaillées — bientôt
        </p>
        <p className="mt-1 text-xs" style={{ color: 'var(--lol-text-muted)' }}>
          Items, sorts, équipe complète (10 joueurs) disponibles après branchement de /api/lol/match.
        </p>
      </div>
    </BaseModal>
  );
}

interface StatCellProps {
  label: string;
  value: string;
  highlight?: { color: string };
}

function StatCell({ label, value, highlight }: StatCellProps): React.JSX.Element {
  return (
    <div
      className="flex flex-col gap-0.5 rounded-md px-3 py-2"
      style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--lol-text-muted)' }}>{label}</span>
      <span
        className="text-sm font-bold"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: highlight?.color ?? 'var(--lol-text)' }}
      >
        {value}
      </span>
    </div>
  );
}
