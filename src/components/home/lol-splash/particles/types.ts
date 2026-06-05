export interface Anchor {
  x: number;
  y: number;
}

export type AnchorKey =
  | 'blitzHead'
  | 'blitzEye'
  | 'blitzFistR'
  | 'blitzFistL'
  | 'yas'
  | 'windO'
  | 'jinxFire'
  | 'jinxBody'
  | 'rocketBack'
  | 'luxBody'
  | 'luxOrb';

export type Anchors = Record<AnchorKey, Anchor>;

export type Pt = [number, number];

/**
 * Mutable per-frame drawing environment shared by every particle system.
 * The engine updates these fields each frame; modules hold the reference.
 * disp* / off* describe the displayed image rect under object-cover crop,
 * so anchor fractions map onto the actual (cropped) champion positions.
 */
export interface SplashEnv {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  S: number;
  now: number;
  intensity: number;
  offX: number;
  offY: number;
  dispW: number;
  dispH: number;
}

export interface ParticleSystem {
  spawn: (dt: number) => void;
  draw: () => void;
  reset: () => void;
}
