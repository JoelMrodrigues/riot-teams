import React, { useRef } from 'react';

import { resizeImageToSquare } from '../../../utils/resizeImage';

interface LolUploadPickerActiveProps {
  onUpload: (dataBase64: string, mime: 'image/jpeg') => Promise<void>;
  uploading: boolean;
  uploadError: string | null;
}

/**
 * Panneau upload actif dans le LolTeamIconPicker — contexte édition/détail.
 * Redimensionne l'image via canvas et délègue l'upload au parent.
 */
export function LolUploadPickerActive({
  onUpload,
  uploading,
  uploadError,
}: LolUploadPickerActiveProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const resized = await resizeImageToSquare(file, 256);
      await onUpload(resized.dataBase64, 'image/jpeg');
    } catch {
      // L'erreur remonte via uploadError
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-sm py-6"
      style={{
        background: 'var(--lol-surface)',
        border: '1px dashed var(--lol-border)',
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: 'var(--lol-text-muted)' }}
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="btn btn-ghost btn-sm"
        aria-label="Choisir un logo à uploader"
      >
        {uploading ? 'Upload en cours…' : 'Choisir une image'}
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

      <p
        className="text-center text-xs"
        style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        PNG, JPEG ou WEBP · max ~512 Ko · 256×256 px (recadrage auto)
      </p>

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
