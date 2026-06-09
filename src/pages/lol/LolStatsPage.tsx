import React from 'react';
import { motion } from 'framer-motion';

import { LolSectionHeading } from '../../components/lol/home/LolSectionHeading';
import { LOL_ACCENTS } from '../../constants/lolTheme';

/** Carte squelette grisée suggérant un bloc de contenu à venir. */
function SkeletonCard({
  label,
  description,
  index,
}: {
  label: string;
  description: string;
  index: number;
}): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 * index }}
      className="rounded-md p-5 flex flex-col gap-3"
      style={{
        background: 'var(--lol-bg-elevated)',
        border: '1px solid var(--lol-border)',
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold uppercase tracking-[0.12em]"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
        >
          {label}
        </span>
        <span
          className="rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-widest"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            color: LOL_ACCENTS.stats.soft,
            background: `${LOL_ACCENTS.stats.color}14`,
            border: `1px solid ${LOL_ACCENTS.stats.color}30`,
          }}
        >
          Bientôt
        </span>
      </div>

      {/* Barres squelette */}
      <div className="flex flex-col gap-2 mt-1">
        <div
          className="h-2 rounded-sm w-3/4 animate-pulse"
          style={{ background: 'var(--lol-surface)' }}
        />
        <div
          className="h-2 rounded-sm w-1/2 animate-pulse"
          style={{ background: 'var(--lol-surface)', animationDelay: '0.15s' }}
        />
        <div
          className="h-2 rounded-sm w-5/6 animate-pulse"
          style={{ background: 'var(--lol-surface)', animationDelay: '0.3s' }}
        />
      </div>

      <p
        className="text-xs leading-relaxed mt-1"
        style={{ color: 'var(--lol-text-muted)' }}
      >
        {description}
      </p>
    </motion.div>
  );
}

const SKELETON_CARDS = [
  {
    label: 'Évolution du winrate',
    description: 'Courbe winrate sur les 7, 14 et 30 derniers jours — Solo/Duo & Flex.',
  },
  {
    label: 'Performances par champion',
    description: 'KDA moyen, winrate et CS/min pour chacun de vos champions joués.',
  },
  {
    label: 'Tendances de méta',
    description: 'Champions en hausse et en baisse dans votre elo cette semaine.',
  },
] as const;

/** Page Stats LoL — placeholder structuré, prêt à recevoir les données API. */
export function LolStatsPage(): React.JSX.Element {
  return (
    <section className="px-6 py-8 md:px-10 md:py-10 flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <LolSectionHeading
        eyebrow="Statistiques"
        title="Stats"
        subtitle="Statistiques avancées — bientôt disponibles. Les données seront alimentées par l'API Riot."
        accent={LOL_ACCENTS.stats.color}
        align="left"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SKELETON_CARDS.map((card, i) => (
          <SkeletonCard
            key={card.label}
            label={card.label}
            description={card.description}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
