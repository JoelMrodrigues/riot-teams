import { ANCHORS, makeEmitter, px, rnd, step } from './utils';
import type { AnchorKey, ParticleSystem, Pt, SplashEnv } from './types';

interface Bolt {
  pts: Pt[];
  branches: Pt[][];
  life: number;
  t0: number;
  w: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  t0: number;
  r: number;
}

function boltPath(x1: number, y1: number, x2: number, y2: number, disp: number, s: number): Pt[] {
  if (disp < 2 * s) return [[x1, y1], [x2, y2]];
  const mx = (x1 + x2) / 2 + rnd(-disp, disp);
  const my = (y1 + y2) / 2 + rnd(-disp, disp);
  return boltPath(x1, y1, mx, my, disp / 2, s)
    .slice(0, -1)
    .concat(boltPath(mx, my, x2, y2, disp / 2, s));
}

/** Blitzcrank — chained lightning bolts + impact sparks + pulsing glow. */
export function createBlitz(env: SplashEnv): ParticleSystem {
  const bolts: Bolt[] = [];
  const sparks: Spark[] = [];
  const emit = makeEmitter();
  const targets: [AnchorKey, AnchorKey, number][] = [
    ['blitzHead', 'blitzFistR', 170],
    ['blitzHead', 'blitzFistL', 150],
    ['blitzEye', 'blitzHead', 70],
    ['blitzFistR', 'blitzFistR', 90],
  ];

  function spawnBolt(): void {
    const s = env.S;
    const t = targets[Math.floor(Math.random() * targets.length)];
    const a = px(env, ANCHORS[t[0]]);
    const b = px(env, ANCHORS[t[1]]);
    const pts = boltPath(a.x, a.y, b.x + rnd(-t[2], t[2]) * s, b.y + rnd(-t[2], t[2]) * s, t[2] * s * 0.5, s);
    const branches: Pt[][] = [];
    if (Math.random() < 0.6) {
      const sp = pts[Math.floor(pts.length * rnd(0.3, 0.7))];
      branches.push(boltPath(sp[0], sp[1], sp[0] + rnd(-90, 90) * s, sp[1] + rnd(-90, 90) * s, 55 * s, s));
    }
    bolts.push({ pts, branches, life: rnd(0.07, 0.17), t0: 0.17, w: rnd(1.4, 2.6) });
  }

  function spawnSpark(): void {
    const s = env.S;
    const p = px(env, Math.random() < 0.5 ? ANCHORS.blitzFistR : ANCHORS.blitzFistL);
    const ang = rnd(0, Math.PI * 2);
    const sp = rnd(40, 160) * s;
    sparks.push({ x: p.x + rnd(-12, 12) * s, y: p.y + rnd(-12, 12) * s, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: rnd(0.3, 0.7), t0: 0.7, r: rnd(0.8, 2) * s });
  }

  function drawGlow(): void {
    const { ctx, S, now } = env;
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.55 + 0.45 * Math.sin(now / 55);
    for (const a of [ANCHORS.blitzEye, ANCHORS.blitzFistR]) {
      const p = px(env, a);
      const rad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 90 * S);
      rad.addColorStop(0, `rgba(120,225,255,${0.32 * fl})`);
      rad.addColorStop(1, 'rgba(120,225,255,0)');
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 90 * S, 0, 7);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawBolts(): void {
    const { ctx, S } = env;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const b of bolts) {
      const k = Math.max(0, b.life / b.t0);
      ctx.shadowColor = '#46d7ff';
      ctx.shadowBlur = 16 * S;
      const stroke = (pts: Pt[], wm: number): void => {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.strokeStyle = `rgba(120,225,255,${0.55 * k})`;
        ctx.lineWidth = b.w * wm * 2.4 * S;
        ctx.stroke();
        ctx.strokeStyle = `rgba(245,253,255,${0.95 * k})`;
        ctx.lineWidth = b.w * wm * S;
        ctx.stroke();
      };
      stroke(b.pts, 1);
      b.branches.forEach((br) => stroke(br, 0.6));
    }
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawSparks(): void {
    const { ctx } = env;
    ctx.globalCompositeOperation = 'lighter';
    for (const p of sparks) {
      const k = Math.min(1, p.life / p.t0);
      ctx.fillStyle = `rgba(180,240,255,${k})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  return {
    spawn(dt) {
      emit('bolt', 3.4, env, dt, spawnBolt);
      emit('spark', 26, env, dt, spawnSpark);
      step(bolts, dt, () => undefined);
      step(sparks, dt, (p) => {
        p.vy += 260 * env.S * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.96;
      });
    },
    draw() {
      drawGlow();
      drawSparks();
      drawBolts();
    },
    reset() {
      bolts.length = 0;
      sparks.length = 0;
    },
  };
}
