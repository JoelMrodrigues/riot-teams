import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import type { HomeGameSectionData } from '../../data/homeSections.data';

interface HomeGameSectionProps {
  data: HomeGameSectionData;
}

/** ②③④ Section d'un jeu (ancre `jeu-<id>`), révélée au scroll. */
export function HomeGameSection({ data }: HomeGameSectionProps): React.JSX.Element {
  const soon = data.status === 'soon';

  return (
    <motion.section
      id={`jeu-${data.id}`}
      className="mx-auto w-full max-w-4xl px-4 py-10 md:py-14"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="rounded-md border p-6 md:p-8"
        style={{ background: 'var(--bg-surface)', borderColor: `${data.accent}33` }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold md:text-3xl" style={{ fontFamily: 'Rajdhani, sans-serif', color: data.accent }}>
            {data.name}
          </h2>
          <span
            className="rounded-sm px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              background: soon ? 'var(--bg-elevated)' : `${data.accent}1A`,
              border: `1px solid ${soon ? 'var(--border-default)' : `${data.accent}40`}`,
              color: soon ? 'var(--text-muted)' : data.accent,
            }}
          >
            {soon ? 'Bientôt' : 'Disponible'}
          </span>
        </div>

        <p className="mt-2 text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-muted)' }}>
          {data.tagline}
        </p>

        <ul className="mt-4 flex flex-col gap-2">
          {data.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: data.accent }} />
              <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)' }}>{f}</span>
            </li>
          ))}
        </ul>

        {data.to && !soon && (
          <Link
            to={data.to}
            className="mt-6 inline-block rounded-sm px-5 py-2.5 text-sm font-bold uppercase tracking-widest transition-transform duration-150 active:scale-95"
            style={{ fontFamily: 'Rajdhani, sans-serif', background: data.accent, color: '#fff' }}
          >
            Explorer {data.name} →
          </Link>
        )}
      </div>
    </motion.section>
  );
}
