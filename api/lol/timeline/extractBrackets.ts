// Extrait, depuis le détail + la timeline d'une partie, les stats du joueur par
// tranche de 5 min (or/cs/xp) et la différence vs son adversaire de rôle.

import type { RiotMatch } from '../matches/types.js';
import type { RiotMatchTimeline, RiotTimelineParticipantFrame } from '../matches/timelineTypes.js';

export interface BracketRow {
  championId: number;
  role: string | null;
  win: boolean;
  gameCreationMs: number;
  bracketMin: number;
  myGold: number;
  myCs: number;
  myXp: number;
  diffGold: number | null;
  diffCs: number | null;
  diffXp: number | null;
}

const BRACKETS = [5, 10, 15, 20, 25, 30];

const teamOf = (index: number, declared?: number): number => declared ?? (index < 5 ? 100 : 200);
const csOf = (f: RiotTimelineParticipantFrame | undefined): number => (f ? f.minionsKilled + f.jungleMinionsKilled : 0);

export function extractBrackets(match: RiotMatch, timeline: RiotMatchTimeline, puuid: string): BracketRow[] {
  const parts = match.info.participants;
  const meIdx = parts.findIndex((p) => p.puuid === puuid);
  if (meIdx < 0) return [];
  const me = parts[meIdx]!;
  const myPid = meIdx + 1;
  const myTeam = teamOf(meIdx, me.teamId);

  // Adversaire de rôle : équipe adverse + même teamPosition.
  const oppIdx = me.teamPosition
    ? parts.findIndex((p, i) => i !== meIdx && teamOf(i, p.teamId) !== myTeam && p.teamPosition === me.teamPosition)
    : -1;
  const oppPid = oppIdx >= 0 ? oppIdx + 1 : null;

  const { frames } = timeline.info;
  const durationMin = match.info.gameDuration / 60;
  const gameCreationMs = match.info.gameCreation ?? match.info.gameEndTimestamp;

  const rows: BracketRow[] = [];
  for (const min of BRACKETS) {
    if (min > durationMin) break;
    const frame = frames[min];
    const myF = frame?.participantFrames[String(myPid)];
    if (!myF) continue;
    const oppF = oppPid ? frame?.participantFrames[String(oppPid)] : undefined;
    rows.push({
      championId: me.championId,
      role: me.teamPosition || null,
      win: me.win,
      gameCreationMs,
      bracketMin: min,
      myGold: myF.totalGold,
      myCs: csOf(myF),
      myXp: myF.xp,
      diffGold: oppF ? myF.totalGold - oppF.totalGold : null,
      diffCs: oppF ? csOf(myF) - csOf(oppF) : null,
      diffXp: oppF ? myF.xp - oppF.xp : null,
    });
  }
  return rows;
}
