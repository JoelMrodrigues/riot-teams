// Agrégations d'équipe à partir des stats joueurs (player-stats) : classement
// interne par rang + champions les plus joués de l'équipe.
import type { LolApiRosterMember } from '../types/lolTeam.types';
import type { PlayerStatEntry } from '../hooks/useTeamPlayerStats';

const TIER_WEIGHT: Record<string, number> = {
  IRON: 1, BRONZE: 2, SILVER: 3, GOLD: 4, PLATINUM: 5,
  EMERALD: 6, DIAMOND: 7, MASTER: 8, GRANDMASTER: 9, CHALLENGER: 10,
};

export interface RankedPlayer {
  member: LolApiRosterMember;
  rank: NonNullable<PlayerStatEntry['rank']>;
}

/** Joueurs classés (du meilleur rang au moins bon). Exclut les non-classés. */
export function sortPlayersByRank(
  roster: LolApiRosterMember[],
  stats: Map<string, PlayerStatEntry>,
): RankedPlayer[] {
  return roster
    .map((m) => ({ member: m, rank: stats.get(m.id)?.rank ?? null }))
    .filter((p): p is RankedPlayer => p.rank !== null)
    .sort((a, b) =>
      (TIER_WEIGHT[b.rank.tier.toUpperCase()] ?? 0) - (TIER_WEIGHT[a.rank.tier.toUpperCase()] ?? 0)
      || b.rank.lp - a.rank.lp);
}

export interface AggChampion {
  champion: string;
  games: number;
  winrate: number;
}

/** Champions les plus joués de l'équipe (somme des parties, winrate pondéré). */
export function aggregateTeamChampions(
  roster: LolApiRosterMember[],
  stats: Map<string, PlayerStatEntry>,
  limit = 8,
): AggChampion[] {
  const map = new Map<string, { games: number; wins: number }>();
  for (const m of roster) {
    const st = stats.get(m.id);
    if (!st) continue;
    for (const c of st.topChampions) {
      const cur = map.get(c.champion) ?? { games: 0, wins: 0 };
      cur.games += c.games;
      cur.wins += Math.round((c.games * c.winrate) / 100);
      map.set(c.champion, cur);
    }
  }
  return [...map.entries()]
    .map(([champion, v]) => ({ champion, games: v.games, winrate: v.games ? Math.round((v.wins / v.games) * 100) : 0 }))
    .sort((a, b) => b.games - a.games)
    .slice(0, limit);
}
