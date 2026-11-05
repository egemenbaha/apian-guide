import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseFaq } from '../scripts/generate-faq.mjs';
import { topics } from '../src/topics.js';
import { createSearchIndex, findMatches, highlightSegments, normalize } from '../src/search.js';

const faq = parseFaq(await readFile(new URL('../PROJECT_DESCRIPTION.md', import.meta.url), 'utf8'));
const index = createSearchIndex(topics, faq.questions);
const search = query => findMatches(query, index);

test('natural questions ignore filler words and rank the requested subject first', () => {
  assert.equal(search('pazar gunu nereler acik?')[0].href, '#alisveris/soru-101');
  assert.equal(search('wifi calismiyor')[0].href, '#internet/soru-13');
  assert.equal(search('Apian2 sineklik')[0].href, '#oda-donanimi/soru-8');
  assert.equal(search('nerede print alabilirim')[0].href, '#resmi-islemler/soru-126');
});

test('small typos and letter swaps find relevant answers and are labelled approximate', () => {
  for (const [query, href] of [
    ['sineklki', '#oda-donanimi/soru-8'],
    ['anmeldng', '#resmi-islemler/soru-44'],
    ['deustchlandticket', '#abonelikler/soru-116'],
    ['ecznane', '#alisveris/soru-103'],
  ]) {
    const results = search(query);
    assert.ok(results.slice(0, 4).some(result => result.href === href), query);
    assert.ok(results.every(result => result.approximate), query);
  }
  assert.ok(search('sineklik').every(result => !result.approximate));
});

test('Turkish suffixes, everyday aliases and German letters work without fuzzy short names', () => {
  assert.ok(search('eczaneye').some(result => result.href === '#alisveris/soru-103'));
  assert.ok(search('Kaution').some(result => result.href === '#cikis/soru-38'));
  assert.ok(search('gym').some(result => result.href === '#abonelikler/soru-100'));
  assert.ok(search('Bäckerei').some(result => result.href === '#alisveris/soru-133'));
  assert.equal(normalize('SİNEKLİK Wi-Fi Straße'), 'sineklik wifi strasse');
  assert.equal(search('N26')[0].href, '#bankalar/soru-87');
  assert.ok(search('dm').some(result => result.href === '#alisveris/soru-131'));
  assert.deepEqual(search('N27'), []);
  assert.deepEqual(search('116118'), []);
});

test('all meaningful terms are required and URL text does not create false matches', () => {
  assert.deepEqual(search('sineklik zzzzzzz'), []);
  assert.deepEqual(search('sineklik 999999'), []);
  assert.deepEqual(search('javascript alert'), []);
  for (const query of ['', '   ', '???', 've ile icin', 'z'.repeat(5000)]) assert.deepEqual(search(query), []);
  const fixture = createSearchIndex([{ id: 'test', title: 'Konu', sections: ['Yanıtlar'], questionIds: [[1, 2]] }], [
    { id: 1, question: 'Apian 1 ölçüleri', answer: 'Oda genişliği 2 metre. [Kaynak](https://sadeceurlkelimesi.example/)' },
    { id: 2, question: 'Apian 2 ölçüleri', answer: 'Odada ölçü aldık.' },
  ]);
  assert.deepEqual(findMatches('sadeceurlkelimesi', fixture), []);
  assert.deepEqual(findMatches('Apian 2 ölçü', fixture).map(result => result.href), ['#test/soru-2']);
  const days = createSearchIndex([{ id: 'days', title: 'Günler', sections: ['Saatler'], questionIds: [[1, 2]] }], [
    { id: 1, question: 'Pazartesi', answer: '09.00–18.00' },
    { id: 2, question: 'Pazar', answer: '07.30–17.30' },
  ]);
  assert.deepEqual(findMatches('pazar', days).map(result => result.href), ['#days/soru-2']);
});

test('exact titles outrank incidental answer mentions and snippets contain useful text', () => {
  const fixture = createSearchIndex([{ id: 'test', title: 'Genel', sections: ['Konular'], questionIds: [[1, 2]] }], [
    { id: 1, question: 'Başka konu', answer: 'Sineklik ölçüsü için bir bağlantı var.' },
    { id: 2, question: 'Sineklik ölçüsü', answer: '**120 × 110 cm**. [Detaylar](https://example.com)' },
  ]);
  const results = findMatches('sineklik ölçüsü', fixture);
  assert.equal(results[0].href, '#test/soru-2');
  assert.equal(results[0].excerpt, '120 × 110 cm. Detaylar');
  const coins = search('bozuk para').find(result => result.href === '#bozuk-para/soru-90');
  assert.match(coins.excerpt, /Dream-Bowl/);
  assert.match(search('pazar gunu nereler acik')[0].excerpt, /^Pazar günü/);
  assert.match(search('Apian2 sineklik')[0].excerpt, /Apian 2’de ölçülen sineklik/);
  for (const result of search('pazar')) {
    assert.ok(result.excerpt.length <= 182);
    assert.doesNotMatch(result.excerpt, /https?:|\*\*/);
  }
});

test('highlighting preserves original Turkish text and keeps markup inert as text', () => {
  const text = 'SİNEKLİK ölçüsü <img src=x onerror=alert(1)>';
  const segments = highlightSegments(text, ['sineklik', 'olcusu']);
  assert.equal(segments.map(segment => segment.text).join(''), text);
  assert.deepEqual(segments.filter(segment => segment.matched).map(segment => segment.text), ['SİNEKLİK', 'ölçüsü']);
  assert.deepEqual(highlightSegments('Wi-Fi bağlantısı', ['wifi']).filter(segment => segment.matched).map(segment => segment.text), ['Wi-Fi']);
});
