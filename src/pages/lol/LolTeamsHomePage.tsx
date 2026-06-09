import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolTeamsGrid } from '../../components/lol/teams/LolTeamsGrid';
import { CreateTeamModal } from '../../components/teams/CreateTeamModal';
import { StorageErrorBanner } from '../../components/feedback/StorageErrorBanner';
import { useTeams } from '../../hooks/useTeams';
import { LOL_ACCENTS } from '../../constants/lolTheme';
import { GAMES_DATA } from '../../data/games.data';

/**
 * /lol/teams — liste complète des équipes LoL, rendue dans LolLayout.
 * Texte via --lol-* (correct en mode clair et sombre).
 */
export function LolTeamsHomePage(): React.JSX.Element {
  const navigate = useNavigate();
  const { teams, createTeam, storageError, dismissStorageError } = useTeams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const lolGame = GAMES_DATA.find((g) => g.id === 'lol')!;
  const lolTeams = teams.filter((t) => t.game === 'lol');
  const accent = LOL_ACCENTS.team;

  const handleCreate = (name: string, _game: string) => {
    // On force le jeu à 'lol' — le sélecteur de jeu de la modale est ignoré ici
    const team = createTeam(name, 'lol');
    navigate(`/lol/team/${team.id}`);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-8 md:px-6 lg:px-8">
        <StorageErrorBanner message={storageError} onDismiss={dismissStorageError} />

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
            <p
              className="text-xs"
              style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
            >
              {lolTeams.length} équipe{lolTeams.length !== 1 ? 's' : ''}
            </p>
          </div>

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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.08 }}
        >
          <LolTeamsGrid teams={lolTeams} onCreateEmpty={() => setIsCreateOpen(true)} />
        </motion.div>
      </div>

      <CreateTeamModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
