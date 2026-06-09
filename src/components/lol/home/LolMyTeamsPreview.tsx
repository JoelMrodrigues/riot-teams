import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { TeamCard } from '../../teams/TeamCard';
import { LolMyTeamsEmptyState } from './LolMyTeamsEmptyState';
import type { Team } from '../../../types/team.types';

interface LolMyTeamsPreviewProps {
  teams: Team[];
  onCreate: () => void;
}

const PREVIEW_LIMIT = 3;

/**
 * Zone C — aperçu des équipes LoL locales (3 max) + état vide.
 * Filtre game === 'lol' effectué en amont (dans LolHomePage).
 */
export function LolMyTeamsPreview({ teams, onCreate }: LolMyTeamsPreviewProps): React.JSX.Element {
  const preview = teams.slice(0, PREVIEW_LIMIT);
  const hasMore = teams.length > PREVIEW_LIMIT;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: 0.16 }}
      aria-label="Mes équipes LoL"
    >
      <div className="mb-3 flex items-center justify-between">
        <p
          className="text-xs font-bold uppercase tracking-[0.12em]"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
        >
          Mes équipes LoL
        </p>
        <button type="button" onClick={onCreate} className="btn btn-ghost btn-sm">
          Nouvelle équipe
        </button>
      </div>

      {teams.length === 0 ? (
        <LolMyTeamsEmptyState onCreate={onCreate} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {preview.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-3 flex justify-end">
              <Link
                to="/lol/teams"
                className="text-xs font-bold uppercase tracking-wider transition-colors duration-150"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)' }}
              >
                Voir toutes les équipes ({teams.length}) →
              </Link>
            </div>
          )}
        </>
      )}
    </motion.section>
  );
}
