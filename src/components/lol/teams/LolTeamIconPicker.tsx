import React, { useState, useRef, useCallback } from 'react';

import { LolChampionPicker } from './LolChampionPicker';
import { LolEmblemPicker } from './LolEmblemPicker';
import { LolUploadPickerDisabled } from './LolUploadPickerDisabled';
import type { LolTeamIcon } from '../../../types/team.types';

type IconTab = 'champion' | 'emblem' | 'upload';
const TABS: { id: IconTab; label: string }[] = [
  { id: 'champion', label: 'Champion' },
  { id: 'emblem',   label: 'Emblème'  },
  { id: 'upload',   label: 'Upload'   },
];

interface LolTeamIconPickerProps {
  value:       LolTeamIcon | null;
  accentColor: string;
  onChange:    (icon: LolTeamIcon | null) => void;
}

/** Segmented control 3 onglets pour choisir l'icône d'équipe LoL. */
export function LolTeamIconPicker({ value, accentColor, onChange }: LolTeamIconPickerProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<Exclude<IconTab, 'upload'>>('champion');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, idx: number) => {
    const activeTabs = [0, 1]; // indices champion + emblem seulement
    const pos = activeTabs.indexOf(idx);
    if (pos === -1) return;
    if (e.key === 'ArrowRight') {
      const next = activeTabs[(pos + 1) % activeTabs.length];
      tabRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      const prev = activeTabs[(pos - 1 + activeTabs.length) % activeTabs.length];
      tabRefs.current[prev]?.focus();
    }
  }, []);

  const handleChampionChange = (key: string) => onChange({ kind: 'champion', value: key });
  const handleEmblemChange   = (id: string)  => onChange({ kind: 'emblem',   value: id  });

  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-xs font-bold uppercase tracking-[0.15em]"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}
      >
        Icône de l'équipe
      </span>

      <div
        role="tablist"
        aria-label="Type d'icône"
        className="flex rounded-sm p-0.5"
        style={{ background: 'var(--bg-elevated)' }}
      >
        {TABS.map((tab, idx) => {
          const isUpload   = tab.id === 'upload';
          const isActive   = !isUpload && activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[idx] = el; }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`icon-panel-${tab.id}`}
              aria-disabled={isUpload ? 'true' : undefined}
              tabIndex={isUpload ? -1 : isActive ? 0 : -1}
              title={isUpload ? 'Disponible avec la base de données' : undefined}
              disabled={isUpload}
              onClick={() => !isUpload && setActiveTab(tab.id as Exclude<IconTab, 'upload'>)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-150"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: isActive ? 'var(--lol-surface)' : 'transparent',
                border: isActive ? '1px solid var(--lol-border)' : '1px solid transparent',
                color: isActive ? 'var(--lol-text)' : 'var(--lol-text-muted)',
                opacity: isUpload ? 0.5 : 1,
                cursor: isUpload ? 'not-allowed' : 'pointer',
              }}
            >
              {tab.label}
              {isUpload && (
                <span
                  className="rounded-sm px-1 text-[10px] uppercase tracking-wider"
                  style={{ background: 'var(--lol-surface)', color: 'var(--lol-text-muted)' }}
                >
                  BIENTÔT
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        id={`icon-panel-${activeTab}`}
        role="tabpanel"
        tabIndex={0}
        className="transition-opacity duration-150"
      >
        {activeTab === 'champion' && (
          <LolChampionPicker
            selected={value?.kind === 'champion' ? value.value : null}
            accentColor={accentColor}
            onChange={handleChampionChange}
          />
        )}
        {activeTab === 'emblem' && (
          <LolEmblemPicker
            selected={value?.kind === 'emblem' ? value.value : null}
            accentColor={accentColor}
            onChange={handleEmblemChange}
          />
        )}
      </div>

      {/* Panneau upload visible uniquement si l'onglet upload était cliquable — état de repli */}
      <div id="icon-panel-upload" role="tabpanel" hidden>
        <LolUploadPickerDisabled />
      </div>
    </div>
  );
}
