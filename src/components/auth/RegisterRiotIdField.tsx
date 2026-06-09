/**
 * Bloc Riot ID du formulaire d'inscription.
 * Contient : champ texte Riot ID + case à cocher "staff" + encart d'explication.
 * Quand isStaff est true, le champ est masqué et l'encart StaffInfoBanner s'affiche.
 */
import React from 'react';

import { StaffInfoBanner } from './StaffInfoBanner';

interface RegisterRiotIdFieldProps {
  riotId: string;
  isStaff: boolean;
  error?: string;
  onRiotIdChange: (value: string) => void;
  onIsStaffChange: (value: boolean) => void;
}

export function RegisterRiotIdField({
  riotId,
  isStaff,
  error,
  onRiotIdChange,
  onIsStaffChange,
}: RegisterRiotIdFieldProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      {/* Champ Riot ID — masqué si staff */}
      {!isStaff && (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reg-riot-id"
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-secondary)', fontFamily: 'Rajdhani, sans-serif' }}
          >
            Riot ID{' '}
            <span
              className="normal-case tracking-normal font-normal"
              style={{ color: 'var(--text-muted)' }}
            >
              (optionnel)
            </span>
          </label>
          <input
            id="reg-riot-id"
            type="text"
            value={riotId}
            onChange={(e) => onRiotIdChange(e.target.value)}
            placeholder="Pseudo#TAG"
            autoComplete="off"
            className="w-full px-3 py-2.5 rounded-sm text-sm outline-none transition-colors duration-150"
            style={{
              background: 'var(--bg-elevated)',
              border: `1px solid ${error ? 'var(--danger)' : 'var(--border-default)'}`,
              color: 'var(--text-primary)',
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'reg-riot-id-error' : undefined}
          />
          {error && (
            <p
              id="reg-riot-id-error"
              role="alert"
              className="text-xs"
              style={{ color: 'var(--danger)' }}
            >
              {error}
            </p>
          )}
        </div>
      )}

      {/* Case à cocher staff */}
      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          checked={isStaff}
          onChange={(e) => onIsStaffChange(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 cursor-pointer accent-[var(--brand)]"
        />
        <span
          className="text-xs leading-relaxed select-none"
          style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)' }}
        >
          Je suis membre du staff / je ne renseigne pas mon Riot ID
        </span>
      </label>

      {/* Encart explicatif quand staff coché */}
      {isStaff && <StaffInfoBanner />}
    </div>
  );
}
