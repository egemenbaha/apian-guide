import { escapeHtml } from './faq.js';

// Open a draft on GitHub; only the visitor can submit it there.
export function correctionUrl(topicId, question) {
  if (!/^[a-z0-9-]+$/.test(topicId) || !Number.isSafeInteger(question.id) || question.id < 1) {
    throw new Error('Invalid correction destination.');
  }
  const url = new URL('https://github.com/egemenbaha/apian-guide/issues/new');
  const guideUrl = `https://apian-guide.vercel.app/#${topicId}/soru-${question.id}`;
  url.searchParams.set('title', `[Bilgi düzeltmesi] ${question.question.slice(0, 120)}`);
  url.searchParams.set('body', `### İlgili yanıt\n${guideUrl}\n\n### Ne değişmeli?\n\n\n### Önerdiğin doğru bilgi\n\n\n### Kaynak veya açıklama\nVarsa bağlantı ekleyebilirsin.\n`);
  return url.href;
}

export function renderCorrection(topicId, question) {
  return `<details class="correction">
    <summary>Düzeltme öner</summary>
    <p>Bu yanıtla ilgili önerini GitHub’da paylaşabilirsin. GitHub hesabı gerekir; önerin herkese açık görünür. Egemen veya Arda inceledikten sonra rehbere işlenir.</p>
    <a class="correction-link" href="${escapeHtml(correctionUrl(topicId, question))}" target="_blank" rel="noopener noreferrer">GitHub’da öneri yaz ↗</a>
  </details>`;
}
