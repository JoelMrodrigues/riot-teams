/**
 * Hook pour le DÉTAIL d'une équipe LoL (id en paramètre).
 * État : { team, members, roster, loading, error, refresh, addRosterMember,
 *          removeRosterMember, updateTeam, deleteTeam,
 *          addMember, updateMemberRole, removeMember, transferOwnership }
 * Les actions membres sont déléguées à useLolMemberActions.
 */
import { useState, useEffect, useCallback } from 'react';

import {
  fetchLolTeam,
  updateLolTeam,
  deleteLolTeam,
  addLolRosterMember,
  removeLolRosterMember,
} from '../services/lolTeamsApi';
import { useLolMemberActions } from './useLolMemberActions';
import { useAuth } from './useAuth';
import { isDemoMode } from '../utils/demoMode';
import { DEMO_TEAM_DETAIL } from '../data/lolDemoTeam.data';
import type {
  LolApiTeam,
  LolApiTeamDetail,
  LolApiMember,
  LolApiRosterMember,
  LolUpdateTeamBody,
  LolAddRosterMemberBody,
  LolAssignableRole,
} from '../types/lolTeam.types';

export interface UseLolTeamReturn {
  team:     LolApiTeam | null;
  members:  LolApiMember[];
  roster:   LolApiRosterMember[];
  loading:  boolean;
  error:    string | null;
  refresh:  () => void;
  addRosterMember:    (body: LolAddRosterMemberBody) => Promise<void>;
  removeRosterMember: (rosterId: string) => Promise<void>;
  updateTeam:         (body: LolUpdateTeamBody) => Promise<void>;
  deleteTeam:         () => Promise<void>;
  addMember:          (userId: string, role: LolAssignableRole) => Promise<void>;
  updateMemberRole:   (userId: string, role: LolAssignableRole) => Promise<void>;
  removeMember:       (userId: string) => Promise<void>;
  transferOwnership:  (userId: string) => Promise<void>;
}

export function useLolTeam(teamId: string | undefined): UseLolTeamReturn {
  const { token } = useAuth();
  const [detail, setDetail]   = useState<LolApiTeamDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [rev, setRev]         = useState(0);

  useEffect(() => {
    if (isDemoMode()) {
      setDetail(DEMO_TEAM_DETAIL);
      setLoading(false);
      setError(null);
      return;
    }

    if (!teamId || !token) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchLolTeam(teamId, token)
      .then((data) => { if (!cancelled) { setDetail(data); setLoading(false); } })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur inconnue');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [teamId, token, rev]);

  const refresh = useCallback(() => setRev((v) => v + 1), []);
  const bumpRev = useCallback(() => setRev((v) => v + 1), []);

  const memberActions = useLolMemberActions({ teamId, token, onSuccess: bumpRev });

  const addRosterMember = useCallback(
    async (body: LolAddRosterMemberBody): Promise<void> => {
      if (!teamId || !token) throw new Error('Non connecté');
      await addLolRosterMember(teamId, body, token);
      setRev((v) => v + 1);
    },
    [teamId, token],
  );

  const removeRosterMember = useCallback(
    async (rosterId: string): Promise<void> => {
      if (!teamId || !token) throw new Error('Non connecté');
      await removeLolRosterMember(teamId, rosterId, token);
      setRev((v) => v + 1);
    },
    [teamId, token],
  );

  const updateTeam = useCallback(
    async (body: LolUpdateTeamBody): Promise<void> => {
      if (!teamId || !token) throw new Error('Non connecté');
      await updateLolTeam(teamId, body, token);
      setRev((v) => v + 1);
    },
    [teamId, token],
  );

  const deleteTeam = useCallback(
    async (): Promise<void> => {
      if (!teamId || !token) throw new Error('Non connecté');
      await deleteLolTeam(teamId, token);
    },
    [teamId, token],
  );

  return {
    team:    detail,
    members: detail?.members ?? [],
    roster:  detail?.roster ?? [],
    loading,
    error,
    refresh,
    addRosterMember,
    removeRosterMember,
    updateTeam,
    deleteTeam,
    ...memberActions,
  };
}
