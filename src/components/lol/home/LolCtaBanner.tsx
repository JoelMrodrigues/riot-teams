import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/** Bandeau d'appel à l'action final, immersif et coloré. */
export function LolCtaBanner(): React.JSX.Element {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative my-24 overflow-hidden rounded-3xl px-8 py-16 text-center"
      style={{ background: 'linear-gradient(120deg, #7C3AED 0%, #22D3EE 50%, #F472B6 100%)' }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.5), transparent 50%)' }} />
      <h2 className="relative z-10 text-3xl font-bold text-white md:text-5xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
        Prêt à passer au niveau supérieur ?
      </h2>
      <p className="relative z-10 mx-auto mt-4 max-w-lg text-base text-white/85">
        Analyse, progresse et fais grimper ton équipe. Tout commence par une simple recherche.
      </p>
      <Link
        to="/lol/search"
        className="relative z-10 mt-8 inline-block rounded-lg bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wider transition-transform hover:scale-[1.05]"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: '#7C3AED' }}
      >
        Commencer maintenant
      </Link>
    </motion.section>
  );
}
