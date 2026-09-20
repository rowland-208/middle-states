// Six hinged strips share the same map artwork. Alternating vertical shear
// supplies the accordion's perspective, while both coasts slide inward.
(() => {
  const svg = document.querySelector('.map');
  const wrap = document.querySelector('.map-wrap');
  const button = document.querySelector('.fold-toggle');
  const paper = document.getElementById('map-paper');
  const defs = svg.querySelector('defs');
  const ns = 'http://www.w3.org/2000/svg';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const left = 150, right = 550, count = 6;
  const stripWidth = (right - left) / count;
  let progress = 0, target = 0, frame;
  let state = globalThis.currentTripState;

  function element(tag, attributes) {
    const node = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    return node;
  }

  const layers = element('g', { 'aria-hidden': 'true' });
  paper.before(layers);
  defs.append(paper);
  const bounds = [[0, left], ...Array.from({ length: count }, (_, i) => [left + i * stripWidth, stripWidth]), [right, 760 - right]];
  const strips = bounds.map(([x, width], index) => {
    const clip = element('clipPath', { id: `fold-clip-${index}`, clipPathUnits: 'userSpaceOnUse' });
    clip.append(element('rect', { x, y: 0, width: width + 0.15, height: 420 }));
    defs.append(clip);
    const transform = element('g', {});
    const content = element('g', { 'clip-path': `url(#fold-clip-${index})` });
    content.append(element('use', { href: '#map-paper' }));
    // Tint only the land, so the paper's silhouette stays intact at each crease.
    const shade = element('image', { href: 'assets/us-map.svg', width: 760, height: 420, opacity: 0 });
    shade.style.filter = index % 2 ? 'brightness(.66) sepia(.2)' : 'brightness(1.08)';
    content.append(shade);
    transform.append(content);
    layers.append(transform);
    return { transform, shade, x };
  });

  function project(x) {
    const scale = 1 - 0.94 * progress;
    const shift = (right - left) * (1 - scale) / 2;
    return x <= left ? x + shift : x >= right ? x - shift : left + shift + (x - left) * scale;
  }

  function paint() {
    const scale = 1 - 0.94 * progress;
    const depth = Math.sin(Math.acos(scale)) * 31;
    const hitArea = button.querySelector('rect');
    hitArea.setAttribute('x', 170 + 132 * progress);
    hitArea.setAttribute('y', 90 - 70 * progress);
    hitArea.setAttribute('width', 370 - 274 * progress);
    hitArea.setAttribute('height', 260 + 120 * progress);
    strips.forEach(({ transform, shade, x }, index) => {
      const middle = index > 0 && index <= count;
      const direction = index % 2 ? -1 : 1;
      const shear = middle ? direction * depth / stripWidth : 0;
      const lift = middle && index % 2 === 0 ? -depth : 0;
      const horizontalScale = middle ? scale : 1;
      transform.setAttribute('transform', `matrix(${horizontalScale} ${shear} 0 1 ${project(x) - x * horizontalScale} ${lift - shear * x})`);
      shade.setAttribute('opacity', middle ? progress * (index % 2 ? 0.55 : 0.3) : 0);
    });
    for (const [selector, x, y] of [['.destination', 59, 213], ['#chicago-pin', 473, 147], ['#nc-pin', 590, 262]]) {
      svg.querySelector(selector).setAttribute('transform', `translate(${project(x)} ${y})`);
    }
    const [x, y] = state.position;
    document.getElementById('traveler').setAttribute('transform', `translate(${project(x) + (!state.flight && state.stop === 'ca' ? 57 : 0)} ${y})`);
  }

  function animate() {
    cancelAnimationFrame(frame);
    const from = progress;
    const start = performance.now();
    const duration = reducedMotion.matches ? 0 : 1150 * Math.abs(target - from);
    function tick(now) {
      const time = duration ? Math.min(1, (now - start) / duration) : 1;
      const eased = time < 0.5 ? 4 * time ** 3 : 1 - (-2 * time + 2) ** 3 / 2;
      progress = from + (target - from) * eased;
      paint();
      if (time < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  }

  button.addEventListener('click', () => {
    target = target ? 0 : 1;
    wrap.classList.toggle('folded', Boolean(target));
    button.setAttribute('aria-pressed', String(Boolean(target)));
    button.setAttribute('aria-label', target ? 'Unfold the middle states' : 'Fold away the middle states');
    animate();
  });
  button.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });
  document.querySelectorAll('.bounce-target').forEach(character => {
    function bounce(event) {
      event.stopPropagation();
      if (reducedMotion.matches) return;
      character.classList.remove('bouncing');
      // Restart on each click, even if the previous bounce is still playing.
      void character.getBoundingClientRect();
      character.classList.add('bouncing');
    }
    character.addEventListener('click', bounce);
    character.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        bounce(event);
      }
    });
    character.addEventListener('animationend', event => {
      if (event.animationName === 'character-bounce') character.classList.remove('bouncing');
    });
  });
  window.addEventListener('trip-position-change', event => { state = event.detail; paint(); });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { cancelAnimationFrame(frame); progress = target; paint(); } });
  paint();
})();
