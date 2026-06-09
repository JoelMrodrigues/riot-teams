/**
 * Ligne d'un membre dans la liste de gestion de l'équipe.
 * - Owner : badge lecture seule, aucune action.
 * - Autres membres : sélecteur de rôle + bouton Retirer.
 */
import React, { useState } from 'react';

import { roleLabelFr } from '../../../utils/lolTeamRole';
import { ASSIGNABLE_ROLE_OPTIONS } from '../../../constants/lolMemberRoles';
import type { LolApiMember, LolTeamRole, LolAssignableRole } from '../../../types/lolTeam.types';

interface LolMemberRowProps {
  member:           LolApiMember;
  ownerId:          string;
  onChangeRole:     (userId: string, role: LolAssignableRole) => Promise<void>;
  onRemove:         (userId: string) => Promise<void>;
}

function badgeColor(role: LolTeamRole): string {
  switch (role) {
    case 'owner':   return 'var(--lol-violet-strong)';
    case 'captain': return 'var(--lol-violet-soft)';
    case 'manager': return 'var(--brand-soft)';
    case 'coach':   return 'var(--lol-accent)';
    default:        return 'var(--text-muted)';
  }
}

export function LolMemberRow({
  member,
  ownerId,
  onChangeRole,
  onRemove,
}: LolMemberRowProps): React.JSX.Element {
  const isOwner = member.userId === ownerId;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as LolAssignableRole;
    setBusy(true);
    setError(null);
    try {
      await onChangeRole(member.userId, newRole);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    setError(null);
    try {
      await onRemove(member.userId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <div
        className="flex h-10 items-center gap-3 rounded-sm border px-3"
        style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}
      >
        {/* Badge rôle (lecture seule pour owner) */}
        {isOwner ? (
          <span
            className="w-24 flex-shrink-0 text-xs font-bold uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: badgeColor(member.role) }}
          >
            {roleLabelFr(member.role)}
          </span>
        ) : (
          <select
            value={member.role ?? ''}
            onChange={(e) => { void handleRoleChange(e); }}
            disabled={busy}
            aria-label={`Rôle de ${member.pseudo}`}
            className="w-24 flex-shrink-0 bg-transparent text-xs font-bold uppercase tracking-widest outline-none disabled:opacity-60"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: badgeColor(member.role) }}
          >
            {ASSIGNABLE_ROLE_OPTIONS.map((o) => (
              <option
                key={o.value}
                value={o.value}
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'Rajdhani, sans-serif' }}
              >
                {o.label}
              </option>
            ))}
          </select>
        )}

        <span
          className="min-w-0 flex-1 truncate text-sm"
          style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text)' }}
        >
          {member.pseudo}
        </span>

        {!isOwner && (
          <button
            type="button"
            onClick={() => { void handleRemove(); }}
            disabled={busy}
            aria-label={`Retirer ${member.pseudo} de l'équipe`}
            className="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors disabled:opacity-40"
            style={{ color: 'var(--lol-text-muted)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--lol-text-muted)')}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {error && (
        <p className="pl-1 text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
