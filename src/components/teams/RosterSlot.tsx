import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import type { TeamMember } from '../../types/team.types';
import type { GameType } from '../../types/team.types';

interface RosterSlotProps {
  member: TeamMember | null;
  slotIndex: number;
  accentColor: string;
  gameRoute: GameType;
  onRemove?: () => void;
  onAdd?: () => void;
}

export function RosterSlot({
  member,
  slotIndex,
  accentColor,
  gameRoute,
  onRemove,
  onAdd,
}: RosterSlotProps): React.JSX.Element {
  const navigate = useNavigate();

  if (!member) {
    return (
      <motion.button
        className="group flex items-center justify-center gap-2 h-14 rounded-sm border border-dashed cursor-pointer transition-colors duration-200 w-full"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        whileHover={{ borderColor: `${accentColor}50`, background: `${accentColor}06` }}
        onClick={onAdd}
      >
        <span
          className="text-sm text-white/20 group-hover:text-white/40 transition-colors duration-200"
          style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}
        >
          + Slot {slotIndex + 1}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.div
      className="group relative flex items-center gap-3 h-14 px-4 rounded-sm border"
      style={{
        background: `${accentColor}0A`,
        borderColor: `${accentColor}25`,
      }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 text-xs font-bold"
        style={{
          background: `${accentColor}20`,
          color: accentColor,
          fontFamily: 'Rajdhani, sans-serif',
        }}
      >
        {slotIndex + 1}
      </div>

      <button
        className="flex-1 text-left min-w-0 cursor-pointer"
        onClick={() =>
          navigate(
            `/${gameRoute}/player/${encodeURIComponent(member.gameName)}/${encodeURIComponent(member.tagLine)}`,
          )
        }
      >
        <span
          className="text-sm font-semibold text-white hover:underline truncate block"
          style={{ fontFamily: 'Inter, sans-serif', textDecorationColor: accentColor }}
        >
          {member.gameName}
          <span className="text-white/30 font-normal">#{member.tagLine}</span>
        </span>
      </button>

      {onRemove && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-white/20 hover:text-[color:var(--danger)] transition-colors duration-150 cursor-pointer opacity-0 group-hover:opacity-100"
          title="Retirer du roster"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}
