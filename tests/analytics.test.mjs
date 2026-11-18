import test from 'node:test';
import assert from 'node:assert/strict';
import { startAnalytics } from '../src/analytics.js';

function makeBrowser() {
  const scripts = [];
  const events = [];
  const browser = {
    location: { hostname: 'apianwiki.space', hash: '#private', search: '?private=yes' },
    navigator: { language: 'tr' },
    document: {
      referrer: 'https://example.org/private?secret=1',
      createElement: () => ({ dataset: {} }),
      head: { append: script => scripts.push(script) },
    },
    umami: { track: payload => events.push(payload) },
  };
  return { browser, scripts, events };
}

test('topic views and search selections retain only guide-defined paths while the script loads', async () => {
  const { browser, scripts, events } = makeBrowser();
  const analytics = startAnalytics('public-test-id', browser);
  analytics.view();
  analytics.searchResult();
  analytics.view({ id: 'camasirhane', title: 'Çamaşırhane' });
  assert.equal(scripts[0].dataset.autoPageview, 'false');
  assert.equal(events.length, 0);
  scripts[0].onload();
  await Promise.resolve();
  assert.deepEqual(events.map(({ url, referrer, name }) => [url, referrer, name]), [
    ['/', 'https://example.org', undefined],
    ['/', 'https://example.org', 'search-result-opened'],
    ['/konu/camasirhane', '/', undefined],
  ]);
  assert.doesNotMatch(JSON.stringify(events), /private|secret/);
});

test('unconfigured sites, previews and opt-outs load no tracker', () => {
  for (const [id, host, privacy] of [
    [undefined, 'apianwiki.space', {}],
    ['id', 'preview.vercel.app', {}],
    ['id', 'apianwiki.space', { doNotTrack: '1' }],
    ['id', 'apianwiki.space', { globalPrivacyControl: true }],
  ]) {
    const { browser, scripts } = makeBrowser();
    browser.location.hostname = host;
    Object.assign(browser.navigator, privacy);
    assert.equal(startAnalytics(id, browser), null);
    assert.equal(scripts.length, 0);
  }
});
