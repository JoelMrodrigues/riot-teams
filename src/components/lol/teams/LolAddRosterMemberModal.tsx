import React, { useState, useEffect, useRef } from 'react';

import { BaseModal } from '../../ui/BaseModal';
import { LolAddRosterFields } from './LolAddRosterFields';
import { useLolTheme } from '../../../hooks/useLolTheme';
import { parseRiotId } from '../../../utils/riotId';
import type { AddRosterFormState } from './LolAddRosterFields';
import type { LolRegion } from '../../../types/team.types';
import type { LolAddRosterMemberBody } from '../../../types/lolTeam.types';

interface LolAddRosterMemberModalProps {
  isOpen:        boolean;
  onClose:       () => void;
  onAdd:         (body: LolAddRosterMemberBody) => Promise<void>;
  defaultRegion?: LolRegion;
}

const initialState = (region: LolRegion): AddRosterFormState => ({
  displayName: '', riotId: '', region, secondaryRiotId: '', role: null, isSub: false,
});

/** Modal d'ajout d'un joueur au roster LoL (formulaire complet : identité + rôle/profil). */
export function LolAddRosterMemberModal({
  isOpen, onClose, onAdd, defaultRegion = 'EUW',
}: LolAddRosterMemberModalProps): React.JSX.Element {
  const { vars }                    = useLolTheme();
  const [state, setState]           = useState<AddRosterFormState>(initialState(defaultRegion));
  const [errors, setErrors]         = useState<Partial<Record<'displayName' | 'riotId', string>>>({});
  const [apiError, setApiError]     = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nameTouched = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setState(initialState(defaultRegion));
      setErrors({}); setApiError(null); setSubmitting(false);
      nameTouched.current = false;
    }
  }, [isOpen, defaultRegion]);

  const patch = (p: Partial<AddRosterFormState>) => {
    if ('displayName' in p) nameTouched.current = true;
    // Auto-remplit le Nom depuis le Riot ID tant qu'il n'a pas été édité manuellement.
    if ('riotId' in p && !nameTouched.current) {
      const game = p.riotId!.split('#')[0]?.trim() ?? '';
      setState((s) => ({ ...s, ...p, displayName: game }));
    } else {
      setState((s) => ({ ...s, ...p }));
    }
    setApiError(null);
  };

  const handleSubmit = async () => {
    const parsed = parseRiotId(state.riotId);
    const nextErrors: typeof errors = {};
    if (!state.displayName.trim()) nextErrors.displayName = 'Nom requis.';
    if (!parsed) nextErrors.riotId = 'Format requis : NomJoueur#TAG';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !parsed) return;

    const secondary = state.secondaryRiotId.trim() ? parseRiotId(state.secondaryRiotId) : null;
    const body: LolAddRosterMemberBody = {
      game_name: parsed.gameName,
      tag_line: parsed.tagLine,
      display_name: state.displayName.trim(),
      region: state.region,
      role_in_game: state.role ?? undefined,
      is_substitute: state.isSub,
      secondary_game_name: secondary?.gameName,
      secondary_tag_line: secondary?.tagLine,
    };

    setSubmitting(true);
    try {
      await onAdd(body);
      onClose();
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Erreur lors de l'ajout.");
      setSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" noPadding panelStyle={vars}>
      <div className="flex max-h-[90vh] flex-col" style={{ background: 'var(--bg-modal)' }}>
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--lol-border)' }}
        >
          <h2 className="text-xl font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
            Ajouter un joueur
          </h2>
          <button onClick={onClose} className="btn btn-text btn-sm text-lg leading-none" aria-label="Fermer">✕</button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <LolAddRosterFields state={state} errors={errors} patch={patch} />
          {apiError && (
            <p className="mt-3 text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--danger)' }}>{apiError}</p>
          )}
        </div>

        <div className="px-6 py-4" style={{ borderTop: '1px solid var(--lol-border)' }}>
          <button
            type="button"
            onClick={() => { void handleSubmit(); }}
            disabled={submitting}
            className="btn btn-solid btn-md w-full justify-center disabled:opacity-60"
            style={{ background: 'var(--lol-violet)', color: '#fff' }}
          >
            {submitting ? 'Ajout…' : 'Ajouter au roster'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
