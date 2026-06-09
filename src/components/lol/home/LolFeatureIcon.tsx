import React from 'react';

import type { LolFeatureIcon as IconKey } from '../../../data/lolFeatures.data';

interface LolFeatureIconProps {
  icon: IconKey;
}

const PATHS: Record<IconKey, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  scrim: (
    <>
      <path d="M14.5 2L13 9l5-2-3.5 13L11 13l-5 2 3.5-13z" />
    </>
  ),
  stats: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  team: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
};

/** Icône SVG d'une feature de la vitrine LoL. */
export function LolFeatureIcon({ icon }: LolFeatureIconProps): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[icon]}
    </svg>
  );
}
