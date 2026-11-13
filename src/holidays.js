import { escapeHtml } from './faq.js';

// Fixed dates: Diyanet official holidays; German scope: Bavaria, including Unterföhring.
// Only local statutory German holidays and Turkish civic holidays / memorial days.
export const calendarEnd = '2027-12-31';
const deSource = 'https://www.stmi.bayern.de/staat-und-verfassung/feiertage/';
const trSource = 'https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=159';
const memorialSource = 'https://www.tavas.gov.tr/belirli-gun-ve-haftalar';
const closed = 'Bavyera · Münih / Unterföhring · Normal marketler kapalı';
const movableGerman = {
  2026: ['04-03', '04-06', '05-14', '05-25', '06-04'],
  2027: ['03-26', '03-29', '05-06', '05-17', '05-27']
};
const movableNames = ['Kutsal Cuma · Karfreitag', 'Paskalya Pazartesisi · Ostermontag',
  'İsa’nın Göğe Yükselişi · Christi Himmelfahrt', 'Pentekost Pazartesisi · Pfingstmontag',
  'İsa’nın Bedeni ve Kanı Bayramı · Fronleichnam'];

export const holidays = [2026, 2027].flatMap(year => {
  const events = [];
  const add = (day, title, region, note, source, end = day) => events.push({
    start: `${year}-${day}`, end: `${year}-${end}`, title, region, note, source
  });
  for (const [day, title, region] of [
    ['01-01', 'Yılbaşı · Neujahr', 'DE · TR'], ['01-06', 'Üç Krallar Günü · Heilige Drei Könige', 'DE'],
    ['05-01', 'Emek ve Dayanışma Günü · Tag der Arbeit', 'DE · TR'],
    ['08-15', 'Meryem’in Göğe Kabulü · Mariä Himmelfahrt', 'DE'],
    ['10-03', 'Alman Birliği Günü', 'DE'], ['11-01', 'Azizler Günü · Allerheiligen', 'DE']
  ]) add(day, title, region, closed, deSource);
  movableGerman[year].forEach((day, i) => add(day, movableNames[i], 'DE', closed, deSource));
  add('12-25', 'Noel · Weihnachten', 'DE', `${closed}. 24 Aralık’ta normal mağazalar 14.00’te kapanır.`, deSource, '12-26');
  for (const [day, title] of [
    ['04-23', 'Ulusal Egemenlik ve Çocuk Bayramı'], ['05-19', 'Atatürk’ü Anma, Gençlik ve Spor Bayramı'],
    ['07-15', 'Demokrasi ve Millî Birlik Günü'], ['08-30', 'Zafer Bayramı']
  ]) add(day, title, 'TR', 'Türkiye’de resmî tatil', trSource);
  add('10-28', 'Cumhuriyet Bayramı', 'TR', '29 Ekim · Türkiye’de tatil 28 Ekim 13.00’te başlar', trSource, '10-29');
  for (const [day, title] of [
    ['03-12', 'İstiklal Marşı’nın Kabulü ve Mehmet Akif Ersoy’u Anma Günü'],
    ['03-18', 'Çanakkale Zaferi ve Şehitleri Anma Günü'], ['11-10', 'Atatürk’ü Anma Günü']
  ]) add(day, title, 'TR', 'Anma günü · Resmî tatil değil', memorialSource);
  return events;
}).sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title, 'tr'));

export function berlinDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  const part = type => parts.find(item => item.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function upcomingHolidays(today = berlinDate(), limit = 5) {
  return holidays.filter(event => event.end >= today).slice(0, limit);
}
const dateLabel = date => new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
}).format(new Date(`${date}T12:00:00Z`));

export function renderHolidayTimeline(today = berlinDate()) {
  const events = upcomingHolidays(today);
  return `<section class="holiday-section" aria-labelledby="holiday-title">
    <h2 id="holiday-title">Yaklaşan tatiller ve önemli günler</h2>
    <p class="holiday-intro">Bavyera (Münih / Unterföhring) resmî tatilleri ve Türkiye’nin millî bayramları ve anma günleri.</p>
    ${events.length ? `<ol class="holiday-timeline">${events.map(event => {
      const ongoing = event.start <= today;
      const dates = `<time datetime="${event.start}">${escapeHtml(dateLabel(event.start))}</time>${event.end !== event.start ? ` – <time datetime="${event.end}">${escapeHtml(dateLabel(event.end))}</time>` : ''}`;
      return `<li${ongoing ? ' class="holiday-current"' : ''}><div class="holiday-date">${dates}${ongoing ? ' <span class="holiday-status">Bugün / devam ediyor</span>' : ''}</div><div class="holiday-heading"><span class="holiday-region">${event.region}</span><a href="${escapeHtml(event.source)}">${escapeHtml(event.title)}</a></div><p>${escapeHtml(event.note)}</p></li>`;
    }).join('')}</ol>` : '<p>Yeni dönem takvimi henüz eklenmedi. Güncel tarihler için resmî kaynaklara bakabilirsin.</p>'}
    <p class="holiday-footer"><a href="#tatiller">Alışveriş ve tatil rehberi</a> · <a href="${deSource}">Bavyera takvimi</a> · <a href="${trSource}">Türkiye resmî tatilleri</a>${today > calendarEnd ? '' : ' <span>Takvim: 2026–2027</span>'}</p>
  </section>`;
}
