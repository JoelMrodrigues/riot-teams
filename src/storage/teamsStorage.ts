import type { Team } from '../types/team.types';

const STORAGE_KEY = 'riot-teams:teams';

export const teamsStorage = {
  getAll(): Team[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Team[]) : [];
    } catch {
      return [];
    }
  },

  save(teams: Team[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  },
};
