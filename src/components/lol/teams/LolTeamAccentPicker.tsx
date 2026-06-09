import React from 'react';

import { LOL_TEAM_ACCENTS } from '../../../data/lolTeamAccents.data';

interface LolTeamAccentPickerProps {
  value:    string;
  onChange: (key: string) => void;
}

/** Rangée de pastilles cliquables pour choisir la couleur d'accent d'une équipe LoL. */
export function LolTeamAccentPicker({ value, onChange }: LolTeamAccentPickerProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="text-xs font-bold uppercase tracking-[0.15em]"
        id="accent-picker-label"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        Couleur d'accent
      </span>
      <div
        role="radiogroup"
        aria-labelledby="accent-picker-label"
        className="flex flex-wrap gap-2"
      >
        {LOL_TEAM_ACCENTS.map((accent) => {
          const isSelected = accent.key === value;
          return (
            <button
              key={accent.key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={accent.label}
              onClick={() => onChange(accent.key)}
              className="h-7 w-7 rounded-full cursor-pointer transition-all duration-150 focus-visible:outline-none"
              style={{
                backgroundColor: accent.hex,
                opacity: isSelected ? 1 : 0.6,
                boxShadow: isSelected
                  ? `0 0 0 2px var(--bg-modal), 0 0 0 4px ${accent.hex}`
                  : 'none',
                outline: undefined,
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid var(--lol-violet)';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
