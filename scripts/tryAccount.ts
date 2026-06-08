import { getAccountByRiotId } from '../api/shared/account/getAccountByRiotId';

// Usage: npm run try:account -- "pseudo#tag"
const input = process.argv.slice(2).join(' ').trim();
const i = input.lastIndexOf('#');
if (i <= 0 || i === input.length - 1) {
  console.error('Usage: npm run try:account -- "pseudo#tag"');
  process.exit(1);
}

const gameName = input.slice(0, i).trim();
const tagLine = input.slice(i + 1).trim();

console.log(`→ ACCOUNT-V1 by-riot-id : "${gameName}" #${tagLine}`);
try {
  const account = await getAccountByRiotId(gameName, tagLine);
  console.log('✅ OK :', account);
} catch (err) {
  console.error('❌ Échec :', err instanceof Error ? err.message : err);
  process.exit(1);
}
