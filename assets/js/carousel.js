/**
 * Modern Medical Clinic - Doctors Carousel
 * Horizontal scrolling carousel with navigation dots and auto-scroll
 */

class DoctorsCarousel {
  constructor(carouselElement) {
    this.carousel = carouselElement;
    this.track = this.carousel.querySelector('.doctors-carousel__track');
    this.cards = this.carousel.querySelectorAll('.doctor-card');
    this.navContainer = this.carousel.querySelector('.carousel-nav');
    this.prevButton = this.carousel.querySelector('.carousel-button--prev');
    this.nextButton = this.carousel.querySelector('.carousel-button--next');

    if (!this.track || this.cards.length === 0) return;

    this.currentIndex = 0;
    this.autoScrollInterval = null;
    this.isAutoScrolling = true;

    this.init();
  }

  init() {
    this.createNavigationDots();
    this.addEventListeners();
    // Ensure we start at index 0
    this.track.scrollLeft = 0;
    this.currentIndex = 0;
    this.updateActiveDot();
    this.updateButtonStates();
    this.startAutoScroll();
  }

  createNavigationDots() {
    if (!this.navContainer) return;

    this.navContainer.innerHTML = '';

    this.cards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-nav__dot';
      dot.setAttribute('aria-label', `Go to doctor ${index + 1}`);
      dot.dataset.index = index;

      if (index === 0) {
        dot.classList.add('carousel-nav__dot--active');
      }

      this.navContainer.appendChild(dot);
    });
  }

  addEventListeners() {
    // Navigation buttons
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.previousSlide();
        this.stopAutoScroll();
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.nextSlide();
        this.stopAutoScroll();
      });
    }

    // Navigation dots click
    if (this.navContainer) {
      this.navContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('carousel-nav__dot')) {
          const index = parseInt(e.target.dataset.index);
          this.goToSlide(index);
          this.stopAutoScroll();
        }
      });
    }

    // Track scroll event for updating active dot
    this.track.addEventListener('scroll', () => {
      this.updateActiveSlideOnScroll();
    });

    // Pause auto-scroll on hover
    this.carousel.addEventListener('mouseenter', () => {
      this.stopAutoScroll();
    });

    // Resume auto-scroll on mouse leave (optional)
    this.carousel.addEventListener('mouseleave', () => {
      if (this.isAutoScrolling) {
        this.startAutoScroll();
      }
    });

    // Pause on touch/interaction
    this.track.addEventListener('touchstart', () => {
      this.stopAutoScroll();
    });

    // Keyboard navigation
    this.carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousSlide();
        this.stopAutoScroll();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
        this.stopAutoScroll();
      }
    });
  }

  goToSlide(index) {
    if (index < 0 || index >= this.cards.length) return;

    this.currentIndex = index;
    const card = this.cards[index];
    const scrollLeft = card.offsetLeft - this.track.offsetLeft;

    this.track.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });

    this.updateActiveDot();
    this.updateButtonStates();
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.cards.length;
    this.goToSlide(nextIndex);
  }

  previousSlide() {
    const prevIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.goToSlide(prevIndex);
  }

  updateButtonStates() {
    if (!this.prevButton || !this.nextButton) return;

    // Optionally disable buttons at start/end (or keep them cycling)
    // For continuous carousel, we don't disable
    this.prevButton.disabled = false;
    this.nextButton.disabled = false;
  }

  updateActiveSlideOnScroll() {
    const trackCenter = this.track.scrollLeft + this.track.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    this.cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(trackCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== this.currentIndex) {
      this.currentIndex = closestIndex;
      this.updateActiveDot();
      this.updateButtonStates();
    }
  }

  updateActiveDot() {
    if (!this.navContainer) return;

    const dots = this.navContainer.querySelectorAll('.carousel-nav__dot');
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('carousel-nav__dot--active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('carousel-nav__dot--active');
        dot.removeAttribute('aria-current');
      }
    });
  }

  startAutoScroll() {
    this.stopAutoScroll(); // Clear any existing interval

    this.autoScrollInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5 seconds
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }
}

// Initialize carousel on page load
document.addEventListener('DOMContentLoaded', () => {
  const carouselElements = document.querySelectorAll('.doctors-carousel');

  carouselElements.forEach(element => {
    new DoctorsCarousel(element);
  });
});

// Alternative: Simple scroll buttons (if needed)
function addCarouselScrollButtons() {
  const carousels = document.querySelectorAll('.doctors-carousel__container');

  carousels.forEach(container => {
    const track = container.querySelector('.doctors-carousel__track');
    if (!track) return;

    // Create buttons
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-button carousel-button--prev';
    prevButton.innerHTML = '←';
    prevButton.setAttribute('aria-label', 'Previous doctor');

    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-button carousel-button--next';
    nextButton.innerHTML = '→';
    nextButton.setAttribute('aria-label', 'Next doctor');

    // Add styles dynamically
    const buttonStyle = `
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: var(--color-background);
      border: 2px solid var(--color-primary-dark);
      color: var(--color-primary-dark);
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 10;
      display: none;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-fast);
    `;

    prevButton.style.cssText = buttonStyle + 'left: 1rem;';
    nextButton.style.cssText = buttonStyle + 'right: 1rem;';

    // Show on hover
    container.style.position = 'relative';
    container.addEventListener('mouseenter', () => {
      prevButton.style.display = 'flex';
      nextButton.style.display = 'flex';
    });

    container.addEventListener('mouseleave', () => {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
    });

    // Scroll functionality
    const scrollAmount = 340; // Card width + gap

    prevButton.addEventListener('click', () => {
      track.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });

    nextButton.addEventListener('click', () => {
      track.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });

    container.appendChild(prevButton);
    container.appendChild(nextButton);
  });
}

// Uncomment to enable scroll buttons
// document.addEventListener('DOMContentLoaded', addCarouselScrollButtons);
