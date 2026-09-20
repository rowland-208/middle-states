const test = require('node:test');
const assert = require('node:assert/strict');
const trip = require('./trip.js');

test('Chicago arrival is Monday at 2 PM Eastern, and changes at the exact boundary', () => {
  assert.equal(new Date(trip.chicagoArrival).toISOString(), '2026-09-21T18:00:00.000Z');
  assert.equal(new Date(trip.chicagoArrival).getUTCDay(), 1);
  assert.equal(trip.getState(trip.chicagoArrival - 1).stop, 'nc');
  assert.equal(trip.getState(trip.chicagoArrival).stop, 'chicago');
});
test('reunion is Friday at 6 PM Pacific, which is Saturday in UTC', () => {
  assert.equal(new Date(trip.reunion).toISOString(), '2026-09-26T01:00:00.000Z');
  assert.deepEqual(trip.getState(trip.reunion - 1000), { stop: 'chicago', hours: 0, minutes: 0, seconds: 1 });
  assert.deepEqual(trip.getState(trip.reunion), { stop: 'ca', hours: 0, minutes: 0, seconds: 0 });
});
test('total hours do not wrap at 24; clock does not end early or become negative', () => {
  assert.deepEqual(trip.getState(trip.reunion - (100 * 3600 + 12 * 60 + 34) * 1000), { stop: 'chicago', hours: 100, minutes: 12, seconds: 34 });
  assert.equal(trip.getState(trip.reunion - 1).seconds, 1);
  assert.deepEqual(trip.getState(trip.reunion + 86400000), { stop: 'ca', hours: 0, minutes: 0, seconds: 0 });
});
