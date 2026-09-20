const test = require('node:test');
const assert = require('node:assert/strict');
const trip = require('./trip.js');

test('flight windows use Eastern, Chicago and Pacific offsets', () => {
  assert.equal(new Date(trip.chicagoDeparture).toISOString(), '2026-09-21T17:00:00.000Z');
  assert.equal(new Date(trip.chicagoArrival).toISOString(), '2026-09-21T19:00:00.000Z');
  assert.equal(new Date(trip.californiaDeparture).toISOString(), '2026-09-25T18:30:00.000Z');
  assert.equal(new Date(trip.californiaArrival).toISOString(), '2026-09-25T23:20:00.000Z');
  assert.equal(new Date(trip.reunion).toISOString(), '2026-09-26T01:00:00.000Z');
});
for (const [start, end, from, to] of [
  ['chicagoDeparture', 'chicagoArrival', 'nc', 'chicago'],
  ['californiaDeparture', 'californiaArrival', 'chicago', 'ca'],
]) {
  test(`${to} flight boundaries and proportional route progress`, () => {
    assert.equal(trip.getState(trip[start]-1).flight, null);
    assert.deepEqual(trip.getState(trip[start]).position, trip.points[from]);
    const midpoint = trip.getState((trip[start]+trip[end])/2);
    assert.equal(midpoint.flight.to, to);
    assert.equal(midpoint.flight.progress, 0.5);
    assert.ok(midpoint.position[0] < trip.points[from][0] && midpoint.position[0] > trip.points[to][0]);
    assert.ok(trip.getState(trip[end]-1).flight);
    assert.equal(trip.getState(trip[end]).flight, null);
    assert.equal(trip.getState(trip[end]).stop, to);
    assert.deepEqual(trip.getState(trip[end]).position, trip.points[to]);
  });
}
test('landing in California does not end the reunion countdown', () => {
  const landed = trip.getState(trip.californiaArrival);
  assert.equal(landed.reunited, false);
  assert.equal(landed.hours, 1);
  assert.equal(landed.minutes, 40);
  assert.equal(trip.getState(trip.reunion-1).seconds, 1);
  assert.equal(trip.getState(trip.reunion).reunited, true);
  assert.equal(trip.getState(trip.reunion+86400000).hours, 0);
  assert.equal(trip.getState(trip.reunion-100*3600000).hours, 100);
});
