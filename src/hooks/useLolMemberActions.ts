/**
 * Hook extrait de useLolTeam — gère uniquement les actions sur les membres
 * (addMember, updateMemberRole, removeMember, transferOwnership).
 * Chaque action rafraîchit le détail via le callback `onSuccess`.
 */
import { useCallback } from 'react';

import {
  addLolMember,
  updateLolMemberRole,
  removeLolMember,
  transferLolOwnership,
} from '../services/lolMembersApi';
import type { LolAssignableRole } from '../types/lolTeam.types';

interface UseLolMemberActionsParams {
  teamId:    string | undefined;
  token:     string | null;
  onSuccess: () => void;
}

export interface UseLolMemberActionsReturn {
  addMember:         (userId: string, role: LolAssignableRole) => Promise<void>;
  updateMemberRole:  (userId: string, role: LolAssignableRole) => Promise<void>;
  removeMember:      (userId: string) => Promise<void>;
  transferOwnership: (userId: string) => Promise<void>;
}

export function useLolMemberActions({
  teamId,
  token,
  onSuccess,
}: UseLolMemberActionsParams): UseLolMemberActionsReturn {
  const addMember = useCallback(
    async (userId: string, role: LolAssignableRole): Promise<void> => {
      if (!teamId || !token) throw new Error('Non connecté');
      await addLolMember(teamId, { user_id: userId, role }, token);
      onSuccess();
    },
    [teamId, token, onSuccess],
  );

  const updateMemberRole = useCallback(
    async (userId: string, role: LolAssignableRole): Promise<void> => {
      if (!teamId || !token) throw new Error('Non connecté');
      await updateLolMemberRole(teamId, userId, { role }, token);
      onSuccess();
    },
    [teamId, token, onSuccess],
  );

  const removeMember = useCallback(
    async (userId: string): Promise<void> => {
      if (!teamId || !token) throw new Error('Non connecté');
      await removeLolMember(teamId, userId, token);
      onSuccess();
    },
    [teamId, token, onSuccess],
  );

  const transferOwnership = useCallback(
    async (userId: string): Promise<void> => {
      if (!teamId || !token) throw new Error('Non connecté');
      await transferLolOwnership(teamId, { user_id: userId }, token);
      onSuccess();
    },
    [teamId, token, onSuccess],
  );

  return { addMember, updateMemberRole, removeMember, transferOwnership };
}
