import React from 'react';
import { motion } from 'framer-motion';

import { LolQuickAccessCard } from './LolQuickAccessCard';
import { LOL_ACCENTS } from '../../../constants/lolTheme';

const QUICK_ACCESS_ITEMS = [
  {
    key: 'solo',
    label: 'SOLO',
    description: 'Rechercher un joueur, voir rang & historique',
    to: '/lol/search',
    accent: LOL_ACCENTS.solo,
    icon: 'search' as const,
    disabled: false,
  },
  {
    key: 'team',
    label: 'ÉQUIPES',
    description: 'Créer et gérer ton roster de scrim',
    to: '/lol/teams',
    accent: LOL_ACCENTS.team,
    icon: 'team' as const,
    disabled: false,
  },
  {
    key: 'stats',
    label: 'STATS',
    description: 'Analyses approfondies — bientôt disponible',
    to: '/lol/stats',
    accent: LOL_ACCENTS.stats,
    icon: 'stats' as const,
    disabled: true,
  },
] as const;

/** Zone B — grille 3 cartes d'accès rapide : Solo, Équipes, Stats. */
export function LolQuickAccess(): React.JSX.Element {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: 0.08 }}
      aria-label="Accès rapides"
    >
      <p
        className="mb-3 text-xs font-bold uppercase tracking-[0.12em]"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        Accès rapides
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {QUICK_ACCESS_ITEMS.map((item) => (
          <LolQuickAccessCard
            key={item.key}
            label={item.label}
            description={item.description}
            to={item.to}
            accent={item.accent}
            icon={item.icon}
            disabled={item.disabled}
          />
        ))}
      </div>
    </motion.section>
  );
}
