const trip = globalThis.Trip;
let preview = 'live';
let lastPhase;
const previews = { nc: trip.chicagoArrival - 86400000, chicago: trip.chicagoArrival, ca: trip.reunion, flightChicago: (trip.chicagoDeparture + trip.chicagoArrival) / 2, flightCalifornia: (trip.californiaDeparture + trip.californiaArrival) / 2 };
const statuses = { nc: 'Currently in Wilmington · thinking of you', chicago: 'Currently in Chicago · one stop closer', ca: 'Finally together · delivery complete ♡' };

function render() {
  const state = trip.getState(preview === 'live' ? Date.now() : previews[preview]);
  for (const unit of ['hours', 'minutes', 'seconds']) {
    document.getElementById(unit).textContent = String(state[unit]).padStart(2, '0');
  }
  document.querySelector('.clock').setAttribute('aria-label', `${state.hours} hours, ${state.minutes} minutes, ${state.seconds} seconds until we are together`);
  globalThis.currentTripState = state;
  const [x, y] = state.position;
  document.getElementById('traveler').setAttribute('transform', `translate(${!state.flight && state.stop === 'ca' ? x + 57 : x} ${y})`);
  document.getElementById('traveler').classList.toggle('in-flight', Boolean(state.flight));
  document.body.classList.toggle('reunited', state.reunited);
  const phase = state.flight ? `flight-${state.flight.to}` : state.reunited ? 'together' : state.stop;
  if (phase !== lastPhase) {
    document.getElementById('traveler-emoji').textContent = state.reunited ? '🥰' : '🥹';
    document.getElementById('location-status').innerHTML = `<span class="status-dot"></span>${state.flight ? (state.flight.to === 'chicago' ? 'On the way to Chicago ✈' : 'On the way to California ✈') : state.stop === 'ca' && !state.reunited ? 'Landed in California · on my way to you' : statuses[state.stop]}`;
    const stops = ['nc', 'chicago', 'ca'];
    for (const [index, stop] of stops.entries()) {
      const element = document.getElementById(`stop-${stop}`);
      element.classList.toggle('active', !state.flight && state.stop === stop);
      element.classList.toggle('complete', index < stops.indexOf(state.stop));
      element.querySelector('.stop-state').textContent = state.flight && state.flight.to === stop ? 'ON THE WAY' : state.stop === stop ? (state.flight ? 'DEPARTED' : stop === 'ca' && state.reunited ? 'TOGETHER' : 'HERE NOW') : index < stops.indexOf(state.stop) ? 'BEEN THERE ✓' : stop === 'ca' ? 'THE DESTINATION' : 'UP NEXT';
    }
    document.getElementById('route-nc').classList.toggle('traveled', state.stop !== 'nc');
    document.getElementById('route-ca').classList.toggle('traveled', state.stop === 'ca');
    lastPhase = phase;
  }
  window.dispatchEvent(new CustomEvent('trip-position-change', { detail: state }));
}

document.querySelectorAll('[data-preview]').forEach(button => {
  button.addEventListener('click', () => {
    preview = button.dataset.preview;
    document.querySelectorAll('[data-preview]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    document.body.classList.toggle('previewing', preview !== 'live');
    render();
  });
});
render();
setInterval(render, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
