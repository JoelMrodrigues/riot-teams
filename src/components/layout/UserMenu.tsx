import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import type { User } from '../../types/auth';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

/** Menu utilisateur connecté : pseudo → Mes équipes / Déconnexion. */
export function UserMenu({ user, onLogout }: UserMenuProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const itemStyle: React.CSSProperties = { fontFamily: 'Rajdhani, sans-serif' };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={user.email}
        className="btn btn-ghost btn-sm flex items-center gap-2"
      >
        <span className="uppercase tracking-widest" style={itemStyle}>{user.pseudo}</span>
        <span aria-hidden className={`text-[10px] transition-transform duration-150 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-sm border py-1 shadow-xl"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-default)' }}
        >
          <Link
            to="/lol/teams"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm transition-colors hover:bg-[var(--bg-surface)]"
            style={{ ...itemStyle, color: 'var(--text-primary)' }}
          >
            Mes équipes
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); onLogout(); }}
            className="block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--bg-surface)]"
            style={{ ...itemStyle, color: 'var(--danger)' }}
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
