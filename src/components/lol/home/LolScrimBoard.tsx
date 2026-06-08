import React from 'react';
import { motion } from 'framer-motion';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { TEAM_DEMO } from '../../../data/lolTeamDemo.data';
import { LOL_ACCENTS } from '../../../constants/lolTheme';

const A = LOL_ACCENTS.team;

/** Dashboard d'équipe mocké (démo Gestion Scrim). */
export function LolScrimBoard(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40, rotateY: -8 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full max-w-md rounded-3xl p-6"
      style={{ background: 'var(--lol-surface)', border: `1px solid ${A.color}40`, boxShadow: `0 24px 60px ${A.glow}` }}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white" style={{ fontFamily: 'Rajdhani, sans-serif', background: A.gradient }}>{TEAM_DEMO.tag}</span>
          <div>
            <p className="text-lg font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>{TEAM_DEMO.name}</p>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: A.soft, border: `1px solid ${A.color}55` }}>{TEAM_DEMO.profile}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: A.color }}>{TEAM_DEMO.winrate}%</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--lol-text-muted)' }}>Winrate</p>
        </div>
      </div>

      {/* Roster */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lol-text-muted)' }}>Roster · SoloQ</p>
      <div className="mb-5 flex flex-col gap-2">
        {TEAM_DEMO.roster.map((p) => (
          <div key={p.name} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: 'var(--lol-bg-elevated)' }}>
            <span className="w-9 text-[10px] font-bold uppercase" style={{ color: A.soft }}>{p.role}</span>
            <ChampionAvatar champKey={p.champKey} label={p.name} size={30} ring={A.gradient} />
            <span className="flex-1 text-sm font-semibold" style={{ color: 'var(--lol-text)' }}>{p.name}</span>
            <span className="text-xs" style={{ color: 'var(--lol-text-muted)' }}>{p.rank}</span>
          </div>
        ))}
      </div>

      {/* Scrims */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lol-text-muted)' }}>Derniers scrims</p>
      <div className="flex flex-col gap-2">
        {TEAM_DEMO.scrims.map((s, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm" style={{ background: 'var(--lol-bg-elevated)' }}>
            <span style={{ color: 'var(--lol-text)' }}>{s.opponent}</span>
            <span className="flex items-center gap-3">
              <span style={{ color: 'var(--lol-text-muted)' }}>{s.score}</span>
              <span className="font-bold" style={{ color: s.result === 'win' ? A.color : '#fb7185' }}>{s.result === 'win' ? 'W' : 'L'}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl px-3 py-2 text-center text-xs font-semibold text-white" style={{ background: A.gradient }}>
        {TEAM_DEMO.nextScrim}
      </div>
    </motion.div>
  );
}
