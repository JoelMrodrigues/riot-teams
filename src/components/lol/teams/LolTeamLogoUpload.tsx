import React, { useRef } from 'react';

import { resizeImageToSquare } from '../../../utils/resizeImage';
import type { UseTeamLogoReturn } from '../../../hooks/useTeamLogo';

interface LolTeamLogoUploadProps {
  logoHook: UseTeamLogoReturn;
}

/**
 * Contrôle d'upload de logo pour la page détail d'équipe LoL.
 * Visible uniquement pour les managers. Réalise le resize côté client
 * avant l'envoi via useTeamLogo.upload().
 */
export function LolTeamLogoUpload({ logoHook }: LolTeamLogoUploadProps): React.JSX.Element {
  const { uploading, uploadError, upload } = logoHook;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset pour permettre re-sélection du même fichier
    e.target.value = '';

    try {
      const resized = await resizeImageToSquare(file, 256);
      await upload({ dataBase64: resized.dataBase64, mime: resized.mime });
    } catch {
      // L'erreur est déjà capturée dans uploadError via le hook
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="btn btn-ghost btn-sm"
        aria-label="Changer le logo de l'équipe"
      >
        {uploading ? 'Upload…' : 'Changer le logo'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleFileChange}
      />

      {uploadError && (
        <p
          className="text-xs"
          style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}
          role="alert"
        >
          {uploadError}
        </p>
      )}
    </div>
  );
}
