/** Détail de partie fictif pour l'espace test (rendu sans serveur). */
import type { MatchDetail, MatchDetailParticipant, MatchDetailTeam } from '../types/lolMatchDetail.types';
import type { RoleKind } from '../types/lolApi.types';

type Row = [string, string, number, RoleKind, number, number, number, number, number, number, number, number, [number, number], number[]];

function mkP(r: Row, teamId: number, win: boolean): MatchDetailParticipant {
  const [riotId, champion, championId, role, kills, deaths, assists, cs, goldEarned, damageToChampions, visionScore, champLevel, spells, items] = r;
  return {
    puuid: `demo-${riotId}`, riotId, champion, championId, teamId, role, win,
    kills, deaths, assists,
    kda: Math.round(((kills + assists) / Math.max(1, deaths)) * 100) / 100,
    cs, csPerMin: Math.round((cs / 30) * 10) / 10,
    goldEarned, damageToChampions, visionScore, champLevel, spells, items,
  };
}

const BLUE: Row[] = [
  ['Shyvana Diff#EUW', 'Renekton', 58, 'TOP', 6, 2, 4, 224, 14200, 18400, 18, 16, [4, 12], [3071, 3047, 3053, 3742, 3065, 1054, 3340]],
  ['Lone Wolf#EUW', 'Viego', 234, 'JUNGLE', 9, 4, 7, 165, 13800, 21300, 22, 16, [11, 4], [3153, 3142, 3071, 3026, 3111, 1037, 3340]],
  ['Phantom Roam#EUW', 'Ahri', 103, 'MIDDLE', 11, 3, 8, 238, 15100, 28700, 16, 17, [4, 14], [6655, 3020, 4645, 3089, 3135, 1058, 3340]],
  ['Crit Happens#EUW', 'Jinx', 222, 'BOTTOM', 13, 2, 6, 271, 16400, 31200, 12, 17, [4, 7], [3031, 3094, 3072, 3006, 6672, 1038, 3340]],
  ['Ward Andrews#EUW', 'Thresh', 412, 'UTILITY', 1, 5, 21, 42, 9800, 7600, 48, 14, [4, 3], [3190, 3158, 3107, 3009, 2055, 0, 3364]],
];

const RED: Row[] = [
  ['Toplaner#EUW', 'Aatrox', 266, 'TOP', 4, 5, 3, 208, 12100, 16800, 15, 15, [4, 12], [6630, 3071, 3053, 3047, 3065, 1054, 3340]],
  ['Jungler#EUW', 'LeeSin', 64, 'JUNGLE', 5, 7, 6, 150, 11200, 14300, 20, 15, [11, 4], [3071, 6692, 3158, 3814, 3065, 1037, 3340]],
  ['Midlaner#EUW', 'Zed', 238, 'MIDDLE', 7, 6, 4, 225, 12900, 19400, 14, 16, [4, 14], [6692, 3814, 3142, 3156, 3071, 1037, 3340]],
  ['ADCarry#EUW', 'Caitlyn', 51, 'BOTTOM', 6, 8, 3, 248, 13100, 22600, 13, 16, [4, 7], [6672, 3094, 3036, 3006, 3031, 1038, 3340]],
  ['Support#EUW', 'Lulu', 117, 'UTILITY', 0, 9, 12, 38, 8200, 5400, 41, 13, [4, 3], [3877, 3158, 6617, 2055, 0, 0, 3364]],
];

function mkTeam(teamId: number, win: boolean, bans: number[], o: number[]): MatchDetailTeam {
  return {
    teamId, win, bans,
    objectives: { baron: o[0], dragon: o[1], tower: o[2], inhibitor: o[3], riftHerald: o[4], champion: o[5] },
  };
}

export const DEMO_MATCH_DETAIL: MatchDetail = {
  matchId: 'DEMO_2',
  queue: 'solo',
  gameMode: 'CLASSIC',
  durationSec: 1834,
  gameEndUnix: Date.now() - 2 * 3600_000,
  teams: [
    mkTeam(100, true, [157, 91, 64], [1, 3, 8, 1, 1, 40]),
    mkTeam(200, false, [238, 555, 0], [0, 1, 2, 0, 0, 22]),
  ],
  participants: [...BLUE.map((r) => mkP(r, 100, true)), ...RED.map((r) => mkP(r, 200, false))],
};
