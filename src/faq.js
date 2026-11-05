// Render the small Markdown subset used by the guide. Raw HTML stays plain text.
export function escapeHtml(text) {
  return text.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

export function renderInline(text) {
  const tokens = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|tel:\+?\d{3,15})\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
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

// Enhance standalone Google Maps place links; other Markdown uses the normal renderer.
export function renderMapLink(paragraph) {
  const match = paragraph.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/);
  if (!match) return null;
  let url;
  try { url = new URL(match[2]); } catch { return null; }
  if (url.origin !== 'https://www.google.com' || !url.pathname.startsWith('/maps/place/')) return null;
  const coordinates = url.pathname.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
  if (!coordinates) return null;
  const [latitude, longitude] = coordinates.slice(1).map(Number);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  const destination = `${latitude},${longitude}`;
  const embed = `https://maps.google.com/maps?q=${destination}&z=17&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  return `<aside class="location-card" aria-label="${escapeHtml(match[1])}">
    <div class="location-heading"><strong>${escapeHtml(match[1])}</strong><a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">Google Maps’te aç ↗</a></div>
    <details><summary>Haritayı göster</summary><iframe title="${escapeHtml(match[1])} haritası" src="${escapeHtml(embed)}" loading="lazy" referrerpolicy="no-referrer" allowfullscreen></iframe></details>
    <a class="directions-link" href="${escapeHtml(directions)}" target="_blank" rel="noopener noreferrer">Yol tarifi al ↗</a>
  </aside>`;
}

// Tables use pipe-delimited rows with a header and a separator; cells stay escaped.
function renderTable(paragraph) {
  const lines = paragraph.trim().split('\n').map(line => line.trim());
  if (lines.length < 3 || lines.some(line => !line.startsWith('|') || !line.endsWith('|'))) return null;
  const rows = lines.map(line => line.slice(1, -1).split('|').map(cell => cell.trim()));
  const [headings, separator, ...body] = rows;
  if (headings.length < 2 || rows.some(row => row.length !== headings.length) || separator.some(cell => !/^-{3,}$/.test(cell))) return null;
  const header = headings.map(heading => `<th scope="col">${renderInline(heading)}</th>`).join('');
  const content = body.map(row => `<tr><th scope="row">${renderInline(row[0])}</th>${row.slice(1).map(cell => `<td>${renderInline(cell)}</td>`).join('')}</tr>`).join('');
  return `<table class="faq-table"><thead><tr>${header}</tr></thead><tbody>${content}</tbody></table>`;
}

function renderChecklist(paragraph, prefix) {
  if (!prefix) return null;
  const lines = paragraph.trim().split('\n');
  if (!lines.every(line => /^- \[ \] .+/.test(line))) return null;
  return `<ul class="packing-list">${lines.map(line => {
    const text = line.slice(6);
    const key = `${prefix}:${text}`;
    return `<li><label><input type="checkbox" data-checklist-key="${escapeHtml(key)}"><span>${renderInline(text)}</span></label></li>`;
  }).join('')}</ul>`;
}

export function renderAnswer(answer, { checklistPrefix = '' } = {}) {
  return answer.split(/\n\s*\n/).map(paragraph => renderChecklist(paragraph, checklistPrefix) ?? renderTable(paragraph) ?? renderMapLink(paragraph) ?? `<p>${renderInline(paragraph)}</p>`).join('');
}
