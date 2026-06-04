import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { parseRiotId } from '../../utils/riotId';
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
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) { setInput(''); setError(null); }
  }, [isOpen]);

  const handleSubmit = () => {
    const parsed = parseRiotId(input);
    if (!parsed) {
      setError('Format invalide — utilisez : NomJoueur#TAG (ex: Faker#KR1)');
      return;
    }
    onAdd(parsed.gameName, parsed.tagLine);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div
              className="w-full max-w-md rounded-sm border p-7 flex flex-col gap-6"
              style={{ background: '#141414', borderColor: 'rgba(255,255,255,0.1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <h2
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                  >
                    Ajouter un joueur
                  </h2>
                  <p
                    className="text-xs"
                    style={{ fontFamily: 'Inter, sans-serif', color: `${game.accentColor}99` }}
                  >
                    {game.shortName}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/30 hover:text-white/70 transition-colors cursor-pointer text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-xs uppercase tracking-widest text-white/40"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
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
                  className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-white/25 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                {error && (
                  <p className="text-xs text-red-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 text-sm font-bold tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:opacity-85 active:scale-95"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  background: game.accentColor,
                  color: game.darkColor,
                }}
              >
                Ajouter au roster
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
