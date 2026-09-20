/* Explicit offsets keep the schedule identical in every visitor's timezone.
   September: Eastern UTC−04, Chicago UTC−05, Pacific UTC−07.
   Flight positions follow elapsed time, not live GPS. */
(function (root) {
  const trip = {
    chicagoDeparture: Date.parse('2026-09-21T13:00:00-04:00'),
    chicagoArrival: Date.parse('2026-09-21T15:00:00-04:00'),
    californiaDeparture: Date.parse('2026-09-25T13:30:00-05:00'),
    californiaArrival: Date.parse('2026-09-25T16:20:00-07:00'),
    reunion: Date.parse('2026-09-25T18:00:00-07:00'),
    points: { nc: [590, 262], chicago: [473, 147], ca: [59, 213] },
    // Sample the same quadratic curves used by the SVG, then interpolate by
    // distance so half the flight time means half the illustrated route length.
    routePoint(from, control, to, progress) {
      const samples = [{ point: from, distance: 0 }];
      for (let i = 1; i <= 160; i++) {
        const t = i / 160;
        const point = from.map((v, axis) => (1-t)**2*v + 2*(1-t)*t*control[axis] + t*t*to[axis]);
        const previous = samples[i-1];
        samples.push({ point, distance: previous.distance + Math.hypot(point[0]-previous.point[0], point[1]-previous.point[1]) });
      }
      const distance = samples[160].distance * Math.max(0, Math.min(1, progress));
      const index = Math.max(1, samples.findIndex(sample => sample.distance >= distance));
      const a = samples[index-1], b = samples[index];
      const fraction = (distance-a.distance)/(b.distance-a.distance);
      return a.point.map((v, axis) => v + (b.point[axis]-v)*fraction);
    },
    getState(now) {
      const remaining = Math.max(0, Math.ceil((this.reunion - now) / 1000));
      const stop = now >= this.californiaArrival ? 'ca' : now >= this.chicagoArrival ? 'chicago' : 'nc';
      let flight = null;
      if (now >= this.chicagoDeparture && now < this.chicagoArrival) flight = { to: 'chicago', progress: (now-this.chicagoDeparture)/(this.chicagoArrival-this.chicagoDeparture) };
      if (now >= this.californiaDeparture && now < this.californiaArrival) flight = { to: 'ca', progress: (now-this.californiaDeparture)/(this.californiaArrival-this.californiaDeparture) };
      const position = flight ? (flight.to === 'chicago'
        ? this.routePoint(this.points.nc, [580,165], this.points.chicago, flight.progress)
        : this.routePoint(this.points.chicago, [260,80], this.points.ca, flight.progress)) : this.points[stop];
      return { stop, flight, position, reunited: now >= this.reunion,
        hours: Math.floor(remaining / 3600), minutes: Math.floor(remaining % 3600 / 60), seconds: remaining % 60 };
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = trip;
  else root.Trip = trip;
})(globalThis);
