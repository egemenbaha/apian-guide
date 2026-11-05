import { topics } from './topics.js';
const content = document.querySelector('#page-content');
const nav = document.querySelector('#topic-nav');
const toggle = document.querySelector('.menu-toggle');
const groups = [...new Set(topics.map(topic => topic.group))];
nav.innerHTML = groups.map(group => `<div class="nav-group"><p>${group}</p>${topics.filter(topic => topic.group === group).map(topic => `<a href="#${topic.id}">${topic.title}</a>`).join('')}</div>`).join('');
toggle.hidden = false;
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(expanded));
  document.querySelector('.sidebar').classList.toggle('is-open', expanded);
});
const card = topic => `<a class="topic-card" href="#${topic.id}"><span class="card-title">${topic.title}<span aria-hidden="true">↗</span></span><span class="card-sections">${topic.sections.slice(0, 3).join(' · ')}</span></a>`;
function home() {
  document.title = 'Apian Guide — Apian’da yaşam rehberi';
  content.innerHTML = `<section class="intro" aria-labelledby="welcome-title"><p class="eyebrow">Apian’da yaşam</p><h1 id="welcome-title">Yeni bir oda.<br>Tanıdık bir rehber.</h1><p class="intro-copy">Yeni taşınanlar ve burada yaşayanlar için Apian’a dair Türkçe bilgi rehberi. Aradığın konuya buradan ulaşabilirsin.</p><a class="primary-link" href="#konular">Rehber konularına göz at <span aria-hidden="true">↓</span></a><div class="building-stamp" aria-hidden="true"><span>APIAN</span><div class="building">${'<i></i>'.repeat(12)}</div><small>1 &amp; 2</small></div></section>
  <aside class="notice"><strong>Rehber hazırlanıyor</strong><p>Şimdilik konu başlıklarını ve bölümleri gezebilirsin. Sık sorulan sorular ve yanıtlar daha sonra eklenecek.</p></aside>
  <section id="konular" class="directory" aria-labelledby="directory-title"><div class="directory-heading"><div><p class="eyebrow">İçindekiler</p><h2 id="directory-title">Nereden başlamak istersin?</h2></div><span class="topic-count">${topics.length} konu</span></div><label class="search"><span aria-hidden="true">⌕</span><span class="sr-only">Konu başlıklarında ara</span><input id="topic-search" type="search" placeholder="Konu başlıklarında ara" autocomplete="off"></label><div id="topic-results">${groups.map(group => `<section class="topic-group" data-group><h3>${group}</h3><div class="card-grid">${topics.filter(topic => topic.group === group).map(card).join('')}</div></section>`).join('')}</div><p id="search-status" class="search-status" role="status"></p></section>
  <section class="about"><h2>Bu rehber hakkında</h2><p>Apian 1 ve Apian 2 sakinleri için hazırlanan bağımsız bir bilgi kaynağı. İçerikler eklendikçe bina bilgileri, kaynaklar ve doğrulama tarihleri ayrı ayrı belirtilecek.</p></section>`;
  const search = document.querySelector('#topic-search');
  search.addEventListener('input', () => {
    const query = normalize(search.value.trim());
    let total = 0;
    for (const group of document.querySelectorAll('[data-group]')) {
      let visible = 0;
      for (const item of group.querySelectorAll('.topic-card')) {
        const topic = topics.find(topic => item.hash === `#${topic.id}`);
        item.hidden = !normalize([topic.title, ...topic.sections].join(' ')).includes(query);
        if (!item.hidden) visible++;
      }
      group.hidden = visible === 0;
      total += visible;
    }
    document.querySelector('#search-status').textContent = query ? (total ? `${total} konu bulundu.` : 'Eşleşen konu bulunamadı. Başka bir başlık deneyebilirsin.') : '';
  });
}
function normalize(text) {
  return text.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}
function article(topic) {
  document.title = `${topic.title} — Apian Guide`;
  const index = topics.indexOf(topic);
  content.innerHTML = `<nav class="breadcrumb" aria-label="Sayfa yolu"><a href="#">Ana sayfa</a><span aria-hidden="true">/</span><span>${topic.title}</span></nav><header class="article-header"><p class="eyebrow">${topic.group}</p><h1>${topic.title}</h1><p class="article-subtitle">Sık sorulan sorular</p></header><aside class="notice"><strong>Bu bölüm hazırlanıyor</strong><p>Sorular ve yanıtlar daha sonra eklenecek.</p></aside><nav class="article-toc" aria-label="Bu sayfada"><h2>Bu sayfada</h2>${topic.sections.map((section, i) => `<a href="#${topic.id}/bolum-${i + 1}">${section}</a>`).join('')}</nav><div class="article-sections">${topic.sections.map((section, i) => `<section id="bolum-${i + 1}" class="empty-section"><h2>${section}</h2><p>İçerik eklenecek.</p></section>`).join('')}</div><nav class="article-pagination" aria-label="Diğer konular">${index > 0 ? `<a href="#${topics[index - 1].id}"><small>← Önceki konu</small>${topics[index - 1].title}</a>` : '<span></span>'}${index < topics.length - 1 ? `<a href="#${topics[index + 1].id}"><small>Sonraki konu →</small>${topics[index + 1].title}</a>` : '<a href="#">Ana sayfaya dön ↑</a>'}</nav>`;
}
let currentTopic;
function render() {
  const [id, sectionId] = location.hash.slice(1).split('/');
  if (id === 'main') {
    document.querySelector('main').focus();
    return;
  }
  const topic = topics.find(topic => topic.id === id);
  const route = topic?.id ?? 'home';
  if (currentTopic !== route) {
    topic ? article(topic) : home();
    currentTopic = route;
    window.scrollTo(0, 0);
    if (document.activeElement !== document.body) document.querySelector('main').focus({ preventScroll: true });
  }
  document.querySelectorAll('.sidebar a').forEach(link => {
    const active = topic ? link.hash === `#${topic.id}` : link.classList.contains('home-link');
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  toggle.setAttribute('aria-expanded', 'false');
  document.querySelector('.sidebar').classList.remove('is-open');
  if (sectionId && /^bolum-\d+$/.test(sectionId)) document.getElementById(sectionId)?.scrollIntoView();
  if (id === 'konular') document.getElementById('konular')?.scrollIntoView();
}
window.addEventListener('hashchange', render);
render();
