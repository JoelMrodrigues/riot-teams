// Charge .env en local (en prod Railway, les variables sont déjà injectées).
try {
  process.loadEnvFile();
} catch {
  /* pas de fichier .env : on compte sur les variables d'environnement réelles */
}

/** Sélectionne la clé selon le mode (test par défaut). */
function pickKey(): string {
  const mode = (process.env.RIOT_KEY_MODE ?? 'test').toLowerCase();
  const key = mode === 'prod' ? process.env.RIOT_API_KEY : process.env.RIOT_API_KEY_TEST;
  if (!key) throw new Error(`Clé API manquante pour le mode "${mode}" (vérifie ton .env).`);
  return key;
}

/** Configuration centrale partagée par tous les modules API. */
export const CONFIG = {
  riotKey: pickKey(),
  keyMode: (process.env.RIOT_KEY_MODE ?? 'test').toLowerCase(),
  defaultPlatform: process.env.RIOT_DEFAULT_PLATFORM ?? 'euw1',
  defaultRegion: 'europe' as const,
  port: Number(process.env.PORT ?? 3001),
};
