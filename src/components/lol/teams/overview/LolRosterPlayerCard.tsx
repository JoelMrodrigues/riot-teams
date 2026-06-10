import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LolPlayerCardChampions } from '../LolPlayerCardChampions';
import { LolPlayerCardSkeleton } from '../LolPlayerCardSkeleton';
import { rankCrest } from '../../../../utils/lolAssets';
import { tierColor, formatRankShort } from '../../../../utils/lolRank';
import { normalizeRole, ROLE_LABEL } from '../../../../utils/organizeRosterByRole';
import type { LolApiRosterMember } from '../../../../types/lolTeam.types';
import type { PlayerStatEntry } from '../../../../hooks/useTeamPlayerStats';

interface LolRosterPlayerCardProps {
  member:       LolApiRosterMember;
  stats:        PlayerStatEntry | null;
  statsLoading: boolean;
  accent:       string;
  isManager:    boolean;
  isDemo?:      boolean;
  onRemove?:    () => void;
}

/**
 * Carte joueur (page Aperçu) : en-tête compact à hauteur fixe (alignement garanti)
 * + Top 5 champions. En-tête dense pour ne pas gaspiller d'espace vertical.
 */
export function LolRosterPlayerCard({
  member, stats, statsLoading, accent, isManager, isDemo, onRemove,
}: LolRosterPlayerCardProps): React.JSX.Element {
  const navigate = useNavigate();
  const rank     = stats?.rank ?? null;
  const crest    = rank ? rankCrest(rank.tier) : null;
  const canon    = normalizeRole(member.roleInGame);
  const roleLbl  = canon ? ROLE_LABEL[canon] : member.roleInGame;
  const title    = member.displayName || member.gameName;

  const openProfile = () => {
    if (isDemo) return;
    navigate(`/lol/player/${encodeURIComponent(member.gameName)}/${encodeURIComponent(member.tagLine)}`);
  };

  return (
    <motion.div
      className="group relative flex h-full flex-col overflow-hidden rounded-md border"
      style={{ background: `${accent}0A`, borderColor: `${accent}24` }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* En-tête compact (bande teintée) — hauteur fixe pour aligner les cartes */}
      <div className="relative h-[92px] px-3.5 pt-3" style={{ background: `${accent}12` }}>
        {crest && (
          <img
            src={crest}
            alt=""
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-1 h-[68px] w-[68px] select-none object-contain opacity-95"
          />
        )}
        {isManager && onRemove && !isDemo && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Retirer ${title}`}
            className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-sm opacity-0 transition-all duration-150 group-hover:opacity-100 focus-visible:opacity-100"
            style={{ background: 'var(--lol-bg-elevated)', color: 'var(--lol-text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--lol-text-muted)'; }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}

        <div className="relative z-[1] flex flex-col gap-1 pr-14">
          <button type="button" onClick={openProfile} className={`block max-w-full text-left ${isDemo ? 'cursor-default' : 'cursor-pointer'}`}>
            <span className="block truncate text-base font-bold leading-tight" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
              {title}
            </span>
          </button>
          <span className="block truncate text-[11px] leading-none" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
            {member.gameName}#{member.tagLine}
          </span>

          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            {roleLbl && (
              <span
                className="rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ fontFamily: 'Rajdhani, sans-serif', background: `${accent}1F`, border: `1px solid ${accent}38`, color: accent }}
              >
                {roleLbl}
              </span>
            )}
            {rank && (
              <span
                className="rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{ fontFamily: 'Rajdhani, sans-serif', background: `${tierColor(rank.tier)}22`, color: tierColor(rank.tier) }}
              >
                {formatRankShort(rank.tier, rank.rank)} · {rank.lp} LP
              </span>
            )}
            {member.isSubstitute && (
              <span
                className="rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ fontFamily: 'Rajdhani, sans-serif', background: 'var(--lol-surface)', border: '1px solid var(--lol-border)', color: 'var(--lol-text-muted)' }}
              >
                Sub
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center border-t px-3.5 pb-3.5 pt-3" style={{ borderColor: `${accent}1A` }}>
        <p
          className="mb-2 text-center text-[10px] uppercase tracking-[0.15em]"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
        >
          Top 5 champions
        </p>
        {statsLoading ? (
          <LolPlayerCardSkeleton />
        ) : (
          <LolPlayerCardChampions champions={stats?.topChampions ?? []} accent={accent} size={46} />
        )}
      </div>
    </motion.div>
  );
}
