import React, { useState, useEffect } from 'react';

import { BaseModal } from '../ui/BaseModal';
import { parseRiotId, RIOT_ID_ERROR } from '../../utils/riotId';
import type { Game } from '../../types/game.types';

interface AddPlayerModalProps {
  isOpen: boolean;
  game: Game;
  onClose: () => void;
  onAdd: (gameName: string, tagLine: string) => void;
}

export function AddPlayerModal({ isOpen, game, onClose, onAdd }: AddPlayerModalProps): React.JSX.Element {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) { setInput(''); setError(null); }
  }, [isOpen]);

  const handleSubmit = () => {
    const parsed = parseRiotId(input);
    if (!parsed) {
      setError(RIOT_ID_ERROR);
      return;
    }
    onAdd(parsed.gameName, parsed.tagLine);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}
          >
            Ajouter un joueur
          </h2>
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: `${game.accentColor}99` }}
          >
            {game.shortName}
          </p>
        </div>
        <button onClick={onClose} className="btn btn-text btn-sm text-lg leading-none">
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-muted)' }}
        >
          Riot ID
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          placeholder="NomJoueur#TAG"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          className="rounded-sm px-4 py-3 text-sm outline-none transition-colors"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            fontFamily: 'Inter, sans-serif',
          }}
          onFocus={(e) => (e.target.style.borderColor = game.accentColor)}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
        />
        {error && (
          <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}>
            {error}
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="btn btn-solid btn-md w-full justify-center"
        style={{ background: game.accentColor, color: game.darkColor }}
      >
        Ajouter au roster
      </button>
    </BaseModal>
  );
}
