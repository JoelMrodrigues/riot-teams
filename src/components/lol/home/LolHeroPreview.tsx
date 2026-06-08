import React from 'react';
import { motion } from 'framer-motion';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_ACCENTS } from '../../../constants/lolTheme';

const FLOATERS = [
  { key: 'Ahri', label: 'Ahri', tag: 'Challenger', val: '67% WR', accent: LOL_ACCENTS.solo, x: '0%', y: '0%', dur: 7 },
  { key: 'Jinx', label: 'Frost', tag: 'ADC · Master', val: 'NF', accent: LOL_ACCENTS.team, x: '38%', y: '52%', dur: 9 },
];

/** Cartes mock flottantes illustrant le produit dans le hero. */
export function LolHeroPreview(): React.JSX.Element {
  return (
    <div className="relative h-[340px] w-full">
      {FLOATERS.map((f, i) => (
        <motion.div
          key={f.key}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
          transition={{ opacity: { delay: 0.4 + i * 0.2, duration: 0.6 }, y: { duration: f.dur, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute flex items-center gap-3 rounded-2xl p-4"
          style={{
            left: f.x,
            top: f.y,
            background: 'var(--lol-surface)',
            border: `1px solid ${f.accent.color}50`,
            boxShadow: `0 20px 50px ${f.accent.glow}`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <ChampionAvatar champKey={f.key} label={f.label} size={48} ring={f.accent.gradient} />
          <div>
            <p className="text-sm font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>{f.label}</p>
            <p className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>{f.tag}</p>
          </div>
          <span className="ml-2 rounded-lg px-2 py-1 text-xs font-bold text-white" style={{ background: f.accent.gradient }}>{f.val}</span>
        </motion.div>
      ))}
    </div>
  );
}
