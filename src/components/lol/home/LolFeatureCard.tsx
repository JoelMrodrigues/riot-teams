import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolFeatureIcon } from './LolFeatureIcon';
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
          border: '1px solid var(--lol-border)',
          minHeight: '160px',
        }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'var(--lol-glow)' }}
        />

        <div className="relative z-10 mb-4 flex items-center justify-between">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: 'var(--lol-violet-strong)', color: '#fff' }}
          >
            <LolFeatureIcon icon={feature.icon} />
          </span>
          {feature.badge && (
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: 'var(--lol-violet-soft)',
                border: '1px solid var(--lol-border)',
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
