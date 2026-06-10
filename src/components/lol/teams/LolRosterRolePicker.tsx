import React from 'react';

/** Rôle stocké côté backend (enum lol_rosters.role_in_game). */
export type RosterRole = 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Support' | 'Fill';

interface RoleOption {
  value: RosterRole;
  label: string;
  color: string;
}

/** Couleurs sémantiques par rôle (proches des conventions LoL). */
const ROLE_OPTIONS: RoleOption[] = [
  { value: 'Top',     label: 'TOP',  color: '#4F8DF7' },
  { value: 'Jungle',  label: 'JNG',  color: '#34D399' },
  { value: 'Mid',     label: 'MID',  color: '#FBBF24' },
  { value: 'ADC',     label: 'ADC',  color: '#FB7185' },
  { value: 'Support', label: 'SUP',  color: '#A78BFA' },
  { value: 'Fill',    label: 'FLEX', color: '#22D3EE' },
];

interface LolRosterRolePickerProps {
  value:    RosterRole | null;
  onChange: (role: RosterRole) => void;
}

/** Boutons de sélection du rôle (TOP/JNG/MID/ADC/SUP/FLEX), un seul actif. */
export function LolRosterRolePicker({ value, onChange }: LolRosterRolePickerProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {ROLE_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className="cursor-pointer rounded-sm px-3 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-150"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              background: active ? opt.color : `${opt.color}14`,
              border: `1px solid ${active ? opt.color : `${opt.color}40`}`,
              color: active ? '#0A1428' : opt.color,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
