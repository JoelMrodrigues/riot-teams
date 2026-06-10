import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { LolCreateEventModal } from '../../../components/lol/teams/events/LolCreateEventModal';
import { useTeamEvents } from '../../../hooks/useTeamEvents';
import { useTeamOutlet } from './teamOutletContext';
import type { LolEvent } from '../../../types/lolEvent.types';

const WIN = 'var(--lol-emerald, #34D399)';
const LOSS = 'var(--danger)';

function fmt(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

/** Scrims d'une équipe — agenda réel (lol_events type=scrim). */
export function LolTeamScrimsPage(): React.JSX.Element {
  const { teamId, isManager, resolvedAccent } = useTeamOutlet();
  const { events, loading, create, update, remove } = useTeamEvents(teamId);
  const [addOpen, setAddOpen] = useState(false);

  const scrims = events.filter((e) => e.type === 'scrim').sort((a, b) => +new Date(b.startsAt) - +new Date(a.startsAt));
  const played = scrims.filter((s) => s.result);
  const wins = played.filter((s) => s.result === 'win').length;
  const now = Date.now();
  const next = [...scrims].reverse().find((s) => +new Date(s.startsAt) > now && !s.result);

  const setResult = (s: LolEvent, result: 'win' | 'loss') => { void update(s.id, { result }); };

  return (
    <motion.div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 lg:px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold md:text-3xl" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>Scrims</h1>
        {isManager && (
          <button type="button" onClick={() => setAddOpen(true)} className="cursor-pointer rounded-sm px-4 py-2 text-sm font-bold uppercase tracking-widest active:scale-95"
            style={{ fontFamily: 'Rajdhani, sans-serif', background: resolvedAccent, color: '#0A1428' }}>+ Planifier</button>
        )}
      </div>

      {next && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4" style={{ background: `${resolvedAccent}10`, borderColor: `${resolvedAccent}33` }}>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: resolvedAccent }}>Prochain scrim</span>
            <span className="text-lg font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>vs {next.opponent ?? '—'}</span>
            <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>{fmt(next.startsAt)}{next.bo ? ` · BO${next.bo}` : ''}</span>
          </div>
        </div>
      )}

      {played.length > 0 && (
        <div className="flex items-center gap-3 text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
          <span className="font-bold" style={{ color: WIN }}>{wins}V</span><span>/</span>
          <span className="font-bold" style={{ color: LOSS }}>{played.length - wins}D</span><span>sur {played.length} scrims joués</span>
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>Chargement…</p>
      ) : scrims.length === 0 ? (
        <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>Aucun scrim pour le moment.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {scrims.map((s) => {
            const win = s.result === 'win';
            const past = +new Date(s.startsAt) < now;
            return (
              <div key={s.id} className="group flex items-center gap-3 rounded-md border px-4 py-3" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
                <span className="h-8 w-1 flex-shrink-0 rounded-full" style={{ background: s.result ? (win ? WIN : LOSS) : resolvedAccent }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>vs {s.opponent ?? s.title}</p>
                  <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>{fmt(s.startsAt)}{s.bo ? ` · BO${s.bo}` : ''}</p>
                </div>
                {s.score && <span className="text-sm font-bold tabular-nums" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>{s.score}</span>}
                {s.result ? (
                  <span className="w-16 flex-shrink-0 rounded-sm py-1 text-center text-xs font-bold uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', background: win ? `${WIN}1A` : `${LOSS}1A`, color: win ? WIN : LOSS }}>{win ? 'Victoire' : 'Défaite'}</span>
                ) : isManager && past ? (
                  <div className="flex flex-shrink-0 gap-1">
                    <button type="button" onClick={() => setResult(s, 'win')} className="rounded-sm px-2 py-1 text-xs font-bold" style={{ background: `${WIN}1A`, color: WIN }}>V</button>
                    <button type="button" onClick={() => setResult(s, 'loss')} className="rounded-sm px-2 py-1 text-xs font-bold" style={{ background: `${LOSS}1A`, color: LOSS }}>D</button>
                  </div>
                ) : (
                  <span className="w-16 flex-shrink-0 text-center text-xs" style={{ color: 'var(--lol-text-muted)' }}>à venir</span>
                )}
                {isManager && (
                  <button type="button" onClick={() => { void remove(s.id); }} aria-label="Supprimer" className="flex-shrink-0 text-xs opacity-0 transition-opacity group-hover:opacity-100" style={{ color: 'var(--lol-text-muted)' }}>✕</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isManager && <LolCreateEventModal isOpen={addOpen} onClose={() => setAddOpen(false)} onCreate={create} defaultType="scrim" />}
    </motion.div>
  );
}
