/**
 * Hook pour la gestion du logo d'équipe LoL.
 * - Dérive l'URL publique (avec cache-bust après upload).
 * - Expose upload() et removeLogo() pour le manager.
 * - Gère les états loading / error locaux.
 */
import { useState, useCallback } from 'react';

import { uploadTeamLogo, deleteTeamLogo, teamLogoUrl } from '../services/lolPlayerStatsApi';
import { useAuth } from './useAuth';
import type { LolTeamLogoBody } from '../types/lolTeam.types';

export interface UseTeamLogoReturn {
  logoUrl: string;
  uploading: boolean;
  uploadError: string | null;
  upload: (body: LolTeamLogoBody) => Promise<void>;
  removeLogo: () => Promise<void>;
}

export function useTeamLogo(teamId: string | undefined): UseTeamLogoReturn {
  const { token } = useAuth();
  const [cacheBust, setCacheBust] = useState<number | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const logoUrl = teamId ? teamLogoUrl(teamId, cacheBust) : '';

  const upload = useCallback(
    async (body: LolTeamLogoBody): Promise<void> => {
      if (!teamId || !token) throw new Error('Non connecté');
      setUploading(true);
      setUploadError(null);
      try {
        await uploadTeamLogo(teamId, body, token);
        setCacheBust(Date.now());
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur lors de l'upload";
        setUploadError(msg);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [teamId, token],
  );

  const removeLogo = useCallback(
    async (): Promise<void> => {
      if (!teamId || !token) throw new Error('Non connecté');
      setUploading(true);
      setUploadError(null);
      try {
        await deleteTeamLogo(teamId, token);
        setCacheBust(undefined);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erreur lors de la suppression';
        setUploadError(msg);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [teamId, token],
  );

  return { logoUrl, uploading, uploadError, upload, removeLogo };
}
