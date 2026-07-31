# Master Plan — Elias Warutere Gathoni Portfolio Redesign

> This is the single source of truth for everything that needs to happen.
> This file is a REFERENCE — do not modify it during execution.
> Update `.agents/rules/progress.md` to track what is done.

---

## Phase 0 — Design & Decisions (Before Any Code)

### 0.1 Generate Design Mockups
- Desktop Hero section (navbar + hero + color palette)
- Desktop Sections (About, Skills, Experience, Contact/Footer)
- Desktop Projects section
- Mobile view (all screens)

### 0.2 Define Design System
- Color tokens (background, surface, border, text, accent, badge colors)
- Typography scale (font families, sizes, weights)
- Layout rules (max-width, grid columns, section padding)
- Interaction patterns (hover, scroll-reveal, mobile menu)

### 0.3 Confirm Design Decisions with User
- Photo placement on desktop hero (right-column vs centered)?
- Section order (About → Projects → Skills → Experience → Contact, or keep original)?
- Keep or remove "Personal Portfolio" project card?
- Keep or remove "Generative AI for Protein Folding" concept card?
- Color palette confirmed (#0d1117 GitHub-dark base)?

---

## Phase 1 — Pre-Implementation Audit

### 1.1 Audit Existing Files
- Review index.html — structure, sections, content accuracy
- Review style.css — what to keep, what to rewrite
- Check for script.js — file doesn't exist yet, needs to be created
- Check assets/ folder contents
- Confirm profile_pic.jpg and resume.pdf are present

### 1.2 Identify Content Gaps
- Confirm all project descriptions are accurate
- Confirm all experience entries are accurate (dates, companies, bullet points)
- Confirm all contact/social links are live
- Confirm CV/resume is up to date

### 1.3 Decide Preserve vs Rewrite Per File
- Keep: all personal content (name, bio, projects, experience, contacts)
- Keep: Vercel Analytics script block
- Keep: existing meta/SEO tags (update titles/descriptions)
- Rewrite: entire style.css using new design system
- Create new: script.js for all interactivity
- Refactor: index.html structure (semantic improvements, new class names)

---

## Phase 2 — Implementation

### 2.1 CSS Design Tokens & Base Reset (style.css — foundation)
- CSS custom properties (all color tokens, font variables)
- Base reset (margin, padding, box-sizing, scroll-behavior)
- Typography base (body font, line-height, link styles)

### 2.2 Navbar
- Sticky navbar with border-bottom on scroll
- Logo EWG. in Fira Code, teal
- Desktop: horizontal nav links (About, Skills, Projects, Contact)
- Mobile: hamburger icon replacing nav links
- Mobile: full-screen slide-in menu overlay

### 2.3 Hero Section
- Two-column grid on desktop (text left, photo right)
- Single column on mobile (text top, photo centered below)
- Elements: greeting label → name → subtitle → bio → CTA buttons
- Profile photo: circular, teal ring border, subtle hover scale
- CTA: "View Projects →" teal outlined button, "Download CV" plain text link

### 2.4 About Section
- Section heading: "01. About ————" pattern
- Two-column grid: bio paragraphs left, quick-stat boxes right
- Stat boxes: Class of 2026, Biochemistry + CS, 5+ Projects
- Languages: English (Fluent), Swahili (Fluent)
- Single column on mobile

### 2.5 Skills Section
- Section heading: "02. Skills ————"
- Three skill cards in 3-column grid (desktop), stacked 1-column (mobile)
- Cards: Life Sciences, Development, AI & Tools
- List items with teal ▹ bullet prefix
- Hover: border brightens to teal, slight translateY(-4px) lift

### 2.6 Experience Section
- Section heading: "03. Experience ————"
- Vertical stack of job cards
- Each card: left teal border accent, company (teal monospace), title (bold white),
  date (muted gray), bullet list with ▹
- Two entries: LifeArc Bioinformatics Job Sim, Dejavu Technologies IT Intern

### 2.7 Projects Section
- Section heading: "04. Projects ————"
- Vertically stacked full-width project cards
- Each card: type tag, status badge (Live / Ongoing / Upcoming),
  title, description, tech pills, external links
- Projects: G2G Hub (Live), DNA Counter (Live), Garlic Research (Ongoing),
  + others based on Phase 0 decisions

### 2.8 Contact / Footer Section
- Section heading: "05. Contact ————" (or styled footer)
- Center-aligned layout
- Heading: "Get In Touch"
- Short tagline paragraph
- "Say Hello →" teal outlined button (mailto link)
- Social links row: GitHub · LinkedIn · X (Twitter)
- Copyright line in small monospace

### 2.9 JavaScript (script.js — new file)
- Smooth scroll offset (account for sticky navbar height ~60px)
- Scroll-spy: highlight active nav link based on section in viewport
- Scroll-reveal: IntersectionObserver fade-in-up on all section elements
- Mobile menu: open/close hamburger + close on link click + close on backdrop
- Navbar border/shadow appears after scrolling past hero

---

## Phase 3 — Polish & Responsiveness

### 3.1 Responsive Breakpoints
- Desktop: > 768px — full two-column layouts
- Mobile: ≤ 768px — single column, larger tap targets, stacked buttons

### 3.2 Accessibility
- All links have descriptive text or aria-label
- Images have proper alt text
- Color contrast meets WCAG AA minimum
- Focus states visible on keyboard navigation
- Hamburger button has aria-label="Toggle menu"

### 3.3 Performance
- Fonts loaded with display=swap
- Images use object-fit: cover
- No unused CSS blocks
- No external JS dependencies (vanilla only)

### 3.4 SEO & Meta Tags
- Title: "Elias Warutere Gathoni | Biochemist & Developer"
- Meta description updated and compelling
- OG tags confirmed correct (title, description, image, url)
- Favicon confirmed

---

## Phase 4 — Verification

### 4.1 Code Quality
- HTML validates (no broken tags, correct semantic structure)
- CSS has no syntax errors
- JS has no console errors

### 4.2 Functional Testing
- All nav links scroll to correct sections
- CV download works
- External project links open in new tab
- Mobile menu opens and closes correctly
- Scroll-reveal animations fire on all sections
- Email link works

### 4.3 Responsive Testing
- Looks correct at 375px (iPhone SE)
- Looks correct at 768px (iPad)
- Looks correct at 1280px (laptop)
- Looks correct at 1440px (large desktop)

### 4.4 Final Review
- Show finished site in browser
- Walk through each section with user
- Confirm ready for Vercel deploy

---

## Files Involved

| File            | Action         | Notes                         |
|-----------------|----------------|-------------------------------|
| index.html      | Refactor       | Keep content, improve structure|
| style.css       | Full rewrite   | New design system from scratch|
| script.js       | Create new     | Does not exist yet            |
| profile_pic.jpg | Keep as-is     | Already present at root       |
| resume.pdf      | Keep as-is     | Already present at root       |
| assets/         | Check          | Contents TBD                  |
