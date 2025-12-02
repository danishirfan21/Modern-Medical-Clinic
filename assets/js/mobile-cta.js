/**
 * Modern Medical Clinic - Improved Sticky Mobile CTA Bar
 * Shows/hides based on scroll position with performance optimizations
 */

class MobileCtaBar {
  constructor() {
    this.ctaBar = document.querySelector('.mobile-cta-bar');
    this.hero = document.querySelector('.hero, .hero--variant-b');
    this.footer = document.querySelector('.footer');
    this.modal = document.querySelector('.modal');

    if (!this.ctaBar) return;

    this.heroHeight = this.hero ? this.hero.offsetHeight : window.innerHeight;
    this.lastScroll = 0;
    this.isVisible = false;
    this.ticking = false;

    this.init();
  }

  init() {
    // Check scroll position on load
    this.handleScroll();

    // Throttled scroll listener for performance using requestAnimationFrame
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });

    // Recalculate on resize
    window.addEventListener('resize', () => {
      this.heroHeight = this.hero ? this.hero.offsetHeight : window.innerHeight;
    });
  }

  handleScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const footerInView = this.isFooterInView();
    const modalOpen = this.modal && this.modal.classList.contains('active');

    // Show CTA bar if:
    // 1. Scrolled past hero
    // 2. Footer is not in view
    // 3. Modal is not open
    if (currentScroll > this.heroHeight && !footerInView && !modalOpen) {
      this.show();
    } else {
      this.hide();
    }

    this.lastScroll = currentScroll;
  }

  show() {
    if (!this.isVisible) {
      this.ctaBar.classList.add('visible');
      this.isVisible = true;
    }
  }

  hide() {
    if (this.isVisible) {
      this.ctaBar.classList.remove('visible');
      this.isVisible = false;
    }
  }

  isFooterInView() {
    if (!this.footer) return false;

    const footerRect = this.footer.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Check if footer top is visible in viewport
    return footerRect.top < windowHeight;
  }
}

// Initialize on DOM load and store globally for modal access
document.addEventListener('DOMContentLoaded', () => {
  window.mobileCtaBarInstance = new MobileCtaBar();
});

// Handle click-to-call functionality
document.addEventListener('DOMContentLoaded', () => {
  const callButtons = document.querySelectorAll('[href^="tel:"]');

  callButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Log analytics event (if integrated)
      console.log('Call button clicked:', this.getAttribute('href'));

      // On desktop, you might want to show a message or copy number
      if (window.innerWidth > 767) {
        // Optional: Show notification that number is being called
        // or copy to clipboard on desktop
      }
    });
  });
});

// Optional: Add haptic feedback for mobile
if ('vibrate' in navigator) {
  document.querySelectorAll('.mobile-cta-bar__button').forEach(button => {
    button.addEventListener('click', () => {
      navigator.vibrate(10); // Short vibration
    });
  });
}
