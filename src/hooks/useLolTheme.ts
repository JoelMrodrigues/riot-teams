import type { CSSProperties } from 'react';

import { useTheme } from '../context/ThemeContext';
import { LOL_PALETTE } from '../constants/lolTheme';
import type { LolPalette } from '../constants/lolTheme';

interface UseLolThemeReturn {
  palette: LolPalette;
  vars: CSSProperties;
}

/**
 * Résout la palette LoL violette selon le thème global (dark/light) et
 * l'expose sous forme de CSS custom properties à poser sur le root du layout.
 */
export function useLolTheme(): UseLolThemeReturn {
  const { theme } = useTheme();
  const palette = LOL_PALETTE[theme];

  const vars = {
    '--lol-bg': palette.bg,
    '--lol-bg-elevated': palette.bgElevated,
    '--lol-header': palette.headerBg,
    '--lol-surface': palette.surface,
    '--lol-border': palette.border,
    '--lol-violet': palette.violet,
    '--lol-violet-strong': palette.violetStrong,
    '--lol-violet-soft': palette.violetSoft,
    '--lol-glow': palette.glow,
    '--lol-text': palette.text,
    '--lol-text-muted': palette.textMuted,
    '--lol-hero-gradient': palette.heroGradient,
  } as CSSProperties;

  return { palette, vars };
}
