import { cp, mkdir, rm } from 'node:fs/promises';
import { generateFaq } from './generate-faq.mjs';
await generateFaq();
const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of ['index.html', 'src']) {
  await cp(new URL(`../${file}`, import.meta.url), new URL(file, dist), { recursive: true });
}
console.log('Static site built in dist/');
