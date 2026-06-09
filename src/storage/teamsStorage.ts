import type { Team } from '../types/team.types';

const STORAGE_KEY = 'void-pro:teams';

export const teamsStorage = {
  getAll(): Team[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Team[]) : [];
    } catch {
      return [];
    }
  },

  /** Renvoie `true` si la persistance a réussi, `false` sinon (quota dépassé, mode privé…). */
  save(teams: Team[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
      return true;
    } catch (err) {
      console.error('[teamsStorage] Échec de la sauvegarde locale :', err);
      return false;
    }
  },
};
