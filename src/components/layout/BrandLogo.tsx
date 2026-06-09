import React from 'react';

interface BrandLogoProps {
  /** Côté du carré en pixels (défaut 24). */
  size?: number;
  /** Dégradé de fond ; par défaut le dégradé de marque void.pro. */
  gradient?: string;
  /** Rayon des coins : `sm` (défaut) ou `md`. */
  radius?: 'sm' | 'md';
}

const DEFAULT_GRADIENT = 'linear-gradient(135deg, var(--brand), var(--brand-soft))';

/** Logo « V » de void.pro — carré en dégradé partagé par tous les headers. */
export function BrandLogo({ size = 24, gradient = DEFAULT_GRADIENT, radius = 'sm' }: BrandLogoProps): React.JSX.Element {
  return (
    <div
      className={`${radius === 'md' ? 'rounded-md' : 'rounded-sm'} flex items-center justify-center flex-shrink-0`}
      style={{ width: size, height: size, background: gradient }}
    >
      <span
        className="text-white font-bold"
        style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: Math.round(size * 0.34), letterSpacing: '0.05em' }}
      >
        V
      </span>
    </div>
  );
}
