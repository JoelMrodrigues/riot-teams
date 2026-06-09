import React from 'react';
import { motion } from 'framer-motion';

import { LolRecentSearches } from '../home/LolRecentSearches';
import type { RecentSearch } from '../../../hooks/useRecentSearches';

interface LolSearchEmptyStateProps {
  searches: RecentSearch[];
  onSelectRecent: (s: RecentSearch) => void;
  onClearRecent: () => void;
}

/**
 * État initial de LolSearchPage : aucune recherche en cours.
 * Invite l'utilisateur + rappel des recherches récentes (si dispo).
 */
export function LolSearchEmptyState({
  searches,
  onSelectRecent,
  onClearRecent,
}: LolSearchEmptyStateProps): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col gap-6"
    >
      {/* Invite principale */}
      <div
        className="rounded-md p-6 flex flex-col items-center gap-3 text-center"
        style={{ background: 'var(--lol-surface)', border: '1px solid var(--lol-border)' }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          style={{ color: 'var(--lol-text-muted)' }}
        >
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p
          className="text-sm font-bold"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
        >
          Recherche un joueur
        </p>
        <p className="text-xs max-w-xs" style={{ color: 'var(--lol-text-muted)' }}>
          Entre un Riot ID (pseudo#TAG) pour voir rang, historique de matchs et maîtrise de champions.
        </p>
      </div>

      {/* Recherches récentes (invisible si vide) */}
      <LolRecentSearches
        searches={searches}
        onSelect={onSelectRecent}
        onClear={onClearRecent}
      />
    </motion.div>
  );
}
