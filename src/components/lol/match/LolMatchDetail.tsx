import React from 'react';

import { LolMatchDetailRow } from './LolMatchDetailRow';
import type { MatchDetail, MatchDetailTeam } from '../../../types/lolMatchDetail.types';

const WIN = 'var(--lol-emerald, #34D399)';
const LOSS = 'var(--danger)';

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  return `${m}:${String(sec % 60).padStart(2, '0')}`;
}

interface LolMatchDetailProps {
  match: MatchDetail;
  accent: string;
}

/** Détail complet d'une partie : en-tête + 2 équipes (objectifs + lignes joueurs). */
export function LolMatchDetail({ match, accent }: LolMatchDetailProps): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-md border" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
      <div className="flex items-center justify-between border-b px-4 py-2" style={{ borderColor: 'var(--lol-border)' }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
          {match.queue} · {match.gameMode}
        </span>
        <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
          {fmtDuration(match.durationSec)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[560px] flex-col">
          {match.teams.map((team) => (
            <TeamBlock key={team.teamId} team={team} match={match} accent={accent} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamBlock({ team, match, accent }: { team: MatchDetailTeam; match: MatchDetail; accent: string }): React.JSX.Element {
  const players = match.participants.filter((p) => p.teamId === team.teamId);
  const color = team.win ? WIN : LOSS;

  return (
    <div className="px-3 py-2" style={{ borderLeft: `3px solid ${color}` }}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif', color }}>
          {team.win ? 'Victoire' : 'Défaite'} · {team.teamId === 100 ? 'Bleu' : 'Rouge'}
        </span>
        <span className="text-[10px]" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
          Drakes {team.objectives.dragon} · Nashor {team.objectives.baron} · Tours {team.objectives.tower}
        </span>
      </div>
      {players.map((p) => (
        <LolMatchDetailRow key={p.puuid} p={p} accent={accent} />
      ))}
    </div>
  );
}
