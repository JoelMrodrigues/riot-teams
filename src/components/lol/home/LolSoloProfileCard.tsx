import React from 'react';
import { motion } from 'framer-motion';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { SOLO_DEMO } from '../../../data/lolSoloDemo.data';
import { LOL_ACCENTS, LOL_LOSS } from '../../../constants/lolTheme';

const A = LOL_ACCENTS.solo;

/** Carte profil joueur mockée (démo Recherche Solo). */
export function LolSoloProfileCard(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, rotateY: 8 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full max-w-md rounded-md p-6"
      style={{ background: 'var(--lol-surface)', border: `1px solid ${A.color}40`, boxShadow: `0 24px 60px ${A.glow}` }}
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-4">
        <ChampionAvatar champKey={SOLO_DEMO.topChampions[0].key} label={SOLO_DEMO.riotId} size={56} ring={A.gradient} />
        <div className="min-w-0">
          <p className="truncate text-lg font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
            {SOLO_DEMO.riotId} <span style={{ color: 'var(--lol-text-muted)' }}>#{SOLO_DEMO.tag}</span>
          </p>
          <p className="text-xs uppercase tracking-wider" style={{ color: A.soft }}>Niveau {SOLO_DEMO.level}</p>
        </div>
      </div>

      {/* Rank banner */}
      <div className="mb-5 flex items-center justify-between rounded-md px-4 py-3" style={{ background: A.gradient }}>
        <div>
          <p className="text-xl font-bold text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{SOLO_DEMO.rank}</p>
          <p className="text-xs font-semibold text-white/80">{SOLO_DEMO.lp} LP</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{SOLO_DEMO.winrate}%</p>
          <p className="text-xs font-semibold text-white/80">Winrate</p>
        </div>
      </div>

      {/* Top champions */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lol-text-muted)' }}>Champions favoris</p>
      <div className="mb-5 flex flex-col gap-2">
        {SOLO_DEMO.topChampions.map((c) => (
          <div key={c.key} className="flex items-center gap-3 rounded-md px-3 py-2" style={{ background: 'var(--lol-bg-elevated)' }}>
            <ChampionAvatar champKey={c.key} label={c.label} size={34} ring={A.gradient} />
            <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--lol-text)' }}>{c.label}</span>
            <span className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>{c.games} games</span>
            <span className="text-sm font-bold" style={{ color: A.color }}>{c.winrate}%</span>
          </div>
        ))}
      </div>

      {/* Recent matches */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lol-text-muted)' }}>Dernières parties</p>
      <div className="flex gap-2">
        {SOLO_DEMO.recentMatches.map((m, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <ChampionAvatar champKey={m.key} label={m.label} size={36} ring={m.result === 'V' ? A.gradient : LOL_LOSS.ring} />
            <span className="text-[10px] font-bold" style={{ color: m.result === 'V' ? A.color : LOL_LOSS.color }}>{m.result}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
