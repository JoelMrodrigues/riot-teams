import React from 'react';
import { motion } from 'framer-motion';

interface Orb {
  color: string;
  size: number;
  top: string;
  left: string;
  dur: number;
}

const ORBS: Orb[] = [
  { color: 'rgba(124, 58, 237, 0.55)', size: 520, top: '-10%', left: '8%', dur: 18 },
  { color: 'rgba(34, 211, 238, 0.35)', size: 420, top: '20%', left: '62%', dur: 22 },
  { color: 'rgba(244, 114, 182, 0.32)', size: 460, top: '55%', left: '25%', dur: 26 },
  { color: 'rgba(167, 139, 250, 0.40)', size: 380, top: '60%', left: '70%', dur: 20 },
];

/** Fond ambiant : orbes colorés floutés en lévitation continue. */
export function LolAuroraBackground(): React.JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: orb.color,
            filter: 'blur(90px)',
          }}
          animate={{ x: [0, 40, -30, 0], y: [0, -50, 30, 0], scale: [1, 1.12, 0.95, 1] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
