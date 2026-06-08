import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolSectionHeading } from './LolSectionHeading';
import { LolSoloProfileCard } from './LolSoloProfileCard';
import { LOL_ACCENTS } from '../../../constants/lolTheme';

const A = LOL_ACCENTS.solo;
const POINTS = ['KDA & CS/min par champion', 'Progression de rang en direct', 'Historique de parties détaillé'];

/** Section démo "Recherche Solo" : explication + profil mock interactif. */
export function LolSoloShowcase(): React.JSX.Element {
  return (
    <section className="grid grid-cols-1 items-center gap-12 py-24 lg:grid-cols-2">
      <div className="flex flex-col gap-7">
        <LolSectionHeading
          eyebrow="Recherche Solo"
          title="Décortique chaque partie comme un pro."
          subtitle="Tape ton Riot ID et accède instantanément à un profil complet : rang, performances par champion et tendances de jeu."
          accent={A.color}
        />
        <ul className="flex flex-col gap-3">
          {POINTS.map((p, i) => (
            <motion.li
              key={p}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-3 text-sm font-medium"
              style={{ color: 'var(--lol-text)' }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: A.gradient }}>✓</span>
              {p}
            </motion.li>
          ))}
        </ul>
        <Link
          to="/lol/search"
          className="w-fit rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.04]"
          style={{ fontFamily: 'Rajdhani, sans-serif', background: A.gradient, boxShadow: `0 10px 30px ${A.glow}` }}
        >
          Lancer une recherche
        </Link>
      </div>

      <div className="flex justify-center lg:justify-end">
        <LolSoloProfileCard />
      </div>
    </section>
  );
}
