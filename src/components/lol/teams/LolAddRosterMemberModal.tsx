import React, { useState, useEffect } from 'react';

import { BaseModal } from '../../ui/BaseModal';
import { useLolTheme } from '../../../hooks/useLolTheme';
import { parseRiotId, RIOT_ID_ERROR } from '../../../utils/riotId';

interface LolAddRosterMemberModalProps {
  isOpen:  boolean;
  onClose: () => void;
  onAdd:   (gameName: string, tagLine: string) => Promise<void>;
}

/**
 * Modal d'ajout d'un joueur au roster LoL via Riot ID.
 * Remplace AddPlayerModal (générique) pour brancher l'API backend.
 */
export function LolAddRosterMemberModal({
  isOpen,
  onClose,
  onAdd,
}: LolAddRosterMemberModalProps): React.JSX.Element {
  const { vars }                    = useLolTheme();
  const [input, setInput]           = useState('');
  const [error, setError]           = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) { setInput(''); setError(null); setSubmitting(false); }
  }, [isOpen]);

  const handleSubmit = async () => {
    const parsed = parseRiotId(input);
    if (!parsed) { setError(RIOT_ID_ERROR); return; }

    setSubmitting(true);
    setError(null);
    try {
      await onAdd(parsed.gameName, parsed.tagLine);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout.");
      setSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} panelStyle={vars}>
      <div className="flex items-center justify-between">
        <h2
          className="text-xl font-bold uppercase tracking-widest"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
        >
          Ajouter un joueur
        </h2>
        <button onClick={onClose} className="btn btn-text btn-sm text-lg leading-none" aria-label="Fermer">
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="lol-add-player-input"
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
        >
          Riot ID
        </label>
        <input
          id="lol-add-player-input"
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { void handleSubmit(); } }}
          placeholder="NomJoueur#TAG"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          className="rounded-sm px-4 py-3 text-sm outline-none transition-colors"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--lol-text)',
            fontFamily: 'Inter, sans-serif',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--lol-violet)')}
          onBlur={(e)  => (e.target.style.borderColor = 'var(--border-default)')}
        />
        {error && (
          <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}>
            {error}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => { void handleSubmit(); }}
        disabled={submitting}
        className="btn btn-solid btn-md w-full justify-center disabled:opacity-60"
        style={{ background: 'var(--lol-violet)', color: '#fff' }}
      >
        {submitting ? 'Ajout…' : 'Ajouter au roster'}
      </button>
    </BaseModal>
  );
}
