/** Palette dédiée à l'écosystème LoL : Violet/Noir (sombre), Violet/Blanc (clair). */
export interface LolPalette {
  bg: string;
  bgElevated: string;
  surface: string;
  border: string;
  violet: string;
  violetStrong: string;
  violetSoft: string;
  glow: string;
  text: string;
  textMuted: string;
  heroGradient: string;
}

export const LOL_PALETTE: Record<'dark' | 'light', LolPalette> = {
  dark: {
    bg: '#070309',
    bgElevated: '#0E0714',
    surface: 'rgba(139, 92, 246, 0.06)',
    border: 'rgba(139, 92, 246, 0.18)',
    violet: '#8B5CF6',
    violetStrong: '#7C3AED',
    violetSoft: '#A78BFA',
    glow: 'rgba(124, 58, 237, 0.45)',
    text: '#F5F3FF',
    textMuted: 'rgba(245, 243, 255, 0.55)',
    heroGradient:
      'radial-gradient(120% 80% at 25% 0%, rgba(124,58,237,0.28) 0%, rgba(124,58,237,0.05) 45%, transparent 70%)',
  },
  light: {
    bg: '#FBFAFF',
    bgElevated: '#FFFFFF',
    surface: 'rgba(124, 58, 237, 0.05)',
    border: 'rgba(124, 58, 237, 0.16)',
    violet: '#7C3AED',
    violetStrong: '#6D28D9',
    violetSoft: '#8B5CF6',
    glow: 'rgba(124, 58, 237, 0.22)',
    text: '#1A1033',
    textMuted: 'rgba(26, 16, 51, 0.55)',
    heroGradient:
      'radial-gradient(120% 80% at 25% 0%, rgba(124,58,237,0.16) 0%, rgba(124,58,237,0.04) 45%, transparent 70%)',
  },
};
