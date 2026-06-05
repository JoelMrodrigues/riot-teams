import { useEffect, useRef } from 'react';

import { computeCover } from './coverRect';
import { createBlitz } from './particles/blitz';
import { createJinx } from './particles/jinx';
import { createLux } from './particles/lux';
import { createYasuo } from './particles/yasuo';
import type { ParticleSystem, SplashEnv } from './particles/types';

const MAX_INTENSITY = 1.85;

/**
 * Drives the canvas particle animation. Runs one long-lived RAF loop that only
 * emits/draws while `active` (intensity ramps to 0 then halts when idle), so
 * inactive cards cost nothing. Maps anchors through the object-cover crop.
 */
export function useSplashEngine(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  frameRef: React.RefObject<HTMLElement | null>,
  active: boolean,
): void {
  const activeRef = useRef(active);
  const kickRef = useRef<() => void>(() => undefined);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const env: SplashEnv = {
      ctx, W: 0, H: 0, S: 1, now: 0, intensity: 0,
      offX: 0, offY: 0, dispW: 0, dispH: 0,
    };
    const systems: ParticleSystem[] = [createLux(env), createYasuo(env), createJinx(env), createBlitz(env)];

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = frame.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const c = computeCover(r.width, r.height);
      env.W = c.W;
      env.H = c.H;
      env.offX = c.offX;
      env.offY = c.offY;
      env.dispW = c.dispW;
      env.dispH = c.dispH;
      env.S = c.S;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(frame);

    let raf = 0;
    let running = false;
    let last = 0;

    const frameLoop = (ts: number): void => {
      const dt = Math.min(0.05, last ? (ts - last) / 1000 : 0.016);
      last = ts;
      env.now = ts;
      const target = activeRef.current ? MAX_INTENSITY : 0;
      env.intensity += (target - env.intensity) * Math.min(1, dt * 4);

      ctx.clearRect(0, 0, env.W, env.H);
      if (env.intensity > 0.01 || activeRef.current) {
        for (const s of systems) s.spawn(dt);
        for (const s of systems) s.draw();
        raf = requestAnimationFrame(frameLoop);
      } else {
        running = false;
        for (const s of systems) s.reset();
      }
    };

    const kick = (): void => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frameLoop);
    };
    kickRef.current = kick;
    if (activeRef.current) kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      running = false;
    };
  }, [canvasRef, frameRef]);

  useEffect(() => {
    if (active) kickRef.current();
  }, [active]);
}
