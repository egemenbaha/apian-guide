import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseFaq, validateTopics } from '../scripts/generate-faq.mjs';
import { topics, sectionQuestionIds } from '../src/topics.js';
import { renderAnswer } from '../src/faq.js';
import { createSearchIndex, findMatches } from '../src/search.js';

const source = await readFile(new URL('../PROJECT_DESCRIPTION.md', import.meta.url), 'utf8');
const faq = parseFaq(source);
const searchIndex = createSearchIndex(topics, faq.questions);

test('all reviewed questions, sources and pending items survive the Markdown import', () => {
  assert.equal(faq.questions.length, 151);
  assert.equal(faq.openQuestions.length, 2);
  assert.match(faq.openQuestions[0], /^\*\*Boya:/);
  assert.match(faq.openQuestions[1], /Apian 1 oda ölçüleri/);
  assert.equal(faq.updatedAt, '5 Kasım 2026');
  assert.match(faq.questions[36].answer, /açık bırakıldı/);
  const sourceLinks = [...source.split('### 1.')[1].matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1]);
  const importedCopy = [...faq.questions.map(question => question.answer), ...faq.openQuestions].join('\n');
  const importedLinks = [...importedCopy.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1]);
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
  assert.ok(findMatches('SİNEKLİK', searchIndex).some(match => match.href === '#oda-donanimi/soru-8'));
  assert.ok(findMatches('koaksiyel', searchIndex).some(match => match.href === '#internet/soru-11'));
  assert.ok(findMatches('  AIRWALLET   rezervasyon ', searchIndex).some(match => match.href === '#camasirhane/soru-17'));
  assert.ok(findMatches('BEYAZ KARTON', searchIndex).some(match => match.href === '#bakim/soru-98'));
  assert.ok(findMatches('acil merdiven', searchIndex).some(match => match.href === '#ortak-alanlar/soru-99'));
  assert.ok(findMatches('pazar market', searchIndex).some(match => match.href === '#alisveris/soru-101'));
  assert.deepEqual(findMatches('   ', searchIndex), []);
  assert.deepEqual(findMatches('zzzzzz', searchIndex), []);
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

test('local photo galleries preserve accessible captions, credits and enlargement links', () => {
  const html = renderAnswer('Örnekler\n\n![Gümüş böceği "yakın" <görünüm>](src/images/bugs/gumus-bocegi.webp)\n**Gümüş böceği**\n[Fotoğrafçı](https://example.com/author) · [Lisans](https://example.com/license)\n![Kâğıt böceği](src/images/bugs/kagit-bocegi.webp)\n<script>alert(1)</script>\n\nSon not.');
  assert.equal((html.match(/<figure /g) || []).length, 2);
  assert.equal((html.match(/<p>/g) || []).length, 2);
  assert.match(html, /alt="Gümüş böceği &quot;yakın&quot; &lt;görünüm&gt;"/);
  assert.match(html, /href="src\/images\/bugs\/gumus-bocegi.webp" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /loading="lazy" decoding="async"/);
  assert.match(html, /<figcaption><strong>Gümüş böceği<\/strong><br><a href="https:\/\/example.com\/author"/);
  assert.match(html, /href="https:\/\/example.com\/license"/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(renderAnswer('![Ev çıyanı](src/images/bugs/ev-ciyani.webp)'), /<figcaption>Ev çıyanı<\/figcaption>/);
});

test('photo rendering rejects external images, executable URLs and paths outside the image directory', () => {
  for (const path of [
    'https://example.com/tracker.png', '//example.com/tracker.png',
    'javascript:alert(1)', 'data:image/svg+xml,<svg>',
    'src/images/../private.png', 'src/images/%2e%2e/private.png',
    'src/images/bugs/a.svg', 'src/images/a.webp?track=1',
    'src/images/a.webp"onerror="alert(1)'
  ]) assert.doesNotMatch(renderAnswer(`![Örnek](${path})`), /<img|<figure/);
});

test('published insect galleries include packaged images and keep file paths out of search excerpts', async () => {
  const images = [];
  for (const id of [146, 148, 149]) {
    const answer = faq.questions.find(question => question.id === id).answer;
    for (const match of answer.matchAll(/!\[[^\]]+\]\((src\/images\/[^)]+)\)/g)) {
      images.push(match[1]);
      const bytes = await readFile(new URL(`../${match[1]}`, import.meta.url));
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    }
  }
  assert.equal(images.length, 5);
  const matches = findMatches('Lepisma saccharina', searchIndex);
  assert.ok(matches.some(match => match.href === '#bocekler/soru-148'));
  assert.doesNotMatch(JSON.stringify(matches), /src\/images\/|!\[/);
});

