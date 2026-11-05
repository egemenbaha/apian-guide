import { topics } from './topics.js';
const content = document.querySelector('#page-content');
const nav = document.querySelector('#topic-nav');
const toggle = document.querySelector('.menu-toggle');
const groups = [...new Set(topics.map(topic => topic.group))];
nav.innerHTML = groups.map(group => `<div class="nav-group"><p>${group}</p>${topics.filter(topic => topic.group === group).map(topic => `<a href="#${topic.id}">${topic.title}</a>`).join('')}</div>`).join('');
toggle.hidden = false;
const desktopMenu = window.matchMedia('(min-width: 901px)');
function resetMenu() {
  toggle.setAttribute('aria-expanded', String(desktopMenu.matches));
  toggle.setAttribute('aria-label', desktopMenu.matches ? 'Ana menüyü gizle' : 'Ana menüyü aç');
  document.querySelector('.sidebar').classList.remove('is-open', 'is-collapsed');
}
desktopMenu.addEventListener('change', resetMenu);
resetMenu();
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', expanded ? 'Ana menüyü gizle' : 'Ana menüyü aç');
  document.querySelector('.sidebar').classList.toggle('is-open', !desktopMenu.matches && expanded);
  document.querySelector('.sidebar').classList.toggle('is-collapsed', desktopMenu.matches && !expanded);
});
const tabs = (title) => `<div class="page-tabs"><span class="tab-current">${title}</span><a href="#hakkinda">Rehber hakkında</a><span class="read-tab">Oku</span><span class="language">Türkçe</span></div>`;
const card = topic => `<li class="topic-card"><a href="#${topic.id}">${topic.title}</a><span class="card-sections">${topic.sections.slice(0, 3).join(' · ')}</span></li>`;
function home() {
  document.title = 'Apian Guide — Apian’da yaşam rehberi';
  content.innerHTML = `<h1>Ana sayfa</h1>${tabs('Ana sayfa')}<p class="site-subtitle">Apian Guide, sakinlerin bilgi rehberi.</p>
  <section class="welcome" aria-labelledby="welcome-title"><h2 id="welcome-title"><strong>Apian Guide</strong>’a hoş geldiniz</h2><p>Apian sakinleri ve yeni taşınacak öğrenciler için Türkçe bilgi rehberi.</p><p class="welcome-meta">Apian 1 · Apian 2 · <a href="#konular">${topics.length} konu başlığı</a></p></section>
  <aside class="notice"><strong>Rehber hazırlanıyor.</strong> Şimdilik yalnızca konu başlıkları ve bölümler yer alıyor. Sık sorulan sorular ve yanıtlar daha sonra eklenecek.</aside>
  <section id="konular" class="directory"><h2>Rehber konuları</h2><div class="portal-grid">${groups.map(group => `<section class="topic-group"><h3>${group}</h3><ul>${topics.filter(topic => topic.group === group).map(card).join('')}</ul></section>`).join('')}</div></section>
  <section id="hakkinda" class="about"><h2>Rehber hakkında</h2><p>Apian’da yerleşme, günlük yaşam ve resmî işlemlere yönelik bağımsız bir bilgi rehberidir. Konulara soldaki içindekiler bölümünden veya arama alanından ulaşabilirsin.</p><p>Apian 1 ve Apian 2 bilgileri ayrı tutulacak; içeriklere kaynaklar ve doğrulama tarihleri eklenecek. Bu proje yurt yönetiminin resmî yayını değildir.</p></section><div class="category-box"><span>Konular:</span> Apian 1 <span class="category-divider">|</span> Apian 2 <span class="category-divider">|</span> Öğrenci yaşamı</div>`;
}
function normalize(text) {
  return text.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}
const search = document.querySelector('#topic-search');
const results = document.querySelector('#search-results');
function searchTopics() {
  const query = normalize(search.value.trim());
  results.replaceChildren();
  results.hidden = !query;
  const matches = query ? topics.filter(topic => normalize([topic.title, ...topic.sections].join(' ')).includes(query)) : [];
  for (const topic of matches) {
    const link = document.createElement('a');
    link.href = `#${topic.id}`;
    link.textContent = topic.title;
    link.addEventListener('click', () => { results.hidden = true; });
    results.append(link);
  }
  if (query && !matches.length) {
    const message = document.createElement('p');
    message.textContent = 'Eşleşen konu bulunamadı.';
    results.append(message);
  }
  document.querySelector('#search-status').textContent = query ? `${matches.length} konu bulundu.` : '';
}
search.addEventListener('input', searchTopics);
search.addEventListener('focus', () => { if (search.value.trim()) searchTopics(); });
search.addEventListener('keydown', event => { if (event.key === 'Escape') results.hidden = true; });
document.querySelector('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  searchTopics();
  results.querySelector('a')?.focus();
});
document.addEventListener('click', event => { if (!event.target.closest('.global-search')) results.hidden = true; });
document.querySelectorAll('.appearance input').forEach(input => input.addEventListener('change', () => {
  document.documentElement.dataset[input.name.replace('-size', 'Size')] = input.value;
}));
function article(topic) {
  document.title = `${topic.title} — Apian Guide`;
  const index = topics.indexOf(topic);
  content.innerHTML = `<h1>${topic.title}</h1>${tabs('Konu')}<p class="site-subtitle">Apian Guide, sakinlerin bilgi rehberi.</p><p class="article-subtitle">${topic.group} / Sık sorulan sorular</p><aside class="notice"><strong>Bu bölüm hazırlanıyor.</strong> Sorular ve yanıtlar daha sonra eklenecek.</aside><nav class="article-toc" aria-label="Bu sayfada"><h2>İçindekiler</h2><ol>${topic.sections.map((section, i) => `<li><a href="#${topic.id}/bolum-${i + 1}">${section}</a></li>`).join('')}</ol></nav><div class="article-sections">${topic.sections.map((section, i) => `<section id="bolum-${i + 1}" class="empty-section"><h2>${section}</h2><p class="empty-copy">İçerik eklenecek.</p></section>`).join('')}</div><nav class="article-pagination" aria-label="Diğer konular">${index > 0 ? `<a href="#${topics[index - 1].id}">← ${topics[index - 1].title}</a>` : '<a href="#">← Ana sayfa</a>'}${index < topics.length - 1 ? `<a href="#${topics[index + 1].id}">${topics[index + 1].title} →</a>` : '<a href="#">Ana sayfa →</a>'}</nav>`;
}
let currentTopic;
function render() {
  const [id, sectionId] = location.hash.slice(1).split('/');
  if (id === 'main') { document.querySelector('main').focus(); return; }
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
  if (!desktopMenu.matches) resetMenu();
  results.hidden = true;
  if (!id) window.scrollTo(0, 0);
  if (sectionId && /^bolum-\d+$/.test(sectionId)) document.getElementById(sectionId)?.scrollIntoView();
  if (id === 'konular' || id === 'hakkinda') document.getElementById(id)?.scrollIntoView();
}
window.addEventListener('hashchange', render);
render();
