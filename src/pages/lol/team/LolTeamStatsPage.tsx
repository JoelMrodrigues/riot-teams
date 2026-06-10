import React from 'react';
import { motion } from 'framer-motion';

import { LolDraftBanner } from '../../../components/lol/teams/drafts/LolDraftBanner';
import { ChampionAvatar } from '../../../components/lol/shared/ChampionAvatar';
import { winrateColor } from '../../../utils/lolRank';
import { DEMO_TEAM_STATS } from '../../../data/lolDemoRoster.data';
import { DRAFT_TEAM_STATS, DRAFT_TEAM_TOP_CHAMPS, DRAFT_RECENT_FORM } from '../../../data/lolTeamDraftsDemo.data';
import { useTeamOutlet } from './teamOutletContext';

const WIN = 'var(--lol-emerald, #34D399)';
const LOSS = 'var(--danger)';

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1 rounded-md border p-4" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>{label}</span>
      <span className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>{value}</span>
      {sub && <span className="text-[11px]" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>{sub}</span>}
    </div>
  );
}

/** BROUILLON — statistiques d'équipe (design proposé, données fictives). */
export function LolTeamStatsPage(): React.JSX.Element {
  const { resolvedAccent } = useTeamOutlet();
  const s = DEMO_TEAM_STATS;

  return (
    <motion.div
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 lg:px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
    >
      <LolDraftBanner
        title="Statistiques d'équipe"
        subtitle="Vue d'ensemble des performances collectives : winrate, côté préféré, champions phares."
        accent={resolvedAccent}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Winrate" value={`${s.winrate}%`} sub={`${s.wins}V · ${s.losses}D`} />
        <StatCard label="Parties" value={`${s.matches}`} />
        <StatCard label="KDA moyen" value={`${s.avgKda}`} />
        <StatCard label="Durée moy." value={DRAFT_TEAM_STATS.avgGameDuration} />
      </div>

      {/* Côté + first blood */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SideBar label="Côté bleu" value={DRAFT_TEAM_STATS.blueWinrate} color="#57A8FF" />
        <SideBar label="Côté rouge" value={DRAFT_TEAM_STATS.redWinrate} color="#FB7185" />
        <SideBar label="First Blood" value={DRAFT_TEAM_STATS.firstBlood} color={resolvedAccent} />
      </div>

      {/* Forme récente */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
          Forme récente
        </span>
        <div className="flex gap-1.5">
          {DRAFT_RECENT_FORM.map((w, i) => (
            <span key={i} title={w ? 'Victoire' : 'Défaite'} className="h-2.5 w-6 rounded-full" style={{ background: w ? WIN : LOSS }} />
          ))}
        </div>
      </div>

      {/* Top champions équipe */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
          Champions les plus joués
        </span>
        {DRAFT_TEAM_TOP_CHAMPS.map((c) => (
          <div key={c.champion} className="flex items-center gap-3 rounded-md border px-3 py-2" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
            <ChampionAvatar champKey={c.champion} label={c.champion} size={34} ring={resolvedAccent} />
            <span className="w-24 flex-shrink-0 truncate text-sm font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>{c.champion}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--lol-bg-elevated)' }}>
              <div className="h-full rounded-full" style={{ width: `${c.winrate}%`, background: winrateColor(c.winrate) }} />
            </div>
            <span className="w-10 flex-shrink-0 text-right text-xs font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: winrateColor(c.winrate) }}>{c.winrate}%</span>
            <span className="w-12 flex-shrink-0 text-right text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>{c.games}g</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SideBar({ label, value, color }: { label: string; value: number; color: string }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2 rounded-md border p-4" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>{label}</span>
        <span className="text-sm font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color }}>{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--lol-bg-elevated)' }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
