import test from 'node:test';
import assert from 'node:assert/strict';
import { holidays, berlinDate, upcomingHolidays, renderHolidayTimeline } from '../src/holidays.js';

test('upcoming list crosses the year with five events and no expired dates', () => {
  const events = upcomingHolidays('2026-11-13');
  assert.equal(events.length, 5);
  assert.deepEqual(events.map(e => e.start), ['2026-12-10', '2026-12-25', '2027-01-01', '2027-01-04', '2027-01-06']);
  assert.equal(upcomingHolidays('2026-12-27')[0].start, '2027-01-01');
});
test('multi-day holidays stay until the last day and overlapping events survive', () => {
  const events = upcomingHolidays('2027-05-19');
  assert.ok(events.some(e => e.title === 'Kurban Bayramı'));
  assert.ok(events.some(e => e.title.includes('Gençlik')));
  assert.ok(!upcomingHolidays('2027-05-20').some(e => e.title === 'Kurban Bayramı'));
  assert.equal(upcomingHolidays('2026-12-26')[0].title, 'Noel · Weihnachten');
});
test('local Munich date is independent of visitor timezone and handles DST', () => {
  assert.equal(berlinDate(new Date('2026-12-31T23:30:00Z')), '2027-01-01');
  assert.equal(berlinDate(new Date('2027-05-18T22:30:00Z')), '2027-05-19');
});
test('approved scope excludes Asure and keeps national and religious distinctions', () => {
  assert.ok(!holidays.some(e => /Aşure/.test(e.title)));
  assert.ok(holidays.filter(e => e.title === 'Atatürk’ü Anma Günü').every(e => e.note.includes('Resmî tatil değil')));
  assert.ok(holidays.filter(e => e.region === 'TR').every(e => !e.note.includes('marketler kapalı')));
  assert.equal(holidays.filter(e => e.start === '2027-01-01').length, 1);
  assert.equal(holidays.filter(e => e.title === 'Miraç Kandili' && e.start.startsWith('2027')).length, 2);
});
test('calendar expiry does not fabricate dates and rendering has five semantic rows', () => {
  assert.deepEqual(upcomingHolidays('2028-01-01'), []);
  assert.match(renderHolidayTimeline('2028-01-01'), /Yeni dönem takvimi henüz eklenmedi/);
  const html = renderHolidayTimeline('2026-11-13');
  assert.equal((html.match(/<li[ >]/g) || []).length, 5);
  assert.match(html, /<time datetime="2027-01-01"/);
});
