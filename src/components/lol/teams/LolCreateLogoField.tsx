import React, { useRef, useState } from 'react';

import { resizeImageToSquare } from '../../../utils/resizeImage';
import type { ResizedImage } from '../../../utils/resizeImage';

interface LolCreateLogoFieldProps {
  value:    ResizedImage | null;
  onChange: (img: ResizedImage | null) => void;
}

/**
 * Champ logo optionnel pour la création d'équipe. Le logo est redimensionné
 * côté client puis envoyé APRÈS la création (il a besoin de l'id d'équipe).
 */
export function LolCreateLogoField({ value, onChange }: LolCreateLogoFieldProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setError(null);
    try {
      onChange(await resizeImageToSquare(file, 256));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Image invalide.');
    }
  };

  const preview = value ? `data:${value.mime};base64,${value.dataBase64}` : null;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
        Logo <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optionnel)</span>
      </span>

      <div className="flex items-center gap-3">
        {preview ? (
          <img src={preview} alt="Aperçu du logo" className="h-14 w-14 rounded-sm object-cover" style={{ border: '1px solid var(--lol-border)' }} />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-sm text-xs" style={{ border: '1px dashed var(--lol-border)', color: 'var(--lol-text-muted)' }}>
            —
          </div>
        )}

        <button type="button" onClick={() => inputRef.current?.click()} className="btn btn-ghost btn-sm">
          {value ? 'Changer' : 'Choisir une image'}
        </button>
        {value && (
          <button type="button" onClick={() => onChange(null)} className="btn btn-text btn-sm" style={{ color: 'var(--lol-text-muted)' }}>
            Retirer
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleFile}
      />
      {error && <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}>{error}</p>}
    </div>
  );
}
