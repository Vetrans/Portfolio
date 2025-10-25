// ----- Core interactions (single-page show/hide) -----
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
  const sections = Array.from(document.querySelectorAll('.section'));
  const btnLinks = Array.from(document.querySelectorAll('[data-target]'));
  const toast = document.getElementById('toast');
  const year = document.getElementById('year');
  const themeToggle = document.getElementById('themeToggle');
  const backTop = document.getElementById('backTop');

  year.textContent = new Date().getFullYear();

  // theme restore
  const savedTheme = localStorage.getItem('rishi_theme');
  if (savedTheme === 'light') document.body.classList.add('light');

  function setActiveSection(id) {
    sections.forEach(s => {
      if (s.id === id) {
        s.classList.add('show');
        // run section-specific reveals
        revealSection(s);
      } else {
        s.classList.remove('show');
      }
    });
    // nav btn active
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.target === id));
  }

  // initial
  setActiveSection('home');

  // nav button clicks
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => setActiveSection(btn.dataset.target));
  });

  // any element with data-target (CTA)
  btnLinks.forEach(el => {
    el.addEventListener('click', (e) => {
      const t = el.dataset.target;
      if (t) {
        e.preventDefault();
        setActiveSection(t);
        // small micro-scroll to top
        window.scrollTo({top:0,behavior:'smooth'});
      }
    });
  });

  // small mobile menu (open toggler)
  const menuOpen = document.getElementById('menuOpen');
  if (menuOpen) {
    menuOpen.addEventListener('click', () => {
      // toggle mobile nav by showing a simple overlay selector
      // create simple nav overlay
      const overlay = document.createElement('div');
      overlay.className = 'mobile-nav-overlay';
      overlay.innerHTML = `<div class="mobile-nav-card">
        ${navBtns.map(b=>`<button class="mobile-link" data-target="${b.dataset.target}">${b.textContent}</button>`).join('')}
        <button class="mobile-close">Close</button>
      </div>`;
      document.body.appendChild(overlay);
      // attach events
      overlay.querySelectorAll('.mobile-link').forEach(l=>{
        l.addEventListener('click', ()=>{ setActiveSection(l.dataset.target); document.body.removeChild(overlay); });
      });
      overlay.querySelector('.mobile-close').addEventListener('click', ()=> document.body.removeChild(overlay));
    });
  }

  // theme toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('rishi_theme', document.body.classList.contains('light') ? 'light' : 'dark');
    // animate icon
    const i = themeToggle.querySelector('i');
    i.classList.toggle('fa-moon');
    i.classList.toggle('fa-sun');
  });

  // back to top
  backTop && backTop.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

  // reveal section specifics
  function revealSection(sec) {
    // run skills animate when opening skills
    if (sec.id === 'skills') animateSkills();
    // other reveals could be added
  }

  // ----- Typing effect for hero -----
  const typedEl = document.querySelector('.typed');
  const phrases = ['Web Developer', 'Backend Developer','Database Developer','UI/UX Designer','OS Designer','Hardcore Programmer'];
  typingLoop(typedEl, phrases, 1200);

  // ----- Skills animation (bars & circular) -----
  function animateSkills() {
    // bars
    document.querySelectorAll('.bar').forEach(bar => {
      const pct = bar.parentElement.dataset.pct || bar.dataset.pct || 0;
      const fill = bar.querySelector('.bar-fill');
      // animate with slight delay per bar
      setTimeout(()=> fill.style.width = pct + '%', 150);
    });

    // circular radials
    document.querySelectorAll('.radial').forEach(r => {
      const pct = parseInt(r.dataset.pct || 0, 10);
      const progress = r.querySelector('.progress');
      if (progress) {
        // dasharray: pct,100
        progress.setAttribute('stroke-dasharray', `${pct},100`);
        // small pulse animation
        r.animate([
          { transform: 'scale(0.98)' },
          { transform: 'scale(1.03)' },
          { transform: 'scale(1)' }
        ], { duration: 900, easing: 'ease-out' });
      }
    });
  }

  // ----- Projects Modal -----
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalLive = document.getElementById('modalLive');
  const modalClose = document.getElementById('modalClose');

  document.querySelectorAll('.view-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const proj = btn.closest('.project');
      const title = proj.dataset.title;
      const desc = proj.dataset.desc;
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalLive.href = '#';
      modal.classList.add('show');
      modal.setAttribute('aria-hidden','false');
    });
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  function closeModal(){ modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }

  // Contact form demo (client-side only)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      if (!fd.get('name') || !fd.get('email') || !fd.get('message')) { showToast('Please fill all fields'); return; }
      showToast('Thanks! Message queued (demo).');
      form.reset();
    });
  }

  // show toast
  function showToast(msg, t = 3000) {
    toast.textContent = msg;
    toast.style.opacity = 1;
    setTimeout(()=> toast.style.opacity = 0, t);
  }

  // on load, small particle movement
  initParticles('#particles', 28);

  // Kick skill animation when navigation directly to skills (if hash)
  if (location.hash && location.hash.slice(1)) {
    setTimeout(()=> setActiveSection(location.hash.slice(1)), 50);
  }
});

// ---- Typing loop helper ----
function typingLoop(el, words, pause=1000) {
  if (!el) return;
  let i=0, j=0, deleting=false;
  function tick(){
    const current = words[i];
    el.textContent = deleting ? current.slice(0, j--) : current.slice(0, j++);
    if (!deleting && j === current.length + 1) { deleting = true; setTimeout(tick, pause); return; }
    if (deleting && j === 0) { deleting = false; i = (i+1) % words.length; }
    setTimeout(tick, deleting ? 40 : 90);
  }
  tick();
}

// ---- Particle system (lightweight dom + CSS animations) ----
function initParticles(selector, count=30) {
  const parent = document.querySelector(selector);
  if (!parent) return;
  parent.innerHTML = '';
  for (let i=0;i<count;i++){
    const d = document.createElement('div');
    d.className = 'p-dot';
    const size = (Math.random()*6 + 4).toFixed(1);
    d.style.width = d.style.height = size+'px';
    d.style.left = Math.random()*100 + '%';
    d.style.top = Math.random()*100 + '%';
    d.style.opacity = (Math.random()*0.5 + 0.08).toString();
    d.style.background = `linear-gradient(90deg, rgba(0,234,255,0.9), rgba(255,95,177,0.9))`;
    d.style.position = 'absolute';
    d.style.borderRadius = '50%';
    d.style.filter = 'blur(6px)';
    d.style.transform = `translate3d(0,0,0)`;
    parent.appendChild(d);
    animateDot(d);
  }

  function animateDot(el) {
    const dur = Math.random()*9000 + 6000;
    const dx = Math.random()*60 - 30;
    const dy = Math.random()*60 - 30;
    el.animate([
      { transform: 'translate(0px, 0px) scale(1)', opacity: el.style.opacity },
      { transform: `translate(${dx}px, ${dy}px) scale(${1 + Math.random()*0.5})`, opacity: (parseFloat(el.style.opacity)-0.02).toString() },
      { transform: 'translate(0px, 0px) scale(1)', opacity: el.style.opacity }
    ], { duration: dur, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
  }
}
