/**
 * Modale de confirmation du transfert de propriété d'une équipe LoL.
 * Affiche les membres éligibles (non-owner) dans un sélecteur, puis une
 * confirmation textuelle avant d'appeler onConfirm(userId).
 * Accessible via BaseModal (portal) + rôle dialog + Escape.
 */
import React, { useState, useEffect } from 'react';

import { BaseModal } from '../../ui/BaseModal';
import { useLolTheme } from '../../../hooks/useLolTheme';
import type { LolApiMember } from '../../../types/lolTeam.types';

interface LolTransferOwnershipModalProps {
  isOpen:     boolean;
  ownerId:    string;
  members:    LolApiMember[];
  onConfirm:  (userId: string) => Promise<void>;
  onCancel:   () => void;
}

export function LolTransferOwnershipModal({
  isOpen,
  ownerId,
  members,
  onConfirm,
  onCancel,
}: LolTransferOwnershipModalProps): React.JSX.Element {
  const { vars }                    = useLolTheme();
  const [selectedId, setSelectedId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const eligibles = members.filter((m) => m.userId !== ownerId);

  useEffect(() => {
    if (!isOpen) { setSelectedId(''); setSubmitting(false); setError(null); }
    else if (eligibles.length > 0 && !selectedId) setSelectedId(eligibles[0].userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!selectedId) { setError('Sélectionnez un membre.'); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(selectedId);
      onCancel();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors du transfert.');
      setSubmitting(false);
    }
  };

  const selectedPseudo = eligibles.find((m) => m.userId === selectedId)?.pseudo ?? '';

  return (
    <BaseModal isOpen={isOpen} onClose={onCancel} panelStyle={vars}>
      <div role="dialog" aria-modal="true" aria-labelledby="transfer-title" className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2
            id="transfer-title"
            className="text-lg font-bold uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
          >
            Transférer la propriété
          </h2>
          <button type="button" onClick={onCancel} className="btn btn-text btn-sm text-lg leading-none" aria-label="Annuler">
            ✕
          </button>
        </div>

        {eligibles.length === 0 ? (
          <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
            Aucun autre membre éligible. Ajoutez d'abord un membre.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="transfer-select"
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
              >
                Nouveau propriétaire
              </label>
              <select
                id="transfer-select"
                value={selectedId}
                onChange={(e) => { setSelectedId(e.target.value); setError(null); }}
                className="rounded-sm px-3 py-2 text-sm outline-none"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--lol-text)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {eligibles.map((m) => (
                  <option key={m.userId} value={m.userId}
                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                  >
                    {m.pseudo}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
              Vous allez transférer la propriété à{' '}
              <strong style={{ color: 'var(--lol-text)', fontFamily: 'Rajdhani, sans-serif' }}>
                {selectedPseudo}
              </strong>
              . Vous deviendrez Capitaine. Cette action est irréversible.
            </p>

            {error && (
              <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}>
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm flex-1 justify-center">
                Annuler
              </button>
              <button
                type="button"
                onClick={() => { void handleConfirm(); }}
                disabled={submitting || !selectedId}
                className="btn btn-sm flex-1 justify-center rounded-sm font-bold disabled:opacity-60"
                style={{ background: 'var(--danger)', color: '#fff', fontFamily: 'Rajdhani, sans-serif' }}
              >
                {submitting ? 'Transfert…' : 'Confirmer'}
              </button>
            </div>
          </>
        )}
      </div>
    </BaseModal>
  );
}
