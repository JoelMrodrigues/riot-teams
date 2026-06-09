import { useState, useCallback } from 'react';

import { teamsStorage } from '../storage/teamsStorage';
import type { Team, TeamMember, GameType, LolTeamIcon, LolRegion } from '../types/team.types';

/** Champs optionnels supplémentaires acceptés par createTeam pour le contexte LoL. */
interface LolTeamExtras {
  tag?:         string;
  region?:      LolRegion;
  accentColor?: string;
  description?: string;
  icon?:        LolTeamIcon;
}

const STORAGE_ERROR_MESSAGE =
  "Impossible d'enregistrer vos modifications (stockage indisponible ou plein). Vos changements seront perdus au rechargement de la page.";

interface UseTeamsReturn {
  teams: Team[];
  storageError: string | null;
  dismissStorageError: () => void;
  createTeam: (name: string, game: GameType, extras?: LolTeamExtras) => Team;
  deleteTeam: (teamId: string) => void;
  addMember: (teamId: string, gameName: string, tagLine: string) => void;
  removeMember: (teamId: string, memberId: string) => void;
  getTeamById: (teamId: string) => Team | undefined;
}

export function useTeams(): UseTeamsReturn {
  const [teams, setTeams] = useState<Team[]>(() => teamsStorage.getAll());
  const [storageError, setStorageError] = useState<string | null>(null);

  const persist = useCallback((updated: Team[]) => {
    setTeams(updated);
    const ok = teamsStorage.save(updated);
    setStorageError(ok ? null : STORAGE_ERROR_MESSAGE);
  }, []);

  const dismissStorageError = useCallback(() => setStorageError(null), []);

  const createTeam = useCallback(
    (name: string, game: GameType, extras?: LolTeamExtras): Team => {
      const now = new Date().toISOString();
      const newTeam: Team = {
        id: crypto.randomUUID(),
        name,
        game,
        members: [],
        createdAt: now,
        updatedAt: now,
        ...extras,
      };
      persist([...teams, newTeam]);
      return newTeam;
    },
    [teams, persist],
  );

  const deleteTeam = useCallback(
    (teamId: string) => {
      persist(teams.filter((t) => t.id !== teamId));
    },
    [teams, persist],
  );

  const addMember = useCallback(
    (teamId: string, gameName: string, tagLine: string) => {
      const now = new Date().toISOString();
      const member: TeamMember = {
        id: crypto.randomUUID(),
        gameName,
        tagLine,
        addedAt: now,
      };
      persist(
        teams.map((t) =>
          t.id === teamId
            ? { ...t, members: [...t.members, member], updatedAt: now }
            : t,
        ),
      );
    },
    [teams, persist],
  );

  const removeMember = useCallback(
    (teamId: string, memberId: string) => {
      const now = new Date().toISOString();
      persist(
        teams.map((t) =>
          t.id === teamId
            ? { ...t, members: t.members.filter((m) => m.id !== memberId), updatedAt: now }
            : t,
        ),
      );
    },
    [teams, persist],
  );

  const getTeamById = useCallback(
    (teamId: string): Team | undefined => teams.find((t) => t.id === teamId),
    [teams],
  );

  return {
    teams,
    storageError,
    dismissStorageError,
    createTeam,
    deleteTeam,
    addMember,
    removeMember,
    getTeamById,
  };
}
