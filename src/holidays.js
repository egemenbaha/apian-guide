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
  const christmasNote = year === 2026
    ? '24 Aralık Perşembe en geç 14.00’te kapanış. 25–26 Aralık Noel tatili, 27 Aralık pazar: normal marketler üç gün üst üste kapalı. 28 Aralık Pazartesi yeniden açılır; şube saatini kontrol et.'
    : '24 Aralık Cuma en geç 14.00’te kapanış. 25–26 Aralık Noel tatili: normal marketler kapalı. 27 Aralık Pazartesi yeniden açılır; şube saatini kontrol et.';
  add('12-25', 'Noel · Weihnachten', 'DE', christmasNote, 'https://www.gesetze-bayern.de/Content/Document/BayLadSchlG-2', '12-26');
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

// Shopping notes are clickable calendar dates, not additional public holidays.
export const shoppingNotes = [2026, 2027].map(year => ({
  start: `${year}-12-24`, end: `${year}-12-24`, region: 'DE',
  title: 'Noel arifesi · Marketler en geç 14.00’te kapanır',
  note: 'Tam gün resmî tatil değil. Normal marketler en geç 14.00’te kapanır; şuben daha erken kapatabilir. Noel alışverişini önceden tamamla.',
  source: 'https://www.gesetze-bayern.de/Content/Document/BayLadSchlG-2'
})).concat([{
  start: '2026-12-27', end: '2026-12-27', region: 'DE',
  title: 'Noel sonrası pazar · Marketler kapalı',
  note: '27 Aralık ayrı bir resmî tatil değil; pazar kapanışı geçerli. 25–27 Aralık boyunca normal marketler üç gün üst üste kapalı. 28 Aralık Pazartesi normal açılış düzenine dönülür; şube saatini kontrol et.',
  source: 'https://www.gesetze-bayern.de/Content/Document/BayLadSchlG-2'
}]);

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

export function shiftMonth(month, offset) {
  const [year, number] = month.split('-').map(Number);
  return new Date(Date.UTC(year, number - 1 + offset, 1)).toISOString().slice(0, 7);
}

export function monthDays(month) {
  const [year, number] = month.split('-').map(Number);
  const first = new Date(Date.UTC(year, number - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, number, 0)).getUTCDate();
  return Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, index) => {
    const day = index - offset + 1;
    return day < 1 || day > count ? null : `${month}-${String(day).padStart(2, '0')}`;
  });
}

export function renderHolidayCalendar(today = berlinDate(), month = today.slice(0, 7)) {
  const days = monthDays(month);
  const upcoming = upcomingHolidays(today, 3);
  const events = [...holidays, ...shoppingNotes]
    .filter(event => event.start <= `${month}-31` && event.end >= `${month}-01`)
    .sort((a, b) => a.start.localeCompare(b.start));
  const supported = month >= '2026-01' && month <= calendarEnd.slice(0, 7);
  const monthTitle = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${month}-01T12:00:00Z`));
  const rows = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(`<tr>${days.slice(i, i + 7).map(day => {
      if (!day) return '<td class="calendar-empty"></td>';
      const matches = events.filter(event => event.start <= day && event.end >= day);
      const number = Number(day.slice(-2));
      const current = day === today ? ' aria-current="date"' : '';
      return `<td class="${day === today ? 'calendar-today' : ''}">${matches.length
        ? `<button type="button" class="calendar-event-day" data-calendar-day="${day}" aria-expanded="false" aria-controls="calendar-details"${current} aria-label="${escapeHtml(dateLabel(day) + ': ' + matches.map(event => event.title).join(', '))}">${number}<span class="calendar-dot" aria-hidden="true"></span></button>`
        : `<span class="calendar-day"${current}>${number}</span>`}</td>`;
    }).join('')}</tr>`);
  }
  return `<section class="holiday-section" data-month="${month}" aria-labelledby="holiday-title">
    <div class="calendar-panel">
    <h2 id="holiday-title">Tatil takvimi</h2>
    <p class="holiday-intro">Bavyera tatilleri · Türkiye millî günleri</p>
    <div class="calendar-toolbar"><button type="button" data-calendar-action="prev" aria-label="Önceki ay">←</button><h3 aria-live="polite" id="calendar-month">${escapeHtml(monthTitle)}</h3><button type="button" data-calendar-action="next" aria-label="Sonraki ay">→</button><button type="button" data-calendar-action="today">Bugün</button></div>
    <table class="holiday-calendar" aria-labelledby="calendar-month"><thead><tr>${['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => `<th scope="col">${day}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>
    <p class="holiday-intro">İşaretli günlere tıklayarak etkinlikleri gör.</p>
    ${!supported ? '<p>Bu ayın tatil verileri henüz eklenmedi. Güncel tarihler için resmî kaynaklara bakabilirsin.</p>' : events.length ? `<ul class="calendar-events" id="calendar-details" aria-live="polite" hidden>${events.map((event, index) => `<li id="calendar-event-${index}" data-event-start="${event.start}" data-event-end="${event.end}" hidden><span class="holiday-date">${escapeHtml(dateLabel(event.start))}${event.end !== event.start ? ` – ${escapeHtml(dateLabel(event.end))}` : ''}</span><div><span class="holiday-region">${event.region}</span> <a href="${escapeHtml(event.source)}">${escapeHtml(event.title)}</a></div><p>${escapeHtml(event.note)}</p></li>`).join('')}</ul>` : '<p>Bu ay listelenen bir tatil veya anma günü yok.</p>'}
    <p class="holiday-footer"><a href="#tatiller">Alışveriş ve tatil rehberi</a> · <a href="${deSource}">Bavyera takvimi</a> · <a href="${trSource}">Türkiye resmî tatilleri</a></p>
    </div>
    <aside class="holiday-upcoming" aria-labelledby="upcoming-title"><h3 id="upcoming-title">Yaklaşan 3 tatil</h3>
    ${upcoming.length ? `<ol>${upcoming.map(event => `<li><span class="holiday-date">${escapeHtml(dateLabel(event.start))}${event.end !== event.start ? ` – ${escapeHtml(dateLabel(event.end))}` : ''}</span><div><span class="holiday-region">${event.region}</span> <a href="${escapeHtml(event.source)}">${escapeHtml(event.title)}</a></div><p>${escapeHtml(event.note)}</p>${event.start <= today ? '<span class="holiday-date">Bugün / devam ediyor</span>' : ''}</li>`).join('')}</ol>` : '<p>Yeni dönem takvimi henüz eklenmedi.</p>'}
    </aside>
  </section>`;
}
