/**
 * Visual effects layer: scroll progress bar + cursor spotlight on cards.
 * Independent of script.js, so it can be removed without breaking anything.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll progress bar
  const bar = document.getElementById('scrollProgress');
  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = `scaleX(${ratio})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // 2. Cursor spotlight on cards (skipped on touch devices)
  if (window.matchMedia('(hover: hover)').matches) {
    const selector = [
      '.lang-card', '.stack-box', '.project-card', '.column-card',
      '.pipe-step', '.contact-link-card', '.contact-details-box', '.contact-form-box'
    ].join(',');

    document.querySelectorAll(selector).forEach(card => {
      card.classList.add('spot');
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }
});

/**
 * Live background: drifting particles that link up when close
 * and bend away from the cursor. Pauses when the tab is hidden.
 */
(function () {
  const canvas = document.getElementById('liveBg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLORS = {
    dark:  [[34, 211, 238], [59, 130, 246], [129, 140, 248]],
    light: [[8, 145, 178], [37, 99, 235], [99, 102, 241]]
  };
  const mouse = { x: -9999, y: -9999 };
  let w, h, dpr, particles = [], raf = null;

  function theme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(Math.floor((w * h) / 16000), 85);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.8,
      c: Math.floor(Math.random() * 3)
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const pal = COLORS[theme()];
    const dotAlpha = theme() === 'light' ? 0.55 : 0.75;
    const lineAlpha = theme() === 'light' ? 0.22 : 0.28;
    const LINK = 130, PUSH = 120;

    for (const p of particles) {
      if (!reduce) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < PUSH && d > 0) {
          p.x += (dx / d) * (PUSH - d) * 0.02;
          p.y += (dy / d) * (PUSH - d) * 0.02;
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
      }
      const [r, g, b] = pal[p.c];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${dotAlpha})`;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          const [r, g, bl] = pal[a.c];
          ctx.strokeStyle = `rgba(${r},${g},${bl},${(1 - d / LINK) * lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => { resize(); if (reduce) frame(); });
  window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  document.addEventListener('visibilitychange', () => {
    if (reduce) return;
    if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(frame);
  });

  resize();
  frame();
})();

/**
 * Page-style navigation: only one section is shown at a time.
 * Clicking any in-page link (#projects, #contact ...) opens that section.
 */
(function () {
  const ids = ['hero', 'languages', 'rag-project', 'skills', 'projects', 'experience', 'contact'];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  function markNav(id) {
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  function animateBars() {
    const bars = document.querySelectorAll('.lang-bar-fill');
    bars.forEach(b => { b.style.transition = 'none'; b.style.width = '0'; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      bars.forEach(b => {
        b.style.transition = '';
        b.style.width = b.style.getPropertyValue('--level');
      });
    }));
  }

  function show(id, push) {
    if (!ids.includes(id)) id = 'hero';
    sections.forEach(s => {
      const on = s.id === id;
      s.classList.toggle('page-hidden', !on);
      s.classList.toggle('page-active', on);
    });
    markNav(id);
    window.scrollTo(0, 0);
    if (id === 'languages') animateBars();
    if (push) history.pushState({ page: id }, '', '#' + id);
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!ids.includes(id)) return;
    e.preventDefault();
    show(id, true);
  });

  window.addEventListener('popstate', () => {
    show(location.hash.slice(1) || 'hero', false);
  });

  // script.js re-marks the nav on scroll; keep our choice on top
  window.addEventListener('scroll', () => {
    const current = sections.find(s => !s.classList.contains('page-hidden'));
    if (current) markNav(current.id);
  }, { passive: true });

  show(location.hash.slice(1) || 'hero', false);
})();
