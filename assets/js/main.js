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
// FADE-IN ANIMATIONS ON SCROLL
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

// ============================================
// BOOKING MODAL
// ============================================

const bookingModal = document.getElementById('bookingModal');
const openModalButtons = document.querySelectorAll('[data-modal="booking"]');
const closeModalButton = document.querySelector('.modal__close');

// Open modal
openModalButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    if (bookingModal) {
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Focus first input
      const firstInput = bookingModal.querySelector('input, select, textarea');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  });
});

// Close modal
if (closeModalButton && bookingModal) {
  closeModalButton.addEventListener('click', () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close on backdrop click
  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
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
// FORM VALIDATION
// ============================================

const forms = document.querySelectorAll('form');

forms.forEach(form => {
  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach(input => {
    // Add validation on blur
    input.addEventListener('blur', () => {
      validateField(input);
    });

    // Remove error on input
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        input.classList.remove('error');
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.remove();
        }
      }
    });
  });
});

function validateField(field) {
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

  // Phone validation (basic)
  if (field.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value) || value.length < 10) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }
  }

  // Display error or remove it
  if (!isValid) {
    field.classList.add('error');
    field.style.borderColor = 'var(--color-error)';

    // Add error message if not exists
    if (!field.parentElement.querySelector('.error-message')) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.color = 'var(--color-error)';
      errorDiv.style.fontSize = 'var(--font-size-small)';
      errorDiv.style.marginTop = 'var(--space-xs)';
      errorDiv.textContent = errorMessage;
      field.parentElement.appendChild(errorDiv);
    }
  } else {
    field.classList.remove('error');
    field.style.borderColor = '';
    const errorDiv = field.parentElement.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  return isValid;
}

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
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.style.color = 'var(--color-primary-main)';
    }
  });
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
