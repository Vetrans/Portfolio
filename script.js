document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
  const sections = Array.from(document.querySelectorAll('.section'));
  const ctAs = Array.from(document.querySelectorAll('[data-target]'));
  const themeToggle = document.getElementById('themeToggle');
  const typedEl = document.getElementById('typed');
  const radials = document.querySelectorAll('.radial');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalLive = document.getElementById('modalLive');
  const modalClose = document.getElementById('modalClose');
  const toast = document.getElementById('toast');
  const backTop = document.getElementById('backTop');
  const yearSpan = document.getElementById('year');
  const cursor = document.getElementById('cursor');

  // Year
  if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());

  // Theme init
  initTheme();

  // Prefers reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Router: show only one section
  function showSection(id, push = true) {
    sections.forEach(s => {
      const show = s.id === id;
      s.classList.toggle('show', show);
      if (show) {
        if (!s.hasAttribute('data-focusable')) s.setAttribute('tabindex', '-1');
        // delay focus slightly to after display:flex applies
        setTimeout(() => { s.focus({ preventScroll: true }); }, 10);
      }
    });
    navBtns.forEach(b => {
      const active = b.dataset.target === id;
      b.classList.toggle('active', active);
      b.setAttribute('aria-current', active ? 'page' : 'false');
    });
    if (push) location.hash = id;
    if (id === 'skills') animateSkills();
    if (!prefersReduced) window.scrollTo({ top: 0, behavior: 'smooth' });
    else window.scrollTo(0, 0);
  }

  // Nav click
  navBtns.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.target)));

  // CTA click
  ctAs.forEach(el => el.addEventListener('click', (e) => {
    const t = el.dataset.target; if (!t) return;
    e.preventDefault(); showSection(t);
  }));

  // Keyboard for nav buttons
  navBtns.forEach(btn => {
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') showSection(btn.dataset.target); });
  });

  // Hash routing
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1) || 'home';
    if (document.getElementById(id)) showSection(id, false);
  });
  if (location.hash) {
    const id = location.hash.slice(1);
    if (document.getElementById(id)) setTimeout(() => showSection(id, false), 50);
  }

  // Typing effect (skip for reduced motion)
  if (!prefersReduced) {
    typeLoop(['Aspiring Computer Engineer', 'Front-end Enthusiast', 'JavaScript Lover', 'Problem Solver'], typedEl, 90, 900);
  } else if (typedEl) {
    typedEl.textContent = 'Aspiring Computer Engineer';
  }

  // Animate skill bars & radials
  function animateSkills() {
    document.querySelectorAll('.skill').forEach((s, i) => {
      const pct = s.dataset.pct || 0;
      const fill = s.querySelector('.bar-fill');
      if (!fill) return;
      fill.style.width = '0%';
      setTimeout(() => { fill.style.width = pct + '%'; }, 100 * i);
    });
    radials.forEach(r => {
      const pct = parseInt(r.dataset.pct || 0, 10);
      const svg = r.querySelector('.circular .progress'); if (!svg) return;
      const circumference = 100;
      const dash = Math.round((pct / 100) * circumference);
      svg.style.strokeDasharray = `${dash},100`;
      r.animate([{ transform: 'scale(.97)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 800, easing: 'ease-out' });
    });
  }
  if (document.getElementById('skills').classList.contains('show')) animateSkills();

  // Projects modal (event delegation)
  document.querySelector('.projects-grid')?.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-modal]');
    if (!opener) return;
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

  // Contact form (client-side demo)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      if (!fd.get('name') || !fd.get('email') || !fd.get('message')) { showToast('Please fill all fields'); return; }
      showToast('Message sent (demo). Thanks!');
      contactForm.reset();
    });
  }

  // Back to top
  backTop && backTop.addEventListener('click', () => showSection('home'));

  // Particles
  initParticles('#particles', 28);

  // Inertia cursor (skip reduced motion)
  if (!prefersReduced) initCursor(cursor);

  // Project reveal on mount
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, i) => {
    card.style.opacity = 0;
    card.style.transform = "translateY(40px)";
    setTimeout(() => {
      card.style.transition = "transform .6s ease, opacity .6s ease";
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }, i * 120);
  });

  // 3D tilt on cards (rAF throttled)
  initTilt('.project-card');
});

/* ===== Typing loop ===== */
function typeLoop(words, el, speed = 100, pause = 1000) {
  if (!el) return;
  let w = 0, i = 0, deleting = false;
  function tick() {
    const full = words[w];
    el.textContent = deleting ? full.substring(0, --i) : full.substring(0, ++i);
    if (!deleting && i === full.length) { deleting = true; return setTimeout(tick, pause); }
    if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; }
    setTimeout(tick, deleting ? 40 : speed);
  }
  tick();
}

/* ===== Toast ===== */
function showToast(msg, ms = 3000) {
  const toast = document.getElementById('toast'); if (!toast) return;
  toast.textContent = msg;
  toast.setAttribute('role', 'alert');
  toast.style.opacity = '1';
  toast.style.pointerEvents = 'auto';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
    toast.removeAttribute('role');
  }, ms);
}

/* ===== Theme init ===== */
function initTheme() {
  const key = 'rishi_theme';
  const stored = localStorage.getItem(key);
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const root = document.documentElement;
  if (stored) root.setAttribute('data-theme', stored);
  else root.setAttribute('data-theme', prefersLight ? 'light' : 'dark');

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
    if (root.getAttribute('data-theme') === 'light') {
      icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); toggle.setAttribute('aria-pressed', 'true');
    } else {
      icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); toggle.setAttribute('aria-pressed', 'false');
    }
  }
}

/* ===== Particles ===== */
function initParticles(selector, count = 28) {
  const parent = document.querySelector(selector); if (!parent) return;
  parent.innerHTML = '';
  parent.style.position = 'fixed'; parent.style.inset = '0'; parent.style.zIndex = '-1';
  for (let i = 0; i < count; i++) {
    const d = document.createElement('div');
    d.className = 'particle-dot';
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
    el.animate([
      { transform: 'translate(0,0)' },
      { transform: `translate(${dx}px, ${dy}px)` },
      { transform: 'translate(0,0)' }
    ], { duration: dur, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
  }
}

/* ===== Inertia cursor ===== */
function initCursor(node) {
  if (!node) return;
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;
  function move(e) { tx = e.clientX; ty = e.clientY; }
  window.addEventListener('mousemove', move, { passive: true });
  function raf() {
    x += (tx - x) * 0.15; y += (ty - y) * 0.15;
    node.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  }
  raf();
}

/* ===== 3D Tilt ===== */
function initTilt(selector) {
  const cards = document.querySelectorAll(selector);
  const max = 8; // degrees
  cards.forEach(card => {
    let raf = null, rx = 0, ry = 0;
    card.parentElement && (card.parentElement.style.perspective = '800px');
    function apply() { raf = null; card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; }
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      ry = ((e.clientX - cx) / r.width) * -max;
      rx = ((e.clientY - cy) / r.height) * max;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 200ms ease'; card.style.transform = 'rotateX(0) rotateY(0)';
      setTimeout(() => { card.style.transition = ''; }, 220);
    });
  });
}

/* ===== Minimal style for particles (inlined) ===== */
(function addParticleStyles() {
  const css = `.particle-dot{pointer-events:none;}`;
  const s = document.createElement('style'); s.appendChild(document.createTextNode(css)); document.head.appendChild(s);
})();
