import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface PlayerSearchBarProps {
  accentColor: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export function PlayerSearchBar({
  accentColor,
  value,
  error,
  onChange,
  onSearch,
}: PlayerSearchBarProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xl">
      <div
        className="flex w-full rounded-sm overflow-hidden border transition-colors duration-200"
        style={{
          borderColor: error ? 'var(--danger)' : 'var(--border-default)',
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="NomJoueur#TAG"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent px-5 py-3.5 text-white placeholder-white/25 text-sm outline-none"
          style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em' }}
        />
        <button
          onClick={onSearch}
          className="px-6 py-3.5 text-sm font-bold tracking-widest uppercase transition-opacity duration-150 hover:opacity-85 active:scale-95 cursor-pointer"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            background: accentColor,
            color: '#000',
            letterSpacing: '0.1em',
          }}
        >
          Search
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            className="text-xs text-center"
            style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
