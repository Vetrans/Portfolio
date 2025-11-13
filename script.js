document.addEventListener('DOMContentLoaded', () => {
  const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
  const sections = Array.from(document.querySelectorAll('.section'));
  const ctAs = Array.from(document.querySelectorAll('[data-target]'));
  const typedEl = document.getElementById('typed');
  const radials = document.querySelectorAll('.radial');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalLive = document.getElementById('modalLive');
  const modalClose = document.getElementById('modalClose');
  const yearSpan = document.getElementById('year');
  const cursor = document.getElementById('cursor');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());

  initTheme();
  initParticles('#particles', 28);
  if (!prefersReduced) initCursor(cursor);

  // Router
  function showSection(id, push = true) {
    sections.forEach(s => {
      const show = s.id === id;
      s.classList.toggle('show', show);
      if (show) {
        if (!s.hasAttribute('data-focusable')) s.setAttribute('tabindex', '-1');
        setTimeout(() => s.focus({ preventScroll: true }), 10);
      }
    });
    navBtns.forEach(b => {
      const active = b.dataset.target === id;
      b.classList.toggle('active', active);
      b.setAttribute('aria-current', active ? 'page' : 'false');
    });
    if (push) location.hash = id;
    if (id === 'skills') animateSkills();
    // Lenis handles smooth scroll; fallback if disabled
    if (lenis) lenis.scrollTo(0, { immediate: prefersReduced });
    else window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  }
  navBtns.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.target)));
  ctAs.forEach(el => el.addEventListener('click', e => { const t = el.dataset.target; if (!t) return; e.preventDefault(); showSection(t) }));
  navBtns.forEach(btn => btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showSection(btn.dataset.target) }));
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1) || 'home';
    if (document.getElementById(id)) showSection(id, false);
  });
  if (location.hash) {
    const id = location.hash.slice(1);
    if (document.getElementById(id)) setTimeout(() => showSection(id, false), 50);
  }

  // Type effect
  if (!prefersReduced) {
    typeLoop(['Aspiring Computer Engineer', 'Front‑end Enthusiast', 'JavaScript Lover', 'Problem Solver'], typedEl, 90, 900);
  } else if (typedEl) {
    typedEl.textContent = 'Aspiring Computer Engineer';
  }

  // GSAP + Lenis setup
  let lenis = null;
  if (!prefersReduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true, smoothTouch: false, syncTouch: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
      // Sync ScrollTrigger with Lenis
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) { return arguments.length ? lenis.scrollTo(value, { immediate: true }) : window.scrollY; },
        getBoundingClientRect() { return { top: 0, left: 0, width: innerWidth, height: innerHeight }; },
        pinType: document.body.style.transform ? 'transform' : 'fixed'
      });
    }

    // Hero entrance
    if (!prefersReduced) {
      gsap.from('.hero-left > *', { y: 24, opacity: 0, duration: .8, ease: 'power2.out', stagger: .08 });
      gsap.from('.portrait-wrap', { y: 28, opacity: 0, duration: .9, ease: 'power2.out' });
    }

    // Section reveal
    document.querySelectorAll('.section').forEach((sec) => {
      if (sec.id === 'home') return;
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          if (prefersReduced) { sec.style.opacity = 1; sec.style.transform = 'none'; return; }
          gsap.fromTo(sec, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power2.out' });
        }
      });
    });

    // Projects stagger on first view
    const cards = gsap.utils.toArray('.project-card');
    if (cards.length) {
      ScrollTrigger.batch(cards, {
        interval: 0.1,
        start: 'top 80%',
        once: true,
        onEnter: batch => {
          if (prefersReduced) { batch.forEach(c => { c.style.opacity = 1; c.style.transform = 'none'; }); return; }
          gsap.fromTo(batch, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out', stagger: 0.08 });
        }
      });
    }

    // Subtle hero parallax
    if (!prefersReduced) {
      gsap.to('.avatar-glow', {
        yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    ScrollTrigger.addEventListener('refresh', () => lenis && lenis.update && lenis.update());
    ScrollTrigger.refresh();
  }

  // Skills animation (bars + radials)
  function animateSkills() {
    document.querySelectorAll('.skill').forEach((s, i) => {
      const pct = s.dataset.pct || 0; const fill = s.querySelector('.bar-fill'); if (!fill) return;
      if (!prefersReduced) { fill.style.width = '0%'; setTimeout(() => fill.style.width = pct + '%', 90 * i); }
      else { fill.style.width = pct + '%'; }
    });
    radials.forEach(r => {
      const pct = parseInt(r.dataset.pct || 0, 10);
      const svg = r.querySelector('.circular .progress'); if (!svg) return;
      const circumference = 100; const dash = Math.round((pct / 100) * circumference);
      svg.style.strokeDasharray = `${dash},100`;
      if (!prefersReduced) r.animate([{ transform: 'scale(.97)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 800, easing: 'ease-out' });
    });
  }
  if (document.getElementById('skills').classList.contains('show')) animateSkills();

  // Projects modal
  document.querySelector('.projects-grid')?.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-modal]'); if (!opener) return;
    const card = opener.closest('.project-card'); if (!card) return;
    modalTitle.textContent = card.querySelector('h3')?.innerText || 'Project';
    modalDesc.textContent = card.querySelector('p')?.innerText || '';
    modalLive.href = card.querySelector('.project-links a.external')?.href || '#';
    openModal();
  });
  function openModal() {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('#modalClose')?.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  modalClose && modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Tilt and magnets
  initTilt('.project-card, .tilt');
  initMagnet('.magnet');
});

/* Typing */
function typeLoop(words, el, speed = 100, pause = 1000) {
  if (!el) return;
  let w = 0, i = 0, deleting = false;
  function tick() {
    const full = words[w];
    el.textContent = deleting ? full.substring(0, --i) : full.substring(0, ++i);
    if (!deleting && i === full.length) { deleting = true; return setTimeout(tick, pause); }
    if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; }
    setTimeout(tick, deleting ? 40 : speed);
  } tick();
}

/* Theme */
function initTheme() {
  const key = 'rishi_theme';
  const stored = localStorage.getItem(key);
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const root = document.documentElement;
  root.setAttribute('data-theme', stored || (prefersLight ? 'light' : 'dark'));
  const toggle = document.getElementById('themeToggle'); if (!toggle) return;
  updateThemeIcon();
  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', current);
    localStorage.setItem(key, current);
    updateThemeIcon();
  });
  function updateThemeIcon() {
    const icon = toggle.querySelector('i'); if (!icon) return;
    if (root.getAttribute('data-theme') === 'light') { icon.classList.replace('fa-moon', 'fa-sun'); toggle.setAttribute('aria-pressed', 'true'); }
    else { icon.classList.replace('fa-sun', 'fa-moon'); toggle.setAttribute('aria-pressed', 'false'); }
  }
}

