/**
 * Données fictives (mock) pour la page Aperçu d'équipe LoL.
 * Remplissent les colonnes de rôle vides afin de visualiser le design avec un
 * roster complet (1 Challenger, 1 Grandmaster, plusieurs Master).
 * Désactivable via DEMO_FILL_EMPTY_ROLES.
 */
import type { LolApiRosterMember } from '../types/lolTeam.types';
import type { PlayerStatEntry } from '../hooks/useTeamPlayerStats';
import type { CanonicalRole } from '../utils/organizeRosterByRole';

export const DEMO_FILL_EMPTY_ROLES = true;

export interface DemoPlayer {
  member: LolApiRosterMember;
  stats: PlayerStatEntry;
}

type TopChamp = { champion: string; games: number; winrate: number };

function champs(list: TopChamp[]): PlayerStatEntry['topChampions'] {
  return list.map((c) => ({ ...c, championId: 0, kda: 0 }));
}

function demo(
  role: CanonicalRole,
  gameName: string,
  rank: PlayerStatEntry['rank'],
  topChampions: TopChamp[],
): DemoPlayer {
  return {
    member: {
      id: `demo-${role.toLowerCase()}`,
      gameName,
      tagLine: 'EUW',
      puuid: null,
      roleInGame: role,
      userId: null,
      addedAt: new Date().toISOString(),
    },
    stats: { rank, topChampions: champs(topChampions) },
  };
}

const DEMO_BY_ROLE: Record<CanonicalRole, DemoPlayer> = {
  TOP: demo('TOP', 'Shyvana Diff', { tier: 'MASTER', rank: 'I', lp: 124, winrate: 54 }, [
    { champion: 'Aatrox', games: 41, winrate: 56 },
    { champion: 'Renekton', games: 33, winrate: 61 },
    { champion: 'Garen', games: 22, winrate: 45 },
    { champion: 'Gnar', games: 18, winrate: 50 },
    { champion: 'Jax', games: 12, winrate: 58 },
  ]),
  JUNGLE: demo('JUNGLE', 'Lone Wolf', { tier: 'GRANDMASTER', rank: 'I', lp: 612, winrate: 57 }, [
    { champion: 'Viego', games: 52, winrate: 60 },
    { champion: 'LeeSin', games: 44, winrate: 53 },
    { champion: 'Graves', games: 30, winrate: 57 },
    { champion: 'Warwick', games: 21, winrate: 48 },
    { champion: 'Sejuani', games: 15, winrate: 66 },
  ]),
  MID: demo('MID', 'Phantom Roam', { tier: 'CHALLENGER', rank: 'I', lp: 1042, winrate: 59 }, [
    { champion: 'Ahri', games: 70, winrate: 61 },
    { champion: 'Orianna', games: 55, winrate: 55 },
    { champion: 'Syndra', games: 40, winrate: 58 },
    { champion: 'Zed', games: 28, winrate: 49 },
    { champion: 'Lux', games: 20, winrate: 65 },
  ]),
  ADC: demo('ADC', 'Crit Happens', { tier: 'MASTER', rank: 'I', lp: 233, winrate: 55 }, [
    { champion: 'Jinx', games: 60, winrate: 57 },
    { champion: 'Kaisa', games: 48, winrate: 52 },
    { champion: 'Caitlyn', games: 35, winrate: 54 },
    { champion: 'Ezreal', games: 26, winrate: 46 },
    { champion: 'Ashe', games: 18, winrate: 61 },
  ]),
  SUPPORT: demo('SUPPORT', 'Ward Andrews', { tier: 'MASTER', rank: 'I', lp: 188, winrate: 53 }, [
    { champion: 'Thresh', games: 58, winrate: 56 },
    { champion: 'Nautilus', games: 42, winrate: 51 },
    { champion: 'Lulu', games: 33, winrate: 58 },
    { champion: 'Morgana', games: 24, winrate: 47 },
    { champion: 'Leona', games: 16, winrate: 63 },
  ]),
};

export function demoFillFor(role: CanonicalRole): DemoPlayer {
  return DEMO_BY_ROLE[role];
}

/** Stats d'équipe fictives (placeholder tant que les matchs d'équipe n'existent pas). */
export const DEMO_TEAM_STATS = {
  winrate: 65,
  wins: 42,
  losses: 23,
  matches: 65,
  avgKda: 3.71,
};
