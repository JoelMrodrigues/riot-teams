/** Routing Riot : plateforme (euw1...) <-> cluster régional (europe...). */
export type RegionalCluster = 'europe' | 'americas' | 'asia' | 'sea';

const PLATFORM_TO_REGIONAL: Record<string, RegionalCluster> = {
  euw1: 'europe', eun1: 'europe', tr1: 'europe', ru: 'europe',
  na1: 'americas', br1: 'americas', la1: 'americas', la2: 'americas',
  kr: 'asia', jp1: 'asia',
  oc1: 'sea', ph2: 'sea', sg2: 'sea', th2: 'sea', tw2: 'sea', vn2: 'sea',
};

export function platformToRegional(platform: string): RegionalCluster {
  return PLATFORM_TO_REGIONAL[platform.toLowerCase()] ?? 'europe';
}

/** Host plateforme (summoner, league, spectator...). Ex: euw1.api.riotgames.com */
export function platformHost(platform: string): string {
  return `https://${platform.toLowerCase()}.api.riotgames.com`;
}

/** Host régional (account, match...). Ex: europe.api.riotgames.com */
export function regionalHost(cluster: RegionalCluster): string {
  return `https://${cluster}.api.riotgames.com`;
}
