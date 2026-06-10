import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { LolCreateEventModal } from '../../../components/lol/teams/events/LolCreateEventModal';
import { useTeamEvents } from '../../../hooks/useTeamEvents';
import { EVENT_TYPE_COLOR, EVENT_TYPE_LABEL, EVENT_TYPES } from '../../../utils/lolEventMeta';
import { useTeamOutlet } from './teamOutletContext';

const DAY_MS = 86_400_000;

function startOfWeek(): Date {
  const d = new Date();
  const offset = (d.getDay() + 6) % 7; // 0 = lundi
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - offset);
  return d;
}

/** Calendrier d'équipe — semaine courante, événements réels (lol_events). */
export function LolTeamCalendarPage(): React.JSX.Element {
  const { teamId, isManager, resolvedAccent } = useTeamOutlet();
  const { events, loading, create } = useTeamEvents(teamId);
  const [addOpen, setAddOpen] = useState(false);

  const week = startOfWeek();
  const days = Array.from({ length: 7 }, (_, i) => new Date(week.getTime() + i * DAY_MS));
  const eventsOfDay = (day: Date) =>
    events
      .filter((e) => { const t = +new Date(e.startsAt); return t >= +day && t < +day + DAY_MS; })
      .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));

  return (
    <motion.div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 lg:px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold md:text-3xl" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>Calendrier</h1>
        {isManager && (
          <button type="button" onClick={() => setAddOpen(true)} className="cursor-pointer rounded-sm px-4 py-2 text-sm font-bold uppercase tracking-widest active:scale-95"
            style={{ fontFamily: 'Rajdhani, sans-serif', background: resolvedAccent, color: '#0A1428' }}>+ Ajouter</button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {EVENT_TYPES.map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: EVENT_TYPE_COLOR[t] }} />{EVENT_TYPE_LABEL[t]}
          </span>
        ))}
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>Chargement…</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {days.map((day) => {
            const dayEvents = eventsOfDay(day);
            return (
              <div key={day.toISOString()} className="flex min-h-[120px] flex-col gap-2 rounded-md border p-3" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
                  {day.toLocaleDateString('fr-FR', { weekday: 'short' })} {day.getDate()}
                </span>
                {dayEvents.length === 0 ? (
                  <span className="flex flex-1 items-center justify-center text-xs" style={{ color: 'var(--lol-text-muted)', opacity: 0.4 }}>—</span>
                ) : dayEvents.map((e) => (
                  <div key={e.id} className="flex flex-col gap-0.5 rounded-sm p-2" style={{ background: `${EVENT_TYPE_COLOR[e.type]}14`, borderLeft: `3px solid ${EVENT_TYPE_COLOR[e.type]}` }}>
                    <span className="text-[11px] font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: EVENT_TYPE_COLOR[e.type] }}>
                      {new Date(e.startsAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-xs leading-tight" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text)' }}>{e.title}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {isManager && <LolCreateEventModal isOpen={addOpen} onClose={() => setAddOpen(false)} onCreate={create} defaultType="training" />}
    </motion.div>
  );
}
