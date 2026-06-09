import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { LolApiRosterMember } from '../../../types/lolTeam.types';

interface LolPlayerCardHeaderProps {
  member:    LolApiRosterMember;
  accent:    string;
  isManager: boolean;
  onRemove?: () => void;
}

/**
 * En-tête d'une LolPlayerCard : Riot ID cliquable, badge rôle, badge compte lié,
 * et bouton discret de retrait (manager, au hover).
 */
export function LolPlayerCardHeader({
  member,
  accent,
  isManager,
  onRemove,
}: LolPlayerCardHeaderProps): React.JSX.Element {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(
      `/lol/player/${encodeURIComponent(member.gameName)}/${encodeURIComponent(member.tagLine)}`,
    );
  };

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={handleProfileClick}
          className="block min-w-0 cursor-pointer text-left"
        >
          <span
            className="block truncate text-sm font-bold hover:underline"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: 'var(--lol-text)',
              textDecorationColor: accent,
            }}
          >
            {member.gameName}
            <span style={{ color: 'var(--lol-text-muted)', fontWeight: 400 }}>
              #{member.tagLine}
            </span>
          </span>
        </button>

        <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
          {member.roleInGame && (
            <span
              className="rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: `${accent}15`,
                border: `1px solid ${accent}30`,
                color: accent,
              }}
            >
              {member.roleInGame}
            </span>
          )}
          {member.userId && (
            <span
              className="rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: 'var(--brand-muted)',
                border: '1px solid rgba(124,58,237,0.25)',
                color: 'var(--brand-soft)',
              }}
              title="Compte void.pro lié"
            >
              Lié
            </span>
          )}
        </div>
      </div>

      {isManager && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Retirer ${member.gameName} du roster`}
          className="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm opacity-0 transition-all duration-150 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100"
          style={{ color: 'var(--lol-text-muted)' }}
          onMouseEnter={(e) => { (e.currentTarget).style.color = 'var(--danger)'; }}
          onMouseLeave={(e) => { (e.currentTarget).style.color = 'var(--lol-text-muted)'; }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
