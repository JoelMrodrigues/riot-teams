import React from 'react';
import { motion } from 'framer-motion';

import { LolDraftBanner } from '../../../components/lol/teams/drafts/LolDraftBanner';
import { DRAFT_SCRIMS, NEXT_SCRIM } from '../../../data/lolTeamDraftsDemo.data';
import { useTeamOutlet } from './teamOutletContext';

const WIN = 'var(--lol-emerald, #34D399)';
const LOSS = 'var(--danger)';

/** BROUILLON — page Scrims d'une équipe LoL (design proposé, données fictives). */
export function LolTeamScrimsPage(): React.JSX.Element {
  const { resolvedAccent } = useTeamOutlet();
  const wins   = DRAFT_SCRIMS.filter((s) => s.result === 'win').length;
  const losses = DRAFT_SCRIMS.length - wins;

  return (
    <motion.div
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 lg:px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
    >
      <LolDraftBanner
        title="Scrims"
        subtitle="Planifie tes matchs d'entraînement, suis les résultats et les adversaires rencontrés."
        accent={resolvedAccent}
      />

      {/* Prochain scrim — mise en avant */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4 md:p-5"
        style={{ background: `${resolvedAccent}10`, borderColor: `${resolvedAccent}33` }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: resolvedAccent }}>
            Prochain scrim
          </span>
          <span className="text-lg font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
            vs {NEXT_SCRIM.opponent}
          </span>
          <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
            {NEXT_SCRIM.when} · {NEXT_SCRIM.bo}
          </span>
        </div>
        <button
          type="button"
          className="cursor-pointer rounded-sm px-4 py-2 text-sm font-bold uppercase tracking-widest"
          style={{ fontFamily: 'Rajdhani, sans-serif', background: resolvedAccent, color: '#0A1428' }}
        >
          + Planifier
        </button>
      </div>

      {/* Bilan */}
      <div className="flex items-center gap-3 text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
        <span className="font-bold" style={{ color: WIN }}>{wins}V</span>
        <span>/</span>
        <span className="font-bold" style={{ color: LOSS }}>{losses}D</span>
        <span>sur les {DRAFT_SCRIMS.length} derniers scrims</span>
      </div>

      {/* Historique */}
      <div className="flex flex-col gap-2">
        {DRAFT_SCRIMS.map((s, i) => {
          const win = s.result === 'win';
          return (
            <div
              key={`${s.opponent}-${i}`}
              className="flex items-center gap-3 rounded-md border px-4 py-3"
              style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}
            >
              <span className="h-8 w-1 flex-shrink-0 rounded-full" style={{ background: win ? WIN : LOSS }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
                  vs {s.opponent}
                </p>
                <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>{s.date}</p>
              </div>
              <span className="text-sm font-bold tabular-nums" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
                {s.score}
              </span>
              <span
                className="w-16 flex-shrink-0 rounded-sm py-1 text-center text-xs font-bold uppercase"
                style={{ fontFamily: 'Rajdhani, sans-serif', background: win ? `${WIN}1A` : `${LOSS}1A`, color: win ? WIN : LOSS }}
              >
                {win ? 'Victoire' : 'Défaite'}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
