import React from 'react';
import { motion } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';

/** Switch animé jour/nuit : pastille glissante avec icône soleil/lune. */
export function ThemeToggle(): React.JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      onClick={toggleTheme}
      className="relative flex flex-shrink-0 cursor-pointer rounded-full transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        width: 44,
        height: 24,
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)',
        border: '1px solid var(--border-default)',
        outlineColor: 'var(--brand)',
        padding: 0,
      }}
    >
      {/* Pastille glissante */}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="absolute top-[3px] flex items-center justify-center rounded-full"
        style={{
          width: 18,
          height: 18,
          left: isDark ? 3 : 23,
          background: isDark ? 'var(--brand-soft)' : 'var(--brand)',
        }}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </motion.span>
    </button>
  );
}

function SunIcon(): React.JSX.Element {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon(): React.JSX.Element {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
