import { useState, useCallback } from 'react';

import { teamsStorage } from '../storage/teamsStorage';
import type { Team, TeamMember, GameType } from '../types/team.types';

interface UseTeamsReturn {
  teams: Team[];
  createTeam: (name: string, game: GameType) => Team;
  deleteTeam: (teamId: string) => void;
  addMember: (teamId: string, gameName: string, tagLine: string) => void;
  removeMember: (teamId: string, memberId: string) => void;
  getTeamById: (teamId: string) => Team | undefined;
}

export function useTeams(): UseTeamsReturn {
  const [teams, setTeams] = useState<Team[]>(() => teamsStorage.getAll());

  const persist = useCallback((updated: Team[]) => {
    teamsStorage.save(updated);
    setTeams(updated);
  }, []);

  const createTeam = useCallback(
    (name: string, game: GameType): Team => {
      const now = new Date().toISOString();
      const newTeam: Team = {
        id: crypto.randomUUID(),
        name,
        game,
        members: [],
        createdAt: now,
        updatedAt: now,
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

  return { teams, createTeam, deleteTeam, addMember, removeMember, getTeamById };
}
