import React from 'react';

import { FilterChip } from './FilterChip';
import type { MatchFilters as Filters } from '../../../hooks/useMatchFilters';
import type { QueueKind, RoleKind } from '../../../types/lolApi.types';

interface MatchFiltersProps {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  champions: string[];
}

const QUEUES: { v: QueueKind | 'all'; l: string }[] = [
  { v: 'all', l: 'Toutes' }, { v: 'solo', l: 'SoloQ' }, { v: 'flex', l: 'Flex' },
  { v: 'normal', l: 'Normales' }, { v: 'aram', l: 'ARAM' },
];
const RESULTS: { v: 'all' | 'win' | 'loss'; l: string }[] = [
  { v: 'all', l: 'Tous' }, { v: 'win', l: 'Victoires' }, { v: 'loss', l: 'Défaites' },
];
const ROLES: { v: RoleKind | 'all'; l: string }[] = [
  { v: 'all', l: 'Tous' }, { v: 'TOP', l: 'Top' }, { v: 'JUNGLE', l: 'Jungle' },
  { v: 'MIDDLE', l: 'Mid' }, { v: 'BOTTOM', l: 'ADC' }, { v: 'UTILITY', l: 'Supp' },
];

function Group({ label, children }: { label: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lol-text-muted)' }}>{label}</span>
      {children}
    </div>
  );
}

/** Barre de filtres de l'historique. */
export function MatchFilters({ filters, setFilter, champions }: MatchFiltersProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 rounded-md p-4" style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}>
      <Group label="File">
        {QUEUES.map((q) => <FilterChip key={q.v} label={q.l} active={filters.queue === q.v} onClick={() => setFilter('queue', q.v)} />)}
      </Group>
      <Group label="Résultat">
        {RESULTS.map((r) => <FilterChip key={r.v} label={r.l} active={filters.result === r.v} onClick={() => setFilter('result', r.v)} />)}
      </Group>
      <Group label="Rôle">
        {ROLES.map((r) => <FilterChip key={r.v} label={r.l} active={filters.role === r.v} onClick={() => setFilter('role', r.v)} />)}
      </Group>
      <Group label="Champ.">
        <select
          value={filters.champion}
          onChange={(e) => setFilter('champion', e.target.value)}
          className="rounded-md px-3 py-1.5 text-xs outline-none"
          style={{ fontFamily: 'Rajdhani, sans-serif', background: 'var(--lol-bg-elevated)', border: '1px solid var(--lol-border)', color: 'var(--lol-text)' }}
        >
          <option value="all">Tous</option>
          {champions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Group>
    </div>
  );
}
