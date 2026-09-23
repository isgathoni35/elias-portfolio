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

  // Certificate Lightbox Modal
  const certBackdrop      = document.getElementById('cert-modal-backdrop');
  const certCloseBtn      = document.getElementById('cert-modal-close-btn');
  const certBody          = document.getElementById('cert-modal-body');

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
      'Full-Stack AI Engineer',
      'Computational Biology Researcher // Molecular Docking',
      'Quantitative Researcher // WorldQuant IQC Top 20%',
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
  const interactiveCards = document.querySelectorAll('.project-card, .skill-card, .stat-box, .cert-item');

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
    biodock: {
      tag: 'IN-SILICO DOCKING & 3D WEBGL // FASTAPI + AUTODOCK VINA',
      title: 'Bio-Dock: Asynchronous In-Silico Molecular Docking Platform',
      banner: 'assets/projects/biodock.png',
      desc: 'An asynchronous, full-stack in-silico ligand docking and 3D visualization web application. Bio-Dock brings molecular docking simulations to the web, providing an intuitive interface for running ligand-protein docking and visually analyzing structural interactions in a fully interactive 3D WebGL environment.',
      problem: 'Traditional molecular docking tools require complex local CLI software installations, manual file format conversions, and lack intuitive web-based real-time 3D binding site exploration for researchers.',
      architecture: [
        'Backend & API: FastAPI (Python) for asynchronous computation workflows',
        'Scientific Compute Engine: AutoDock Vina for molecular docking simulations',
        'Chemoinformatics Processing: RDKit for parsing, handling, and manipulating chemical data & ligands',
        'Frontend 3D Visuals: WebGL for rendering interactive 3D molecular structures and binding sites',
        'Cloud Infrastructure: Asynchronous backend deployed on Render, frontend deployed on Vercel'
      ],
      features: [
        'Asynchronous job queue managing long-running computational workloads without blocking the UI',
        'Automated target macromolecule PDB fetching from RCSB Protein Data Bank',
        'SMILES ligand input with 3D conformer generation and Gasteiger charge assignment',
        'Interactive 3D active site search grid box configuration (X, Y, Z coordinates & dimensions)',
        'Full WebGL 3D molecular viewport for structural inspection of protein-ligand binding poses'
      ],
      metrics: [
        { val: '60 FPS', label: 'Zero-Latency WebGL Shaders' },
        { val: 'Async', label: 'Decoupled Worker Queue' },
        { val: '0 Installs', label: 'In-Browser Vina Execution' }
      ],
      pipeline: `┌─────────────────────┐      Async WebSocket / REST     ┌─────────────────────────┐
│ WebGL 3D Molecular  │ ──────────────────────────────> │ FastAPI Async Engine    │
│ Viewport (Client)   │                                 │ Non-blocking Event Loop │
└─────────────────────┘ <── Real-time Binding Pose ──── └────────────┬────────────┘
                                                                     │
                         ┌───────────────────────────────────────────┴────────────────────────┐
                         ▼                                                                    ▼
            ┌─────────────────────────┐                                          ┌─────────────────────────┐
            │ RCSB Protein Data Bank  │                                          │ RDKit Chemoinformatics │
            │ Automated PDB Retrieval │                                          │ SMILES Parsing & 3D     │
            │ & Macromolecule Clean   │                                          │ Conformer Minimization  │
            └────────────┬────────────┘                                          └────────────┬────────────┘
                         │                                                                    │
                         └─────────────────────────────┬──────────────────────────────────────┘
                                                       ▼
                                      ┌─────────────────────────────────┐
                                      │ AutoDock Vina Simulation Engine │
                                      │ Semi-flexible In-Silico Docking │
                                      │ Grid Box & Energy Calculations  │
                                      └────────────────┬────────────────┘
                                                       │
                                                       ▼
                                      ┌─────────────────────────────────┐
                                      │ Binding Free Energy (ΔG) Calc   │
                                      │ Hydrogen-Bond Interaction Map   │
                                      │ Multi-Pose PDBQT Conformer Gen  │
                                      └─────────────────────────────────┘`,
      tradeoffs: [
        {
          title: 'Asynchronous Task Queue vs. Synchronous Blocking HTTP',
          problem: 'Docking runs take 30–120s depending on grid dimension. Standard HTTP requests hit reverse-proxy 504 timeouts and freeze the client thread.',
          solution: 'Engineered an asynchronous task queue returning an immediate simulation job ID. The client polls or listens via event stream while keeping the 3D viewport completely smooth at 60 FPS.'
        },
        {
          title: 'Client WebGL Shaders vs. Server-Side Raytracing',
          problem: 'Server-side raytraced streaming incurs heavy server GPU operational costs and introduces unacceptable input latency when rotating structures.',
          solution: 'Rendered molecular geometries entirely client-side using WebGL atomic sphere shaders and ribbon interpolations, streaming only lightweight PDBQT coordinates.'
        }
      ],
      links: [
        { label: 'Launch Live Platform ↗', url: 'https://bio-dock.vercel.app/', primary: true }
      ]
    },
    postmatic: {
      tag: 'AUTONOMOUS AI VIDEO SAAS // NEXT.JS 16 + FASTAPI + GEMINI',
      title: 'PostMatic: Autonomous Faceless Video SaaS & Publisher',
      banner: 'assets/projects/postmatic.png',
      desc: 'A full-stack, zero-OpEx autonomous faceless video generator and social publisher tailored for YouTube Shorts, TikTok, and Instagram Reels. It end-to-end automates scriptwriting, neural voiceover synthesis, synchronized karaoke subtitles, smart b-roll matching, and FFmpeg assembly into high-retention 9:16 vertical videos.',
      problem: 'Content creators spend hours manually drafting scripts, recording voiceovers, hunting for stock footage, syncing captions word-by-word, and rendering vertical videos for social platforms.',
      architecture: [
        'Frontend UI: Next.js 16 (Turbopack), React 19, Tailwind CSS with live 9:16 smartphone player & multi-view workspaces',
        'Backend API: FastAPI + Uvicorn (Python 3.12) asynchronous orchestration daemon & REST endpoints',
        'LLM Scriptwriter: Google Gemini (google-genai SDK) with strict Pydantic multi-scene JSON schemas',
        'Neural Voiceover: Microsoft edge-tts with sub-second word-boundary offsets for dynamic karaoke .ass captions',
        'Media Pipeline: Pexels Video API v1 for 4K/HD clips + hardware-accelerated FFmpeg (libass / imageio-ffmpeg)',
        'Database & Auth: Supabase (PostgreSQL + Row-Level Security + GoTrue Auth)',
        'Cloud Worker & Publishing: Ephemeral GitHub Actions runners for rendering + YouTube Data API v3 OAuth 2.0 chunked uploads'
      ],
      features: [
        'AI Multi-Scene Scriptwriter with structured scene hooks, retention pacing, and dynamic visual prompts',
        'High-fidelity neural voiceover with sub-second word-boundary timing alignment',
        'Dynamic Karaoke Subtitles with custom typography themes (The Bold Highlight, Sunset Glow, Neon Cyber)',
        'Smart 9:16 vertical 4K b-roll sourcing, auto-trimming, background audio ducking, and H.264 rendering',
        'Linear-grade Studio Console with live 9:16 smartphone player simulator and multi-view workspaces',
        'Automated OAuth 2.0 YouTube Shorts chunked video publishing with background token refresh workers'
      ],
      metrics: [
        { val: '32 Tests', label: 'Pytest Suite (100% Core)' },
        { val: '$0.00', label: 'Zero-OpEx Cloud Baseline' },
        { val: '< 45s', label: '1080p 60FPS Render Pipeline' }
      ],
      pipeline: `┌─────────────────┐       HTTP / REST        ┌─────────────────────────┐
│ Next.js 16 UI   │ ───────────────────────> │ FastAPI Orchestrator    │
│ (React 19 /     │                          │ (Pydantic Validation &  │
│ Turbopack)      │ <─── WebSocket / Polling │ Session Management)     │
└─────────────────┘                          └────────────┬────────────┘
                                                          │
                    ┌─────────────────────────────────────┴───────────────────┐
                    ▼                                                         ▼
       ┌────────────────────────┐                                ┌────────────────────────┐
       │ Google Gemini 3.5      │                                │ Microsoft Edge-TTS     │
       │ Structured Multi-Scene │                                │ Sub-second word-level  │
       │ JSON Pydantic Schema   │                                │ offset timestamping    │
       └────────────┬───────────┘                                └────────────┬───────────┘
                    │                                                         │
                    ▼                                                         ▼
       ┌────────────────────────┐                                ┌────────────────────────┐
       │ Pexels Video API       │                                │ Dynamic .ass Subtitle  │
       │ 4K / HD 9:16 Vertical  │                                │ Kinetic Typography     │
       │ Stock B-Roll Retrieval │                                │ (Karaoke Glow / Cyber) │
       └────────────┬───────────┘                                └────────────┬───────────┘
                    │                                                         │
                    └─────────────────────┬───────────────────────────────────┘
                                          ▼
                         ┌─────────────────────────────────┐
                         │ Ephemeral GitHub Actions Runner │
                         │ Hardware-Accelerated FFmpeg     │
                         │ (H.264 / AAC Video Encoding)    │
                         └────────────────┬────────────────┘
                                          │ Direct Chunked Upload
                                          ▼
                         ┌─────────────────────────────────┐
                         │ YouTube Data API v3 (OAuth 2.0) │
                         │ Auto Token Refresh Daemon       │
                         └─────────────────────────────────┘`,
      tradeoffs: [
        {
          title: 'Zero-OpEx Ephemeral Runners vs. Dedicated Cloud GPUs',
          problem: 'Dedicated rendering servers cost $60–$150/mo in idle compute, making early-stage creator tools financially unsustainable.',
          solution: 'Architected an event-driven workflow dispatch to ephemeral GitHub Actions runners (\`render.yml\`) for FFmpeg video compilation, scaling compute to zero when idle.'
        },
        {
          title: 'Strict Pydantic JSON Schemas vs. Free-form Prompting',
          problem: 'LLMs regularly output unpredictable markdown blocks, trailing commas, or missing scene timing keys, causing downstream video assembly crashes.',
          solution: 'Enforced strict Pydantic schemas via Google GenAI SDK structured JSON mode with automated retry loops, ensuring 100% deterministic scene inputs for the rendering engine.'
        },
        {
          title: 'Direct Word-Boundary Offsets vs. Whisper Audio Alignment',
          problem: 'Aligning audio post-generation with Whisper adds 15–25 seconds of transcription latency and significant compute overhead.',
          solution: 'Hooked into Microsoft Edge-TTS stream word-boundary events during synthesis, eliminating transcription latency and generating instant word-level kinetic karaoke subtitles.'
        }
      ],
      links: [
        { label: 'Launch Live Studio ↗', url: 'https://post-matic.vercel.app/', primary: true }
      ]
    },
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
      metrics: [
        { val: '-40%', label: 'Client Bundle Size via RSC' },
        { val: '100% RLS', label: 'PostgreSQL Policy Auth' },
        { val: 'Edge', label: 'Serverless SSR Deployment' }
      ],
      pipeline: `┌─────────────────────────┐       Edge Serverless       ┌─────────────────────────┐
│ Next.js 15+ App Router  │ ──────────────────────────> │ Vercel Edge Network     │
│ React Server Components │                             │ Dynamic SSR & Static ISR│
└─────────────────────────┘                             └────────────┬────────────┘
                                                                     │
                         ┌───────────────────────────────────────────┴────────────────────────┐
                         ▼                                                                    ▼
            ┌─────────────────────────┐                                          ┌─────────────────────────┐
            │ Supabase PostgreSQL DB  │                                          │ Supabase Auth & Storage │
            │ Row-Level Security(RLS) │                                          │ JWT Session Verification│
            │ Real-time Replication   │                                          │ S3-compatible Lab Docs  │
            └─────────────────────────┘                                          └─────────────────────────┘`,
      tradeoffs: [
        {
          title: 'PostgreSQL Row-Level Security vs. Application Middleware Auth',
          problem: 'Application-level authorization easily leaks data if an engineer forgets to apply an auth guard on a single API route.',
          solution: 'Enforced declarative Row-Level Security (RLS) policies directly within PostgreSQL, mathematically guaranteeing student privacy at the database layer.'
        }
      ],
      links: [
        { label: 'Launch Live Platform ↗', url: 'https://g2g-community.vercel.app/', primary: true }
      ]
    },
    dna: {
      tag: 'BIOINFORMATICS & GENOMICS TOOL // PYTHON + STREAMLIT',
      title: 'DNA Nucleotide Counter & Composition Visualizer',
      banner: 'assets/projects/dna.png',
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
      banner: 'assets/projects/garlic.png',
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

    const hasTabs = data.pipeline || data.tradeoffs;

    const tabsHtml = hasTabs ? `
      <div class="modal-tabs">
        <button class="modal-tab active" data-tab="overview">[ 01. Overview &amp; Specs ]</button>
        ${data.pipeline ? `<button class="modal-tab" data-tab="architecture">[ 02. System Architecture Flow ]</button>` : ''}
        ${data.tradeoffs ? `<button class="modal-tab" data-tab="tradeoffs">[ 03. Engineering Decisions &amp; Trade-offs ]</button>` : ''}
      </div>
    ` : '';

    const metricsHtml = data.metrics && data.metrics.length > 0 ? `
      <div class="metrics-row">
        ${data.metrics.map(m => `
          <div class="metric-card">
            <span class="metric-val">${m.val}</span>
            <span class="metric-lbl">${m.label}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    const pipelineHtml = data.pipeline ? `
      <div class="modal-tab-content" id="tab-architecture">
        <div class="modal-info-box">
          <h4>Data Flow &amp; Distributed Architecture Topology</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px;">
            End-to-end data pipeline mapping communication paths across client viewports, asynchronous API daemons, AI inference engines, and cloud rendering targets:
          </p>
          <div class="pipeline-flow-box">
            <pre class="pipeline-flow-diagram">${data.pipeline}</pre>
          </div>
        </div>
      </div>
    ` : '';

    const tradeoffsHtml = data.tradeoffs && data.tradeoffs.length > 0 ? `
      <div class="modal-tab-content" id="tab-tradeoffs">
        <div class="modal-info-box">
          <h4>Senior Architectural Decisions &amp; Failure Modes</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px;">
            Technical trade-offs evaluated during system design to guarantee zero runtime crashes, eliminate thread blocking, and optimize cost/latency:
          </p>
          <div class="tradeoffs-list">
            ${data.tradeoffs.map(t => `
              <div class="tradeoff-card">
                <h5>⚡ ${t.title}</h5>
                <div class="tradeoff-grid">
                  <div class="tradeoff-col problem">
                    <strong>Bottleneck / Challenge</strong>
                    ${t.problem}
                  </div>
                  <div class="tradeoff-col solution">
                    <strong>Architectural Solution</strong>
                    ${t.solution}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : '';

    modalBody.innerHTML = `
      <div class="modal-header-tag">// ${data.tag}</div>
      <h3 class="modal-title">${data.title}</h3>
      <div class="modal-banner-wrap">
        <img src="${data.banner}" alt="${data.title} Preview" loading="lazy">
      </div>

      ${tabsHtml}

      <div class="modal-tab-content active" id="tab-overview">
        <p style="font-size: 1.02rem; color: var(--text-primary); margin-bottom: 24px; line-height: 1.6;">
          ${data.desc}
        </p>

        ${metricsHtml}

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

        <div class="modal-info-box" style="margin-top: 20px;">
          <h4>Technical Architecture &amp; Tooling</h4>
          <ul>
            ${data.architecture.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
      </div>

      ${pipelineHtml}
      ${tradeoffsHtml}

      ${linksHtml}
    `;

    // Attach modal tab switching listeners
    const tabBtns = modalBody.querySelectorAll('.modal-tab');
    const tabContents = modalBody.querySelectorAll('.modal-tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const activeContent = modalBody.querySelector('#tab-' + targetTab);
        if (activeContent) activeContent.classList.add('active');
      });
    });

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

  /* ── 6.5 Certificate Lightbox Modals ────────────────────── */
  const certData = {
    simplilearn: {
      tag: 'PROFESSIONAL CERTIFICATION // ARTIFICIAL INTELLIGENCE',
      title: 'Introduction to Artificial Intelligence',
      issuer: 'Simplilearn SkillUp',
      date: '17th January 2026',
      image: 'assets/certificates/simplilearn_ai.png',
      pdf: 'assets/certificates/simplilearn_ai.pdf',
      seal: '🤖',
      desc: 'Professional certificate of completion awarded for demonstrating foundational competency and applied knowledge in Artificial Intelligence principles, algorithms, and core architectures.',
      highlights: [
        'Certificate Code: 9725975',
        'Demonstrated commitment and competency in Artificial Intelligence principles & techniques',
        'Signed and accredited by Krishna Kumar, CEO of Simplilearn'
      ],
      skills: ['Artificial Intelligence', 'Machine Learning', 'Neural Systems', 'AI Fundamentals'],
      verifyUrl: 'assets/certificates/simplilearn_ai.pdf'
    },
    qualcomm: {
      tag: 'TECHNICAL ACCREDITATION // QUALCOMM ACADEMY',
      title: 'AI Upskilling Certificate: Technical Foundation',
      issuer: 'Qualcomm Academy',
      date: 'December 23, 2025',
      image: 'assets/certificates/qualcomm_ai.png',
      pdf: 'assets/certificates/qualcomm_ai.pdf',
      seal: '⚡',
      desc: 'Certificate of completion awarded in recognition of successfully completing the technical foundation curriculum for AI Upskilling through Qualcomm Academy.',
      highlights: [
        'Qualcomm ID: ULHP1dIvnD',
        'Issued by Qualcomm Academy (Qualcomm Technologies, Inc.)',
        'Signed by Vikram Y Malhotra, Senior Director, Program Management'
      ],
      skills: ['Artificial Intelligence', 'Technical Foundations', 'Machine Learning', 'Edge AI'],
      verifyUrl: 'assets/certificates/qualcomm_ai.pdf'
    },
    martial: {
      tag: 'SOFTWARE ENGINEERING // PYTHON & OBJECT-ORIENTED PROGRAMMING',
      title: 'Python Programming Essentials & OOP',
      issuer: 'Martial School of IT (Powered by Jenga eLearning)',
      date: '24th October 2025',
      image: 'assets/certificates/martial_python_oop.png',
      pdf: 'assets/certificates/martial_python_oop.pdf',
      seal: '🐍',
      desc: 'Certificate of completion awarded for successfully completing the rigorous Python Programming Essentials course (January 2025 Cohort) covering comprehensive software engineering principles and hands-on application development.',
      highlights: [
        'Certificate Serial ID: 6030-6065-4275-3572',
        'Curriculum: Variables, Data Structures, Conditional Logic, Loops, Functions & Modules',
        'Advanced focus on Object-Oriented Programming (OOP) paradigms and modular architecture',
        'Instructor: Erick Otieno | Signed by Education Director & Managing Director'
      ],
      skills: ['Python', 'Object-Oriented Programming (OOP)', 'Modular Architecture', 'Software Engineering', 'Data Structures'],
      verifyUrl: 'assets/certificates/martial_python_oop.pdf'
    },
    saylor: {
      tag: 'COMPUTER SCIENCE // FOUNDATIONAL PROGRAMMING',
      title: 'CS101: Introduction to Programming I',
      issuer: 'Saylor Academy',
      date: 'January 16, 2026',
      image: 'assets/certificates/saylor_cs101.png',
      pdf: 'assets/certificates/saylor_cs101.pdf',
      seal: '💻',
      desc: 'Certificate of Achievement awarded for mastering computational problem-solving, algorithm formulation, syntax, flow control, and programming methodologies with academic distinction.',
      highlights: [
        'Certificate ID: 3173318028EG',
        'Academic Distinction Grade: 92.00%',
        'Total Hours in Course: 26 hours (2.6 Continuing Education Units)',
        'Accredited by Saylor Academy & signed by Michael J Saylor'
      ],
      skills: ['Computer Science', 'Programming Fundamentals', 'Algorithms', 'Logic & Flow Control'],
      verifyUrl: 'assets/certificates/saylor_cs101.pdf'
    },
    worldquant: {
      tag: 'GLOBAL QUANT COMPETITION // STAGE 1 TOP 20% OF TEAMS',
      title: 'International Quant Championship 2026: Stage 1 Recognition',
      issuer: 'WorldQuant BRAIN',
      date: '2026',
      image: 'assets/certificates/worldquant_iqc2026.png',
      pdf: 'assets/certificates/worldquant_iqc2026.pdf',
      seal: '🧠',
      desc: 'Official Certificate of Recognition awarded by WorldQuant BRAIN for advancing through Stage 1 of the prestigious International Quant Championship (IQC 2026) and ranking in the Top 20% of competitive quant teams globally.',
      highlights: [
        'Competitor / BRAIN ID: EG43839',
        'Distinction: Stage 1 – 2026 | Top 20% of Teams Globally',
        'Authorized and presented by Nitish Maini, Chief Strategy Officer of WorldQuant',
        'Formulated & backtested algorithmic predictive alpha models across vast global financial matrices',
        'Gold Level Tier quantitative researcher standing on the WorldQuant BRAIN platform'
      ],
      skills: ['Quantitative Modeling', 'Alpha Signals', 'Statistical Arbitrage', 'IQC 2026', 'Algorithmic Finance'],
      verifyUrl: 'assets/certificates/worldquant_iqc2026.pdf'
    },
    lifearc: {
      tag: 'VIRTUAL EXPERIENCE ACCREDITATION // LIFE SCIENCES RESEARCH',
      title: 'Life Sciences: Biology Research Job Simulation',
      issuer: 'LifeArc (via Forage)',
      date: 'January 9th, 2026',
      image: 'assets/certificates/lifearc_biology.png',
      pdf: 'assets/certificates/lifearc_biology.pdf',
      seal: '🧬',
      desc: 'Certificate of completion awarded for completing practical industry-standard tasks in experimental condition optimization, biological data analysis, evidence synthesis, and collaborative scientific results presentation.',
      highlights: [
        'Enrolment Verification: jyoSYSExArWJwWbfB | User Verification: 578TzDefqBRPcdCHq',
        'Practical tasks: Optimise experimental conditions & analyse data for optimal bio-parameters',
        'Synthesising evidence, cross-functional collaboration, and professional presentation of results',
        'Issued by Forage & signed by Tom Brunskill, CEO and Co-Founder'
      ],
      skills: ['Biology Research', 'Experimental Optimization', 'Data Analysis', 'Evidence Synthesis', 'Life Sciences'],
      verifyUrl: 'assets/certificates/lifearc_biology.pdf'
    },
    pfizer: {
      tag: 'PHARMACEUTICAL SIMULATION // PFIZER & FORAGE',
      title: 'Molecule to Market Job Simulation',
      issuer: 'Pfizer (via Forage)',
      date: 'January 9th, 2026',
      image: 'assets/certificates/pfizer_simulation.png',
      pdf: 'assets/certificates/pfizer_simulation.pdf',
      seal: '💊',
      desc: 'Certificate of completion awarded for completing industry-grade practical workflows spanning the entire pharmaceutical molecule-to-market pipeline, health economics evaluations, market assessment, and go-to-market commercialization strategy.',
      highlights: [
        'Enrolment Verification: HN4vDBcirbCmSkygs | User Verification: 578TzDefqBRPcdCHq',
        'Analyzed the full Molecule to Market Pathway across clinical stages and drug development',
        'Evaluated Health Economics metrics and pharmacoeconomic value propositions',
        'Formulated pharmaceutical marketing and Go-to-Market Strategy',
        'Issued by Forage & signed by Tom Brunskill, CEO and Co-Founder'
      ],
      skills: ['Molecule to Market', 'Health Economics', 'Pharmaceutical Strategy', 'Go-to-Market', 'Drug Commercialization'],
      verifyUrl: 'assets/certificates/pfizer_simulation.pdf'
    },
    uon: {
      tag: 'ACADEMIC DEGREE CONFERRAL // UNIVERSITY OF NAIROBI',
      title: 'B.Sc. Biochemistry & Molecular Biology',
      issuer: 'University of Nairobi (Faculty of Science & Technology)',
      date: 'Conferred 2024',
      image: '',
      seal: '🎓',
      desc: 'Conferred Bachelor of Science in Biochemistry & Molecular Biology with specialized coursework in computational structural biology, enzymology, metabolic genetics, and molecular docking capstone research.',
      highlights: [
        'Conducted capstone in-silico research on natural organosulfur inhibitors against pathogenic fungal targets',
        'Rigorous lab research in nucleic acid analysis and protein purification',
        'Foundation for quantitative, data-driven computational life science applications'
      ],
      skills: ['Biochemistry', 'Molecular Biology', 'Genomics', 'In-Silico Research'],
      verifyUrl: 'assets/docs/resume.pdf'
    }
  };

  function openCertModal(certId) {
    const data = certData[certId];
    if (!data || !certBody || !certBackdrop) return;

    const bannerHtml = data.image ? `
      <div class="cert-preview-banner">
        <img src="${data.image}" alt="${data.title} Certificate Preview" loading="lazy">
      </div>
    ` : `
      <div class="cert-thumb-placeholder" style="height: 180px; border-radius: 10px; margin-bottom: 24px;">
        <div class="cert-seal-icon">${data.seal}</div>
        <div class="cert-brand-title">${data.title}</div>
        <div class="cert-brand-sub">${data.issuer} &bull; ${data.date}</div>
        <div class="cert-scanline"></div>
      </div>
    `;

    certBody.innerHTML = `
      <div class="modal-header-tag">// ${data.tag}</div>
      <h3 class="modal-title">${data.title}</h3>
      <div class="cert-meta" style="margin: 8px 0 20px;">
        <span class="cert-issuer" style="font-size: 0.95rem;">${data.issuer}</span>
        <span style="color: var(--text-dim); margin-left: 12px;">[ ${data.date} ]</span>
      </div>

      ${bannerHtml}

      <div class="modal-info-box" style="margin-bottom: 20px;">
        <h4>Credential Summary &amp; Scope</h4>
        <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">${data.desc}</p>
      </div>

      <div class="modal-info-box" style="margin-bottom: 20px;">
        <h4>Competencies &amp; Verification Proofs</h4>
        <ul>
          ${data.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-family: var(--font-code); font-size: 0.84rem; color: var(--text-dim); margin-bottom: 10px;">// ACCREDITED SKILLS</h4>
        <div class="stack-pills-wrap">
          ${data.skills.map(s => `<span class="tech-pill">${s}</span>`).join('')}
        </div>
      </div>

      <div class="modal-actions" style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-sub);">
        <a href="${data.verifyUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
          Official Credential Record ↗
        </a>
      </div>
    `;

    certBackdrop.classList.add('open');
    certBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    if (!certBackdrop) return;
    certBackdrop.classList.remove('open');
    certBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.cert-item, .btn-cert-view').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const certId = btn.getAttribute('data-cert') || btn.getAttribute('data-cert-id');
      if (certId) openCertModal(certId);
    });
  });

  if (certCloseBtn) certCloseBtn.addEventListener('click', closeCertModal);
  if (certBackdrop) {
    certBackdrop.addEventListener('click', e => {
      if (e.target === certBackdrop) closeCertModal();
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
      } else if (certBackdrop && certBackdrop.classList.contains('open')) {
        closeCertModal();
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

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
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
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    staggerGroups.forEach(function (el) {
      staggerObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
    staggerGroups.forEach(el => el.classList.add('is-visible'));
  }

  // Immediate visibility check for above-the-fold content on load
  function checkInitialVisibility() {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      }
    });
    staggerGroups.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkInitialVisibility);
  } else {
    checkInitialVisibility();
  }
  setTimeout(checkInitialVisibility, 150);

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
