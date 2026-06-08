/** Réponse SUMMONER-V4 (invocateur LoL via PUUID). */
export interface RiotSummoner {
  puuid: string;
  profileIconId: number;
  summonerLevel: number;
  revisionDate: number;
  /** summonerId chiffré — optionnel (Riot le déprécie progressivement). */
  id?: string;
  accountId?: string;
}
