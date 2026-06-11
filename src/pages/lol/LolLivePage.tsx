import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolLiveGame } from '../../components/lol/live/LolLiveGame';
import { useLiveGame } from '../../hooks/useLiveGame';
import { LOL_ACCENTS } from '../../constants/lolTheme';

/** /lol/live/:gameName/:tagLine — partie en cours d'un joueur (2 équipes). */
export function LolLivePage(): React.JSX.Element {
  const params = useParams<{ gameName: string; tagLine: string }>();
  const gameName = decodeURIComponent(params.gameName ?? '');
  const tagLine = decodeURIComponent(params.tagLine ?? '');
  const { inGame, game, loading } = useLiveGame(gameName, tagLine);

  const profileLink = `/lol/search?riotId=${encodeURIComponent(`${gameName}#${tagLine}`)}`;

  return (
    <motion.div
      className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-10 pt-6 md:px-6 lg:px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
            Partie en cours
          </h1>
          <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>{gameName}#{tagLine}</p>
        </div>
        <Link to={profileLink} className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: LOL_ACCENTS.solo.color }}>
          ← Retour au profil
        </Link>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>Recherche de la partie…</p>
      ) : !inGame || !game ? (
        <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>
          Ce joueur n'est pas en partie actuellement.
        </p>
      ) : (
        <LolLiveGame game={game} meName={`${gameName}#${tagLine}`} />
      )}
    </motion.div>
  );
}
