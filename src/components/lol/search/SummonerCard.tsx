import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { profileIcon } from '../../../utils/lolAssets';
import type { SummonerProfile } from '../../../types/lolApi.types';

interface SummonerCardProps {
  profile: SummonerProfile;
  label: string;
}

/** Carte résultat : icône, Riot ID recherché, niveau. */
export function SummonerCard({ profile, label }: SummonerCardProps): React.JSX.Element {
  const [iconOk, setIconOk] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-5 rounded-3xl p-6"
      style={{ background: 'var(--lol-bg-elevated)', border: '1px solid var(--lol-border)' }}
    >
      <div className="h-20 w-20 overflow-hidden rounded-2xl" style={{ border: '2px solid var(--lol-violet)' }}>
        {iconOk ? (
          <img src={profileIcon(profile.profileIconId)} alt="" onError={() => setIconOk(false)} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: 'var(--lol-violet-strong)' }} />
        )}
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
          {label}
        </p>
        <p className="text-sm uppercase tracking-wider" style={{ color: 'var(--lol-violet-soft)' }}>
          Niveau {profile.summonerLevel}
        </p>
      </div>
    </motion.div>
  );
}
