import React from 'react';

import type { MatchTimeline, TimelineEvent } from '../../../types/lolTimeline.types';

const BLUE = '#57A8FF';
const RED = '#FB7185';

function mmss(ms: number): string {
  return `${Math.floor(ms / 60_000)}:${String(Math.floor((ms % 60_000) / 1000)).padStart(2, '0')}`;
}

function teamColor(killerId?: number): string {
  return killerId && killerId <= 5 ? BLUE : RED;
}

function eventLabel(e: TimelineEvent): string {
  if (e.type === 'CHAMPION_KILL') return 'First Blood';
  if (e.monsterType === 'BARON_NASHOR') return 'Baron Nashor';
  if (e.monsterType === 'RIFTHERALD') return 'Héraut';
  if (e.monsterType === 'DRAGON') return 'Drake';
  return 'Objectif';
}

interface LolMatchTimelineProps {
  timeline: MatchTimeline;
}

/** Timeline d'une partie : différence d'or (bleu vs rouge) + événements clés. */
export function LolMatchTimeline({ timeline }: LolMatchTimelineProps): React.JSX.Element {
  const frames = timeline.info.frames;
  if (frames.length === 0) {
    return <p className="py-6 text-center text-xs" style={{ color: 'var(--lol-text-muted)' }}>Timeline indisponible.</p>;
  }

  const goldDiff = frames.map((f) => {
    let blue = 0;
    let red = 0;
    for (let p = 1; p <= 10; p += 1) {
      const g = f.participantFrames[String(p)]?.totalGold ?? 0;
      if (p <= 5) blue += g; else red += g;
    }
    return blue - red;
  });
  const maxAbs = Math.max(...goldDiff.map((d) => Math.abs(d)), 1);
  const lastMin = frames.length - 1;

  const all = frames.flatMap((f) => f.events);
  const firstBlood = all.find((e) => e.type === 'CHAMPION_KILL');
  const keyEvents = [
    ...(firstBlood ? [firstBlood] : []),
    ...all.filter((e) => e.type === 'ELITE_MONSTER_KILL'),
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="flex flex-col gap-3 rounded-md border p-4" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
          Différence d'or
        </span>
        <span className="flex items-center gap-2 text-[11px]" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
          <span style={{ color: BLUE }}>● Bleu</span><span style={{ color: RED }}>● Rouge</span>
        </span>
      </div>

      <svg viewBox={`0 0 ${frames.length} 100`} preserveAspectRatio="none" className="h-36 w-full">
        <line x1={0} y1={50} x2={frames.length} y2={50} stroke="var(--lol-border)" strokeWidth={0.4} />
        {goldDiff.map((d, i) => {
          const h = (Math.abs(d) / maxAbs) * 46;
          const blue = d >= 0;
          return <rect key={i} x={i + 0.15} width={0.7} y={blue ? 50 - h : 50} height={h || 0.3} fill={blue ? BLUE : RED} />;
        })}
      </svg>

      <div className="flex justify-between text-[10px]" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
        <span>0:00</span><span>{Math.floor(lastMin / 2)}:00</span><span>{lastMin}:00</span>
      </div>

      {keyEvents.length > 0 && (
        <div className="flex flex-col gap-1 border-t pt-3" style={{ borderColor: 'var(--lol-border)' }}>
          {keyEvents.map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="w-10 tabular-nums" style={{ color: 'var(--lol-text-muted)' }}>{mmss(e.timestamp)}</span>
              <span className="h-2 w-2 rounded-full" style={{ background: teamColor(e.killerId) }} />
              <span style={{ color: 'var(--lol-text)' }}>{eventLabel(e)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
