// Cache mémoire générique à TTL — évite de spammer l'API Riot pour des données
// lentes à varier (rotation, statut, classements) ou immuables (match joué).

interface Entry<T> {
  value: T;
  expires: number;
}

const store = new Map<string, Entry<unknown>>();

/**
 * Renvoie la valeur cachée pour `key` si encore valide, sinon exécute `fn`,
 * met en cache le résultat (TTL `ttlMs`) et le renvoie.
 */
export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as T;

  const value = await fn();
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}
