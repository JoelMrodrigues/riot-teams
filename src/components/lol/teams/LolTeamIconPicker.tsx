import React, { useState, useRef, useCallback } from 'react';

import { LolChampionPicker } from './LolChampionPicker';
import { LolEmblemPicker } from './LolEmblemPicker';
import { LolUploadPickerDisabled } from './LolUploadPickerDisabled';
import { LolUploadPickerActive } from './LolUploadPickerActive';
import type { LolTeamIcon } from '../../../types/team.types';
import type { UseTeamLogoReturn } from '../../../hooks/useTeamLogo';

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
  /**
   * Si fourni (contexte édition/détail), l'onglet Upload est activé.
   * Absent (création) → onglet désactivé avec mention "après création".
   */
  logoHook?:   UseTeamLogoReturn;
}

/** Segmented control 3 onglets pour choisir l'icône d'équipe LoL. */
export function LolTeamIconPicker({
  value,
  accentColor,
  onChange,
  logoHook,
}: LolTeamIconPickerProps): React.JSX.Element {
  const uploadEnabled = logoHook !== undefined;
  const [activeTab, setActiveTab] = useState<IconTab>('champion');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, idx: number) => {
    const activeTabs = uploadEnabled ? [0, 1, 2] : [0, 1];
    const pos = activeTabs.indexOf(idx);
    if (pos === -1) return;
    if (e.key === 'ArrowRight') {
      const next = activeTabs[(pos + 1) % activeTabs.length];
      tabRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      const prev = activeTabs[(pos - 1 + activeTabs.length) % activeTabs.length];
      tabRefs.current[prev]?.focus();
    }
  }, [uploadEnabled]);

  const handleChampionChange = (key: string) => onChange({ kind: 'champion', value: key });
  const handleEmblemChange   = (id: string)  => onChange({ kind: 'emblem',   value: id  });

  const handleUpload = async (dataBase64: string, mime: 'image/jpeg') => {
    if (!logoHook) return;
    await logoHook.upload({ dataBase64, mime });
  };

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
          const isUploadTab  = tab.id === 'upload';
          const isDisabled   = isUploadTab && !uploadEnabled;
          const isActive     = !isDisabled && activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[idx] = el; }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`icon-panel-${tab.id}`}
              aria-disabled={isDisabled ? 'true' : undefined}
              tabIndex={isDisabled ? -1 : isActive ? 0 : -1}
              title={isDisabled ? 'Disponible après création de l\'équipe' : undefined}
              disabled={isDisabled}
              onClick={() => !isDisabled && setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-150"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: isActive ? 'var(--lol-surface)' : 'transparent',
                border: isActive ? '1px solid var(--lol-border)' : '1px solid transparent',
                color: isActive ? 'var(--lol-text)' : 'var(--lol-text-muted)',
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {tab.label}
              {isDisabled && (
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
        {activeTab === 'upload' && uploadEnabled && logoHook && (
          <LolUploadPickerActive
            onUpload={handleUpload}
            uploading={logoHook.uploading}
            uploadError={logoHook.uploadError}
          />
        )}
        {activeTab === 'upload' && !uploadEnabled && (
          <LolUploadPickerDisabled />
        )}
      </div>
    </div>
  );
}
