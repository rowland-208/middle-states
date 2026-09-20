const trip = globalThis.Trip;
let preview = 'live';
let lastStop;
const previews = { nc: trip.chicagoArrival - 86400000, chicago: trip.chicagoArrival, ca: trip.reunion };
const statuses = { nc: 'Currently in Wilmington · thinking of you', chicago: 'Currently in Chicago · one stop closer', ca: 'Finally together · delivery complete ♡' };

function render() {
  const state = trip.getState(preview === 'live' ? Date.now() : previews[preview]);
  for (const unit of ['hours', 'minutes', 'seconds']) {
    document.getElementById(unit).textContent = String(state[unit]).padStart(2, '0');
  }
  document.querySelector('.clock').setAttribute('aria-label', `${state.hours} hours, ${state.minutes} minutes, ${state.seconds} seconds until we are together`);
  document.body.classList.toggle('reunited', state.stop === 'ca');
  if (state.stop !== lastStop) {
    const [x, y] = trip.points[state.stop];
    document.getElementById('traveler').setAttribute('transform', `translate(${state.stop === 'ca' ? x + 57 : x} ${y})`);
    document.getElementById('traveler-emoji').textContent = state.stop === 'ca' ? '🥰' : '🥹';
    document.getElementById('location-status').innerHTML = `<span class="status-dot"></span>${statuses[state.stop]}`;
    const stops = ['nc', 'chicago', 'ca'];
    for (const [index, stop] of stops.entries()) {
      const element = document.getElementById(`stop-${stop}`);
      element.classList.toggle('active', state.stop === stop);
      element.classList.toggle('complete', index < stops.indexOf(state.stop));
      element.querySelector('.stop-state').textContent = state.stop === stop ? (stop === 'ca' ? 'TOGETHER' : 'HERE NOW') : index < stops.indexOf(state.stop) ? 'BEEN THERE ✓' : stop === 'ca' ? 'THE DESTINATION' : 'UP NEXT';
    }
    document.getElementById('route-nc').classList.toggle('traveled', state.stop !== 'nc');
    document.getElementById('route-ca').classList.toggle('traveled', state.stop === 'ca');
    lastStop = state.stop;
  }
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
