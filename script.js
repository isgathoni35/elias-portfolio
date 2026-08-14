/* ============================================================
   Elias Warutere Gathoni — Portfolio
   script.js — Interactive Cyber Biotech Particle Canvas, HUD,
               Typewriter Decrypt, 3D Tilt, and Command Palette
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. DOM References ──────────────────────────────────── */
  const navbar            = document.getElementById('navbar');
  const hamburger         = document.getElementById('nav-hamburger');
  const mobileMenu        = document.getElementById('mobile-menu');
  const hero              = document.getElementById('hero');
  const navLinks          = document.querySelectorAll('.nav-links a');
  const sections          = document.querySelectorAll('section[id], footer[id], header[id]');
  const canvas            = document.getElementById('bg-canvas');
  const typewriterEl      = document.getElementById('hero-typewriter');
  const cmdBackdrop       = document.getElementById('cmd-palette-backdrop');
  const cmdInput          = document.getElementById('cmd-input');
  const cmdResults        = document.getElementById('cmd-results');
  const openCmdBtn        = document.getElementById('open-cmd-palette');
  const mobileOpenCmdBtn  = document.getElementById('mobile-open-cmd');

  /* ── 2. Background Cyber Biotech Molecular Canvas ───────── */
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 75;
    const maxDistance = 140;

    let mouse = {
      x: null,
      y: null,
      radius: 130
    };

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseout', function () {
      mouse.x = null;
      mouse.y = null;
    });

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class MolecularNode {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        // 70% Emerald, 20% Cyan, 10% Purple
        const rand = Math.random();
        if (rand < 0.7) {
          this.color = 'rgba(0, 255, 159, ';
        } else if (rand < 0.9) {
          this.color = 'rgba(0, 240, 255, ';
        } else {
          this.color = 'rgba(168, 85, 247, ';
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '0.7)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2;
            this.y -= (dy / dist) * force * 2;
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new MolecularNode());
      }
    }

    function connectNodes() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = 1 - (dist / maxDistance);
            ctx.strokeStyle = `rgba(0, 255, 159, ${alpha * 0.22})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectNodes();

      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    resize();
    initParticles();
    animate();
  }

  /* ── 3. Dynamic Terminal Typewriter Subtitle ─────────────── */
  if (typewriterEl) {
    const roles = [
      'Synthetic Biology Enthusiast // Full-Stack Developer',
      'Computational Biology Researcher // Molecular Docking',
      'Full-Stack Web Engineer // Next.js & Python Tools',
      'BSc. Biochemistry // University of Nairobi 2026'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typingSpeed = 50;
    const pauseDelay = 2200;

    function typeLoop() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = typingSpeed;

      if (isDeleting) {
        speed /= 1.8;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        speed = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        speed = 400;
      }

      setTimeout(typeLoop, speed);
    }

    setTimeout(typeLoop, 800);
  }

  /* ── 4. 3D Perspective Card Tilt ────────────────────────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.project-card, .skill-card, .stat-box');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── 5. Power-User Command Palette (Ctrl + K) ────────────── */
  function openCmdPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.add('open');
    cmdBackdrop.setAttribute('aria-hidden', 'false');
    if (cmdInput) {
      cmdInput.value = '';
      filterCmdItems('');
      setTimeout(() => cmdInput.focus(), 50);
    }
  }

  function closeCmdPalette() {
    if (!cmdBackdrop) return;
    cmdBackdrop.classList.remove('open');
    cmdBackdrop.setAttribute('aria-hidden', 'true');
  }

  function filterCmdItems(query) {
    if (!cmdResults) return;
    const items = cmdResults.querySelectorAll('.cmd-item');
    const q = query.toLowerCase().trim();

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (openCmdBtn) openCmdBtn.addEventListener('click', openCmdPalette);
  if (mobileOpenCmdBtn) {
    mobileOpenCmdBtn.addEventListener('click', () => {
      closeMenu();
      openCmdPalette();
    });
  }

  if (cmdBackdrop) {
    cmdBackdrop.addEventListener('click', e => {
      if (e.target === cmdBackdrop) closeCmdPalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', e => {
      filterCmdItems(e.target.value);
    });

    cmdInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeCmdPalette();
      } else if (e.key === 'Enter') {
        const visibleItems = Array.from(cmdResults.querySelectorAll('.cmd-item')).filter(el => el.style.display !== 'none');
        if (visibleItems.length > 0) {
          executeCmdItem(visibleItems[0]);
        }
      }
    });
  }

  function executeCmdItem(item) {
    const action = item.getAttribute('data-action');
    if (action === 'goto') {
      const target = item.getAttribute('data-target');
      closeCmdPalette();
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'link') {
      const url = item.getAttribute('data-url');
      window.open(url, '_blank');
      closeCmdPalette();
    } else if (action === 'download') {
      const url = item.getAttribute('data-url');
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      a.click();
      closeCmdPalette();
    }
  }

  if (cmdResults) {
    cmdResults.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => executeCmdItem(item));
    });
  }

  /* Global Keyboard Shortcuts */
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdBackdrop && cmdBackdrop.classList.contains('open')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    } else if (e.key === 'Escape' && cmdBackdrop && cmdBackdrop.classList.contains('open')) {
      closeCmdPalette();
    }
  });

  /* ── 6. Navbar — Scrolled State ─────────────────────────── */
  function updateNavbar() {
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    if (heroBottom <= 0) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ── 7. Scroll-Spy — Active Nav Link ────────────────────── */
  function updateScrollSpy() {
    const scrollY = window.scrollY;
    const navHeight = navbar ? navbar.offsetHeight : 72;

    let current = '';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - navHeight - 30;
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

  function onScroll() {
    updateNavbar();
    updateScrollSpy();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 8. Scroll-Reveal — IntersectionObserver ────────────── */
  const revealElements = document.querySelectorAll('.reveal');
  const staggerGroups  = document.querySelectorAll('.reveal-stagger');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  const staggerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  staggerGroups.forEach(function (el) {
    staggerObserver.observe(el);
  });

  /* ── 9. Mobile Menu ─────────────────────────────────────── */
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

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

})();
