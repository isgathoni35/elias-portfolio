/* ============================================================
   Elias Warutere Gathoni — Portfolio
   script.js — Interactive Cyber Biotech Particle Canvas, HUD,
               Typewriter Decrypt, 3D Tilt, Category Filter Tabs,
               Cursor Border Tracker, Quick-View Modal, and Command Palette
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
  
  // Command Palette
  const cmdBackdrop       = document.getElementById('cmd-palette-backdrop');
  const cmdInput          = document.getElementById('cmd-input');
  const cmdResults        = document.getElementById('cmd-results');
  const openCmdBtn        = document.getElementById('open-cmd-palette');
  const mobileOpenCmdBtn  = document.getElementById('mobile-open-cmd');

  // Project Filter Tabs & Quick-View Modal
  const filterTabs        = document.querySelectorAll('.filter-tab');
  const projectCards      = document.querySelectorAll('.project-card');
  const modalBackdrop     = document.getElementById('project-modal-backdrop');
  const modalCloseBtn     = document.getElementById('modal-close-btn');
  const modalBody         = document.getElementById('modal-body');

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
      'AI Front-End Engineer // Flyrank AI',
      'Agentic Software Engineer // Next.js & React',
      'Computational Biology Researcher // Molecular Docking',
      'Quantitative Researcher // WorldQuant BRAIN Gold Tier',
      'BSc. Biochemistry // University of Nairobi'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typingSpeed = 50;
    const pauseDelay = 2200;

    function typeLoop() {
      // If user has scrolled past hero, pause typing to eliminate background layout shifts & save CPU
      if (window.scrollY > (hero ? hero.offsetHeight : 600)) {
        setTimeout(typeLoop, 500);
        return;
      }

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

  /* ── 4. 3D Card Tilt & Mouse-Tracking Glow Border ────────── */
  const interactiveCards = document.querySelectorAll('.project-card, .skill-card, .stat-box');

  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables for radial border shine
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D perspective tilt
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── 5. Project Category Filter Tabs ────────────────────── */
  if (filterTabs.length > 0) {
    // Set initial hero card layout
    const firstCard = document.querySelector('.project-card');
    if (firstCard) firstCard.classList.add('hero-card');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'none';
            }, 50);
          } else {
            card.classList.add('is-hidden');
          }
        });

        // If 'all', make the first card span across 2 cols
        const visibleCards = Array.from(projectCards).filter(c => !c.classList.contains('is-hidden'));
        projectCards.forEach(c => c.classList.remove('hero-card'));
        if (filter === 'all' && visibleCards.length > 0) {
          visibleCards[0].classList.add('hero-card');
        }
      });
    });
  }

  /* ── 6. Project Quick-View Modals ────────────────────────── */
  const projectData = {
    g2g: {
      tag: 'FULL-STACK WEB PLATFORM // NEXT.JS + SUPABASE',
      title: 'G2G Biochemistry Community Hub',
      banner: 'assets/projects/g2g.png',
      desc: 'A full-stack academic and career platform engineered for biochemistry students at the University of Nairobi. It bridges the gap between scientific coursework, peer research sharing, and professional mentorship networks.',
      problem: 'Biochemistry students lacked a centralized, dedicated digital commons to exchange lab protocols, coordinate peer study groups, and connect with postgraduate mentors.',
      architecture: [
        'Next.js 15+ App Router with React Server Components',
        'Supabase BaaS: PostgreSQL database, Row Level Security (RLS)',
        'Supabase Auth: JWT session management & secure role authorization',
        'Tailwind CSS: Responsive cyberpunk-inspired design system',
        'Vercel: Continuous integration and edge serverless deployment'
      ],
      features: [
        'Dynamic peer resource repository with file upload & categorization',
        'Real-time study group networking feeds and discussion threads',
        'Departmental announcements & lab safety workshop registrations',
        'Live 3D interactive DNA double-helix visualization widget'
      ],
      links: [
        { label: 'Launch Live Platform ↗', url: 'https://g2g-community.vercel.app/', primary: true }
      ]
    },
    dna: {
      tag: 'BIOINFORMATICS & GENOMICS TOOL // PYTHON + STREAMLIT',
      title: 'DNA Nucleotide Counter & Composition Visualizer',
      banner: 'assets/projects/dna.jpg',
      desc: 'An interactive bioinformatics web application designed for rapid genomic sequence analysis, calculating nucleotide distributions and compositional metrics from raw FASTA inputs.',
      problem: 'Manually parsing large FASTA sequence files and calculating GC-content ratios during molecular genetics coursework is time-consuming and error-prone.',
      architecture: [
        'Python 3.11 core parsing algorithms',
        'Streamlit interactive reactive web framework',
        'BioPython for rigorous genomic sequence verification',
        'Pandas DataFrame manipulation for statistical breakdowns',
        'Altair declarative charting for real-time visualization'
      ],
      features: [
        'Instant A, T, G, C base count extraction from multi-line FASTA strings',
        'Automated GC-content percentage calculation for thermal stability analysis',
        'Dynamic interactive bar charts & tabular frequency distribution tables',
        'Lightweight, zero-install accessible cloud deployment'
      ],
      links: [
        { label: 'Launch Tool ↗', url: 'https://dna-app-elias.streamlit.app', primary: true },
        { label: 'Source Code ↗', url: 'https://github.com/isgathoni35/dna-app', primary: false }
      ]
    },
    garlic: {
      tag: 'MOLECULAR DOCKING CAPSTONE // COMPUTATIONAL BIO',
      title: 'Garlic Secondary Metabolites vs. Aspergillus flavus',
      banner: 'assets/projects/garlic.jpg',
      desc: 'Undergraduate capstone research investigating the computational binding affinity and pharmacological inhibition potential of secondary organosulfur metabolites from Allium sativum against pathogenic Aspergillus flavus target proteins.',
      problem: 'Aspergillus flavus produces carcinogenic aflatoxins that contaminate food supplies. Synthesizing synthetic fungicides causes resistance, necessitating the identification of natural bioactive inhibitors.',
      architecture: [
        'AutoDock Vina: Semi-flexible molecular docking simulation engine',
        'PyRx: Automated virtual screening GUI & ligand energy minimization',
        'BIOVIA Discovery Studio: 2D/3D non-covalent receptor-ligand interaction mapping',
        'Python Scripting: Automated binding affinity data extraction & analysis'
      ],
      features: [
        'Screening of Allicin, Ajoene, Diallyl Disulfide against fungal target enzymes',
        'Target protein crystal structure preparation from Protein Data Bank (PDB)',
        'Evaluation of binding energies (ΔG kcal/mol), RMSD values, and hydrogen bonding networks',
        'Actionable computational proof for natural biocontrol formulations'
      ],
      links: []
    },
    portfolio: {
      tag: 'WEB ENGINEERING // VANILLA CYBER BIOTECH SYSTEM',
      title: 'Cyber Biotech Developer Portfolio',
      banner: 'assets/projects/portfolio.png',
      desc: 'A custom, performance-engineered personal portfolio articulating the convergence of Biochemistry and Software Engineering. Features zero heavy runtime dependencies and custom HTML5 particle physics.',
      problem: 'Generic portfolio templates fail to convey the unique intersection of computational molecular science and modern software engineering.',
      architecture: [
        'HTML5 Semantic Architecture & Microdata markup',
        'Vanilla CSS with custom tokens, glassmorphism, and responsive breakpoints',
        'Interactive HTML5 Canvas particle network simulating synaptic molecular nodes',
        'ES6+ JavaScript for 3D card tilt physics, Command Palette, and typewriter decrypt'
      ],
      features: [
        'Command Palette (Ctrl + K) for rapid keyboard-driven navigation',
        'Duotone holographic profile photo grading with continuous scanline sweeps',
        'Dynamic Project Category Filter tabs for instantaneous browsing',
        '100% responsive across mobile, tablet, and widescreen desktop displays'
      ],
      links: []
    },
    genai: {
      tag: 'DEEP LEARNING ROADMAP // GEOMETRIC AI',
      title: 'Generative AI for 3D Protein Folding & Design',
      banner: 'assets/projects/genai.jpg',
      desc: 'An exploratory technical roadmap investigating the application of transformer-based attention models and geometric deep learning to predict 3D protein tertiary structures directly from 1D primary sequences.',
      problem: 'Experimental determination of protein structures via X-ray crystallography or Cryo-EM is expensive and laborious. Computational folding models enable rapid de novo design.',
      architecture: [
        'PyTorch: Deep learning tensor framework',
        'Geometric Deep Learning & Invariant Point Attention (IPA)',
        'Hugging Face Transformers for protein language modeling (ESM/ProtBERT)',
        'Python Structural Bio pipelines (MDTraj, BioPython, OpenMM)'
      ],
      features: [
        'Sequence-to-structure attention matrix interpretation',
        'Prediction of inter-residue distance maps (distograms) and dihedral angles',
        'De novo designed peptide scaffolds for enzyme binding pocket optimization',
        'Integration with molecular dynamics simulation pipelines'
      ],
      links: []
    }
  };

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data || !modalBody || !modalBackdrop) return;

    let linksHtml = '';
    if (data.links && data.links.length > 0) {
      linksHtml = `
        <div class="modal-actions">
          ${data.links.map(l => `
            <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="project-link ${l.primary ? '' : 'link-ghost'}">
              ${l.label}
            </a>
          `).join('')}
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="modal-header-tag">// ${data.tag}</div>
      <h3 class="modal-title">${data.title}</h3>
      <div class="modal-banner-wrap">
        <img src="${data.banner}" alt="${data.title} Preview" loading="lazy">
      </div>
      <p style="font-size: 1.02rem; color: var(--text-primary); margin-bottom: 24px; line-height: 1.6;">
        ${data.desc}
      </p>

      <div class="modal-grid-2col">
        <div class="modal-info-box">
          <h4>Core Problem &amp; Scope</h4>
          <p>${data.problem}</p>
        </div>
        <div class="modal-info-box">
          <h4>Key Capabilities</h4>
          <ul>
            ${data.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="modal-info-box">
        <h4>Technical Architecture &amp; Tooling</h4>
        <ul>
          ${data.architecture.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>

      ${linksHtml}
    `;

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.link-details').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const proj = btn.getAttribute('data-project');
      openProjectModal(proj);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', e => {
      if (e.target === modalBackdrop) closeProjectModal();
    });
  }

  /* ── 7. Power-User Command Palette (Ctrl + K) ────────────── */
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
    } else if (e.key === 'Escape') {
      if (modalBackdrop && modalBackdrop.classList.contains('open')) {
        closeProjectModal();
      } else if (cmdBackdrop && cmdBackdrop.classList.contains('open')) {
        closeCmdPalette();
      }
    }
  });

  /* ── 8. Navbar — Scrolled State ─────────────────────────── */
  function updateNavbar() {
    const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    if (heroBottom <= 0) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ── 9. Scroll-Spy — Active Nav Link ────────────────────── */
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

  /* ── 10. Scroll-Reveal — IntersectionObserver ───────────── */
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

  /* ── 11. Mobile Menu ────────────────────────────────────── */
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
