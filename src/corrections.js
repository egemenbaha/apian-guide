import { escapeHtml } from './faq.js';

// GitHub opens these as drafts for visitors to review and submit.
function issueDraftUrl(title, body) {
  const url = new URL('https://github.com/egemenbaha/apian-guide/issues/new');
  url.searchParams.set('title', title);
  url.searchParams.set('body', body);
  return url.href;
}

export const topicSuggestionUrl = issueDraftUrl(
  '[Yeni başlık] ',
  '### Rehberde hangi konu yer alsın?\n\n\n### Bu başlık hangi soruya yanıt versin?\n\n',
);

export function correctionUrl(topicId, question) {
  if (!/^[a-z0-9-]+$/.test(topicId) || !Number.isSafeInteger(question.id) || question.id < 1) {
    throw new Error('Invalid correction destination.');
  }
  const guideUrl = `https://apianwiki.space/#${topicId}/soru-${question.id}`;
  return issueDraftUrl(
    `[Bilgi düzeltmesi] ${question.question.slice(0, 120)}`,
    `### İlgili yanıt\n${guideUrl}\n\n### Ne değişmeli?\n\n\n### Önerdiğin doğru bilgi\n\n\n### Kaynak veya açıklama\nVarsa bağlantı ekleyebilirsin.\n`,
  );
}

export function renderCorrection(topicId, question) {
  return `<details class="correction">
    <summary>Düzeltme öner</summary>
    <p>Bu yanıtla ilgili önerini GitHub’da paylaşabilirsin. GitHub hesabı gerekir; önerin herkese açık görünür. Egemen veya Arda inceledikten sonra rehbere işlenir.</p>
    <a class="correction-link" href="${escapeHtml(correctionUrl(topicId, question))}" target="_blank" rel="noopener noreferrer">GitHub’da öneri yaz ↗</a>
  </details>`;
}
