import React, { useState, useEffect, useCallback } from 'react';

import { BaseModal } from '../../ui/BaseModal';
import { useLolTheme } from '../../../hooks/useLolTheme';
import { LolTeamPreview } from './LolTeamPreview';
import { LolTeamFormFields } from './LolTeamFormFields';
import { resolveAccent, DEFAULT_ACCENT_KEY } from '../../../data/lolTeamAccents.data';
import type { Team, LolRegion } from '../../../types/team.types';
import type { LolTeamFormState, LolTeamFormErrors } from './LolTeamFormFields';

interface LolCreateTeamModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  onCreate: (data: Omit<Team, 'id' | 'members' | 'createdAt' | 'updatedAt'>) => void;
}

const INITIAL_STATE: LolTeamFormState = {
  name:        '',
  tag:         '',
  region:      'EUW',
  accentColor: DEFAULT_ACCENT_KEY,
  description: '',
  icon:        null,
};

function validate(state: LolTeamFormState): LolTeamFormErrors {
  const errors: LolTeamFormErrors = {};
  if (!state.name.trim() || state.name.trim().length < 2) errors.name = 'Minimum 2 caractères.';
  if (state.name.trim().length > 40) errors.name = 'Maximum 40 caractères.';
  if (!state.tag || state.tag.length < 2) errors.tag = '2–4 caractères requis.';
  return errors;
}

/**
 * Modal de création d'équipe LoL — formulaire enrichi avec aperçu live,
 * sélecteur d'icône (champion / emblème), accents et région.
 */
export function LolCreateTeamModal({ isOpen, onClose, onCreate }: LolCreateTeamModalProps): React.JSX.Element {
  const { vars } = useLolTheme();
  const [formState, setFormState] = useState<LolTeamFormState>(INITIAL_STATE);
  const [errors, setErrors]       = useState<LolTeamFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormState(INITIAL_STATE);
      setErrors({});
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleChange = useCallback((patch: Partial<LolTeamFormState>) => {
    setFormState((prev) => {
      const next = { ...prev, ...patch };
      if (submitted) setErrors(validate(next));
      return next;
    });
  }, [submitted]);

  const handleSubmit = () => {
    setSubmitted(true);
    const errs = validate(formState);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    onCreate({
      name:        formState.name.trim(),
      game:        'lol',
      tag:         formState.tag || undefined,
      region:      (formState.region as LolRegion) || undefined,
      accentColor: formState.accentColor || undefined,
      description: formState.description.trim() || undefined,
      icon:        formState.icon ?? undefined,
    });
    onClose();
  };

  const resolvedHex = resolveAccent(formState.accentColor);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg" noPadding panelStyle={vars}>
      <div
        className="flex max-h-[90vh] flex-col"
        style={{ background: 'var(--bg-modal)' }}
      >
        {/* En-tête sticky */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: 'var(--bg-modal)', borderBottom: '1px solid var(--lol-border)' }}
        >
          <h2
            className="text-xl font-bold uppercase tracking-widest"
            id="lol-create-modal-title"
            style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
          >
            Créer une équipe LoL
          </h2>
          <button onClick={onClose} className="btn btn-text btn-sm text-lg leading-none" aria-label="Fermer">
            ✕
          </button>
        </div>

        {/* Aperçu sticky */}
        <div
          className="sticky top-[57px] z-10 px-6 py-3"
          style={{ background: 'var(--bg-modal)', borderBottom: '1px solid var(--lol-border)' }}
        >
          <LolTeamPreview
            name={formState.name}
            tag={formState.tag}
            region={formState.region}
            accentColor={resolvedHex}
            icon={formState.icon}
          />
        </div>

        {/* Corps scrollable */}
        <div className="overflow-y-auto px-6 py-5">
          <LolTeamFormFields state={formState} errors={errors} onChange={handleChange} />
        </div>

        {/* Bouton sticky bas */}
        <div
          className="sticky bottom-0 px-6 py-4"
          style={{ background: 'var(--bg-modal)', borderTop: '1px solid var(--lol-border)' }}
        >
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-solid btn-md w-full justify-center"
            style={{ background: resolvedHex, color: '#0A1428' }}
          >
            Créer l'équipe
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
