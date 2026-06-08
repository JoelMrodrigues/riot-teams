import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { RankBadge } from './RankBadge';
import { profileIcon } from '../../../utils/lolAssets';
import type { LolProfile } from '../../../types/lolApi.types';

interface ProfileHeaderProps {
  profile: LolProfile;
}

/** En-tête : icône, Riot ID, niveau et classements Solo/Flex. */
export function ProfileHeader({ profile }: ProfileHeaderProps): React.JSX.Element {
  const [iconOk, setIconOk] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 rounded-3xl p-6 lg:flex-row lg:items-center"
      style={{ background: 'var(--lol-bg-elevated)', border: '1px solid var(--lol-border)' }}
    >
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-2xl" style={{ border: '2px solid var(--lol-violet)' }}>
          {iconOk ? (
            <img src={profileIcon(profile.profileIconId)} alt="" onError={() => setIconOk(false)} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full" style={{ background: 'var(--lol-violet-strong)' }} />
          )}
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
            {profile.riotId} <span style={{ color: 'var(--lol-text-muted)' }}>#{profile.tagLine}</span>
          </p>
          <p className="text-sm uppercase tracking-wider" style={{ color: 'var(--lol-violet-soft)' }}>
            Niveau {profile.summonerLevel} · {profile.platform.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 lg:ml-auto">
        {profile.ranks.length > 0 ? (
          profile.ranks.map((r) => <RankBadge key={r.queue} entry={r} />)
        ) : (
          <span className="self-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>Non classé</span>
        )}
      </div>
    </motion.div>
  );
}
