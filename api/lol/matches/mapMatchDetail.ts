// Transforme une partie brute MATCH-V5 en détail « propre » prêt à afficher.
import { queueKind, roleKind } from './queueMap';
import type { RiotMatch, RiotMatchParticipant, RiotMatchTeam } from './types';
import type {
  MatchDetail, MatchDetailParticipant, MatchDetailTeam,
} from './matchDetailTypes';

function itemsOf(p: RiotMatchParticipant): number[] {
  return [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].map((i) => i ?? 0);
}

function objKills(team: RiotMatchTeam, key: string): number {
  return team.objectives?.[key]?.kills ?? 0;
}

function toParticipant(p: RiotMatchParticipant, minutes: number): MatchDetailParticipant {
  const cs = p.totalMinionsKilled + p.neutralMinionsKilled;
  const tag = p.riotIdTagline ? `#${p.riotIdTagline}` : '';
  return {
    puuid: p.puuid,
    riotId: `${p.riotIdGameName || p.summonerName || '—'}${tag}`,
    champion: p.championName,
    championId: p.championId,
    teamId: p.teamId ?? 0,
    role: roleKind(p.teamPosition),
    win: p.win,
    kills: p.kills,
    deaths: p.deaths,
    assists: p.assists,
    kda: Math.round(((p.kills + p.assists) / Math.max(1, p.deaths)) * 100) / 100,
    cs,
    csPerMin: minutes > 0 ? Math.round((cs / minutes) * 10) / 10 : 0,
    goldEarned: p.goldEarned ?? 0,
    damageToChampions: p.totalDamageDealtToChampions ?? 0,
    visionScore: p.visionScore ?? 0,
    champLevel: p.champLevel ?? 0,
    spells: [p.summoner1Id ?? 0, p.summoner2Id ?? 0],
    items: itemsOf(p),
  };
}

function toTeam(t: RiotMatchTeam): MatchDetailTeam {
  return {
    teamId: t.teamId,
    win: t.win,
    bans: (t.bans ?? []).map((b) => b.championId),
    objectives: {
      baron: objKills(t, 'baron'),
      dragon: objKills(t, 'dragon'),
      tower: objKills(t, 'tower'),
      inhibitor: objKills(t, 'inhibitor'),
      riftHerald: objKills(t, 'riftHerald'),
      champion: objKills(t, 'champion'),
    },
  };
}

export function mapMatchDetail(match: RiotMatch): MatchDetail {
  const minutes = match.info.gameDuration / 60;
  return {
    matchId: match.metadata.matchId,
    queue: queueKind(match.info.queueId),
    gameMode: match.info.gameMode,
    durationSec: match.info.gameDuration,
    gameEndUnix: match.info.gameEndTimestamp,
    teams: (match.info.teams ?? []).map(toTeam),
    participants: match.info.participants.map((p) => toParticipant(p, minutes)),
  };
}
