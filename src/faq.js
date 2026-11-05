// Render the small Markdown subset used by the guide. Raw HTML stays plain text.
export function escapeHtml(text) {
  return text.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

export function renderInline(text) {
  const tokens = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let html = '';
  let position = 0;
  for (const match of text.matchAll(tokens)) {
    html += escapeHtml(text.slice(position, match.index));
    if (match[1]) html += `<a href="${escapeHtml(match[2])}" rel="noopener noreferrer">${escapeHtml(match[1])}</a>`;
    else if (match[3]) html += `<strong>${escapeHtml(match[3])}</strong>`;
    else html += `<em>${escapeHtml(match[4])}</em>`;
    position = match.index + match[0].length;
  }
  return html + escapeHtml(text.slice(position));
}

export function renderAnswer(answer) {
  return answer.split(/\n\s*\n/).map(paragraph => `<p>${renderInline(paragraph)}</p>`).join('');
}

export function normalize(text) {
  return text.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}

export function findMatches(query, topics, questions) {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const matches = text => terms.every(term => normalize(text).includes(term));
  const topicMatches = topics.filter(topic => matches([topic.title, ...topic.sections].join(' ')))
    .map(topic => ({ href: `#${topic.id}`, title: topic.title }));
  const questionMatches = questions.filter(question => matches(`${question.question} ${question.answer}`))
    .map(question => {
      const topic = topics.find(item => item.questionIds.flat().includes(question.id));
      return { href: `#${topic.id}/soru-${question.id}`, title: question.question };
    });
  return [...topicMatches, ...questionMatches];
}
