import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolSectionHeading } from './LolSectionHeading';
import { LolScrimBoard } from './LolScrimBoard';
import { LOL_ACCENTS } from '../../../constants/lolTheme';

const A = LOL_ACCENTS.team;
const PROFILES = [
  { name: 'Scrim', desc: 'Compétitif & suivi des perfs' },
  { name: 'Flex', desc: 'Classé entre amis' },
  { name: 'Fun', desc: 'Sans pression' },
];

/** Section démo "Gestion Équipe" : board mock + explication des profils. */
export function LolTeamShowcase(): React.JSX.Element {
  return (
    <section className="grid grid-cols-1 items-center gap-12 py-24 lg:grid-cols-2">
      <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
        <LolScrimBoard />
      </div>

      <div className="order-1 flex flex-col gap-7 lg:order-2">
        <LolSectionHeading
          eyebrow="Gestion Équipe"
          title="Ton équipe de scrim, pilotée d'un seul écran."
          subtitle="Crée ton roster, choisis un profil d'équipe et suis le SoloQ de tes joueurs comme l'historique de tes scrims."
          accent={A.color}
        />
        <div className="grid grid-cols-3 gap-3">
          {PROFILES.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-md p-4 text-center"
              style={{ background: 'var(--lol-surface)', border: `1px solid ${A.color}33` }}
            >
              <p className="text-sm font-bold uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: A.soft }}>{p.name}</p>
              <p className="mt-1 text-xs" style={{ color: 'var(--lol-text-muted)' }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
        <Link
          to="/lol/teams"
          className="w-fit rounded-md px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.04]"
          style={{ fontFamily: 'Rajdhani, sans-serif', background: A.gradient, boxShadow: `0 10px 30px ${A.glow}` }}
        >
          Créer mon équipe
        </Link>
      </div>
    </section>
  );
}