/* Particles */
function initParticles(selector, count = 28) {
  const parent = document.querySelector(selector); if (!parent) return;
  parent.innerHTML = ''; parent.style.position = 'fixed'; parent.style.inset = '0'; parent.style.zIndex = '-1';
  for (let i = 0; i < count; i++) {
    const d = document.createElement('div'); d.className = 'particle-dot';
    const s = Math.random() * 6 + 4;
    Object.assign(d.style, {
      width: s + 'px', height: s + 'px', left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
      position: 'absolute', borderRadius: '50%', opacity: (Math.random() * 0.5 + 0.08) + '',
      background: 'linear-gradient(90deg, rgba(0,234,255,.9), rgba(255,102,204,.9))',
      filter: 'blur(6px)', mixBlendMode: 'screen'
    });
    parent.appendChild(d);
    animateDot(d);
  }
  function animateDot(el) {
    const dur = Math.random() * 8000 + 5000;
    const dx = Math.random() * 40 - 20, dy = Math.random() * 40 - 20;
    el.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${dx}px,${dy}px)` }, { transform: 'translate(0,0)' }], { duration: dur, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
  }
}

/* Inertia cursor */
function initCursor(node) {
  if (!node) return;
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function raf() { x += (tx - x) * 0.15; y += (ty - y) * 0.15; node.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; requestAnimationFrame(raf); })();
}

/* 3D Tilt */
function initTilt(selector) {
  const els = document.querySelectorAll(selector); const max = 8;
  els.forEach(card => {
    let raf = null, rx = 0, ry = 0;
    (card.parentElement || card).style.perspective = '900px';
    function apply() { raf = null; card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; }
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      ry = ((e.clientX - cx) / r.width) * -max; rx = ((e.clientY - cy) / r.height) * max;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 200ms ease'; card.style.transform = 'rotateX(0) rotateY(0)';
      setTimeout(() => card.style.transition = '', 220);
    });
  });
}

/* Magnetic buttons */
function initMagnet(selector) {
  const els = document.querySelectorAll(selector); const strength = 12;
  els.forEach(el => {
    let raf = null, x = 0, y = 0;
    function apply() { raf = null; el.style.transform = `translate(${x}px, ${y}px)`; }
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      x = dx * strength; y = dy * strength; if (!raf) raf = requestAnimationFrame(apply);
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 150ms ease'; x = 0; y = 0; el.style.transform = 'translate(0,0)'; setTimeout(() => el.style.transition = '', 160);
    });
  });
}

/* Inline particle style */
(function () { const s = document.createElement('style'); s.textContent = '.particle-dot{pointer-events:none;}'; document.head.appendChild(s); })();
