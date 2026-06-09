/**
 * Encart d'information affiché quand l'utilisateur coche "Je suis staff".
 * Explique qu'il n'aura pas de rôle automatique lors de l'adhésion à une équipe.
 */
import React from 'react';

export function StaffInfoBanner(): React.JSX.Element {
  return (
    <div
      role="note"
      className="flex gap-2.5 rounded-sm border px-3.5 py-3"
      style={{
        background: 'var(--brand-muted)',
        borderColor: 'rgba(124, 58, 237, 0.30)',
      }}
    >
      <span
        className="mt-0.5 flex-shrink-0 text-sm leading-none"
        aria-hidden="true"
        style={{ color: 'var(--brand-soft)' }}
      >
        ℹ
      </span>
      <p
        className="text-xs leading-relaxed"
        style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)' }}
      >
        En rejoignant une équipe, tu n'auras pas de rôle attribué automatiquement&nbsp;: le
        propriétaire ou le capitaine te donnera un rôle.
      </p>
    </div>
  );
}
