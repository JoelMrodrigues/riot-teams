import React, { useState, useEffect } from 'react';

import { BaseModal } from '../../../ui/BaseModal';
import { useLolTheme } from '../../../../hooks/useLolTheme';
import { EVENT_TYPES, EVENT_TYPE_LABEL } from '../../../../utils/lolEventMeta';
import type { LolEventBody, LolEventType } from '../../../../types/lolEvent.types';

interface LolCreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (body: LolEventBody) => Promise<void>;
  defaultType?: LolEventType;
}

const FIELD = 'w-full rounded-sm px-3 py-2 text-sm outline-none';

/** Modal de création d'un événement d'agenda (scrim, entraînement…). */
export function LolCreateEventModal({ isOpen, onClose, onCreate, defaultType = 'scrim' }: LolCreateEventModalProps): React.JSX.Element {
  const { vars } = useLolTheme();
  const [type, setType] = useState<LolEventType>(defaultType);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [opponent, setOpponent] = useState('');
  const [bo, setBo] = useState('3');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setType(defaultType); setTitle(''); setDate(''); setDuration('');
    setOpponent(''); setBo('3'); setNotes(''); setError(null); setSubmitting(false);
  }, [isOpen, defaultType]);

  const fieldStyle: React.CSSProperties = {
    background: 'var(--lol-surface)', border: '1px solid var(--lol-border)',
    color: 'var(--lol-text)', fontFamily: 'Inter, sans-serif',
  };

  const submit = async (): Promise<void> => {
    if (!date) { setError('Date et heure requises.'); return; }
    const finalTitle = title.trim() || (type === 'scrim' && opponent.trim() ? `Scrim vs ${opponent.trim()}` : '');
    if (!finalTitle) { setError('Titre requis.'); return; }
    setSubmitting(true); setError(null);
    try {
      await onCreate({
        type,
        title: finalTitle,
        starts_at: new Date(date).toISOString(),
        duration_min: duration ? Number(duration) : null,
        opponent: type === 'scrim' ? (opponent.trim() || null) : null,
        bo: type === 'scrim' ? Number(bo) : null,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la création.');
      setSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" panelStyle={vars}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
          Nouvel événement
        </h2>
        <button onClick={onClose} aria-label="Fermer" className="btn btn-text btn-sm text-lg leading-none">✕</button>
      </div>

      <div className="flex flex-col gap-3">
        <select className={FIELD} style={fieldStyle} value={type} onChange={(e) => setType(e.target.value as LolEventType)} aria-label="Type">
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{EVENT_TYPE_LABEL[t]}</option>)}
        </select>

        {type === 'scrim' && (
          <div className="flex gap-2">
            <input className={FIELD} style={fieldStyle} placeholder="Adversaire" value={opponent} onChange={(e) => setOpponent(e.target.value)} />
            <select className="rounded-sm px-3 py-2 text-sm outline-none" style={fieldStyle} value={bo} onChange={(e) => setBo(e.target.value)} aria-label="Format">
              <option value="1">BO1</option><option value="3">BO3</option><option value="5">BO5</option>
            </select>
          </div>
        )}

        <input className={FIELD} style={fieldStyle} placeholder={type === 'scrim' ? 'Titre (auto si vide)' : 'Titre'} value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className={FIELD} style={fieldStyle} type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date et heure" />
        <input className={FIELD} style={fieldStyle} type="number" min={0} placeholder="Durée (min)" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <textarea className={FIELD} style={fieldStyle} rows={2} placeholder="Notes (optionnel)" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {error && <p className="text-xs" style={{ color: 'var(--danger)', fontFamily: 'Inter, sans-serif' }}>{error}</p>}
      </div>

      <button type="button" onClick={() => { void submit(); }} disabled={submitting} className="btn btn-solid btn-md w-full justify-center disabled:opacity-60" style={{ background: 'var(--lol-violet)', color: '#fff' }}>
        {submitting ? 'Ajout…' : 'Ajouter'}
      </button>
    </BaseModal>
  );
}
