/**
 * Contexte partagé par LolTeamLayout à ses sous-pages (Aperçu, Membres) via Outlet.
 * Évite de re-fetch les données d'équipe dans chaque page.
 */
import { useOutletContext } from 'react-router-dom';

import type { UseLolTeamReturn } from '../../../hooks/useLolTeam';
import type { UseTeamLogoReturn } from '../../../hooks/useTeamLogo';
import type { PlayerStatEntry } from '../../../hooks/useTeamPlayerStats';
import type { LolApiTeam, LolTeamRole } from '../../../types/lolTeam.types';

export interface TeamOutletContext {
  teamId: string;
  /** Garanti non-null : le layout gère les états loading / erreur. */
  team: LolApiTeam;
  /** Données détail + actions (roster, membres, suppression…). */
  actions: UseLolTeamReturn;
  myRole: LolTeamRole;
  isManager: boolean;
  logoHook: UseTeamLogoReturn;
  statsByRosterId: Map<string, PlayerStatEntry>;
  statsLoading: boolean;
  resolvedAccent: string;
}

export function useTeamOutlet(): TeamOutletContext {
  return useOutletContext<TeamOutletContext>();
}
