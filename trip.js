/* Explicit UTC offsets keep the schedule correct in every visitor's timezone.
   September 2026: Eastern is UTC−04:00; Pacific is UTC−07:00.
   City markers follow the schedule, not live GPS. */
(function (root) {
  const trip = {
    chicagoArrival: Date.parse('2026-09-21T14:00:00-04:00'),
    reunion: Date.parse('2026-09-25T18:00:00-07:00'),
    points: { nc: [590, 262], chicago: [473, 147], ca: [59, 213] },
    getState(now) {
      const remaining = Math.max(0, Math.ceil((this.reunion - now) / 1000));
      return {
        stop: now >= this.reunion ? 'ca' : now >= this.chicagoArrival ? 'chicago' : 'nc',
        hours: Math.floor(remaining / 3600),
        minutes: Math.floor(remaining % 3600 / 60),
        seconds: remaining % 60,
      };
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = trip;
  else root.Trip = trip;
})(globalThis);
