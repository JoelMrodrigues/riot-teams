import React from 'react';
import { motion } from 'framer-motion';

import type { GameType } from '../../types/team.types';
import { GAMES_DATA } from '../../data/games.data';

export type FilterTab = 'all' | GameType;

interface TeamsFilterTabsProps {
  activeFilter: FilterTab;
  onFilterChange: (filter: FilterTab) => void;
}

const TABS: { key: FilterTab; label: string; color?: string }[] = [
  { key: 'all', label: 'Toutes' },
  ...GAMES_DATA.map((g) => ({ key: g.id as FilterTab, label: g.tag, color: g.accentColor })),
];

/** Onglets de filtrage des équipes par jeu (Toutes / LoL / VAL / TFT). */
export function TeamsFilterTabs({ activeFilter, onFilterChange }: TeamsFilterTabsProps): React.JSX.Element {
  return (
    <motion.div
      className="flex gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      {TABS.map((tab) => {
        const isActive = activeFilter === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className="px-4 py-1.5 text-xs uppercase tracking-widest rounded-sm border cursor-pointer transition-all duration-150"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              borderColor: isActive ? (tab.color ?? 'var(--brand)') : 'var(--border-default)',
              color: isActive ? (tab.color ?? 'var(--brand)') : 'var(--text-muted)',
              background: isActive && tab.color
                ? `${tab.color}15`
                : isActive
                ? 'var(--brand-muted)'
                : 'transparent',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </motion.div>
  );
}
