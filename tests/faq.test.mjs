import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseFaq, validateTopics } from '../scripts/generate-faq.mjs';
import { topics } from '../src/topics.js';
import { renderAnswer, findMatches } from '../src/faq.js';

const source = await readFile(new URL('../PROJECT_DESCRIPTION.md', import.meta.url), 'utf8');
const faq = parseFaq(source);

test('all reviewed questions, sources and pending items survive the Markdown import', () => {
  assert.equal(faq.questions.length, 59);
  assert.equal(faq.openQuestions.length, 4);
  assert.equal(faq.updatedAt, '5 Kasım 2026');
  assert.match(faq.questions[36].answer, /açık bırakıldı/);
  const sourceLinks = [...source.split('### 1.')[1].matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1]);
  const importedLinks = [...faq.questions.map(question => question.answer).join('\n').matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1]);
  assert.deepEqual(importedLinks, sourceLinks);
  validateTopics(faq.questions, topics);
});

test('missing or duplicated question assignments fail before publishing', () => {
  const invalid = structuredClone(topics);
  invalid[0].questionIds[0] = [2];
  assert.throws(() => validateTopics(faq.questions, invalid), /exactly one/);
  assert.throws(() => parseFaq(source.replace('### 2.', '### 3.')), /sequential/);
});

test('search handles Turkish letters, answers, whitespace and exact question destinations', () => {
  assert.ok(findMatches('SİNEKLİK', topics, faq.questions).some(match => match.href === '#oda-donanimi/soru-8'));
  assert.ok(findMatches('koaksiyel', topics, faq.questions).some(match => match.href === '#internet/soru-11'));
  assert.ok(findMatches('  AIRWALLET   rezervasyon ', topics, faq.questions).some(match => match.href === '#camasirhane/soru-17'));
  assert.ok(findMatches('BEYAZ KARTON', topics, faq.questions).some(match => match.href === '#bakim/soru-57'));
  assert.ok(findMatches('acil merdiven', topics, faq.questions).some(match => match.href === '#ortak-alanlar/soru-58'));
  assert.deepEqual(findMatches('   ', topics, faq.questions), []);
  assert.deepEqual(findMatches('zzzzzz', topics, faq.questions), []);
});

test('Markdown formatting preserves sources without allowing raw HTML or unsafe URLs', () => {
  const html = renderAnswer('**Önemli** ve *not*\n\n[Kaynak](https://example.com/?a=1&b=2) <script>alert(1)</script> [x](javascript:alert(1))');
  assert.match(html, /<strong>Önemli<\/strong>/);
  assert.match(html, /<em>not<\/em>/);
  assert.match(html, /href="https:\/\/example.com\/\?a=1&amp;b=2"/);
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('href="javascript:'));
  assert.equal((html.match(/<p>/g) || []).length, 2);
});

// Duty hours do not establish the building-door or laundry opening hours.
test('night assistance is answered while unknown Apian 2 access hours remain open', () => {
  assert.match(faq.questions[19].answer, /Apian 2/);
  assert.match(faq.questions[19].answer, /21\.00–06\.00/);
  assert.match(faq.questions[19].answer, /10 €/);
  assert.match(faq.questions[19].answer, /2025/);
  assert.match(faq.questions[17].answer, /kesin kapanış ve açılış saatleri açık bırakıldı/);
  const pending = faq.openQuestions.find(item => item.startsWith('**Gece erişimi:**'));
  assert.match(pending, /dış kapısı/);
  assert.doesNotMatch(pending, /Gece görevlisine/);
});

test('Rathaus link renders a map with the supplied pin and a directions fallback', () => {
  const html = renderAnswer(faq.questions[43].answer);
  assert.match(html, /<details>/);
  assert.match(html, /<summary>Haritayı göster<\/summary>/);
  assert.match(html, /<iframe title="Unterföhring, Rathaus haritası"/);
  assert.match(html, /q=48\.1916509,11\.6401404/);
  assert.match(html, /destination=48\.1916509,11\.6401404/);
  assert.match(html, /Google Maps’te aç/);
  assert.ok(!renderAnswer('[x](https://example.com/maps/place/x/!3d48!4d11)').includes('<iframe'));
  assert.ok(!renderAnswer('[x](https://www.google.com/maps/place/x/!3d999!4d11)').includes('<iframe'));
  assert.ok(!renderAnswer('[<script>](https://www.google.com/maps/place/x/!3d48!4d11)').includes('<script>'));
});
