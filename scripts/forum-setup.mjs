import { randomBytes } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
try {
  await writeFile(new URL('../.env', import.meta.url), `FORUM_ADMIN_PASSWORD=${randomBytes(24).toString('base64url')}\n`, { flag: 'wx', mode: 0o600 });
  console.log('Local administrator password generated in .env (ignored by Git).');
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log('Existing .env preserved.');
}
