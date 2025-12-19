// ===================================
// Initialize on DOM Ready
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  initFullPageNavigation();
  initNavigation();
  // initSmoothScroll();
  initAnimations();
  initCursor();
  initHeroStats();
  initContactForm();
  initBackToTop();
  setCurrentYear();
});

// ===================================
// Full Page Section Navigation
// ===================================
let currentSectionIndex = 0;
let isAnimating = false;

function initFullPageNavigation() {
  const sections = [...document.querySelectorAll('main section')];
  const navLinks = document.querySelectorAll('.nav-link');

  function showSection(index) {
    if (index < 0 || index >= sections.length || isAnimating) return;

    isAnimating = true;

    const current = sections[currentSectionIndex];
    const next = sections[index];

    // GSAP transition
    gsap.to(current, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        current.classList.remove('active');
      }
    });

    next.classList.add('active');

    gsap.fromTo(
      next,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        onComplete: () => {
          currentSectionIndex = index;
          isAnimating = false;
          updateNav();
          history.replaceState(null, '', `#${next.id}`);
        }
      }
    );
  }

  function updateNav() {
    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${sections[currentSectionIndex].id}`
      );
    });
  }


  // Nav click navigation
  navLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(index);
    });
  });

  // Load section from URL hash
  const hash = window.location.hash.replace('#', '');
  const startIndex = sections.findIndex(sec => sec.id === hash);
  if (startIndex >= 0) showSection(startIndex);
}


// ===================================
// Navigation
// ===================================
function initNavigation() {
  const nav = document.querySelector('.nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isActive = menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isActive);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
  }
  
  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavOnScroll);
  
  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuToggle.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion && window.Lenis) {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    // Integrate with GSAP ScrollTrigger
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
      
      window.gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      
      window.gsap.ticker.lagSmoothing(0);
    }
    
    // Store lenis instance globally for scroll-to functionality
    window.lenisInstance = lenis;
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        if (window.lenisInstance) {
          window.lenisInstance.scrollTo(target, {
            offset: -80,
            duration: 1.5
          });
        } else {
          // Fallback for browsers without Lenis
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// ===================================
// GSAP Animations
// ===================================
function initAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;
  
  gsap.registerPlugin(ScrollTrigger);
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  // Hero animations
  gsap.from('.hero-badge', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out'
  });
  
  gsap.from('.hero-title', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.2,
    ease: 'power2.out'
  });
  
  gsap.from('.hero-description', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.4,
    ease: 'power2.out'
  });
  
  gsap.from('.hero-cta', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.6,
    ease: 'power2.out'
  });
  
  gsap.from('.hero-stats', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.8,
    ease: 'power2.out'
  });
  
  gsap.from('.floating-card', {
    opacity: 0,
    scale: 0.8,
    duration: 0.8,
    stagger: 0.2,
    delay: 0.5,
    ease: 'back.out(1.7)'
  });
  
  // Section animations
  gsap.utils.toArray('section').forEach((section, index) => {
    if (section.id === 'home') return;
    
    gsap.from(section.querySelector('.section-header'), {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out'
    });
  });
  
  // About cards
  gsap.from('.about-card', {
    scrollTrigger: {
      trigger: '.about-grid',
      start: 'top 75%',
      once: true
    },
    opacity: 0,
    y: 40,
    stagger: 0.15,
    duration: 0.6,
    ease: 'power2.out'
  });
  
  // Tech stack
  gsap.from('.tech-item', {
    scrollTrigger: {
      trigger: '.tech-stack',
      start: 'top 75%',
      once: true
    },
    opacity: 0,
    scale: 0.8,
    stagger: 0.1,
    duration: 0.5,
    ease: 'back.out(1.7)'
  });
  
  // Service cards
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 75%',
      once: true
    },
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.7,
    ease: 'power2.out'
  });
  
  // Project cards
  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '.projects-grid',
      start: 'top 75%',
      once: true
    },
    opacity: 0,
    y: 60,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power2.out'
  });
  
  // Testimonial cards
  gsap.from('.testimonial-card', {
    scrollTrigger: {
      trigger: '.testimonials-grid',
      start: 'top 75%',
      once: true
    },
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.7,
    ease: 'power2.out'
  });
  
  // Contact section
  gsap.from('.contact-info', {
    scrollTrigger: {
      trigger: '.contact-grid',
      start: 'top 75%',
      once: true
    },
    opacity: 0,
    x: -50,
    duration: 0.8,
    ease: 'power2.out'
  });
  
  gsap.from('.contact-form', {
    scrollTrigger: {
      trigger: '.contact-grid',
      start: 'top 75%',
      once: true
    },
    opacity: 0,
    x: 50,
    duration: 0.8,
    ease: 'power2.out'
  });
}

// ===================================
// Custom Cursor
// ===================================
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  
  // Check if on mobile or prefers reduced motion
  const isMobile = window.matchMedia('(max-width: 1024px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (isMobile || prefersReducedMotion) {
    cursor.style.display = 'none';
    return;
  }
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Cursor interactions
  const interactiveElements = document.querySelectorAll('a, button, .project-card');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursor.style.opacity = '0.4';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.opacity = '0.6';
    });
  });
}

// ===================================
// Hero Stats Counter
// ===================================
function initHeroStats() {
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;
  
  function animateStats() {
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const updateCount = () => {
        if (current < target) {
          current += increment;
          stat.textContent = Math.ceil(current);
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target;
        }
      };
      
      updateCount();
    });
  }
  
  // Trigger animation when hero section is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        setTimeout(animateStats, 500);
      }
    });
  }, { threshold: 0.5 });
  
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    observer.observe(heroStats);
  }
}

// ===================================
// Contact Form
// ===================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      service: form.service.value,
      message: form.message.value.trim()
    };
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      form.reset();
    } catch (error) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ===================================
// Email Validation
// ===================================
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ===================================
// Toast Notification
// ===================================
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ===================================
// Back to Top Button
// ===================================
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.display = 'flex';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    if (window.lenisInstance) {
      window.lenisInstance.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
}

// ===================================
// Set Current Year
// ===================================
function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ===================================
// Utility Functions
// ===================================

// Throttle function
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ===================================
// Performance Optimization
// ===================================

// Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===================================
// Console Message
// ===================================
console.log('%cSiteforge Portfolio', 'color: #0066ff; font-size: 24px; font-weight: bold;');
console.log('%cBuilt with passion and precision', 'color: #00d9ff; font-size: 14px;');