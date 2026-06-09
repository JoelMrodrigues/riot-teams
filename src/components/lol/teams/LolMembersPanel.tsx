/**
 * Panel complet de gestion des membres d'une équipe LoL.
 * - Visible uniquement si le rôle courant est 'owner' ou 'captain' (gating UI).
 * - Liste les membres avec LolMemberRow (changement de rôle + retrait).
 * - Intègre LolMemberSearch pour ajouter un utilisateur.
 * - Réservé à l'owner : bouton « Transférer la propriété ».
 */
import React, { useState } from 'react';

import { LolMemberRow } from './LolMemberRow';
import { LolMemberSearch } from './LolMemberSearch';
import { LolTransferOwnershipModal } from './LolTransferOwnershipModal';
import { LolTeamManagersList } from './LolTeamManagersList';
import type { LolApiMember, LolAssignableRole, LolTeamRole } from '../../../types/lolTeam.types';

interface LolMembersPanelProps {
  members:          LolApiMember[];
  ownerId:          string;
  myRole:           LolTeamRole;
  onAddMember:      (userId: string, role: LolAssignableRole) => Promise<void>;
  onChangeRole:     (userId: string, role: LolAssignableRole) => Promise<void>;
  onRemoveMember:   (userId: string) => Promise<void>;
  onTransfer:       (userId: string) => Promise<void>;
}

export function LolMembersPanel({
  members,
  ownerId,
  myRole,
  onAddMember,
  onChangeRole,
  onRemoveMember,
  onTransfer,
}: LolMembersPanelProps): React.JSX.Element | null {
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const canManage   = myRole === 'owner' || myRole === 'captain';
  const isOwner     = myRole === 'owner';

  // En lecture seule → on réutilise le composant existant
  if (!canManage) return <LolTeamManagersList members={members} />;

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
          >
            Membres
          </span>
          {isOwner && (
            <button
              type="button"
              onClick={() => setIsTransferOpen(true)}
              className="text-xs uppercase tracking-widest transition-opacity hover:opacity-75"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
            >
              Transférer la propriété
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          {members.map((m) => (
            <LolMemberRow
              key={m.userId}
              member={m}
              ownerId={ownerId}
              onChangeRole={onChangeRole}
              onRemove={onRemoveMember}
            />
          ))}
        </div>

        <LolMemberSearch onAdd={onAddMember} />
      </div>

      <LolTransferOwnershipModal
        isOpen={isTransferOpen}
        ownerId={ownerId}
        members={members}
        onConfirm={onTransfer}
        onCancel={() => setIsTransferOpen(false)}
      />
    </>
  );
}
