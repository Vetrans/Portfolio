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
  const menuOpen = document.getElementById('menuOpen');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const tablinks = Array.from(document.querySelectorAll('.tablink'));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());
  initParticles('#particles', 28);
  if (!prefersReduced) initCursor(cursor);

  // Lenis + GSAP
  let lenis = null;
  if (!prefersReduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.05, easing: t => 1 - Math.pow(1 - t, 3), smoothWheel: true, smoothTouch: false, syncTouch: true });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value){ return arguments.length ? lenis.scrollTo(value, { immediate:true }) : window.scrollY; },
        getBoundingClientRect(){ return { top:0, left:0, width:innerWidth, height:innerHeight }; },
        pinType: document.body.style.transform ? 'transform' : 'fixed'
      });
    }

    // Hero entrance
    if (!prefersReduced) {
      gsap.from('.hero-left > *', { y: 24, opacity: 0, duration: .8, ease: 'power2.out', stagger: .08 });
      gsap.from('.portrait-wrap', { y: 28, opacity: 0, duration: .9, ease: 'power2.out' });
    }

    // Section reveal
    document.querySelectorAll('.section').forEach((sec)=>{
      if (sec.id === 'home') return;
      ScrollTrigger.create({
        trigger: sec, start: 'top 70%', once: true,
        onEnter: ()=> {
          if (prefersReduced) { sec.style.opacity = 1; sec.style.transform = 'none'; return; }
          gsap.fromTo(sec, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power2.out' });
        }
      });
    });

    // Projects stagger
    const cards = gsap.utils.toArray('.project-card');
    if (cards.length) {
      ScrollTrigger.batch(cards, {
        interval: 0.1, start: 'top 80%', once: true,
        onEnter: batch => {
          if (prefersReduced) { batch.forEach(c=>{ c.style.opacity=1; c.style.transform='none'; }); return; }
          gsap.fromTo(batch, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out', stagger: 0.08 });
        }
      });
    }

    // About: stagger rows and chips
    if (!prefersReduced) {
      gsap.from('.about-timeline .row', { opacity:0, y:16, duration:.5, ease:'power2.out', stagger:.08, scrollTrigger:{ trigger: '.about-timeline', start:'top 85%', once:true } });
      gsap.from('.chips li', { opacity:0, y:10, duration:.4, ease:'power2.out', stagger:.06, scrollTrigger:{ trigger: '.chips', start:'top 90%', once:true } });
    }

    ScrollTrigger.addEventListener('refresh', ()=> lenis && lenis.update && lenis.update());
    ScrollTrigger.refresh();
  }

  // Router + tabbar sync
  function setActiveUI(id){
    navBtns.forEach(b => { const active = b.dataset.target === id; b.classList.toggle('active', active); b.setAttribute('aria-current', active ? 'page':'false'); });
    tablinks.forEach(t => t.classList.toggle('active', t.dataset.target === id));
  }
  function showSection(id, push=true){
    sections.forEach(s=>{
      const show = s.id === id;
      s.classList.toggle('show', show);
      if (show){ if (!s.hasAttribute('data-focusable')) s.setAttribute('tabindex','-1'); setTimeout(()=>s.focus({preventScroll:true}),10); }
    });
    setActiveUI(id);
    if (push) location.hash = id;
    if (id==='skills') animateSkills();
    if (lenis) lenis.scrollTo(0, { immediate: prefersReduced }); else window.scrollTo({top:0, behavior: prefersReduced ? 'auto':'smooth'});
    closeMenu();
  }
  navBtns.forEach(btn => btn.addEventListener('click', ()=>showSection(btn.dataset.target)));
  ctAs.forEach(el => el.addEventListener('click', e => {const t=el.dataset.target;if(!t)return;e.preventDefault();showSection(t)}));
  tablinks.forEach(t => t.addEventListener('click', ()=>showSection(t.dataset.target)));
  navBtns.forEach(btn => btn.addEventListener('keydown', e => { if (e.key==='Enter' || e.key===' ') showSection(btn.dataset.target)}));
  window.addEventListener('hashchange', ()=>{ const id = location.hash.slice(1) || 'home'; if (document.getElementById(id)) showSection(id,false); });
  if (location.hash){ const id = location.hash.slice(1); if (document.getElementById(id)) setTimeout(()=>showSection(id,false),50); }

  // Typing effect
  if (!prefersReduced) {
    typeLoop(['Front‑end Enthusiast','JavaScript Lover','Problem Solver'], typedEl, 70, 800);
  } else if (typedEl) {
    typedEl.textContent = 'Front‑end Enthusiast';
  }

  // Skills animation
  function animateSkills(){
    document.querySelectorAll('.skill').forEach((s,i)=>{
      const pct=s.dataset.pct||0; const fill=s.querySelector('.bar-fill'); if(!fill) return;
      fill.style.width='0%'; setTimeout(()=>fill.style.width=pct+'%', 90*i);
    });
    radials.forEach(r=>{
      const pct=parseInt(r.dataset.pct||0,10);
      const svg=r.querySelector('.circular .progress'); if(!svg) return;
      const circumference=100; const dash=Math.round((pct/100)*circumference);
      svg.style.strokeDasharray=`${dash},100`;
      if (!prefersReduced) r.animate([{transform:'scale(.97)'},{transform:'scale(1.03)'},{transform:'scale(1)'}],{duration:800,easing:'ease-out'});
    });
  }
  if (document.getElementById('skills').classList.contains('show')) animateSkills();

  // Mobile slide menu (mobile only via CSS .only-mobile)
  function openMenu(){ mobileMenu.classList.add('show'); mobileMenu.setAttribute('aria-hidden','false'); }
  function closeMenu(){ mobileMenu.classList.remove('show'); mobileMenu.setAttribute('aria-hidden','true'); }
  menuOpen?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);
  mobileMenu?.addEventListener('click', e=>{ if(e.target===mobileMenu) closeMenu(); });
  mobileMenu?.querySelectorAll('.menu-link').forEach(link=> link.addEventListener('click', ()=> closeMenu()));

  // About counters (animated numbers)
  const counters = document.querySelectorAll('.stat[data-count]');
  const counterOnce = new Set();
  function animateCounter(el){
    if (counterOnce.has(el)) return;
    counterOnce.add(el);
    const target = parseInt(el.dataset.count,10)||0;
    const numEl = el.querySelector('.num'); if (!numEl) return;
    let v = 0;
    const step = Math.max(1, Math.round(target / 40));
    const timer = setInterval(()=> {
      v += step;
      if (v >= target){ v = target; clearInterval(timer); }
      numEl.textContent = v;
    }, 24);
  }
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if (e.isIntersecting) animateCounter(e.target); });
  }, { threshold: 0.5 });
  counters.forEach(c=> observer.observe(c));

  // Spotlight hover (About)
  const aboutCard = document.querySelector('.about-card.spotlight');
  aboutCard?.addEventListener('pointermove', (e)=>{
    const r = aboutCard.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    aboutCard.style.setProperty('--sx', x + 'px');
    aboutCard.style.setProperty('--sy', y + 'px');
  });

  // Tilt + magnet
  initTilt('.project-card, .tilt');
  initMagnet('.magnet');
});

