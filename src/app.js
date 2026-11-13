// The build optionally adds the public Umami website ID to the feature settings.
const { forumEnabled = false, umamiWebsiteId } = await fetch(new URL('./features.json', import.meta.url)).then(response => response.json()).catch(() => ({}));
document.querySelector('.forum-link').hidden = forumEnabled !== true;
import { topics, sectionQuestionIds } from './topics.js';
import { faq } from './faq-data.js';
import { escapeHtml, renderInline, renderAnswer } from './faq.js';
import { checklistToolbar, mountChecklist } from './checklist.js';
import { renderCorrection, topicSuggestionUrl } from './corrections.js';
import { mountSearch } from './search-ui.js';
import { renderHolidayCalendar, berlinDate, shiftMonth } from './holidays.js';
import { startAnalytics } from './analytics.js';
const analytics = startAnalytics(umamiWebsiteId);
const memorial = document.querySelector('.memorial-banner');
if (memorial) {
  const memorialCopy = memorial.querySelector('.memorial-group').cloneNode(true);
  memorialCopy.setAttribute('aria-hidden', 'true');
  memorial.querySelector('.memorial-track').append(memorialCopy);
  memorial.dataset.ready = 'true';
  const memorialToggle = memorial.querySelector('.memorial-toggle');
  memorialToggle.hidden = false;
  memorialToggle.addEventListener('click', () => {
    const paused = memorial.dataset.paused !== 'true';
    memorial.dataset.paused = String(paused);
    const label = paused ? 'Kayan yazıyı sürdür' : 'Kayan yazıyı duraklat';
    memorialToggle.setAttribute('aria-label', label);
    memorialToggle.title = label;
    memorialToggle.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
  });
}
const questionsById = new Map(faq.questions.map(question => [question.id, question]));
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
const tabs = (title) => `<div class="page-tabs"><span class="tab-current">${title}</span>${forumEnabled === true ? '<a href="/forum/index.php?title=Talk:Forum">Tartışma</a>' : ''}<a href="#hakkinda">Rehber hakkında</a><span class="read-tab">Oku</span><span class="language">Türkçe</span></div>`;
const card = topic => `<li class="topic-card"><a href="#${topic.id}">${topic.title}</a><span class="card-sections">${topic.sections.slice(0, 3).join(' · ')}</span></li>`;
function home() {
  document.title = 'Apian Wiki — Apian’da yaşam rehberi';
  content.innerHTML = `<h1>Ana sayfa</h1>${tabs('Ana sayfa')}<p class="site-subtitle">Apian Wiki, Apian’da yaşam rehberi.</p>
  <section class="welcome" aria-labelledby="welcome-title"><h2 id="welcome-title"><strong>Apian Wiki</strong>’ye hoş geldiniz</h2><p>Apian sakinleri ve yeni taşınacak Türk öğrenciler için bilgi rehberi.</p><p class="welcome-meta">Apian 1 · Apian 2 · <a href="#konular">${topics.length} konu başlığı</a> · <a href="#acik-sorular">Açık sorular ve öneriler</a></p></section>
  ${renderHolidayCalendar()}
  <section id="konular" class="directory"><h2>Rehber konuları</h2><div class="portal-grid">${groups.map(group => `<section class="topic-group" data-group="${escapeHtml(group)}"><h3>${group}</h3><ul>${topics.filter(topic => topic.group === group).map(card).join('')}</ul></section>`).join('')}</div></section>
  ${forumEnabled === true ? '<section id="topluluk" class="about"><h2>Topluluk forumu</h2><p>Rehbere katkı sunmak, bilgi paylaşmak veya bir konuyu birlikte değerlendirmek için <a href="/forum/index.php?title=Talk:Forum">Apian Wiki forumuna katıl</a>. Konu açmak ve yanıt yazmak için giriş yapman gerekiyor.</p></section>' : ''}
  <section id="hakkinda" class="about"><h2>Rehber hakkında</h2><p>Apian’da yerleşme, günlük yaşam ve resmî işlemlere yönelik bağımsız bir bilgi rehberidir. Konulara soldaki içindekiler bölümünden veya arama alanından ulaşabilirsin.</p><p>Apian 1 ve Apian 2 bilgileri ayrı tutulur; kaynak bağlantıları ilgili yanıtların yanında yer alır. Bu proje yurt yönetiminin resmî yayını değildir.</p>
  ${umamiWebsiteId ? '<p>Hangi konuların okunduğunu ve arama sonuçlarının kaç kez açıldığını Umami ile sayıyoruz. Aradığın kelimeler ve taşınma listesindeki işaretlerin tarayıcında kalır. Tarayıcında Do Not Track veya Global Privacy Control açıksa ziyaretin ölçüme katılmaz.</p>' : ''}</section>
  <section id="acik-sorular" class="about">
    <h2>${faq.openQuestions.length === 1 ? 'Açık kalan soru' : 'Açık kalan sorular'}</h2>
    ${faq.openQuestions.length ? `<ul>${faq.openQuestions.map(question => `<li>${renderInline(question)}</li>`).join('')}</ul>` : '<p>Açık kalan soru bulunmuyor.</p>'}
    <p>Rehberde başka ne görmek istersin? Önerini GitHub hesabınla paylaşabilirsin. Gönderdiğin öneri herkese açık olur.</p>
    <a class="correction-link" href="${escapeHtml(topicSuggestionUrl)}" target="_blank" rel="noopener noreferrer">Yeni başlık öner</a>
  </section>
  <div class="category-box"><span>Konular:</span> Apian 1 <span class="category-divider">|</span> Apian 2 <span class="category-divider">|</span> Öğrenci yaşamı</div>`;
}
const guideSearch = mountSearch({
  root: document.querySelector('.global-search'), topics, questions: faq.questions,
  onSelect: match => {
    analytics?.searchResult();
    if (location.hash === match.href) render();
    document.querySelector('main').focus({ preventScroll: true });
  },
});
const themeToggle = document.querySelector('.theme-toggle');
function setColorTheme(color, save = true) {
  const dark = color === 'dark';
  document.documentElement.dataset.color = dark ? 'dark' : 'light';
  themeToggle.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
  themeToggle.querySelector('.theme-label').textContent = dark ? 'Açık mod' : 'Koyu mod';
  themeToggle.setAttribute('aria-label', dark ? 'Açık moda geç' : 'Koyu moda geç');
  themeToggle.title = themeToggle.getAttribute('aria-label');
  document.querySelectorAll('.appearance input[name="color"]').forEach(input => {
    input.checked = input.value === document.documentElement.dataset.color;
  });
  document.querySelector('meta[name="theme-color"]').content = dark ? '#101418' : '#ffffff';
  if (save) {
    try { localStorage.setItem('apian-color-theme', document.documentElement.dataset.color); }
    catch { /* Theme switching also works when browser storage is unavailable. */ }
  }
}
setColorTheme(document.documentElement.dataset.color, false);
themeToggle.hidden = false;
themeToggle.addEventListener('click', () => {
  setColorTheme(document.documentElement.dataset.color === 'dark' ? 'light' : 'dark');
});
document.querySelectorAll('.appearance input').forEach(input => input.addEventListener('change', () => {
  if (input.name === 'color') { setColorTheme(input.value); return; }
  document.documentElement.dataset[input.name.replace('-size', 'Size')] = input.value;
}));
function renderSection(topic, sectionIndex) {
  const ids = sectionQuestionIds(topic, sectionIndex);
  if (!ids.length) return '<p>İptal başvurunu ve üyeliğinin sona ereceği tarihi gösteren yazılı teyidi sakla. <a href="#abonelikler/soru-56">Üyelik iptali yanıtına git.</a></p>';
  const answers = ids.map(id => {
    const question = questionsById.get(id);
    return `<article class="faq-answer" id="soru-${id}"><h3>${escapeHtml(question.question)}</h3>${renderAnswer(question.answer, { checklistPrefix: topic.checklist ? `soru-${id}` : '' })}${renderCorrection(topic.id, question)}</article>`;
  }).join('');
  return answers;
}
function article(topic) {
  document.title = `${topic.title} — Apian Wiki`;
  const index = topics.indexOf(topic);
  const anchors = topic.sections.map((_, i) => `bolum-${topic.sectionNumbers?.[i] ?? (i + 1)}`);
  content.innerHTML = `<h1>${topic.title}</h1>${tabs('Konu')}<p class="site-subtitle">Apian Wiki, Apian’da yaşam rehberi.</p><p class="article-subtitle">${topic.group} / Sık sorulan sorular</p><nav class="article-toc" aria-label="Bu sayfada"><h2>İçindekiler</h2><ol>${topic.sections.map((section, i) => `<li><a href="#${topic.id}/${anchors[i]}">${section}</a></li>`).join('')}</ol></nav>${topic.checklist ? checklistToolbar() : ''}<div class="article-sections">${topic.sections.map((section, i) => `<section id="${anchors[i]}" class="empty-section"><h2>${section}</h2>${renderSection(topic, i)}</section>`).join('')}</div><nav class="article-pagination" aria-label="Diğer konular">${index > 0 ? `<a href="#${topics[index - 1].id}">← ${topics[index - 1].title}</a>` : '<a href="#">← Ana sayfa</a>'}${index < topics.length - 1 ? `<a href="#${topics[index + 1].id}">${topics[index + 1].title} →</a>` : '<a href="#">Ana sayfa →</a>'}</nav>`;
}
let currentTopic;
function render() {
  if (location.hash === '#abonelikler/bolum-2') {
    history.replaceState(history.state, '', '#abonelikler/soru-56');
  }
  const [id, sectionId] = location.hash.slice(1).split('/');
  if (id === 'main') { document.querySelector('main').focus(); return; }
  const topic = topics.find(topic => topic.id === id);
  const route = topic?.id ?? 'home';
  if (currentTopic !== route) {
    topic ? article(topic) : home();
    if (topic?.checklist) mountChecklist(content);
    currentTopic = route;
    analytics?.view(topic);
    window.scrollTo(0, 0);
    if (document.activeElement !== document.body) document.querySelector('main').focus({ preventScroll: true });
  }
  document.querySelectorAll('.sidebar a').forEach(link => {
    const active = topic ? link.hash === `#${topic.id}` : link.classList.contains('home-link');
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (!desktopMenu.matches) resetMenu();
  guideSearch.close();
  if (!id) window.scrollTo(0, 0);
  if (sectionId && /^(bolum|soru)-\d+$/.test(sectionId)) document.getElementById(sectionId)?.scrollIntoView();
  if (['konular', 'hakkinda', 'acik-sorular'].includes(id)) document.getElementById(id)?.scrollIntoView();
}
window.addEventListener('hashchange', render);
render();

// Refresh only the calendar when an open page crosses midnight in Munich.
let holidayDate = berlinDate();
function refreshHolidayTimeline() {
  const today = berlinDate();
  if (today === holidayDate) return;
  holidayDate = today;
  const section = document.querySelector('.holiday-section');
  if (section) section.outerHTML = renderHolidayCalendar(today, section.dataset.month);
}
setInterval(refreshHolidayTimeline, 60_000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refreshHolidayTimeline();
});

content.addEventListener('click', event => {
  const day = event.target.closest('[data-calendar-day]');
  if (day) {
    event.preventDefault();
    const target = document.getElementById(day.getAttribute('href').slice(1));
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest' });
    return;
  }
  const button = event.target.closest('[data-calendar-action]');
  if (!button) return;
  const section = button.closest('.holiday-section');
  const action = button.dataset.calendarAction;
  const today = berlinDate();
  const month = action === 'today' ? today.slice(0, 7) : shiftMonth(section.dataset.month, action === 'prev' ? -1 : 1);
  section.outerHTML = renderHolidayCalendar(today, month);
  content.querySelector(`[data-calendar-action="${action}"]`)?.focus({ preventScroll: true });
});
