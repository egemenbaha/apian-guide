import test from 'node:test';
import assert from 'node:assert/strict';
import { createChecklistStore } from '../src/checklist.js';
import { correctionUrl, renderCorrection } from '../src/corrections.js';
import { renderAnswer } from '../src/faq.js';
import { topics } from '../src/topics.js';
import { parseFaq } from '../scripts/generate-faq.mjs';
import { readFile } from 'node:fs/promises';

const faq = parseFaq(await readFile(new URL('../PROJECT_DESCRIPTION.md', import.meta.url), 'utf8'));

test('checklist storage survives reload, filters removed entries and supports clearing', () => {
  let value = null;
  const storage = { getItem: () => value, setItem: (_, next) => { value = next; } };
  const store = createChecklistStore(() => storage);
  assert.equal(store.save(['pillow', 'duvet', 'obsolete']), true);
  const restored = createChecklistStore(() => storage);
  assert.deepEqual([...restored.load(['duvet', 'pillow']).checked], ['pillow', 'duvet']);
  restored.save([]);
  assert.equal(restored.load(['pillow']).checked.size, 0);
  for (const invalid of ['null', '{}', '42', '[null,7,"pillow"]', 'broken']) {
    value = invalid;
    const fresh = createChecklistStore(() => storage);
    assert.doesNotThrow(() => fresh.load(['pillow']));
    assert.equal(fresh.save(['pillow']), true);
    assert.deepEqual([...fresh.load(['pillow']).checked], ['pillow']);
  }
});

test('blocked storage and write-only failures preserve progress during navigation', () => {
  for (const getStorage of [
    () => { throw new Error('blocked'); },
    () => ({ getItem: () => null, setItem: () => { throw new Error('quota'); } })
  ]) {
    const store = createChecklistStore(getStorage);
    store.load(['pillow']);
    assert.equal(store.save(['pillow']), false);
    const state = store.load(['pillow']);
    assert.deepEqual([...state.checked], ['pillow']);
    assert.equal(state.persisted, false);
  }
});

test('checklist cells escape HTML and retain stable keys when reordered', () => {
  const first = '- [ ] Yastık\n- [ ] <img src=x onerror=alert(1)>';
  const reversed = first.split('\n').reverse().join('\n');
  const options = { checklistPrefix: 'soru-113' };
  const html = renderAnswer(first, options);
  assert.equal((html.match(/type="checkbox"/g) || []).length, 2);
  assert.ok(html.includes('data-checklist-key="soru-113:Yastık"'));
  assert.ok(renderAnswer(reversed, options).includes('data-checklist-key="soru-113:Yastık"'));
  assert.doesNotMatch(html, /<img/);
  assert.doesNotMatch(renderAnswer(first), /type="checkbox"/);
});

test('packing page maps three groups to 17 unique actionable checklist items', () => {
  const topic = topics.find(topic => topic.id === 'tasinma-listesi');
  assert.equal(topic.checklist, true);
  assert.equal(topic.sections.length, 3);
  const html = topic.questionIds.flat().map(id => {
    const question = faq.questions.find(q => q.id === id);
    return renderAnswer(question.answer, { checklistPrefix: `soru-${id}` });
  }).join('');
  const keys = [...html.matchAll(/data-checklist-key="([^"]+)"/g)].map(match => match[1]);
  assert.equal(keys.length, 17);
  assert.equal(new Set(keys).size, 17);
});

test('every correction draft names the right canonical question and stays on GitHub', () => {
  for (const topic of topics) for (const id of topic.questionIds.flat()) {
    const question = faq.questions.find(q => q.id === id);
    const url = new URL(correctionUrl(topic.id, question));
    assert.equal(url.origin, 'https://github.com');
    assert.equal(url.pathname, '/egemenbaha/apian-guide/issues/new');
    assert.ok(url.searchParams.get('body').includes(`https://apianwiki.space/#${topic.id}/soru-${id}`));
    assert.ok(url.searchParams.get('title').startsWith('[Bilgi düzeltmesi] '));
    assert.ok(url.href.length < 4000);
  }
  assert.throws(() => correctionUrl('../bad', { id: 1, question: 'x' }));
  assert.throws(() => correctionUrl('oda', { id: -1, question: 'x' }));
  const question = { id: 52, question: 'Öğrenci & "örnek" <script>?' };
  assert.equal(new URL(correctionUrl('odemeler', question)).searchParams.get('title'), `[Bilgi düzeltmesi] ${question.question}`);
  assert.doesNotMatch(renderCorrection('odemeler', question), /<script>/);
  assert.match(renderCorrection('odemeler', question), /herkese açık/);
});
