import React from 'react';
import { Link } from 'react-router-dom';

import { LolFeatureIcon } from './LolFeatureIcon';
import type { LolFeatureIcon as IconKey } from '../../../data/lolFeatures.data';
import type { LolAccent } from '../../../constants/lolTheme';

interface LolQuickAccessCardProps {
  label: string;
  description: string;
  to: string;
  accent: LolAccent;
  icon: IconKey;
  disabled?: boolean;
}

/**
 * Zone B — une carte d'accès rapide (Solo / Équipes / Stats).
 * Dense : padding compact, hover CSS uniquement (pas de framer-motion scale).
 */
export function LolQuickAccessCard({
  label,
  description,
  to,
  accent,
  icon,
  disabled = false,
}: LolQuickAccessCardProps): React.JSX.Element {
  const cardStyle: React.CSSProperties = {
    background: 'var(--lol-surface)',
    border: `1px solid ${accent.color}28`,
    transition: 'border-color 150ms, background 150ms',
  };

  const content = (
    <div
      className="group flex flex-col gap-3 rounded-md p-4"
      style={cardStyle}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = `${accent.color}55`;
        el.style.background = `var(--lol-surface-hover)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = `${accent.color}28`;
        el.style.background = 'var(--lol-surface)';
      }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-sm"
        style={{ background: `${accent.color}18`, color: accent.color }}
      >
        <LolFeatureIcon icon={icon} />
      </div>

      <div className="flex flex-col gap-1">
        <span
          className="text-sm font-bold uppercase tracking-[0.1em]"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
        >
          {label}
        </span>
        <p className="text-xs leading-snug" style={{ color: 'var(--lol-text-muted)' }}>
          {description}
        </p>
      </div>

      <span
        className="mt-auto inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
        style={{ fontFamily: 'Rajdhani, sans-serif', color: accent.color }}
      >
        {disabled ? 'Bientôt' : 'Accéder'}
        {!disabled && (
          <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
        )}
      </span>
    </div>
  );

  if (disabled) {
    return <div className="opacity-60 cursor-default">{content}</div>;
  }

  return (
    <Link to={to} className="block no-underline">
      {content}
    </Link>
  );
}
