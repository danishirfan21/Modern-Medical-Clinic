/**
 * Modern Medical Clinic - Sticky Mobile CTA Bar
 * Shows/hides based on scroll position
 */

class MobileCtaBar {
  constructor() {
    this.ctaBar = document.querySelector('.mobile-cta-bar');
    this.hero = document.querySelector('.hero, .hero--variant-b');
    this.footer = document.querySelector('.footer');

    if (!this.ctaBar) return;

    this.heroHeight = this.hero ? this.hero.offsetHeight : window.innerHeight;
    this.lastScroll = 0;
    this.isVisible = false;

    this.init();
  }

  init() {
    // Check scroll position on load
    this.handleScroll();

    // Listen to scroll events
    window.addEventListener('scroll', () => this.handleScroll());

    // Recalculate on resize
    window.addEventListener('resize', () => {
      this.heroHeight = this.hero ? this.hero.offsetHeight : window.innerHeight;
    });
  }

  handleScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Check if footer is in viewport
    const footerInView = this.isFooterInView();

    // Show CTA bar if:
    // 1. Scrolled past hero (more than 100vh)
    // 2. Scrolling down or already past threshold
    // 3. Footer is not in view

    if (currentScroll > this.heroHeight && !footerInView) {
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

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new MobileCtaBar();
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
