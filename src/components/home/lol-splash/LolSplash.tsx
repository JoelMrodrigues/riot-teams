import React, { useRef } from 'react';

import { useSplashEngine } from './useSplashEngine';

interface LolSplashProps {
  active: boolean;
}

const SPLASH_IMG = '/images/lol-splash.jpg';
const FX_TRANSITION = 'transform 0.9s cubic-bezier(0.65, 0, 0.35, 1)';

/** Animated LoL splash: static art + canvas particle FX (active only). */
export function LolSplash({ active }: LolSplashProps): React.JSX.Element {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useSplashEngine(canvasRef, frameRef, active);

  const scale = active ? 'scale(1.07)' : 'scale(1)';

  return (
    <div ref={frameRef} className="absolute inset-0 overflow-hidden">
      <img
        src={SPLASH_IMG}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: scale, transformOrigin: 'center', transition: FX_TRANSITION }}
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ transform: scale, transformOrigin: 'center', transition: FX_TRANSITION }}
      />
    </div>
  );
}
