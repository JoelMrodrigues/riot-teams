import React from 'react';
import { motion } from 'framer-motion';

interface LolComingSoonProps {
  step: string;
  title: string;
  description: string;
}

/** Placeholder stylisé pour les sections LoL à venir (Étapes 3 & 4). */
export function LolComingSoon({ step, title, description }: LolComingSoonProps): React.JSX.Element {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center px-8 py-32 text-center"
    >
      <span
        className="mb-5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]"
        style={{
          fontFamily: 'Rajdhani, sans-serif',
          color: 'var(--lol-violet-soft)',
          border: '1px solid var(--lol-border)',
          background: 'var(--lol-surface)',
        }}
      >
        {step} · Bientôt disponible
      </span>
      <h1
        className="text-4xl font-bold md:text-5xl"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
      >
        {title}
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed" style={{ color: 'var(--lol-text-muted)' }}>
        {description}
      </p>
    </motion.section>
  );
}
