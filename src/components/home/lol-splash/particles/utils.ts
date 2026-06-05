import type { Anchor, Anchors, SplashEnv } from './types';

/** Anchor positions as fractions of the full (uncropped) splash art. */
export const ANCHORS: Anchors = {
  blitzHead: { x: 0.705, y: 0.275 },
  blitzEye: { x: 0.717, y: 0.345 },
  blitzFistR: { x: 0.878, y: 0.455 },
  blitzFistL: { x: 0.6, y: 0.31 },
  yas: { x: 0.66, y: 0.55 },
  windO: { x: 0.54, y: 0.84 },
  jinxFire: { x: 0.42, y: 0.78 },
  jinxBody: { x: 0.46, y: 0.45 },
  rocketBack: { x: 0.092, y: 0.893 },
  luxBody: { x: 0.165, y: 0.58 },
  luxOrb: { x: 0.125, y: 0.45 },
};

export const rnd = (a: number, b: number): number => a + Math.random() * (b - a);

/** Map an anchor fraction to canvas px through the object-cover transform. */
export const px = (env: SplashEnv, p: Anchor): Anchor => ({
  x: env.offX + p.x * env.dispW,
  y: env.offY + p.y * env.dispH,
});

type EmitFn = (key: string, rate: number, env: SplashEnv, dt: number, spawn: () => void) => void;

/** Accumulator-based emitter: spawns `rate * intensity` particles per second. */
export function makeEmitter(): EmitFn {
  const acc: Record<string, number> = {};
  return (key, rate, env, dt, spawn) => {
    acc[key] = (acc[key] ?? 0) + rate * env.intensity * dt;
    while (acc[key] >= 1) {
      acc[key] -= 1;
      spawn();
    }
  };
}

/** Advance a particle array by dt, removing dead ones and updating survivors. */
export function step<T extends { life: number }>(
  arr: T[],
  dt: number,
  update: (p: T) => void,
): void {
  for (let i = arr.length - 1; i >= 0; i--) {
    const p = arr[i];
    p.life -= dt;
    if (p.life <= 0) {
      arr.splice(i, 1);
      continue;
    }
    update(p);
  }
}
