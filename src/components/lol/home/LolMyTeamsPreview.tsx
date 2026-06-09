import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolTeamCard } from '../teams/LolTeamCard';
import { LolMyTeamsEmptyState } from './LolMyTeamsEmptyState';
import { LolAuthPrompt } from '../../auth/LolAuthPrompt';
import { useLolTeams } from '../../../hooks/useLolTeams';
import { useAuth } from '../../../hooks/useAuth';

interface LolMyTeamsPreviewProps {
  onCreate: () => void;
}

const PREVIEW_LIMIT = 3;

/**
 * Zone C du hub — aperçu des équipes LoL via API (3 max).
 * Affiche une invite de connexion si l'utilisateur est anonyme.
 */
export function LolMyTeamsPreview({ onCreate }: LolMyTeamsPreviewProps): React.JSX.Element {
  const { status }              = useAuth();
  const { teams, loading }      = useLolTeams();
  const preview                 = teams.slice(0, PREVIEW_LIMIT);
  const hasMore                 = teams.length > PREVIEW_LIMIT;

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
        {status === 'authenticated' && (
          <button type="button" onClick={onCreate} className="btn btn-ghost btn-sm">
            Nouvelle équipe
          </button>
        )}
      </div>

      {status === 'anonymous' ? (
        <LolAuthPrompt message="Connecte-toi pour voir tes équipes League of Legends." />
      ) : loading ? (
        <div
          className="flex h-16 items-center justify-center rounded-sm border"
          style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}
        >
          <span className="text-xs animate-pulse" style={{ color: 'var(--lol-text-muted)', fontFamily: 'Inter, sans-serif' }}>
            Chargement…
          </span>
        </div>
      ) : teams.length === 0 ? (
        <LolMyTeamsEmptyState onCreate={onCreate} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {preview.map((team) => (
              <LolTeamCard key={team.id} team={team} />
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
