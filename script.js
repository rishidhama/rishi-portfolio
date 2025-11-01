// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Particle System
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = 50;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 3 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    const colors = ['#7c3aed', '#2563eb', '#8b5cf6', '#3b82f6'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(particle);
    particles.push(particle);
  }
}

// Initialize particles when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createParticles);
} else {
  createParticles();
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('portfolio_theme');
const current = saved || 'dark';
document.documentElement.dataset.theme = current;
themeToggle.textContent = current === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('portfolio_theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('primaryNav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Active Nav Highlighting
const sections = document.querySelectorAll('main .section');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const id = entry.target.id;
      const activeLink = document.querySelector(`.nav a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { rootMargin: '-20% 0px -60% 0px' });

sections.forEach(section => observer.observe(section));

// Enhanced Scroll Reveal
const revealElements = document.querySelectorAll('.section-header, .project-card, .education-item, .skill-category');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }, index * 100);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

revealElements.forEach(el => {
  el.classList.add('revealed');
  revealObserver.observe(el);
});

// Project Images
document.querySelectorAll('.project-image img').forEach(img => {
  img.addEventListener('load', () => {
    img.style.opacity = '1';
  });
  if (img.complete) {
    img.style.opacity = '1';
  }
});

// Back to Top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact Form
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

const EMAILJS_SERVICE_ID = '';
const EMAILJS_TEMPLATE_ID = '';
const EMAILJS_PUBLIC_KEY = '';
const USE_EMAILJS = EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY;

if (USE_EMAILJS) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    if (window.emailjs) window.emailjs.init(EMAILJS_PUBLIC_KEY);
  };
  document.head.appendChild(script);
}

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const showError = (fieldId, message) => {
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (errorEl) errorEl.textContent = message;
};

const clearError = (fieldId) => {
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (errorEl) errorEl.textContent = '';
};

['name', 'email', 'message'].forEach(fieldId => {
  const field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener('blur', () => {
      const value = field.value.trim();
      if (!value) {
        showError(fieldId, `${fieldId === 'email' ? 'Email' : fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} is required`);
      } else if (fieldId === 'email' && !validateEmail(value)) {
        showError(fieldId, 'Please enter a valid email address');
      } else {
        clearError(fieldId);
      }
    });
    
    field.addEventListener('input', () => {
      if (field.value.trim()) clearError(fieldId);
      formMessage.style.display = 'none';
    });
  }
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  ['name', 'email', 'message'].forEach(clearError);
  formMessage.style.display = 'none';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  let isValid = true;
  if (!name) { showError('name', 'Name is required'); isValid = false; }
  if (!email) { showError('email', 'Email is required'); isValid = false; }
  else if (!validateEmail(email)) { showError('email', 'Please enter a valid email address'); isValid = false; }
  if (!message) { showError('message', 'Message is required'); isValid = false; }

  if (!isValid) {
    formMessage.textContent = 'Please fix the errors above';
    formMessage.className = 'form-message error';
    formMessage.style.display = 'block';
    return;
  }

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    if (USE_EMAILJS && window.emailjs) {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        message: message,
        to_email: 'rishidhama26@gmail.com'
      });
      formMessage.textContent = 'Thank you! Your message has been sent successfully.';
      formMessage.className = 'form-message success';
      contactForm.reset();
    } else {
      const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:rishidhama26@gmail.com?subject=${subject}&body=${body}`;
      formMessage.textContent = 'Opening your email client... If it didn\'t open, please email rishidhama26@gmail.com directly.';
      formMessage.className = 'form-message success';
    }
  } catch (error) {
    formMessage.textContent = 'Something went wrong. Please try again or email me directly at rishidhama26@gmail.com';
    formMessage.className = 'form-message error';
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    formMessage.style.display = 'block';
  }
});

