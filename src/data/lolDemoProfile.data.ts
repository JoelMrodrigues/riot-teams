/** Profil Solo fictif pour l'espace test /lol/test/solo (preview sans serveur). */
import type { LolProfile, MatchInfo, RoleKind, QueueKind } from '../types/lolApi.types';

type M = [string, number, RoleKind, boolean, number, number, number, number, number, QueueKind?];

function mkMatch(m: M, i: number): MatchInfo {
  const [champion, championId, role, win, kills, deaths, assists, cs, durMin, queue = 'solo'] = m;
  return {
    matchId: `DEMO_${i}`,
    queue, champion, championId, role, win, kills, deaths, assists,
    kda: Math.round(((kills + assists) / Math.max(1, deaths)) * 100) / 100,
    cs,
    csPerMin: Math.round((cs / durMin) * 10) / 10,
    durationSec: Math.round(durMin * 60),
    gameEndUnix: Date.now() - i * 3600_000,
  };
}

const RAW: M[] = [
  ['Ahri', 103, 'MIDDLE', true, 8, 3, 10, 210, 28],
  ['Ahri', 103, 'MIDDLE', false, 4, 7, 6, 195, 31],
  ['Syndra', 134, 'MIDDLE', true, 11, 2, 7, 240, 26],
  ['Orianna', 61, 'MIDDLE', true, 6, 4, 14, 230, 33, 'flex'],
  ['Zed', 238, 'MIDDLE', false, 9, 8, 4, 205, 29],
  ['Akali', 84, 'MIDDLE', true, 13, 5, 8, 220, 30],
  ['Viktor', 112, 'MIDDLE', false, 5, 6, 9, 250, 35, 'flex'],
  ['Lux', 99, 'MIDDLE', true, 7, 3, 16, 180, 27],
  ['Ahri', 103, 'MIDDLE', true, 10, 4, 11, 215, 28],
  ['Sylas', 517, 'MIDDLE', false, 6, 9, 5, 190, 32],
  ['Syndra', 134, 'MIDDLE', true, 9, 2, 6, 235, 25],
  ['Yasuo', 157, 'MIDDLE', false, 8, 7, 7, 225, 34, 'normal'],
];

export const DEMO_PROFILE: LolProfile = {
  riotId: 'Phantom Roam',
  tagLine: 'EUW',
  puuid: 'demo-puuid',
  profileIconId: 4567,
  summonerLevel: 412,
  platform: 'euw1',
  ranks: [
    { queue: 'solo', tier: 'DIAMOND', rank: 'II', lp: 64, wins: 142, losses: 121, winrate: 54 },
    { queue: 'flex', tier: 'PLATINUM', rank: 'I', lp: 32, wins: 38, losses: 30, winrate: 56 },
  ],
  matches: RAW.map(mkMatch),
  mastery: [
    { championId: 103, level: 7, points: 284910 },
    { championId: 134, level: 7, points: 142300 },
    { championId: 61, level: 6, points: 98700 },
    { championId: 84, level: 5, points: 64200 },
    { championId: 238, level: 5, points: 51800 },
    { championId: 99, level: 4, points: 33100 },
  ],
};
