/**
 * Champ de recherche d'utilisateurs void.pro + sélecteur de rôle + bouton Ajouter.
 * Debounce 350 ms sur la saisie. Résultats via LolUserSearchResults.
 * Appelle onAdd(userId, role) à la validation.
 */
import React, { useState, useEffect, useRef } from 'react';

import { LolUserSearchResults } from './LolUserSearchResults';
import { searchUsers } from '../../../services/usersApi';
import { useAuth } from '../../../hooks/useAuth';
import { ASSIGNABLE_ROLE_OPTIONS } from '../../../constants/lolMemberRoles';
import type { LolAssignableRole, UserSearchResult } from '../../../types/lolTeam.types';

interface LolMemberSearchProps {
  onAdd: (userId: string, role: LolAssignableRole) => Promise<void>;
}

export function LolMemberSearch({ onAdd }: LolMemberSearchProps): React.JSX.Element {
  const { token } = useAuth();
  const [query, setQuery]           = useState('');
  const [results, setResults]       = useState<UserSearchResult[]>([]);
  const [selected, setSelected]     = useState<UserSearchResult | null>(null);
  const [role, setRole]             = useState<LolAssignableRole>('manager');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selected) { setResults([]); return; }
    if (query.trim().length < 2) { setResults([]); return; }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!token) return;
      searchUsers(query.trim(), token)
        .then(setResults)
        .catch(() => setResults([]));
    }, 350);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, token, selected]);

  const handleSelect = (u: UserSearchResult) => {
    setSelected(u);
    setQuery(u.pseudo);
    setResults([]);
    setError(null);
  };

  const handleAdd = async () => {
    if (!selected) { setError('Sélectionnez un utilisateur dans la liste.'); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onAdd(selected.id, role);
      setQuery('');
      setSelected(null);
      setRole('manager');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <span
        className="text-xs uppercase tracking-widest"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        Ajouter un membre
      </span>

      <div className="relative flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); setError(null); }}
            placeholder="Rechercher un pseudo…"
            autoComplete="off"
            spellCheck={false}
            aria-label="Rechercher un utilisateur"
            className="w-full rounded-sm px-3 py-2 text-sm outline-none transition-colors"
            style={{
              background: 'var(--lol-surface)',
              border: '1px solid var(--lol-border)',
              color: 'var(--lol-text)',
              fontFamily: 'Inter, sans-serif',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--lol-violet)')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--lol-border)')}
          />
          <LolUserSearchResults results={results} onSelect={handleSelect} />
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as LolAssignableRole)}
          aria-label="Rôle à attribuer"
          className="rounded-sm px-3 py-2 text-sm outline-none"
          style={{
            background: 'var(--lol-surface)',
            border: '1px solid var(--lol-border)',
            color: 'var(--lol-text)',
            fontFamily: 'Rajdhani, sans-serif',
            minWidth: '9rem',
          }}
        >
          {ASSIGNABLE_ROLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => { void handleAdd(); }}
          disabled={submitting || !selected}
          className="btn btn-solid btn-sm whitespace-nowrap disabled:opacity-50"
          style={{ background: 'var(--lol-violet)' }}
        >
          {submitting ? 'Ajout…' : 'Ajouter'}
        </button>
      </div>

      {error && (
        <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