test('tables keep column and row headings, inline formatting and escaped cell content', () => {
  const html = renderAnswer('Ölçüler\n\n| Eşya | Ölçü |\n| --- | --- |\n| <img src=x onerror=alert(1)> | **7 adet** |\n| Perde | [Kaynak](https://example.com) [x](javascript:alert(1)) |\n\nSon not.');
  assert.match(html, /<th scope="col">Eşya<\/th>/);
  assert.match(html, /<th scope="row">&lt;img src=x onerror=alert\(1\)&gt;<\/th>/);
  assert.match(html, /<td><strong>7 adet<\/strong><\/td>/);
  assert.match(html, /href="https:\/\/example.com"/);
  assert.doesNotMatch(html, /<img|href="javascript:/);
  assert.equal((html.match(/<p>/g) || []).length, 2);
  for (const invalid of [
    '| Eşya | Ölçü |\n| yanlış | --- |\n| Masa | 70 × 80 cm |',
    '| Eşya | Ölçü |\n| --- | --- |\n| Masa |',
    '| Eşya | Ölçü |\n| --- | --- |',
    'Eşya | Ölçü\nMasa | 70 × 80 cm'
  ]) assert.doesNotMatch(renderAnswer(invalid), /<table/);
});

test('night assistance and confirmed Apian 2 door hours are distinguished from Apian 1 access', () => {
  assert.match(faq.questions[19].answer, /Apian 2/);
  assert.match(faq.questions[19].answer, /21\.00–06\.00/);
  assert.match(faq.questions[19].answer, /10 €/);
  assert.match(faq.questions[19].answer, /2025/);
  assert.match(faq.questions[17].answer, /Apian 2’nin dış kapısı akşam 21\.00’de kilitleniyor, sabah 06\.00’da açılıyor/);
  assert.doesNotMatch(faq.questions[17].answer, /açık bırakıldı|yanıtı eklenecek/);
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

test('pharmacy comes first in the shopping topic without mixing Sunday market hours', () => {
  const shopping = topics.find(topic => topic.id === 'alisveris');
  assert.equal(shopping.sections[0], 'En yakın eczane');
  assert.deepEqual(shopping.questionIds[0], [103]);
  const pharmacies = topics.find(topic => topic.id === 'eczaneler');
  assert.deepEqual(sectionQuestionIds(pharmacies, 0), [103, 62]);
  assert.deepEqual(sectionQuestionIds(pharmacies, 2), [64]);
  assert.match(faq.questions[102].answer, /Pharao Apotheke/);
  assert.match(faq.questions[102].answer, /pazar günü kapalı/);
  assert.ok(findMatches('eczane', searchIndex).some(match => match.href === '#alisveris/soru-103'));
});

test('emergency contacts are discoverable and render safe dial links', () => {
  const emergency = faq.questions.find(question => question.id === 104);
  assert.equal(topics[0].id, 'acil-yardim');
  assert.ok(findMatches('116117', searchIndex).some(match => match.href === '#acil-yardim/soru-104'));
  const html = renderAnswer(emergency.answer);
  for (const number of ['112', '110', '116117', '+498919240']) {
    assert.ok(html.includes(`href="tel:${number}"`));
  }
  assert.match(emergency.answer, /Hayati tehlikede 116117 yerine 112’yi ara/);
  const unsafe = renderAnswer('[x](tel:112;ext=123) [x](tel:112"onclick="alert) [x](javascript:alert(1))');
  assert.ok(!unsafe.includes('<a '));
});


test('published guide copy has no chat or resident-attribution phrasing', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const indirectAttribution = /sakinlerin (?:paylaşımlarına|paylaştığı (?:bilgiye|bilgilere)|deneyimlerine) göre|söyleyen sakinler|gruptaki süreler|grupta .*paylaşım|sakin aktarımı|ham sohbet dökümü|rehberdeki mevcut/i;
  assert.doesNotMatch(source, indirectAttribution);
  assert.doesNotMatch(app, indirectAttribution);
  assert.doesNotMatch(readme, indirectAttribution);
  assert.match(faq.questions.find(question => question.id === 18).answer, /Apian 1’de çamaşırhane şimdilik gece de kullanılabiliyor/);
});
