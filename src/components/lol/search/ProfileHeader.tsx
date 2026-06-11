import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { RankBadge } from './RankBadge';
import { LolLiveBadge } from '../live/LolLiveBadge';
import { profileIcon, bigChampionImage } from '../../../utils/lolAssets';
import { useLiveGame } from '../../../hooks/useLiveGame';
import type { LolProfile } from '../../../types/lolApi.types';

interface ProfileHeaderProps {
  profile: LolProfile;
}

/** En-tête : bannière champion + icône, Riot ID, niveau et classements. */
export function ProfileHeader({ profile }: ProfileHeaderProps): React.JSX.Element {
  const [iconOk, setIconOk] = useState(true);
  const [bannerOk, setBannerOk] = useState(true);
  const bannerChampion = profile.matches[0]?.champion;
  const { inGame } = useLiveGame(profile.riotId, profile.tagLine);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col gap-6 overflow-hidden rounded-md p-6 lg:flex-row lg:items-center"
      style={{ background: 'var(--lol-bg-elevated)', border: '1px solid var(--lol-border)' }}
    >
      {bannerChampion && bannerOk && (
        <>
          <img
            src={bigChampionImage(bannerChampion)}
            alt=""
            onError={() => setBannerOk(false)}
            className="pointer-events-none absolute right-0 top-0 h-full w-1/2 object-cover"
            style={{ maskImage: 'linear-gradient(to left, #000 10%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to left, #000 10%, transparent 95%)', opacity: 0.35 }}
          />
          <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to right, var(--lol-bg-elevated) 30%, transparent)' }} />
        </>
      )}

      <div className="relative z-10 flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-md" style={{ border: '2px solid var(--lol-violet)' }}>
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
          {inGame && (
            <Link
              to={`/lol/live/${encodeURIComponent(profile.riotId)}/${encodeURIComponent(profile.tagLine)}`}
              className="mt-2 inline-block transition-opacity hover:opacity-80"
            >
              <LolLiveBadge inGame label="En partie — voir" />
            </Link>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-4 lg:ml-auto">
        {profile.ranks.length > 0 ? (
          profile.ranks.map((r) => <RankBadge key={r.queue} entry={r} />)
        ) : (
          <span className="self-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>Non classé</span>
        )}
      </div>
    </motion.div>
  );
}
