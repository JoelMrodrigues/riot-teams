import React from 'react';
import { motion } from 'framer-motion';

import { LolDraftBanner } from '../../../components/lol/teams/drafts/LolDraftBanner';
import {
  DRAFT_WEEK_DAYS, DRAFT_EVENTS, DRAFT_EVENT_COLORS,
} from '../../../data/lolTeamDraftsDemo.data';
import type { DraftEventType } from '../../../data/lolTeamDraftsDemo.data';
import { useTeamOutlet } from './teamOutletContext';

const TYPE_LABEL: Record<DraftEventType, string> = {
  scrim: 'Scrim', training: 'Entraînement', review: 'Review VOD', soloq: 'SoloQ groupée',
};

/** BROUILLON — calendrier hebdomadaire d'équipe (design proposé, données fictives). */
export function LolTeamCalendarPage(): React.JSX.Element {
  const { resolvedAccent } = useTeamOutlet();

  return (
    <motion.div
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 lg:px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
    >
      <LolDraftBanner
        title="Calendrier"
        subtitle="Planning de la semaine : scrims, entraînements, reviews et sessions SoloQ."
        accent={resolvedAccent}
      />

      {/* Légende */}
      <div className="flex flex-wrap gap-3">
        {(Object.keys(TYPE_LABEL) as DraftEventType[]).map((t) => (
          <span key={t} className="flex items-center gap-1.5 text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: DRAFT_EVENT_COLORS[t] }} />
            {TYPE_LABEL[t]}
          </span>
        ))}
      </div>

      {/* Grille hebdo — responsive : 2 → 4 → 7 colonnes */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {DRAFT_WEEK_DAYS.map((day, i) => {
          const ev = DRAFT_EVENTS.find((e) => e.day === i);
          return (
            <div
              key={day}
              className="flex min-h-[120px] flex-col gap-2 rounded-md border p-3"
              style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}
            >
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
                {day}
              </span>
              {ev ? (
                <div
                  className="flex flex-1 flex-col gap-1 rounded-sm p-2"
                  style={{ background: `${DRAFT_EVENT_COLORS[ev.type]}14`, borderLeft: `3px solid ${DRAFT_EVENT_COLORS[ev.type]}` }}
                >
                  <span className="text-[11px] font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: DRAFT_EVENT_COLORS[ev.type] }}>
                    {ev.time}
                  </span>
                  <span className="text-xs leading-tight" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text)' }}>
                    {ev.label}
                  </span>
                </div>
              ) : (
                <span className="flex flex-1 items-center justify-center text-xs" style={{ color: 'var(--lol-text-muted)', opacity: 0.5 }}>
                  —
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="w-fit cursor-pointer rounded-sm px-4 py-2 text-sm font-bold uppercase tracking-widest"
        style={{ fontFamily: 'Rajdhani, sans-serif', background: `${resolvedAccent}1A`, border: `1px solid ${resolvedAccent}40`, color: resolvedAccent }}
      >
        + Ajouter un événement
      </button>
    </motion.div>
  );
}
