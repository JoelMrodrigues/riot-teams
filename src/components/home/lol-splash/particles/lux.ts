import { ANCHORS, makeEmitter, px, rnd, step } from './utils';
import type { Anchor, ParticleSystem, SplashEnv } from './types';

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  t0: number;
  r: number;
  ph: number;
}

type Pulse = [anchor: Anchor, radius: number, alpha: number];

/** Lux — radiant glow + slow rotating light rays + floating motes. */
export function createLux(env: SplashEnv): ParticleSystem {
  const motes: Mote[] = [];
  const emit = makeEmitter();
  const pulses: Pulse[] = [
    [ANCHORS.luxOrb, 90, 0.5],
    [ANCHORS.luxBody, 150, 0.26],
  ];

  function spawnMote(): void {
    const s = env.S;
    const o = px(env, Math.random() < 0.6 ? ANCHORS.luxOrb : ANCHORS.luxBody);
    motes.push({ x: o.x + rnd(-40, 40) * s, y: o.y + rnd(-40, 40) * s, vx: rnd(-20, 20) * s, vy: rnd(-40, -8) * s, life: rnd(1, 2.2), t0: 2.2, r: rnd(0.8, 2.2) * s, ph: rnd(0, 7) });
  }

  function drawGlow(): void {
    const { ctx, S, now } = env;
    ctx.globalCompositeOperation = 'lighter';
    const breath = 0.8 + 0.2 * Math.sin(now / 700);
    for (const [a, radius, alpha] of pulses) {
      const p = px(env, a);
      const rad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * S * breath);
      rad.addColorStop(0, `rgba(255,244,196,${alpha * breath})`);
      rad.addColorStop(0.5, `rgba(255,226,140,${alpha * 0.5 * breath})`);
      rad.addColorStop(1, 'rgba(255,226,140,0)');
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * S * breath, 0, 7);
      ctx.fill();
    }

    const o = px(env, ANCHORS.luxOrb);
    const rot = now / 4200;
    const rays = 7;
    for (let i = 0; i < rays; i++) {
      const ang = rot + (i / rays) * Math.PI * 2;
      const len = (120 + 30 * Math.sin(now / 500 + i)) * S;
      const g = ctx.createLinearGradient(o.x, o.y, o.x + Math.cos(ang) * len, o.y + Math.sin(ang) * len);
      g.addColorStop(0, `rgba(255,240,180,${0.22 * breath})`);
      g.addColorStop(1, 'rgba(255,240,180,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 6 * S;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(o.x, o.y);
      ctx.lineTo(o.x + Math.cos(ang) * len, o.y + Math.sin(ang) * len);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawMotes(): void {
    const { ctx, now } = env;
    ctx.globalCompositeOperation = 'lighter';
    for (const p of motes) {
      const k = Math.min(1, p.life / p.t0);
      const tw = 0.6 + 0.4 * Math.sin(now / 120 + p.ph);
      ctx.fillStyle = `rgba(255,244,200,${k * tw})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  return {
    spawn(dt) {
      emit('mote', 16, env, dt, spawnMote);
      step(motes, dt, (p) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy *= 0.99;
      });
    },
    draw() {
      drawGlow();
      drawMotes();
    },
    reset() {
      motes.length = 0;
    },
  };
}
