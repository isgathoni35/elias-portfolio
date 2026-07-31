/* ============================================================
   Elias Warutere Gathoni — Portfolio
   script.js — Interactivity
   Features:
     1. Navbar: scrolled border/shadow after hero
     2. Scroll-spy: highlight active nav link
     3. Scroll-reveal: IntersectionObserver fade-in-up
     4. Mobile menu: open/close, close on link, close on backdrop
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. DOM References ──────────────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const hero       = document.getElementById('hero');
  const navLinks   = document.querySelectorAll('.nav-links a');
  const sections   = document.querySelectorAll('section[id], footer[id], header[id]');

  /* ── 2. Navbar — scrolled state ─────────────────────────── */
  function updateNavbar() {
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    if (heroBottom <= 0) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ── 3. Scroll-spy — active nav link ────────────────────── */
  function updateScrollSpy() {
    const scrollY = window.scrollY;
    const navHeight = navbar ? navbar.offsetHeight : 64;

    let current = '';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - navHeight - 16;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* Combined scroll handler */
  function onScroll() {
    updateNavbar();
    updateScrollSpy();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  /* Run once on load */
  onScroll();

  /* ── 4. Scroll-reveal — IntersectionObserver ────────────── */
  var revealElements  = document.querySelectorAll('.reveal');
  var staggerGroups   = document.querySelectorAll('.reveal-stagger');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  var staggerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  staggerGroups.forEach(function (el) {
    staggerObserver.observe(el);
  });

  /* ── 5. Mobile Menu ─────────────────────────────────────── */
  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* Close on any mobile menu link click */
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* Close on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  /* ── 6. Smooth scroll offset (handles <a href="#..."> links) */
  /* html { scroll-padding-top: var(--nav-height); } in CSS handles this.
     No extra JS needed — just leaving this comment for clarity. */

})();
