import { createSearchIndex, findMatches, highlightSegments } from './search.js';

const PREVIEW_LIMIT = 8;

function highlightedElement(tag, className, text, matchedWords) {
  const element = document.createElement(tag);
  element.className = className;
  for (const segment of highlightSegments(text, matchedWords)) {
    if (!segment.matched) { element.append(document.createTextNode(segment.text)); continue; }
    const mark = document.createElement('mark');
    mark.textContent = segment.text;
    element.append(mark);
  }
  return element;
}

/** Mount local search with ranked previews and native-link keyboard navigation. */
export function mountSearch({ root, topics, questions, onSelect }) {
  const input = root.querySelector('input');
  const panel = root.querySelector('#search-results');
  const status = root.querySelector('#search-status');
  const submit = root.querySelector('button[type="submit"]');
  const index = createSearchIndex(topics, questions);
  let matches = [];
  let showAll = false;

  function close() {
    panel.hidden = true;
    submit.setAttribute('aria-expanded', 'false');
  }

  function render() {
    panel.replaceChildren();
    if (!input.value.trim()) { close(); status.textContent = ''; return; }
    panel.hidden = false;
    submit.setAttribute('aria-expanded', 'true');
    const summary = document.createElement('p');
    summary.className = 'search-summary';
    const count = matches.length;
    summary.textContent = count ? `${count} sonuç${count > PREVIEW_LIMIT && !showAll ? ` · İlk ${PREVIEW_LIMIT} sonuç` : ''}` : 'Aramayı biraz değiştirelim';
    panel.append(summary);
    status.textContent = count ? `${count} sonuç bulundu. Sonuçlara geçmek için aşağı ok tuşunu kullanabilirsin.` : 'Eşleşme bulunamadı. Daha kısa bir ifadeyle deneyebilirsin.';
    if (matches.some(match => match.approximate)) {
      const hint = document.createElement('p');
      hint.className = 'search-hint';
      hint.textContent = 'Yazımına yakın eşleşmeleri gösteriyorum.';
      panel.append(hint);
    }
    for (const match of showAll ? matches : matches.slice(0, PREVIEW_LIMIT)) {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = match.href;
      const label = document.createElement('span');
      label.className = 'search-context';
      label.textContent = match.label;
      link.append(label, highlightedElement('strong', 'search-title', match.title, match.matchedWords), highlightedElement('span', 'search-excerpt', match.excerpt, match.matchedWords));
      link.addEventListener('click', () => { close(); onSelect?.(match); });
      panel.append(link);
    }
    if (!count) {
      const hint = document.createElement('p');
      hint.textContent = 'Bir iki anahtar kelime yeterli. Örneğin “pazar açık”, “wifi” veya “bozuk para” yazabilirsin.';
      panel.append(hint);
    } else if (count > PREVIEW_LIMIT && !showAll) {
      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'search-more';
      more.textContent = `${count} sonucun tamamını göster`;
      more.addEventListener('click', () => { showAll = true; render(); panel.querySelectorAll('a')[PREVIEW_LIMIT]?.focus(); });
      panel.append(more);
    }
  }

  function update() {
    matches = findMatches(input.value, index);
    showAll = false;
    render();
    panel.scrollTop = 0;
  }

  input.addEventListener('input', event => { if (!event.isComposing) update(); });
  input.addEventListener('compositionend', update);
  input.addEventListener('focus', update);
  root.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (event.key === 'Escape') { input.focus(); close(); event.preventDefault(); return; }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const inInput = event.target === input;
    if (inInput && ['Home', 'End'].includes(event.key)) return;
    if (panel.hidden && inInput) update();
    const links = [...panel.querySelectorAll('a')];
    if (panel.hidden || !links.length) return;
    const current = links.indexOf(document.activeElement);
    let next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = links.length - 1;
    else if (inInput || current < 0) next = event.key === 'ArrowDown' ? 0 : links.length - 1;
    else next = (current + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    links[next].focus();
    event.preventDefault();
  });
  root.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    update();
    panel.querySelector('a')?.focus();
  });
  // A pointer click can blur to body before a button fires (notably in WebKit).
  // Close for a known outside focus target; the click handler handles background clicks.
  root.addEventListener('focusout', event => {
    if (event.relatedTarget && !root.contains(event.relatedTarget)) close();
  });
  document.addEventListener('click', event => { if (!event.composedPath().includes(root)) close(); });
  return { close };
}
