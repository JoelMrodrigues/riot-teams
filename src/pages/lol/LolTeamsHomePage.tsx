import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolTeamsGrid } from '../../components/lol/teams/LolTeamsGrid';
import { LolTeamsSkeletonGrid } from '../../components/lol/teams/LolTeamsSkeletonGrid';
import { LolCreateTeamModal } from '../../components/lol/teams/LolCreateTeamModal';
import { ApiErrorBanner } from '../../components/feedback/ApiErrorBanner';
import { LolAuthPrompt } from '../../components/auth/LolAuthPrompt';
import { useLolTeams } from '../../hooks/useLolTeams';
import { useAuth } from '../../hooks/useAuth';
import { LOL_ACCENTS } from '../../constants/lolTheme';
import { GAMES_DATA } from '../../data/games.data';
import type { LolCreateTeamBody } from '../../types/lolTeam.types';

/**
 * /lol/teams — liste des équipes LoL backend (auth requise).
 * Affiche un skeleton pendant le chargement, une invite si anonyme.
 */
export function LolTeamsHomePage(): React.JSX.Element {
  const navigate                    = useNavigate();
  const { status }                  = useAuth();
  const { teams, loading, error, refresh, createTeam } = useLolTeams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const lolGame = GAMES_DATA.find((g) => g.id === 'lol')!;
  const accent  = LOL_ACCENTS.team;

  const handleCreate = async (body: LolCreateTeamBody): Promise<void> => {
    const created = await createTeam(body);
    setIsCreateOpen(false);
    navigate(`/lol/team/${created.id}`);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-8 md:px-6 lg:px-8">
        <ApiErrorBanner message={error} onRetry={refresh} />

        <motion.div
          className="mb-6 flex items-end justify-between gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="flex flex-col gap-1">
            <p
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-violet-soft)' }}
            >
              League of Legends · Hub
            </p>
            <h1
              className="text-2xl font-bold md:text-3xl"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
            >
              Mes équipes
            </h1>
            {!loading && status === 'authenticated' && (
              <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
                {teams.length} équipe{teams.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {status === 'authenticated' && (
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="flex-shrink-0 px-5 py-2.5 text-sm font-bold tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 active:scale-95"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: accent.color,
                color: lolGame.darkColor,
              }}
            >
              + Nouvelle équipe
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.08 }}
        >
          {status === 'loading' || loading ? (
            <LolTeamsSkeletonGrid />
          ) : status === 'anonymous' ? (
            <LolAuthPrompt message="Connecte-toi pour voir et gérer tes équipes League of Legends." />
          ) : (
            <LolTeamsGrid teams={teams} onCreateEmpty={() => setIsCreateOpen(true)} />
          )}
        </motion.div>
      </div>

      {status === 'authenticated' && (
        <LolCreateTeamModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  );
}
