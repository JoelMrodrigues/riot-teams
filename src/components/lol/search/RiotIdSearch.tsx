import React, { useState } from 'react';

interface RiotIdSearchProps {
  onSearch: (riotId: string) => void;
  loading: boolean;
}

/** Barre de recherche Riot ID (pseudo#tag). */
export function RiotIdSearch({ onSearch, loading }: RiotIdSearchProps): React.JSX.Element {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (value.trim()) onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Pseudo#TAG  (ex: Marcel le Zgeg#BACK)"
        className="flex-1 rounded-md px-4 py-3 text-sm outline-none"
        style={{
          fontFamily: 'Rajdhani, sans-serif',
          background: 'var(--lol-surface)',
          border: '1px solid var(--lol-border)',
          color: 'var(--lol-text)',
        }}
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-md px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.03] disabled:opacity-50"
        style={{ fontFamily: 'Rajdhani, sans-serif', background: 'var(--lol-violet-strong)', boxShadow: '0 8px 24px var(--lol-glow)' }}
      >
        {loading ? '...' : 'Rechercher'}
      </button>
    </form>
  );
}
