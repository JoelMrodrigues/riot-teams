import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolHeroPreview } from './LolHeroPreview';
import { LOL_ACCENTS } from '../../../constants/lolTheme';

const TITLE_GRADIENT =
  `linear-gradient(120deg, ${LOL_ACCENTS.solo.color}, var(--lol-violet), ${LOL_ACCENTS.team.color})`;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' as const } }),
};

/** Hero vitrine LoL : accroche, pitch, double CTA et preview flottante animée. */
export function LolHero(): React.JSX.Element {
  return (
    <section className="grid grid-cols-1 items-center gap-10 pt-16 pb-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col items-start">
        <motion.span
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)', border: '1px solid var(--lol-border)', background: 'var(--lol-surface)' }}
        >
          League of Legends · Hub
        </motion.span>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-2xl text-5xl font-bold leading-[1.04] md:text-7xl"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
        >
          Maîtrise ta SoloQ.
          <br />
          <span style={{ background: TITLE_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Pilote tes scrims.
          </span>
        </motion.h1>

        <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show" className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: 'var(--lol-text-muted)' }}>
          Un hub unique pour analyser tes statistiques de partie et gérer ton équipe de scrim,
          du recrutement au suivi des performances.
        </motion.p>

        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="mt-9 flex flex-wrap gap-4">
          <Link
            to="/lol/search"
            className="rounded-md px-7 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.03]"
            style={{ fontFamily: 'Rajdhani, sans-serif', background: 'var(--lol-violet-strong)', boxShadow: '0 8px 30px var(--lol-glow)' }}
          >
            Rechercher des stats
          </Link>
          <Link
            to="/lol/teams"
            className="rounded-md px-7 py-3 text-sm font-bold uppercase tracking-wider transition-colors"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)', border: '1px solid var(--lol-border)', background: 'var(--lol-surface)' }}
          >
            Gérer mon équipe
          </Link>
        </motion.div>
      </div>

      <LolHeroPreview />
    </section>
  );
}
