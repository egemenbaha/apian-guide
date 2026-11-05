import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
const features = JSON.parse(await readFile(new URL('../src/features.json', import.meta.url), 'utf8'));
if (features.forumEnabled !== true) {
  console.error('Forum is disabled. Set forumEnabled to true in src/features.json before starting it.');
  process.exit(1);
}
try {
  await writeFile(new URL('../.env', import.meta.url), `FORUM_ADMIN_PASSWORD=${randomBytes(24).toString('base64url')}\n`, { flag: 'wx', mode: 0o600 });
  console.log('Local administrator password generated in .env (ignored by Git).');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log('Existing .env preserved.');
}