/* Typing */
function typeLoop(words, el, speed=70, pause=800){
  if (!el) return;
  let w=0,i=0,deleting=false;
  function tick(){
    const full=words[w];
    el.textContent = deleting ? full.substring(0,--i) : full.substring(0,++i);
    if (!deleting && i===full.length){ deleting=true; return setTimeout(tick, pause); }
    if (deleting && i===0){ deleting=false; w=(w+1)%words.length; }
    setTimeout(tick, deleting?35:speed);
  } tick();
}

/* Particles */
function initParticles(selector, count=28){
  const parent=document.querySelector(selector); if(!parent) return;
  parent.innerHTML=''; parent.style.position='fixed'; parent.style.inset='0'; parent.style.zIndex='-1';
  for (let i=0;i<count;i++){
    const d=document.createElement('div'); d.className='particle-dot';
    const s=Math.random()*6+4;
    Object.assign(d.style,{
      width:s+'px',height:s+'px',left:Math.random()*100+'%',top:Math.random()*100+'%',
      position:'absolute',borderRadius:'50%',opacity:(Math.random()*0.5+0.08)+'',
      background:'linear-gradient(90deg, rgba(30,167,255,.9), rgba(255,86,200,.9))',
      filter:'blur(6px)',mixBlendMode:'screen'
    });
    parent.appendChild(d);
    animateDot(d);
  }
  function animateDot(el){
    const dur=Math.random()*8000+5000;
    const dx=Math.random()*40-20, dy=Math.random()*40-20;
    el.animate([{transform:'translate(0,0)'},{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}], {duration:dur,iterations:Infinity,direction:'alternate',easing:'ease-in-out'});
  }
}

/* Cursor */
function initCursor(node){
  if (!node) return;
  let x=innerWidth/2, y=innerHeight/2, tx=x, ty=y;
  addEventListener('mousemove', e=>{ tx=e.clientX; ty=e.clientY; }, {passive:true});
  (function raf(){ x+=(tx-x)*0.15; y+=(ty-y)*0.15; node.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`; requestAnimationFrame(raf); })();
}

/* Tilt */
function initTilt(selector){
  const els=document.querySelectorAll(selector); const max=8;
  els.forEach(card=>{
    let raf=null, rx=0, ry=0;
    (card.parentElement||card).style.perspective='900px';
    function apply(){ raf=null; card.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`; }
    card.addEventListener('mousemove', e=>{
      const r=card.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
      ry=((e.clientX-cx)/r.width)*-max; rx=((e.clientY-cy)/r.height)*max;
      if(!raf) raf=requestAnimationFrame(apply);
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transition='transform 200ms ease'; card.style.transform='rotateX(0) rotateY(0)';
      setTimeout(()=>card.style.transition='', 220);
    });
  });
}

/* Magnet */
function initMagnet(selector){
  const els=document.querySelectorAll(selector); const strength=12;
  els.forEach(el=>{
    let raf=null, x=0, y=0;
    function apply(){ raf=null; el.style.transform=`translate(${x}px, ${y}px)`; }
    el.addEventListener('mousemove', e=>{
      const r=el.getBoundingClientRect();
      const dx=(e.clientX-(r.left+r.width/2))/r.width;
      const dy=(e.clientY-(r.top+r.height/2))/r.height;
      x=dx*strength; y=dy*strength; if(!raf) raf=requestAnimationFrame(apply);
    });
    el.addEventListener('mouseleave', ()=>{
      el.style.transition='transform 150ms ease'; x=0; y=0; el.style.transform='translate(0,0)'; setTimeout(()=>el.style.transition='', 160);
    });
  });
}

/* Inline particle style */
(function(){ const s=document.createElement('style'); s.textContent='.particle-dot{pointer-events:none;}'; document.head.appendChild(s); })();
