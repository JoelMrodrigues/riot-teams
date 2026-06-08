import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolFeatureIcon } from './LolFeatureIcon';
import { LOL_ACCENTS } from '../../../constants/lolTheme';
import type { LolFeature } from '../../../data/lolFeatures.data';

interface LolFeatureCardProps {
  feature: LolFeature;
}

const SPAN_CLASS: Record<LolFeature['span'], string> = {
  wide: 'md:col-span-2',
  tall: 'md:row-span-2',
  normal: '',
};

/** Carte bento d'une fonctionnalité : icône, titre, description, glow au survol. */
export function LolFeatureCard({ feature }: LolFeatureCardProps): React.JSX.Element {
  const accent = LOL_ACCENTS[feature.accent];

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className={SPAN_CLASS[feature.span]}
    >
      <Link
        to={feature.to}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl p-6"
        style={{
          background: 'var(--lol-surface)',
          border: `1px solid ${accent.color}33`,
          minHeight: '160px',
        }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: accent.glow }}
        />

        <div className="relative z-10 mb-4 flex items-center justify-between">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
            style={{ background: accent.gradient }}
          >
            <LolFeatureIcon icon={feature.icon} />
          </span>
          {feature.badge && (
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: accent.soft,
                border: `1px solid ${accent.color}55`,
              }}
            >
              {feature.badge}
            </span>
          )}
        </div>

        <h3
          className="relative z-10 mb-2 text-xl font-bold"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
        >
          {feature.title}
        </h3>
        <p className="relative z-10 text-sm leading-relaxed" style={{ color: 'var(--lol-text-muted)' }}>
          {feature.description}
        </p>
      </Link>
    </motion.div>
  );
}
