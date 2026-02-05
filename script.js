// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const currentYear = document.getElementById('currentYear');
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');

// Set current year
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);

  themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.style.transition = 'background-color 0.3s, color 0.3s';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // Micro-interaction
  themeToggle.style.transform = 'scale(0.9)';
  setTimeout(() => {
    themeToggle.style.transform = 'scale(1)';
  }, 150);
}

// Carousel Functionality
class Carousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.carousel-slide');
    this.totalSlides = this.slides.length;
    this.autoScrollInterval = null;
    this.isAutoScrolling = true;
    this.isAnimating = false;

    this.init();
  }

  init() {
    this.createDots();
    this.setupEventListeners();
    this.updateCarousel();
    this.startAutoScroll();
  }

  createDots() {
    carouselDots.innerHTML = '';
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(i));
      carouselDots.appendChild(dot);
    }
  }

  setupEventListeners() {
    prevBtn.addEventListener('click', () => this.prevSlide());
    nextBtn.addEventListener('click', () => this.nextSlide());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // Touch/swipe support
    let startX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      this.stopAutoScroll();
    });

    carouselTrack.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      this.startAutoScroll();
    });

    // Pause auto-scroll on hover
    carouselTrack.addEventListener('mouseenter', () => {
      this.stopAutoScroll();
    });

    carouselTrack.addEventListener('mouseleave', () => {
      this.startAutoScroll();
    });
  }

  goToSlide(index) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.currentSlide = (index + this.totalSlides) % this.totalSlides;
    this.updateCarousel();

    // Reset auto-scroll timer
    this.stopAutoScroll();
    this.startAutoScroll();

    // Button micro-interactions
    const direction = index > this.currentSlide ? 'next' : 'prev';
    const button = direction === 'next' ? nextBtn : prevBtn;
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);

    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false;
    }, 500);
  }

  nextSlide() {
    this.goToSlide(this.currentSlide + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentSlide - 1);
  }

  updateCarousel() {
    const slideWidth = 100; // Percentage
    const translateX = -this.currentSlide * slideWidth;
    carouselTrack.style.transform = `translateX(${translateX}%)`;

    // Update active states
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });

    // Update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }

  startAutoScroll() {
    if (this.isAutoScrolling) {
      this.stopAutoScroll();
      this.autoScrollInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }
}

// Smooth Scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      if (this.getAttribute('href') === '#') return;

      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth',
        });
      }
    });
  });
}

// Animate skill bars on scroll
function initSkillAnimations() {
  const skillBars = document.querySelectorAll('.level-bar');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const width = entry.target.style.width;
          entry.target.style.width = '0%';
          setTimeout(() => {
            entry.target.style.width = width;
          }, 300);
        }
      });
    },
    {
      threshold: 0.5,
    },
  );

  skillBars.forEach((bar) => observer.observe(bar));
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSmoothScroll();
  initSkillAnimations();

  // Initialize carousel
  const carousel = new Carousel();

  // Handle window resize
  window.addEventListener('resize', () => {
    carousel.updateCarousel();
  });

  // Fade in animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

//

(function () {
  const popup = document.getElementById('dev-protect-popup');
  const closeBtn = popup.querySelector('.close-btn');

  function showPopup() {
    popup.style.display = 'flex';
  }

  function hidePopup() {
    popup.style.display = 'none';
  }

  // Disable right click
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    showPopup();
  });

  // Detect key combinations
  document.addEventListener('keydown', function (e) {
    const key = e.key.toLowerCase();

    const blocked =
      (e.ctrlKey && ['u', 'i', 's', 'j'].includes(key)) ||
      (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(key)) ||
      key === 'f12';

    if (blocked) {
      e.preventDefault();
      showPopup();
    }
  });

  closeBtn.addEventListener('click', hidePopup);
})();
