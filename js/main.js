/**
 * HARSHH — Personal Portfolio (Vanilla JavaScript)
 * Performance-first, accessible, zero external dependencies.
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. Theme Management (Dark / Light Mode)
  // ==========================================================================
  const THEME_STORAGE_KEY = 'harshh_portfolio_theme';
  const htmlElement = document.documentElement;
  const themeMetaTag = document.querySelector('meta[name="theme-color"]');

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // Default to the signature warm off-white editorial theme (#F5F3ED)
    return 'light';
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (themeMetaTag) {
      themeMetaTag.setAttribute('content', theme === 'dark' ? '#0E0F11' : '#F5F3ED');
    }
  }

  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  // Initialize theme immediately
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Attach toggle listeners
  const themeToggle = document.getElementById('theme-toggle');
  const drawerThemeToggle = document.getElementById('drawer-theme-toggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  if (drawerThemeToggle) {
    drawerThemeToggle.addEventListener('click', toggleTheme);
    drawerThemeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  // ==========================================================================
  // 2. Opening Animation — Handwritten SVG "hello"
  // ==========================================================================
  const introOverlay = document.getElementById('intro-overlay');
  const skipIntroBtn = document.getElementById('skip-intro-btn');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function endIntro() {
    if (!introOverlay) return;
    introOverlay.classList.add('fade-out');
    setTimeout(() => {
      introOverlay.style.display = 'none';
      introOverlay.setAttribute('aria-hidden', 'true');
    }, 750);
  }

  if (prefersReducedMotion) {
    if (introOverlay) introOverlay.style.display = 'none';
  } else if (introOverlay) {
    // Setup paths for stroke drawing
    const paths = [
      { id: 'path-h', delay: 200, duration: 600 },
      { id: 'path-e', delay: 750, duration: 350 },
      { id: 'path-l1', delay: 1050, duration: 400 },
      { id: 'path-l2', delay: 1400, duration: 400 },
      { id: 'path-o', delay: 1750, duration: 450 }
    ];

    paths.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) {
        const length = el.getTotalLength ? el.getTotalLength() : 800;
        el.style.strokeDasharray = `${length}`;
        el.style.strokeDashoffset = `${length}`;
        el.style.transition = `stroke-dashoffset ${item.duration}ms cubic-bezier(0.35, 0, 0.25, 1)`;

        setTimeout(() => {
          el.style.strokeDashoffset = '0';
        }, item.delay);
      }
    });

    // Hold word briefly, then fade out
    const totalAnimationTime = 2500;
    const introTimeout = setTimeout(() => {
      endIntro();
    }, totalAnimationTime);

    // Skip controls
    if (skipIntroBtn) {
      skipIntroBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(introTimeout);
        endIntro();
      });
    }

    introOverlay.addEventListener('click', () => {
      clearTimeout(introTimeout);
      endIntro();
    });

    window.addEventListener('keydown', function onKeyDown(e) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        clearTimeout(introTimeout);
        endIntro();
        window.removeEventListener('keydown', onKeyDown);
      }
    });
  }

  // ==========================================================================
  // 3. Mobile Navigation Drawer
  // ==========================================================================
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', openDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================================================
  // 4. Project Category Filtering
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetFilter = btn.getAttribute('data-filter');

      // Update button active states
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter project cards
      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (targetFilter === 'all' || categories.includes(targetFilter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ==========================================================================
  // 5. Copy Email to Clipboard
  // ==========================================================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailTextEl = document.getElementById('email-text');
  const copyFeedback = document.getElementById('copy-feedback');

  if (copyEmailBtn && emailTextEl && copyFeedback) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = emailTextEl.textContent.trim();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for older environments
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        copyFeedback.classList.add('show');
        setTimeout(() => {
          copyFeedback.classList.remove('show');
        }, 2500);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }

  // ==========================================================================
  // 6. Interactive Quick Inquiry Form
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill out all required fields.';
        formStatus.style.color = '#DC2626';
        formStatus.style.display = 'block';
        return;
      }

      // Generate mailto link
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:wtorque@outlook.com?subject=${subject}&body=${body}`;

      formStatus.textContent = 'Opening your email client to send message...';
      formStatus.classList.add('success');
      formStatus.style.display = 'block';

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });
  }

  // ==========================================================================
  // 7. Live GitHub Stars Indicator
  // ==========================================================================
  const starCountEl = document.getElementById('nav-star-count');
  if (starCountEl) {
    fetch('https://api.github.com/users/wtorque/repos?per_page=100')
      .then(res => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then(repos => {
        if (Array.isArray(repos)) {
          const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
          // If total stars > 0, update element
          if (totalStars > 0) {
            starCountEl.textContent = totalStars;
          }
        }
      })
      .catch(() => {
        // Fallback default star count from visual reference is preserved
      });
  }

  // ==========================================================================
  // 8. Navigation ScrollSpy & Active Link Indicator
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

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

  window.addEventListener('scroll', updateActiveNav, { passive: true });

})();
