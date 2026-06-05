import { ANCHORS, makeEmitter, px, rnd, step } from './utils';
import type { ParticleSystem, SplashEnv } from './types';

interface RkSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  t0: number;
  r: number;
  hue: number;
}

/** Exhaust direction — points away from the rocket nose (down-left). */
const RK_ANG = Math.atan2(0.14, -0.4);

type FlameLayer = [len: number, wid: number, col: string, alpha: number];

/** Jinx — rocket exhaust flame + trailing ember sparks. */
export function createJinx(env: SplashEnv): ParticleSystem {
  const rkSparks: RkSpark[] = [];
  const emit = makeEmitter();
  const layers: FlameLayer[] = [
    [225, 54, '225,70,18', 0.82],
    [165, 40, '255,120,30', 0.92],
    [105, 24, '255,196,90', 0.95],
    [52, 12, '255,250,235', 1],
  ];

  function spawnSpark(): void {
    const s = env.S;
    const o = px(env, ANCHORS.rocketBack);
    const a = RK_ANG + rnd(-0.4, 0.4);
    const sp = rnd(180, 420) * s;
    rkSparks.push({ x: o.x + rnd(-8, 8) * s, y: o.y + rnd(-8, 8) * s, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rnd(0.45, 1), t0: 1, r: rnd(1.2, 3.4) * s, hue: rnd(20, 44) });
  }

  function drawFlame(): void {
    const { ctx, S, now } = env;
    const o = px(env, ANCHORS.rocketBack);
    const flick = 0.82 + 0.18 * Math.sin(now / 38) + 0.1 * Math.sin(now / 11) + rnd(-0.04, 0.04);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const halo = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, 105 * S * flick);
    halo.addColorStop(0, `rgba(255,180,90,${0.5 * flick})`);
    halo.addColorStop(0.45, `rgba(255,95,25,${0.28 * flick})`);
    halo.addColorStop(1, 'rgba(255,80,20,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(o.x, o.y, 105 * S * flick, 0, 7);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate(o.x, o.y);
    ctx.rotate(RK_ANG);
    const tear = (len: number, wid: number): void => {
      ctx.beginPath();
      ctx.moveTo(0, -wid);
      ctx.quadraticCurveTo(len * 0.55, -wid, len, 0);
      ctx.quadraticCurveTo(len * 0.55, wid, 0, wid);
      ctx.closePath();
    };
    for (const [len, wid, col, alpha] of layers) {
      const lpx = len * S * flick;
      const wpx = wid * S * flick;
      const g = ctx.createLinearGradient(0, 0, lpx, 0);
      g.addColorStop(0, `rgba(${col},${alpha})`);
      g.addColorStop(0.6, `rgba(${col},${alpha * 0.6})`);
      g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g;
      tear(lpx, wpx);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSparks(): void {
    const { ctx } = env;
    ctx.globalCompositeOperation = 'lighter';
    for (const p of rkSparks) {
      const k = Math.min(1, p.life / p.t0);
      ctx.fillStyle = `hsla(${p.hue},100%,${58 + 18 * k}%,${k})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  return {
    spawn(dt) {
      emit('rks', 90, env, dt, spawnSpark);
      step(rkSparks, dt, (p) => {
        p.vy += 120 * env.S * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.95;
        p.vy *= 0.97;
      });
    },
    draw() {
      drawFlame();
      drawSparks();
    },
    reset() {
      rkSparks.length = 0;
    },
  };
}
