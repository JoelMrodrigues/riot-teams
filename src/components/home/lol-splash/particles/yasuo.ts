import { ANCHORS, makeEmitter, px, rnd, step } from './utils';
import type { ParticleSystem, SplashEnv } from './types';

interface Wind {
  x0: number;
  y0: number;
  len: number;
  curve: number;
  ang: number;
  life: number;
  t0: number;
  w: number;
}

interface Leaf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  sw: number;
  life: number;
  t0: number;
  sz: number;
  c: string;
}

const LEAF_COLORS = ['#7fae3a', '#9fc24a'];

/** Yasuo — sweeping wind streaks + drifting leaves. */
export function createYasuo(env: SplashEnv): ParticleSystem {
  const winds: Wind[] = [];
  const leaves: Leaf[] = [];
  const emit = makeEmitter();

  function spawnWind(): void {
    const s = env.S;
    const o = px(env, ANCHORS.yas);
    winds.push({ x0: o.x + rnd(-40, 40) * s, y0: o.y + rnd(-50, 50) * s, len: rnd(120, 260) * s, curve: rnd(-60, 60) * s, ang: rnd(-0.5, 0.2), life: rnd(0.5, 0.9), t0: 0.9, w: rnd(1.2, 2.6) * s });
  }

  function spawnLeaf(): void {
    const s = env.S;
    const o = px(env, ANCHORS.windO);
    leaves.push({ x: o.x + rnd(-30, 30) * s, y: o.y + rnd(-30, 30) * s, vx: rnd(40, 130) * s, vy: rnd(-50, -10) * s, rot: rnd(0, 7), vr: rnd(-4, 4), sw: rnd(2, 5), life: rnd(1.2, 2.4), t0: 2.4, sz: rnd(4, 8) * s, c: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)] });
  }

  function drawWind(): void {
    const { ctx } = env;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const w of winds) {
      const k = w.life / w.t0;
      const seg = 18;
      const ca = Math.cos(w.ang);
      const sa = Math.sin(w.ang);
      const head = 1 - k;
      ctx.beginPath();
      for (let i = 0; i <= seg; i++) {
        const t = i / seg;
        const along = t * w.len;
        const off = Math.sin(t * Math.PI) * w.curve;
        const x = w.x0 + ca * along - sa * off;
        const y = w.y0 + sa * along + ca * off;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const fade = Math.sin(Math.min(1, head * 1.6) * Math.PI);
      ctx.strokeStyle = `rgba(200,240,210,${0.4 * fade})`;
      ctx.lineWidth = w.w;
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawLeaves(): void {
    const { ctx } = env;
    for (const p of leaves) {
      const k = Math.min(1, p.life / p.t0);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = k;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.sz, p.sz * 0.5, 0, 0, 7);
      ctx.fill();
      ctx.strokeStyle = 'rgba(40,70,20,0.5)';
      ctx.lineWidth = 0.6 * env.S;
      ctx.beginPath();
      ctx.moveTo(-p.sz, 0);
      ctx.lineTo(p.sz, 0);
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  return {
    spawn(dt) {
      emit('wind', 11, env, dt, spawnWind);
      emit('leaf', 8, env, dt, spawnLeaf);
      step(winds, dt, () => undefined);
      step(leaves, dt, (p) => {
        p.x += (p.vx + Math.sin(p.life * p.sw) * 30 * env.S) * dt;
        p.y += p.vy * dt;
        p.vy += 18 * env.S * dt;
        p.rot += p.vr * dt;
      });
    },
    draw() {
      drawLeaves();
      drawWind();
    },
    reset() {
      winds.length = 0;
      leaves.length = 0;
    },
  };
}
