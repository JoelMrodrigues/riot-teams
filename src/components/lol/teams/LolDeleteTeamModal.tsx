import React from 'react';

import { BaseModal } from '../../ui/BaseModal';
import { useLolTheme } from '../../../hooks/useLolTheme';

interface LolDeleteTeamModalProps {
  isOpen:    boolean;
  teamName:  string;
  onConfirm: () => void;
  onCancel:  () => void;
}

/** Modale de confirmation accessible pour la suppression d'une équipe LoL. */
export function LolDeleteTeamModal({
  isOpen,
  teamName,
  onConfirm,
  onCancel,
}: LolDeleteTeamModalProps): React.JSX.Element {
  const { vars } = useLolTheme();

  return (
    <BaseModal isOpen={isOpen} onClose={onCancel} panelStyle={vars}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-team-title"
        className="flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h2
            id="delete-team-title"
            className="text-lg font-bold uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
          >
            Supprimer l'équipe ?
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-text btn-sm text-lg leading-none"
            aria-label="Annuler"
          >
            ✕
          </button>
        </div>

        <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
          L'équipe <strong style={{ color: 'var(--lol-text)', fontFamily: 'Rajdhani, sans-serif' }}>{teamName}</strong> et
          tous ses membres seront définitivement supprimés. Cette action est irréversible.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost btn-sm flex-1 justify-center"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-sm flex-1 justify-center rounded-sm font-bold"
            style={{
              background: 'var(--danger)',
              color: '#fff',
              fontFamily: 'Rajdhani, sans-serif',
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
