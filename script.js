// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSectionNavigation();
  initHeroStats();
  initTypingAnimation();
  initTestimonials();
  initContactForm();
  initBackToTop();
  initScrollAnimations();
  initCursorFollower();
  initParallax();
  setCurrentYear();
});

// ===================================
// Custom Cursor Follower
// ===================================
function initCursorFollower() {
  const cursorFollower = document.querySelector('.cursor-follower');
  const cursorDot = document.querySelector('.cursor-dot');
  
  if (!cursorFollower || !cursorDot) return;
  
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let dotX = 0, dotY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    dotX = mouseX;
    dotY = mouseY;
  });
  
  function animate() {
    const speed = 0.15;
    
    followerX += (mouseX - followerX) * speed;
    followerY += (mouseY - followerY) * speed;
    
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .project-card, .service-card');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.style.transform += ' scale(1.5)';
      cursorDot.style.transform += ' scale(0.5)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
      cursorDot.style.transform = cursorDot.style.transform.replace(' scale(0.5)', '');
    });
  });
}

// ===================================
// Typing Animation
// ===================================
function initTypingAnimation() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;
  
  const words = ['Experiences', 'Solutions', 'Innovations', 'Masterpieces'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
  }
  
  type();
}

// ===================================
// Scroll Animations (AOS-like)
// ===================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  const animatedElements = document.querySelectorAll('[data-aos]');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    const delay = el.getAttribute('data-aos-delay');
    if (delay) {
      el.style.transitionDelay = `${delay}ms`;
    }
    
    observer.observe(el);
  });
}

// ===================================
// Parallax Effect
// ===================================
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-card');
    
    parallaxElements.forEach((el, index) => {
      const speed = 0.5 + (index * 0.1);
      el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });
  });
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (!nav || !menuToggle || !navMenu) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
  
  menuToggle.addEventListener('click', () => {
    const isActive = menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  });
  
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ===================================
// Section Navigation
// ===================================
function initSectionNavigation() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');
  const footerLinks = document.querySelectorAll('.footer-column a[href^="#"]');
  const allLinks = [...navLinks, ...footerLinks];
  
  function showSection(sectionId) {
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${sectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      
      const menuToggle = document.getElementById('menuToggle');
      const navMenu = document.getElementById('navMenu');
      if (menuToggle && navMenu) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      if (sectionId === 'home') {
        setTimeout(() => {
          animateStats();
        }, 100);
      }
    }
  }
  
  allLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const sectionId = href.substring(1);
        showSection(sectionId);
        history.pushState(null, '', href);
      }
    });
  });
  
  const ctaButtons = document.querySelectorAll('.btn[href^="#"]');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        const sectionId = href.substring(1);
        showSection(sectionId);
        history.pushState(null, '', href);
      }
    });
  });
  
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1) || 'home';
    showSection(hash);
  });
  
  const initialHash = window.location.hash.substring(1);
  if (initialHash && document.getElementById(initialHash)) {
    showSection(initialHash);
  } else {
    showSection('home');
    setTimeout(() => {
      animateStats();
    }, 500);
  }
}

// ===================================
// Hero Stats Counter
// ===================================
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length === 0) return;
  
  statsAnimated = true;
  
  stats.forEach(stat => {
    const target = parseInt(stat.dataset.target) || 0;
    const isPercentage = stat.parentElement.querySelector('.stat-label').textContent.includes('Rate');
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * easeOutCubic);
      
      stat.textContent = isPercentage ? current + '%' : current + '+';
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        stat.textContent = isPercentage ? target + '%' : target + '+';
      }
    }
    
    requestAnimationFrame(update);
  });
}

function initHeroStats() {
  // Stats will be animated when home section becomes active
}

