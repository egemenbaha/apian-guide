import test from 'node:test';
import assert from 'node:assert/strict';
import { holidays, berlinDate, upcomingHolidays, renderHolidayCalendar, monthDays, shiftMonth } from '../src/holidays.js';

test('upcoming list crosses the year with five events and no expired dates', () => {
  const events = upcomingHolidays('2026-11-13');
  assert.equal(events.length, 5);
  assert.deepEqual(events.map(e => e.start), ['2026-12-25', '2027-01-01', '2027-01-06', '2027-03-12', '2027-03-18']);
  assert.equal(upcomingHolidays('2026-12-27')[0].start, '2027-01-01');
});
test('multi-day holidays stay until the last day and civic holidays remain', () => {
  const events = upcomingHolidays('2027-05-19');
  assert.ok(events.some(e => e.title.includes('Gençlik')));
  assert.ok(!upcomingHolidays('2027-05-20').some(e => e.title.includes('Gençlik')));
  assert.equal(upcomingHolidays('2026-12-26')[0].title, 'Noel · Weihnachten');
});
test('local Munich date is independent of visitor timezone and handles DST', () => {
  assert.equal(berlinDate(new Date('2026-12-31T23:30:00Z')), '2027-01-01');
  assert.equal(berlinDate(new Date('2027-05-18T22:30:00Z')), '2027-05-19');
});
test('scope excludes Turkish religious days and retains local statutory holidays', () => {
  assert.ok(!holidays.some(e => /Aşure|Kandil|Ramazan|Kurban|Kadir|Hicri|Üç aylar/.test(e.title)));
  assert.ok(holidays.filter(e => e.title === 'Atatürk’ü Anma Günü').every(e => e.note.includes('Resmî tatil değil')));
  assert.ok(holidays.filter(e => e.region === 'TR').every(e => !e.note.includes('marketler kapalı')));
  assert.equal(holidays.filter(e => e.start === '2027-01-01').length, 1);
  assert.equal(holidays.filter(e => e.region.includes('DE') && e.start.startsWith('2027')).length, 12);
  assert.ok(!holidays.some(e => /Friedensfest|Buß|Reformation/.test(e.title)));
});
test('month layout starts Monday, handles leap years and year navigation', () => {
  assert.equal(monthDays('2027-02').filter(Boolean).length, 28);
  assert.equal(monthDays('2028-02').filter(Boolean).length, 29);
  assert.equal(monthDays('2026-11')[6], '2026-11-01');
  assert.equal(shiftMonth('2026-12', 1), '2027-01');
  assert.equal(shiftMonth('2027-01', -1), '2026-12');
});
test('calendar shows coverage warning, today and both days of Christmas', () => {
  assert.match(renderHolidayCalendar('2028-01-01'), /Bu ayın tatil verileri henüz eklenmedi/);
  const html = renderHolidayCalendar('2026-12-25');
  assert.match(html, /aria-current="date"/);
  assert.match(html, /data-calendar-day="2026-12-25"/);
  assert.match(html, /data-calendar-day="2026-12-26"/);
  assert.doesNotMatch(renderHolidayCalendar('2027-02-01'), /data-calendar-day=/);
});

test('compact calendar keeps event details hidden until a date is selected', () => {
  const html = renderHolidayCalendar('2026-12-01');
  assert.match(html, /id="calendar-details" aria-live="polite" hidden/);
  assert.match(html, /data-calendar-day="2026-12-25" aria-expanded="false"/);
  assert.match(html, /data-event-start="2026-12-25" data-event-end="2026-12-26" hidden/);
});
