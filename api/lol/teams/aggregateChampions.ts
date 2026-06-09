// Utilitaire pur : agrège les stats par champion à partir d'une liste de matchs.
// Entrée : matchs filtrés sur le PUUID du joueur.
// Sortie : top N champions triés par nombre de parties.

import type { RiotMatch } from '../matches/types.js';
import type { TopChampionStat } from './types.js';

interface ChampionAccum {
  champion: string;
  championId: number;
  games: number;
  wins: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
}

/** Calcule le KDA agrégé : (ΣK + ΣA) / max(ΣD, 1). */
function computeKda(acc: ChampionAccum): number {
  const kda = (acc.totalKills + acc.totalAssists) / Math.max(acc.totalDeaths, 1);
  return Math.round(kda * 100) / 100;
}

/**
 * Agrège les stats par champion sur une liste de matchs MATCH-V5.
 * Retourne les `topN` champions triés par nombre de parties (décroissant).
 */
export function aggregateChampions(
  matches: RiotMatch[],
  puuid: string,
  topN = 5,
): TopChampionStat[] {
  const map = new Map<number, ChampionAccum>();

  for (const match of matches) {
    const me = match.info.participants.find((p) => p.puuid === puuid);
    if (!me) continue;

    const existing = map.get(me.championId);
    if (existing) {
      existing.games += 1;
      existing.wins += me.win ? 1 : 0;
      existing.totalKills += me.kills;
      existing.totalDeaths += me.deaths;
      existing.totalAssists += me.assists;
    } else {
      map.set(me.championId, {
        champion: me.championName,
        championId: me.championId,
        games: 1,
        wins: me.win ? 1 : 0,
        totalKills: me.kills,
        totalDeaths: me.deaths,
        totalAssists: me.assists,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.games - a.games)
    .slice(0, topN)
    .map((acc) => ({
      champion: acc.champion,
      championId: acc.championId,
      games: acc.games,
      winrate: acc.games > 0 ? Math.round((acc.wins / acc.games) * 100) : 0,
      kda: computeKda(acc),
    }));
}
