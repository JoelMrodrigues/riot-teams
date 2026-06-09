import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LOL_ACCENTS } from '../../../constants/lolTheme';
import type { LolApiRosterMember } from '../../../types/lolTeam.types';

interface LolTeamRosterSlotProps {
  member:     LolApiRosterMember | null;
  slotIndex:  number;
  isManager:  boolean;
  onRemove?:  () => void;
  onAdd?:     () => void;
}

const accent = LOL_ACCENTS.team.color;

/**
 * Slot de roster thème LoL — branché sur LolApiRosterMember.
 * Bouton retirer visible uniquement si isManager === true et membre présent.
 */
export function LolTeamRosterSlot({
  member,
  slotIndex,
  isManager,
  onRemove,
  onAdd,
}: LolTeamRosterSlotProps): React.JSX.Element {
  const navigate = useNavigate();

  if (!member) {
    if (!isManager) {
      return (
        <div
          className="flex h-14 w-full items-center justify-center rounded-sm border border-dashed"
          style={{ borderColor: 'var(--lol-border)' }}
          aria-label={`Slot ${slotIndex + 1} vide`}
        >
          <span
            className="text-sm"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)', letterSpacing: '0.05em' }}
          >
            Slot {slotIndex + 1}
          </span>
        </div>
      );
    }

    return (
      <motion.button
        type="button"
        className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed transition-colors duration-200"
        style={{ borderColor: 'var(--lol-border)' }}
        whileHover={{ borderColor: `${accent}55`, background: `${accent}08` }}
        onClick={onAdd}
        aria-label={`Ajouter un joueur au slot ${slotIndex + 1}`}
      >
        <span
          className="text-sm transition-colors duration-200"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)', letterSpacing: '0.05em' }}
        >
          + Slot {slotIndex + 1}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.div
      className="group relative flex h-14 items-center gap-3 rounded-sm border px-4"
      style={{ background: `${accent}0A`, borderColor: `${accent}25` }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-sm text-xs font-bold"
        style={{ background: `${accent}20`, color: accent, fontFamily: 'Rajdhani, sans-serif' }}
      >
        {slotIndex + 1}
      </div>

      <button
        type="button"
        className="min-w-0 flex-1 cursor-pointer text-left"
        onClick={() =>
          navigate(
            `/lol/player/${encodeURIComponent(member.gameName)}/${encodeURIComponent(member.tagLine)}`,
          )
        }
      >
        <span
          className="block truncate text-sm font-semibold hover:underline"
          style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text)', textDecorationColor: accent }}
        >
          {member.gameName}
          <span style={{ color: 'var(--lol-text-muted)', fontWeight: 400 }}>#{member.tagLine}</span>
        </span>
      </button>

      {isManager && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Retirer ${member.gameName} du roster`}
          className="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm opacity-0 transition-all duration-150 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100"
          style={{ color: 'var(--lol-text-muted)' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--lol-text-muted)')}
          onFocus={(e)      => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)')}
          onBlur={(e)       => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--lol-text-muted)')}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}
