/* =============================================
   HRITVIK SAIGAONKAR — PORTFOLIO
   script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. FOOTER YEAR
  // ============================================
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ============================================
  // 2. MOBILE MENU TOGGLE
  // ============================================
  const menuBtn       = document.getElementById('mobile-menu-btn');
  const menuPanel     = document.getElementById('mobile-menu');
  const iconHamburger = document.getElementById('icon-hamburger');
  const iconClose     = document.getElementById('icon-close');

  if (menuBtn && menuPanel) {
    menuBtn.addEventListener('click', () => {
      const isOpen = menuPanel.classList.contains('open');
      menuPanel.classList.toggle('open');
      iconHamburger.classList.toggle('hidden', !isOpen);
      iconClose.classList.toggle('hidden', isOpen);
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close on mobile link click
    menuPanel.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuPanel.classList.remove('open');
        iconHamburger.classList.remove('hidden');
        iconClose.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ============================================
  // 3. SMOOTH SCROLL (offset for sticky navbar)
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight ?? 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ============================================
  // 4. NAVBAR — scroll shadow & active links
  // ============================================
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.desktop-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll-shadow on navbar
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.style.borderBottomColor = window.scrollY > 50
      ? 'rgba(255,255,255,0.07)'
      : 'rgba(255,255,255,0.04)';
  }, { passive: true });

  // Active link highlighting via IntersectionObserver
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const href = link.getAttribute('href').slice(1);
        const active = href === id || (id === 'hero' && href === 'about');
        link.classList.toggle('active-nav', active);
      });
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));


  // ============================================
  // 5. SCROLL REVEAL (Intersection Observer)
  // ============================================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Immediately reveal hero elements (above the fold)
  setTimeout(() => {
    document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));
  }, 80);


  // ============================================
  // 6. CONTACT FORM
  // ============================================
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const statusEl   = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // --- Validation ---
      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', false);
        return;
      }

      // --- Loading state ---
      setLoading(true);

      try {
        // --- Send to Formspree ---
        const res = await fetch('https://formspree.io/f/xgobkkge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        if (!res.ok) throw new Error('Server error');

        showStatus('✅ Message sent! I\'ll get back to you within 24 hours.', true);
        form.reset();
        setTimeout(() => hideStatus(), 6000);

      } catch (err) {
        showStatus('❌ Something went wrong. Please try again or email me directly.', false);
      } finally {
        setLoading(false);
      }
    });
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle('btn-loading', loading);

    const textEl    = submitBtn.querySelector('.btn-text');
    const arrowEl   = submitBtn.querySelector('.btn-icon');
    const spinnerEl = submitBtn.querySelector('.spinner');

    if (textEl)    textEl.textContent = loading ? 'Sending…' : 'Send Message';
    if (arrowEl)   arrowEl.style.display = loading ? 'none' : 'block';
    if (spinnerEl) spinnerEl.style.display = loading ? 'block' : 'none';
  }

  function showStatus(msg, success) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + (success ? 'success' : 'error');
  }

  function hideStatus() {
    if (!statusEl) return;
    statusEl.className = 'form-status';
    statusEl.textContent = '';
  }


  // ============================================
  // 7. TYPED SUBHEADING (optional subtle effect)
  // ============================================
  const typed = document.getElementById('typed-subheading');
  if (typed) {
    const phrases = [
      'Computer Engineer',
      'Full-Stack Developer',
      'AI/ML Engineer',
    ];
    let phraseIndex = 0;
    let charIndex   = 0;
    let deleting    = false;
    let pause       = false;

    function type() {
      if (pause) return;
      const current = phrases[phraseIndex];

      if (!deleting) {
        typed.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          pause = true;
          setTimeout(() => { deleting = true; pause = false; type(); }, 2200);
          return;
        }
      } else {
        typed.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 45 : 90);
    }

    type();
  }

});
