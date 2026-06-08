import React from 'react';
import { motion } from 'framer-motion';

interface LolSectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  align?: 'left' | 'center';
}

/** En-tête de section réutilisable avec eyebrow coloré et révélation au scroll. */
export function LolSectionHeading({
  eyebrow,
  title,
  subtitle,
  accent,
  align = 'left',
}: LolSectionHeadingProps): React.JSX.Element {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`flex flex-col gap-3 ${isCenter ? 'items-center text-center' : 'items-start'}`}
    >
      <span
        className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: accent, border: `1px solid ${accent}55`, background: `${accent}14` }}
      >
        {eyebrow}
      </span>
      <h2
        className="max-w-2xl text-3xl font-bold leading-tight md:text-5xl"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
      >
        {title}
      </h2>
      <p className="max-w-xl text-base leading-relaxed" style={{ color: 'var(--lol-text-muted)' }}>
        {subtitle}
      </p>
    </motion.div>
  );
}
