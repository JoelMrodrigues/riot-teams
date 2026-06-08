import { getSummonerByPuuid } from '../api/lol/profile/getSummonerByPuuid';

// Usage: npm run try:summoner -- <puuid>
const puuid = process.argv.slice(2).join(' ').trim();
if (!puuid) {
  console.error('Usage: npm run try:summoner -- <puuid>');
  process.exit(1);
}

console.log(`→ SUMMONER-V4 by-puuid : ${puuid.slice(0, 12)}…`);
try {
  const summoner = await getSummonerByPuuid(puuid);
  console.log('✅ OK :', summoner);
} catch (err) {
  console.error('❌ Échec :', err instanceof Error ? err.message : err);
  process.exit(1);
}
