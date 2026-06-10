import React from 'react';
import { motion } from 'framer-motion';

import { HOME_SUMMARY } from '../../data/homeSections.data';

/** ① Le site en bref — résumé court, révélé au scroll. */
export function HomeSummary(): React.JSX.Element {
  return (
    <motion.section
      className="mx-auto w-full max-w-3xl px-4 py-16 text-center md:py-24"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <p
        className="text-xs font-bold uppercase tracking-[0.2em]"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--brand)' }}
      >
        Le site en bref
      </p>
      <p
        className="mt-4 text-lg leading-relaxed md:text-2xl"
        style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-primary)' }}
      >
        {HOME_SUMMARY}
      </p>
    </motion.section>
  );
}
