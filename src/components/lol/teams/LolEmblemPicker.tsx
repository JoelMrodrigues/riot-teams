import React from 'react';

import { LOL_EMBLEMS } from '../../../data/lolEmblems.data';

interface LolEmblemPickerProps {
  selected:    string | null;
  accentColor: string;
  onChange:    (emblemId: string) => void;
}

/** Grille d'emblèmes SVG teintés par la couleur d'accent choisie. */
export function LolEmblemPicker({ selected, accentColor, onChange }: LolEmblemPickerProps): React.JSX.Element {
  return (
    <div
      role="group"
      aria-label="Choisir un emblème"
      className="grid grid-cols-5 gap-2"
    >
      {LOL_EMBLEMS.map((emblem) => {
        const isSelected = emblem.id === selected;
        return (
          <button
            key={emblem.id}
            type="button"
            aria-label={emblem.name}
            aria-pressed={isSelected}
            onClick={() => onChange(emblem.id)}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-sm transition-all duration-150"
            style={{
              background: isSelected ? `${accentColor}15` : 'var(--lol-surface)',
              border: `1px solid ${isSelected ? accentColor : 'var(--lol-border)'}`,
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = `${accentColor}0A`;
                e.currentTarget.style.borderColor = `${accentColor}55`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'var(--lol-surface)';
                e.currentTarget.style.borderColor = 'var(--lol-border)';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid var(--lol-violet)';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={accentColor}
              aria-hidden="true"
            >
              <path d={emblem.path} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
