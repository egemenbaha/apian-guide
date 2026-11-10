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

// Enhance standalone Google Maps place/address links; other Markdown stays unchanged.
export function renderMapLink(paragraph) {
  const match = paragraph.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/);
  if (!match) return null;
  let url;
  try { url = new URL(match[2]); } catch { return null; }
  if (url.origin !== 'https://www.google.com') return null;
  let destination;
  if (url.pathname.startsWith('/maps/place/')) {
    const coordinates = url.pathname.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
    if (!coordinates) return null;
    const [latitude, longitude] = coordinates.slice(1).map(Number);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
    destination = `${latitude},${longitude}`;
  } else if (/^\/maps\/search\/?$/.test(url.pathname) && url.searchParams.get('api') === '1') {
    const address = url.searchParams.get('query')?.trim();
    if (!address) return null;
    destination = encodeURIComponent(address);
  } else return null;
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

// Consecutive local Markdown images and their caption lines form a photo gallery.
function renderPhotoGallery(paragraph) {
  const photos = paragraph.trim().split(/\n(?=!\[)/).map(block => {
    const [image, ...caption] = block.split('\n');
    const match = image.match(/^!\[([^\]\n]+)\]\((src\/images\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(?:webp|jpe?g|png))\)$/);
    if (!match) return null;
    const [, alt, source] = match;
    return `<figure class="faq-photo">
      <a class="faq-photo-link" href="${source}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(alt)} — fotoğrafı büyüt (yeni sekme)">
        <img src="${source}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">
        <span class="faq-photo-zoom" aria-hidden="true">Fotoğrafı büyüt ↗</span>
      </a>
      <figcaption>${caption.length ? caption.map(renderInline).join('<br>') : escapeHtml(alt)}</figcaption>
    </figure>`;
  });
  if (photos.some(photo => photo === null)) return null;
  return `<div class="faq-photo-gallery">${photos.join('')}</div>`;
}

export function renderAnswer(answer, { checklistPrefix = '' } = {}) {
  return answer.split(/\n\s*\n/).map(paragraph => renderChecklist(paragraph, checklistPrefix) ?? renderTable(paragraph) ?? renderMapLink(paragraph) ?? renderPhotoGallery(paragraph) ?? `<p>${renderInline(paragraph)}</p>`).join('');
}