// ===================================
// Enhanced Testimonials
// ===================================
function initTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.querySelector('.prev-testimonial');
  const nextBtn = document.querySelector('.next-testimonial');
  
  if (!grid || !dotsContainer) return;
  
  const cards = document.querySelectorAll('.testimonial-card-new');
  let currentPage = 0;
  let autoRotateInterval;
  const CARDS_PER_PAGE = getCardsPerPage();
  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  
  function getCardsPerPage() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }
  
  // Create dots
  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('div');
      dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToPage(i));
      dotsContainer.appendChild(dot);
    }
  }
  
  createDots();
  
  // Update grid display
  function updateGrid() {
    const startIndex = currentPage * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    
    cards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.classList.add('active');
        card.style.animationDelay = `${(index - startIndex) * 0.1}s`;
      } else {
        card.classList.remove('active');
      }
    });
    
    // Update dots
    document.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPage);
    });
    
    // Update buttons
    if (prevBtn && nextBtn) {
      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = currentPage === totalPages - 1;
    }
  }
  
  function goToPage(page) {
    currentPage = page;
    updateGrid();
    resetAutoRotate();
  }
  
  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      updateGrid();
      resetAutoRotate();
    } else {
      currentPage = 0;
      updateGrid();
    }
  }
  
  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      updateGrid();
      resetAutoRotate();
    }
  }
  
  // Auto-rotate testimonials
  function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
      nextPage();
    }, 5000);
  }
  
  function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    startAutoRotate();
  }
  
  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', prevPage);
  if (nextBtn) nextBtn.addEventListener('click', nextPage);
  
  // Read more functionality
  cards.forEach(card => {
    const readMoreBtn = card.querySelector('.read-more-btn');
    const preview = card.querySelector('.testimonial-preview');
    const full = card.querySelector('.testimonial-full');
    
    if (readMoreBtn) {
      readMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close all other expanded cards
        cards.forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.classList.remove('expanded');
            const otherBtn = otherCard.querySelector('.read-more-btn');
            if (otherBtn) otherBtn.textContent = 'Read More';
          }
        });
        
        // Toggle current card
        card.classList.toggle('expanded');
        
        if (card.classList.contains('expanded')) {
          readMoreBtn.textContent = 'Read Less';
          resetAutoRotate();
        } else {
          readMoreBtn.textContent = 'Read More';
        }
      });
    }
    
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!card.contains(e.target) && card.classList.contains('expanded')) {
        card.classList.remove('expanded');
        if (readMoreBtn) readMoreBtn.textContent = 'Read More';
      }
    });
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newCardsPerPage = getCardsPerPage();
      if (newCardsPerPage !== CARDS_PER_PAGE) {
        location.reload(); // Simple solution for responsive changes
      }
    }, 250);
  });
  
  // Initial display
  updateGrid();
  startAutoRotate();
  
  // Pause on hover
  grid.addEventListener('mouseenter', () => {
    clearInterval(autoRotateInterval);
  });
  
  grid.addEventListener('mouseleave', () => {
    startAutoRotate();
  });
}

// ===================================
// Contact Form
// ===================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  // Add floating label effect
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      service: form.service.value,
      message: form.message.value.trim()
    };
    
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      form.reset();
      
      // Remove focused class from all form groups
      inputs.forEach(input => {
        input.parentElement.classList.remove('focused');
      });
      
      console.log('Form submitted:', formData);
    } catch (error) {
      showToast('Failed to send message. Please try again.', 'error');
      console.error('Form submission error:', error);
    } finally {
      submitBtn.innerHTML = originalHTML;
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
  toast.className = `toast ${type}`;
  
  void toast.offsetWidth;
  
  toast.classList.add('show');
  
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
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
// Keyboard Navigation
// ===================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu && navMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    // Close expanded testimonials
    const expandedCards = document.querySelectorAll('.testimonial-card-new.expanded');
    expandedCards.forEach(card => {
      card.classList.remove('expanded');
      const btn = card.querySelector('.read-more-btn');
      if (btn) btn.textContent = 'Read More';
    });
  }
});

// ===================================
// Console Message
// ===================================
console.log(
  '%cSiteforge Portfolio',
  'color: #0066ff; font-size: 24px; font-weight: bold;'
);
console.log(
  '%cBuilt with passion and precision ✨',
  'color: #00d9ff; font-size: 14px;'
);