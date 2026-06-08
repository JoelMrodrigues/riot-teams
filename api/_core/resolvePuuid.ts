import { RiotError } from './riotClient';
import { getAccountByRiotId } from '../shared/account/getAccountByRiotId';

/**
 * Résout un PUUID depuis la requête : soit fourni directement, soit dérivé
 * d'un Riot ID (gameName + tagLine) avec la clé courante. Throw 400 sinon.
 */
export async function resolvePuuid(puuid: string, gameName: string, tagLine: string): Promise<string> {
  if (puuid) return puuid;
  if (gameName && tagLine) {
    const account = await getAccountByRiotId(gameName, tagLine);
    return account.puuid;
  }
  throw new RiotError(400, 'puuid, ou gameName + tagLine, requis.');
}
