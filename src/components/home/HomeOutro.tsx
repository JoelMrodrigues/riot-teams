import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { HOME_OUTRO } from '../../data/homeSections.data';

/** ⑤ Message de fin + appels à l'action, révélé au scroll. */
export function HomeOutro(): React.JSX.Element {
  return (
    <motion.section
      className="mx-auto w-full max-w-2xl px-4 py-20 text-center md:py-28"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <p
        className="text-xl font-bold md:text-2xl"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}
      >
        {HOME_OUTRO}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/lol"
          className="rounded-sm px-5 py-2.5 text-sm font-bold uppercase tracking-widest transition-transform duration-150 active:scale-95"
          style={{ fontFamily: 'Rajdhani, sans-serif', background: 'var(--brand)', color: '#fff' }}
        >
          Explorer League
        </Link>
        <Link
          to="/register"
          className="rounded-sm border px-5 py-2.5 text-sm font-bold uppercase tracking-widest transition-colors duration-150"
          style={{ fontFamily: 'Rajdhani, sans-serif', borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
        >
          Créer un compte
        </Link>
      </div>
    </motion.section>
  );
}
