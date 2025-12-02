/**
 * Modern Medical Clinic - Main JavaScript
 * Handles core functionality: mobile nav, smooth scroll, animations, modal, A/B toggle
 */

// ============================================
// MOBILE NAVIGATION TOGGLE
// ============================================

const headerToggle = document.querySelector('.header__toggle');
const nav = document.querySelector('.nav');

if (headerToggle && nav) {
  headerToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    const isExpanded = nav.classList.contains('active');
    headerToggle.setAttribute('aria-expanded', isExpanded);

    // Toggle icon
    headerToggle.innerHTML = isExpanded ? '✕' : '☰';
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !headerToggle.contains(e.target)) {
      nav.classList.remove('active');
      headerToggle.setAttribute('aria-expanded', 'false');
      headerToggle.innerHTML = '☰';
    }
  });

  // Close menu when clicking a link
  const navLinks = nav.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      headerToggle.setAttribute('aria-expanded', 'false');
      headerToggle.innerHTML = '☰';
    });
  });
}

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// IMPROVED FADE-IN ANIMATIONS ON SCROLL
// ============================================

class ImprovedFadeInObserver {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.observerOptions
    );

    this.init();
  }

  init() {
    const elements = document.querySelectorAll('.fade-in');
    
    // Observe elements in batches to improve performance
    elements.forEach((el, index) => {
      setTimeout(() => {
        this.observer.observe(el);
      }, index * 10);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// Initialize improved fade-in observer
const fadeInObserver = new ImprovedFadeInObserver();

// ============================================
// IMPROVED BOOKING MODAL (iOS COMPATIBLE)
// ============================================

class ModalManager {
  constructor() {
    this.scrollPosition = 0;
    this.modal = document.getElementById('bookingModal');
    this.openButtons = document.querySelectorAll('[data-modal="booking"]');
    this.closeButton = document.querySelector('.modal__close');
    
    if (!this.modal) return;
    
    this.init();
  }

  init() {
    // Open modal handlers
    this.openButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
      
      // Keyboard accessibility
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openModal();
        }
      });
    });

    // Close modal handlers
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.closeModal());
    }

    // Close on backdrop click (only backdrop, not content)
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  openModal() {
    // Save current scroll position
    this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Lock scroll (iOS compatible)
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.classList.add('modal-open');
    
    // Show modal
    this.modal.classList.add('active');
    
    // Focus first input
    setTimeout(() => {
      const firstInput = this.modal.querySelector('input, select, textarea');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);

    // Hide mobile CTA bar
    const mobileCta = document.querySelector('.mobile-cta-bar');
    if (mobileCta) {
      mobileCta.style.display = 'none';
    }
  }

  closeModal() {
    // Hide modal
    this.modal.classList.remove('active');
    
    // Unlock scroll
    document.body.classList.remove('modal-open');
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    // Restore scroll position
    window.scrollTo(0, parseInt(scrollY || '0') * -1);

    // Show mobile CTA bar if it should be visible
    const mobileCta = document.querySelector('.mobile-cta-bar');
    if (mobileCta) {
      mobileCta.style.display = '';
      // Trigger mobile CTA check
      if (window.mobileCtaBarInstance) {
        window.mobileCtaBarInstance.handleScroll();
      }
    }
  }
}

// Initialize modal manager
let modalManager;
if (document.getElementById('bookingModal')) {
  modalManager = new ModalManager();
}

// ============================================
// BOOKING FORM SUBMISSION
// ============================================

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);

    // Simulate submission
    console.log('Booking submitted:', data);

    // Show success message
    const modalBody = bookingModal.querySelector('.modal__body');
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 4rem; color: var(--color-accent-sage); margin-bottom: 1rem;">✓</div>
        <h3 style="margin-bottom: 1rem;">Appointment Request Received!</h3>
        <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
          We'll confirm your appointment within 2 hours during business hours.
          You'll receive an email at <strong>${data.email}</strong>.
        </p>
        <button class="btn btn--primary" onclick="location.reload()">Close</button>
      </div>
    `;
  });
}

// ============================================
// HERO A/B VARIANT TOGGLE
// ============================================

const heroAbToggle = document.getElementById('heroAbToggle');
const heroVariantA = document.getElementById('heroVariantA');
const heroVariantB = document.getElementById('heroVariantB');

if (heroAbToggle && heroVariantA && heroVariantB) {
  let currentVariant = 'A';

  heroAbToggle.addEventListener('click', () => {
    if (currentVariant === 'A') {
      heroVariantA.style.display = 'none';
      heroVariantB.style.display = 'grid';
      heroAbToggle.textContent = 'View Variant A (Trust)';
      currentVariant = 'B';
    } else {
      heroVariantA.style.display = 'flex';
      heroVariantB.style.display = 'none';
      heroAbToggle.textContent = 'View Variant B (Convenience)';
      currentVariant = 'A';
    }
  });
}

// ============================================
// TABS (for Doctor Profile page)
// ============================================

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetTab = button.dataset.tab;

    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked button and corresponding content
    button.classList.add('active');
    const targetContent = document.getElementById(targetTab);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});

// ============================================
// IMPROVED FORM VALIDATION
// ============================================

class ImprovedFormValidation {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');

      inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => {
          this.validateField(input);
        });

        // Clear error on input
        input.addEventListener('input', () => {
          this.clearError(input);
        });
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required field check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email (e.g., name@example.com)';
      }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    if (!isValid) {
      this.showError(field, errorMessage);
    } else {
      this.clearError(field);
    }

    return isValid;
  }

  showError(field, message) {
    field.classList.add('error');
    field.style.borderColor = 'var(--color-error)';
    field.setAttribute('aria-invalid', 'true');

    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'var(--color-error)';
    errorDiv.style.fontSize = 'var(--font-size-small)';
    errorDiv.style.marginTop = 'var(--space-xs)';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
  }

  clearError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    field.removeAttribute('aria-invalid');

    const errorDiv = field.parentElement.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.remove();
    }
  }
}

// Initialize improved form validation
const formValidation = new ImprovedFormValidation();

// ============================================
// INITIALIZE ON DOM LOADED
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Modern Medical Clinic website initialized');

  // Set current year in footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Add active class to current nav item
  setActiveNavLink();
  
  // Add skip link for accessibility
  addSkipLink();
});

// ============================================
// PERFORMANCE: Lazy loading images
// ============================================

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// NAV ACTIVE STATE MANAGEMENT
// ============================================

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav__link').forEach(link => {
    const linkHref = link.getAttribute('href');
    
    if (linkHref === currentPage) {
      link.classList.add('nav__link--active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('nav__link--active');
      link.removeAttribute('aria-current');
    }
  });
}

// ============================================
// SKIP LINK FUNCTIONALITY
// ============================================

function addSkipLink() {
  // Check if skip link already exists
  if (document.querySelector('.skip-link')) return;

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';

  // Insert at beginning of body
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Find or create main content wrapper
  let mainContent = document.getElementById('main-content');
  if (!mainContent) {
    // Wrap first section after header in main
    const header = document.querySelector('header');
    const firstSection = header ? header.nextElementSibling : document.body.firstChild;
    
    if (firstSection && firstSection.tagName !== 'FOOTER') {
      firstSection.id = 'main-content';
      firstSection.setAttribute('tabindex', '-1');
    }
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export utilities for use in other scripts
window.utilityFunctions = {
  debounce,
  throttle
};

console.log('✅ Modern Medical Clinic - JavaScript loaded successfully');
