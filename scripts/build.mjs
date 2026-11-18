import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { generateFaq } from './generate-faq.mjs';
const websiteId = process.env.UMAMI_WEBSITE_ID?.trim();
if (websiteId && !/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(websiteId)) {
  throw new Error('UMAMI_WEBSITE_ID must be the public Website ID from Umami.');
}
await generateFaq();
const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of ['index.html', 'src']) {
  await cp(new URL(`../${file}`, import.meta.url), new URL(file, dist), { recursive: true });
}
if (websiteId) {
  const file = new URL('src/features.json', dist);
  const features = JSON.parse(await readFile(file, 'utf8'));
  await writeFile(file, JSON.stringify({ ...features, umamiWebsiteId: websiteId }));
}
console.log('Static site built in dist/');
