import 'dotenv/config';

/** Configuration centrale du serveur proxy (lue depuis .env). */
function pickKey(): string {
  const mode = (process.env.RIOT_KEY_MODE ?? 'test').toLowerCase();
  const key = mode === 'prod' ? process.env.RIOT_API_KEY : process.env.RIOT_API_KEY_TEST;
  if (!key) throw new Error(`Clé API manquante pour le mode "${mode}" (vérifie ton .env).`);
  return key;
}

export const CONFIG = {
  riotKey: pickKey(),
  keyMode: (process.env.RIOT_KEY_MODE ?? 'test').toLowerCase(),
  defaultPlatform: process.env.RIOT_DEFAULT_PLATFORM ?? 'euw1',
  port: Number(process.env.PORT ?? 3001),
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
};
