import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolLiveBadge } from '../../../components/lol/live/LolLiveBadge';
import { LOL_ACCENTS } from '../../../constants/lolTheme';

function LinkCard({ to, title, desc, color }: { to: string; title: string; desc: string; color: string }): React.JSX.Element {
  return (
    <Link
      to={to}
      className="flex flex-col gap-1 rounded-md border p-5 transition-colors duration-150"
      style={{ background: `${color}0A`, borderColor: `${color}33` }}
    >
      <span className="text-lg font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>{title}</span>
      <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>{desc}</span>
      <span className="mt-1 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color }}>Ouvrir →</span>
    </Link>
  );
}

/** Hub de l'espace test — isolé, ne touche pas la version actuelle. */
export function LolTestHubPage(): React.JSX.Element {
  return (
    <motion.div
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 lg:px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold md:text-3xl" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
            Espace test
          </h1>
          <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
            Brouillons de design en données fictives. Isolé : ne touche pas la version actuelle.
          </p>
        </div>
        <LolLiveBadge inGame label="Démo live" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LinkCard to="/lol/test/solo" title="Solo test" desc="Profil joueur + détail de match déroulant (démo)." color={LOL_ACCENTS.solo.color} />
        <LinkCard to="/lol/test/team" title="Team test" desc="Aperçu d'équipe : en-tête + roster par rôle." color={LOL_ACCENTS.team.color} />
      </div>
    </motion.div>
  );
}
