import React from 'react';

import { BrandLogo } from './BrandLogo';
import { HeaderActions } from './HeaderActions';

export function Header(): React.JSX.Element {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <BrandLogo size={32} />
        <span
          className="text-white font-bold tracking-widest uppercase"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '1.05rem',
            letterSpacing: '0.18em',
            textShadow: '0 1px 12px rgba(0,0,0,0.6)',
          }}
        >
          void.pro
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <HeaderActions buttonSize="md" />
      </div>
    </header>
  );
}
