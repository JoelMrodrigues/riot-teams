import React from 'react';
import { motion } from 'framer-motion';

import { LolFeatureCard } from './LolFeatureCard';
import { LOL_FEATURES } from '../../../data/lolFeatures.data';

/** Bento grid des fonctionnalités, avec apparition en cascade. */
export function LolFeatureGrid(): React.JSX.Element {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
      className="grid grid-cols-1 gap-5 md:grid-cols-3 md:auto-rows-[160px]"
    >
      {LOL_FEATURES.map((feature) => (
        <LolFeatureCard key={feature.id} feature={feature} />
      ))}
    </motion.div>
  );
}
