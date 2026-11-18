import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const bootstrap = html.match(/<script id="theme-init">([\s\S]*?)<\/script>/);

function initialTheme(savedTheme, storageBlocked = false) {
  const root = { dataset: {} };
  const meta = { content: '#ffffff' };
  runInNewContext(bootstrap[1], {
    document: { documentElement: root, querySelector: () => meta },
    localStorage: {
      getItem(key) {
        assert.equal(key, 'apian-color-theme');
        if (storageBlocked) throw new Error('Storage blocked');
        return savedTheme;
      },
    },
  });
  return { color: root.dataset.color, browserColor: meta.content };
}

test('the saved theme and critical background are applied before external styles and modules', () => {
  assert.ok(bootstrap);
  const stylesheet = html.indexOf('<link rel="stylesheet"');
  const background = html.indexOf('<style id="theme-background">');
  assert.ok(stylesheet >= 0 && background >= 0);
  assert.ok(bootstrap.index < stylesheet);
  assert.ok(background < stylesheet);
  assert.ok(bootstrap.index < html.indexOf('<script type="module"'));
  assert.deepEqual(initialTheme('dark'), { color: 'dark', browserColor: '#101418' });
  assert.match(html, /:root\[data-color="dark"\]\{background:#101418;color-scheme:dark\}/);
});

test('missing, invalid or inaccessible saved preferences safely use the light theme', () => {
  for (const preference of ['light', null, '', 'unexpected']) {
    assert.deepEqual(initialTheme(preference), { color: 'light', browserColor: '#ffffff' });
  }
  assert.deepEqual(initialTheme('dark', true), { color: 'light', browserColor: '#ffffff' });
});
