import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { GameType } from '../../types/team.types';
import { GAMES_DATA } from '../../data/games.data';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, game: GameType) => void;
}

export function CreateTeamModal({ isOpen, onClose, onCreate }: CreateTeamModalProps): React.JSX.Element {
  const [name, setName] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameType>('lol');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) { setName(''); setError(null); setSelectedGame('lol'); }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) { setError('Le nom de l\'équipe est requis.'); return; }
    if (name.trim().length < 2) { setError('Minimum 2 caractères.'); return; }
    onCreate(name.trim(), selectedGame);
    onClose();
  };

  const activeGame = GAMES_DATA.find((g) => g.id === selectedGame)!;

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
                <h2
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  Créer une équipe
                </h2>
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
                  Nom de l'équipe
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                  placeholder="ex: Team Soleil"
                  autoFocus
                  className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-white/25 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                {error && (
                  <p className="text-xs text-red-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {error}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-xs uppercase tracking-widest text-white/40"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  Jeu
                </label>
                <div className="flex gap-2">
                  {GAMES_DATA.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game.id as GameType)}
                      className="flex-1 py-2.5 text-sm font-semibold uppercase tracking-wider rounded-sm border cursor-pointer transition-all duration-150"
                      style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        background: selectedGame === game.id ? `${game.accentColor}18` : 'transparent',
                        borderColor: selectedGame === game.id ? game.accentColor : 'rgba(255,255,255,0.1)',
                        color: selectedGame === game.id ? game.accentColor : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {game.tag}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 text-sm font-bold tracking-widest uppercase rounded-sm cursor-pointer transition-all duration-150 hover:opacity-85 active:scale-95"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  background: activeGame.accentColor,
                  color: activeGame.darkColor,
                }}
              >
                Créer l'équipe
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
