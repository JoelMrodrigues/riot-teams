import React from 'react';
import { motion } from 'framer-motion';

import { LolPlayerCardHeader } from './LolPlayerCardHeader';
import { LolPlayerCardRankBadge } from './LolPlayerCardRankBadge';
import { LolPlayerCardChampions } from './LolPlayerCardChampions';
import { LolPlayerCardSkeleton } from './LolPlayerCardSkeleton';
import type { LolApiRosterMember } from '../../../types/lolTeam.types';
import type { PlayerStatEntry } from '../../../hooks/useTeamPlayerStats';

interface LolPlayerCardProps {
  member:       LolApiRosterMember;
  stats:        PlayerStatEntry | null;
  statsLoading: boolean;
  accent:       string;
  isManager:    boolean;
  onRemove?:    () => void;
}

/**
 * Carte joueur riche pour la page détail d'équipe LoL.
 * Délègue le header à LolPlayerCardHeader et les stats à leurs propres composants.
 */
export function LolPlayerCard({
  member,
  stats,
  statsLoading,
  accent,
  isManager,
  onRemove,
}: LolPlayerCardProps): React.JSX.Element {
  return (
    <motion.div
      className="group relative flex flex-col gap-3 rounded-md border p-4"
      style={{
        background: `${accent}08`,
        borderColor: `${accent}22`,
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <LolPlayerCardHeader
        member={member}
        accent={accent}
        isManager={isManager}
        onRemove={onRemove}
      />

      <div className="border-t pt-3" style={{ borderColor: `${accent}18` }}>
        {statsLoading ? (
          <LolPlayerCardSkeleton />
        ) : stats ? (
          <LolPlayerCardStatsBody stats={stats} accent={accent} />
        ) : (
          <p
            className="text-xs"
            style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
          >
            Stats non disponibles
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Sous-composant privé : corps des stats ───────────────────────────────────

interface LolPlayerCardStatsBodyProps {
  stats:  PlayerStatEntry;
  accent: string;
}

function LolPlayerCardStatsBody({ stats, accent }: LolPlayerCardStatsBodyProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      {stats.rank ? (
        <LolPlayerCardRankBadge rank={stats.rank} />
      ) : (
        <p
          className="text-xs"
          style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
        >
          Non classé
        </p>
      )}
      {stats.topChampions.length > 0 && (
        <>
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
          >
            Top champions
          </p>
          <LolPlayerCardChampions champions={stats.topChampions} accent={accent} />
        </>
      )}
    </div>
  );
}
