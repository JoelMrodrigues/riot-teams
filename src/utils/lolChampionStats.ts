import type { MatchInfo } from '../types/lolApi.types';

export interface ChampionStat {
  champion: string;
  championId: number;
  games: number;
  wins: number;
  winrate: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  kda: number;
}

interface Accumulator {
  champion: string;
  championId: number;
  games: number;
  wins: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
}

/**
 * Agrège les matchs par champion et retourne le top N trié par nb de parties
 * décroissant. Pur, sans effet de bord — testable unitairement.
 */
export function computeTopChampions(matches: MatchInfo[], limit = 10): ChampionStat[] {
  const map = new Map<string, Accumulator>();

  for (const m of matches) {
    const existing = map.get(m.champion);
    if (existing) {
      existing.games += 1;
      existing.wins += m.win ? 1 : 0;
      existing.totalKills += m.kills;
      existing.totalDeaths += m.deaths;
      existing.totalAssists += m.assists;
    } else {
      map.set(m.champion, {
        champion: m.champion,
        championId: m.championId,
        games: 1,
        wins: m.win ? 1 : 0,
        totalKills: m.kills,
        totalDeaths: m.deaths,
        totalAssists: m.assists,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.games - a.games)
    .slice(0, limit)
    .map((acc) => ({
      champion: acc.champion,
      championId: acc.championId,
      games: acc.games,
      wins: acc.wins,
      winrate: Math.round((acc.wins / acc.games) * 100),
      totalKills: acc.totalKills,
      totalDeaths: acc.totalDeaths,
      totalAssists: acc.totalAssists,
      kda: parseFloat(
        ((acc.totalKills + acc.totalAssists) / Math.max(acc.totalDeaths, 1)).toFixed(2),
      ),
    }));
}
