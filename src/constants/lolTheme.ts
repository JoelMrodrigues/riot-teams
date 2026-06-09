/** Palette dédiée à l'écosystème LoL : Violet/Noir (sombre), Violet/Blanc (clair). */
export interface LolPalette {
  bg: string;
  bgElevated: string;
  headerBg: string;
  surface: string;
  surfaceHover: string;
  border: string;
  violet: string;
  violetStrong: string;
  violetSoft: string;
  glow: string;
  text: string;
  textMuted: string;
  heroGradient: string;
}

/** Accents vifs par section, déclinés autour du violet (gradients dynamiques). */
export interface LolAccent {
  color: string;
  soft: string;
  gradient: string;
  glow: string;
}

/** Couleur « défaite » (pendant des accents de victoire), centralisée pour tout le hub LoL. */
export const LOL_LOSS = {
  color: '#FB7185',
  ring: 'rgba(244, 63, 94, 0.8)',
};

export const LOL_ACCENTS: Record<'solo' | 'team' | 'stats', LolAccent> = {
  solo: {
    color: '#22D3EE',
    soft: '#67E8F9',
    gradient: 'linear-gradient(135deg, #22D3EE 0%, #7C3AED 100%)',
    glow: 'rgba(34, 211, 238, 0.35)',
  },
  team: {
    color: '#F472B6',
    soft: '#F9A8D4',
    gradient: 'linear-gradient(135deg, #F472B6 0%, #7C3AED 100%)',
    glow: 'rgba(244, 114, 182, 0.35)',
  },
  stats: {
    color: '#FBBF24',
    soft: '#FCD34D',
    gradient: 'linear-gradient(135deg, #FBBF24 0%, #7C3AED 100%)',
    glow: 'rgba(251, 191, 36, 0.32)',
  },
};

export const LOL_PALETTE: Record<'dark' | 'light', LolPalette> = {
  dark: {
    bg: '#070309',
    bgElevated: '#0E0714',
    headerBg: 'rgba(7, 3, 9, 0.55)',
    surface: 'rgba(139, 92, 246, 0.06)',
    surfaceHover: 'rgba(139, 92, 246, 0.10)',
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
    headerBg: 'rgba(255, 255, 255, 0.72)',
    surface: 'rgba(124, 58, 237, 0.05)',
    surfaceHover: 'rgba(124, 58, 237, 0.08)',
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
