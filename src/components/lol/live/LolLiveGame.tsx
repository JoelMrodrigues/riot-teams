import React from 'react';

import { LolLiveParticipant } from './LolLiveParticipant';
import { queueLabel } from '../../../utils/lolQueue';
import { LOL_ACCENTS } from '../../../constants/lolTheme';
import type { LiveGame, LiveParticipant } from '../../../types/lolLive.types';

const BLUE = '#57A8FF';
const RED = '#FB7185';
const ME = LOL_ACCENTS.solo.color;

function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

interface LolLiveGameProps {
  game: LiveGame;
  /** Riot ID complet du joueur cherché (gameName#tagLine) — surligné. */
  meName: string;
}

/** Vue « partie en cours » : 2 équipes (avec qui / contre qui), façon porofessor. */
export function LolLiveGame({ game, meName }: LolLiveGameProps): React.JSX.Element {
  const me = meName.toLowerCase();
  const isMe = (p: LiveParticipant): boolean =>
    (p.riotId ?? '').toLowerCase() === me || (p.summonerName ?? '').toLowerCase() === me.split('#')[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-md border px-4 py-2.5" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
        <span className="text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
          {queueLabel(game.gameQueueConfigId)}
        </span>
        <span className="flex items-center gap-2 text-sm" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-emerald, #34D399)' }}>
          <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: 'var(--lol-emerald, #34D399)' }} />
          {fmt(game.gameLength)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TeamColumn title="Équipe bleue" color={BLUE} players={game.participants.filter((p) => p.teamId === 100)} isMe={isMe} />
        <TeamColumn title="Équipe rouge" color={RED} players={game.participants.filter((p) => p.teamId === 200)} isMe={isMe} />
      </div>
    </div>
  );
}

function TeamColumn({ title, color, players, isMe }: {
  title: string; color: string; players: LiveParticipant[]; isMe: (p: LiveParticipant) => boolean;
}): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-md border" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
      <div className="px-3 py-2" style={{ borderLeft: `3px solid ${color}` }}>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif', color }}>{title}</span>
      </div>
      <div className="flex flex-col gap-0.5 p-2">
        {players.map((p) => <LolLiveParticipant key={p.puuid} p={p} isMe={isMe(p)} accent={ME} />)}
      </div>
    </div>
  );
}
