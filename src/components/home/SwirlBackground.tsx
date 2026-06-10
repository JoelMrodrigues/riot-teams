import React from 'react';

interface SwirlBackgroundProps {
  /** Positionnement / opacité fournis par l'appelant (ex: "absolute inset-0"). */
  className?: string;
}

const WAVES = [40, 90, 140, 190, 240, 290];

function wavePath(y: number): string {
  return `M-40 ${y} C 180 ${y - 60} 360 ${y + 60} 560 ${y} S 940 ${y - 60} 1120 ${y}`;
}

/**
 * Fond « swirl » de marque (violet sur sombre) — motif groovy maison en SVG
 * (pas d'image stock). Transparent : l'appelant fournit le fond sombre.
 */
export function SwirlBackground({ className = '' }: SwirlBackgroundProps): React.JSX.Element {
  return (
    <div className={`pointer-events-none overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute -left-1/3 -top-1/4 h-[150%] w-2/3"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.45), transparent 60%)', filter: 'blur(48px)' }}
      />
      <div
        className="absolute -right-1/4 top-0 h-[140%] w-2/3"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.30), transparent 60%)', filter: 'blur(48px)' }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1080 320" preserveAspectRatio="none">
        <g transform="rotate(-7 540 160)">
          {WAVES.map((y, i) => (
            <path
              key={y}
              d={wavePath(y)}
              fill="none"
              stroke="#A78BFA"
              strokeOpacity={0.1 + i * 0.03}
              strokeWidth={10}
              strokeLinecap="round"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
