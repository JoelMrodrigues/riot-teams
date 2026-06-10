import React from 'react';

import { LolRegionSelect } from './LolRegionSelect';
import { LolRosterRolePicker } from './LolRosterRolePicker';
import { LolRosterStatusToggle } from './LolRosterStatusToggle';
import type { RosterRole } from './LolRosterRolePicker';
import type { LolRegion } from '../../../types/team.types';

export interface AddRosterFormState {
  displayName:     string;
  riotId:          string;
  region:          LolRegion;
  secondaryRiotId: string;
  role:            RosterRole | null;
  isSub:           boolean;
}

interface LolAddRosterFieldsProps {
  state:  AddRosterFormState;
  errors: Partial<Record<'displayName' | 'riotId', string>>;
  patch:  (p: Partial<AddRosterFormState>) => void;
}

const SECTION_CLS = 'text-[11px] font-bold uppercase tracking-[0.2em]';
const SECTION_STYLE: React.CSSProperties = { fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' };

interface TextFieldProps {
  label: string; value: string; placeholder: string;
  onChange: (v: string) => void; error?: string; hint?: string;
}

/** Champ texte stylé (défini au niveau module → pas de remount au render). */
function TextField({ label, value, placeholder, onChange, error, hint }: TextFieldProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.15em]" style={SECTION_STYLE}>
        {label}
      </span>
      <input
        type="text" value={value} placeholder={placeholder} autoComplete="off" spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--lol-text)', fontFamily: 'Inter, sans-serif' }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--lol-violet)')}
        onBlur={(e)  => (e.target.style.borderColor = 'var(--border-default)')}
      />
      {error
        ? <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}>{error}</span>
        : hint && <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>{hint}</span>}
    </div>
  );
}

/** Champs du formulaire d'ajout d'un joueur au roster (présentational). */
export function LolAddRosterFields({ state, errors, patch }: LolAddRosterFieldsProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-5">
      <p className={SECTION_CLS} style={SECTION_STYLE}>Identité</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Nom *" value={state.displayName} placeholder="Ex: John Doe"
          onChange={(v) => patch({ displayName: v })} error={errors.displayName}
        />
        <TextField
          label="Pseudo Riot ID *" value={state.riotId} placeholder="ex: Shayn#EUW1"
          onChange={(v) => patch({ riotId: v })} error={errors.riotId}
          hint="Format Riot ID requis — active la sync SoloQ automatique"
        />
        <LolRegionSelect value={state.region} onChange={(r) => patch({ region: r })} />
        <TextField
          label="Compte secondaire" value={state.secondaryRiotId} placeholder="ex: AltAccount#EUW1"
          onChange={(v) => patch({ secondaryRiotId: v })}
        />
      </div>

      <p className={SECTION_CLS} style={SECTION_STYLE}>Rôle &amp; profil</p>
      <LolRosterRolePicker value={state.role} onChange={(role) => patch({ role })} />
      <LolRosterStatusToggle isSub={state.isSub} onChange={(isSub) => patch({ isSub })} />
    </div>
  );
}
