import React from 'react';

import { LolRegionSelect } from './LolRegionSelect';
import { LolTeamAccentPicker } from './LolTeamAccentPicker';
import { LolTeamIconPicker } from './LolTeamIconPicker';
import type { LolTeamIcon, LolRegion } from '../../../types/team.types';

interface LolTeamFormState {
  name:        string;
  tag:         string;
  region:      LolRegion | '';
  accentColor: string;
  description: string;
  icon:        LolTeamIcon | null;
}

interface LolTeamFormErrors {
  name?: string;
  tag?:  string;
}

interface LolTeamFormFieldsProps {
  state:    LolTeamFormState;
  errors:   LolTeamFormErrors;
  onChange: (patch: Partial<LolTeamFormState>) => void;
}

const INPUT_STYLE: React.CSSProperties = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-default)',
  color: 'var(--lol-text)',
  fontFamily: 'Inter, sans-serif',
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Rajdhani, sans-serif',
  color: 'var(--lol-text-muted)',
};

/** Corps du formulaire de création d'équipe LoL — champs texte, pickers. */
export function LolTeamFormFields({ state, errors, onChange }: LolTeamFormFieldsProps): React.JSX.Element {
  const focusViolet  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--lol-violet)');
  const blurDefault  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--border-default)');

  return (
    <div className="flex flex-col gap-4">
      {/* Nom + Tag — grille 2 colonnes */}
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr auto' }}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lol-team-name" className="text-xs font-bold uppercase tracking-[0.15em]" style={LABEL_STYLE}>
            Nom de l'équipe
          </label>
          <input
            id="lol-team-name"
            type="text"
            value={state.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="ex : Neon Knights"
            autoFocus
            maxLength={40}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'lol-name-error' : undefined}
            className="rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"
            style={INPUT_STYLE}
            onFocus={focusViolet}
            onBlur={blurDefault}
          />
          {errors.name && (
            <p id="lol-name-error" className="text-xs" style={{ fontFamily: 'Inter', color: 'var(--danger)' }}>
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5" style={{ width: '5.5rem' }}>
          <label htmlFor="lol-team-tag" className="text-xs font-bold uppercase tracking-[0.15em]" style={LABEL_STYLE}>
            Tag
          </label>
          <input
            id="lol-team-tag"
            type="text"
            value={state.tag}
            onChange={(e) => onChange({ tag: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) })}
            placeholder="NK"
            maxLength={4}
            aria-required="true"
            aria-invalid={!!errors.tag}
            aria-describedby={errors.tag ? 'lol-tag-error' : undefined}
            className="rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"
            style={INPUT_STYLE}
            onFocus={focusViolet}
            onBlur={blurDefault}
          />
          {errors.tag && (
            <p id="lol-tag-error" className="text-xs" style={{ fontFamily: 'Inter', color: 'var(--danger)' }}>
              {errors.tag}
            </p>
          )}
        </div>
      </div>

      <LolRegionSelect value={state.region} onChange={(r) => onChange({ region: r })} />
      <LolTeamAccentPicker value={state.accentColor} onChange={(k) => onChange({ accentColor: k })} />
      <LolTeamIconPicker value={state.icon} accentColor={state.accentColor} onChange={(ic) => onChange({ icon: ic })} />

      {/* Description optionnelle */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lol-team-desc" className="text-xs font-bold uppercase tracking-[0.15em]" style={LABEL_STYLE}>
          Description <span style={{ color: 'var(--lol-text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optionnel)</span>
        </label>
        <textarea
          id="lol-team-desc"
          value={state.description}
          onChange={(e) => onChange({ description: e.target.value.slice(0, 200) })}
          placeholder="ex : Roster semi-pro EUW, scrim du jeudi soir."
          rows={3}
          maxLength={200}
          className="resize-none rounded-sm px-3 py-2.5 text-sm outline-none transition-colors"
          style={{ ...INPUT_STYLE, fontFamily: 'Inter, sans-serif' }}
          onFocus={focusViolet}
          onBlur={blurDefault}
        />
        <p className="self-end text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
          {state.description.length} / 200
        </p>
      </div>
    </div>
  );
}

export type { LolTeamFormState, LolTeamFormErrors };
