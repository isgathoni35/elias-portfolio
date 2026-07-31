# AGENTS.md — Portfolio Redesign Project Rules
# Elias Warutere Gathoni — elias-portfolio

These are the rules I (the agent) follow throughout this project.
Elias can read and update these at any time.

---

## Core Working Rules

1. **Design before code.** Never touch `index.html`, `style.css`, or `script.js`
   until Phase 0 (design) is fully signed off by Elias.

2. **Update progress after every step.** Every time a task completes, mark it ✅
   in `.agents/rules/progress.md` before moving to the next task. No exceptions.

3. **Never skip ahead.** Tasks in `master_plan.md` are done in order.
   If a phase is blocked, stop and flag it — do not jump ahead.

4. **Ask before destroying.** If any step involves deleting or fully overwriting
   existing content, confirm with Elias first.

5. **One section at a time.** During Phase 2, complete one section fully
   (HTML + CSS) before starting the next.

6. **No external dependencies.** Vanilla HTML/CSS/JS only.
   No frameworks, no npm, no CDN libraries beyond Google Fonts.

7. **Preserve all personal content.** Bio, project descriptions, experience,
   contact links — nothing changes without Elias's input.

8. **Commit-ready code only.** All code must be clean, commented where needed,
   and production-ready. No leftover TODOs in code files.

---

## File Map

| File                              | Purpose                                  | Who updates       |
|-----------------------------------|------------------------------------------|-------------------|
| `.agents/AGENTS.md`               | Working rules (this file)                | Both              |
| `.agents/rules/master_plan.md`    | Full project plan (reference — stable)   | Agent (start only)|
| `.agents/rules/progress.md`       | Live step-by-step tracker                | Agent after tasks |
| `index.html`                      | Portfolio markup                         | Agent (Phase 2+)  |
| `style.css`                       | Portfolio styles                         | Agent (Phase 2+)  |
| `script.js`                       | Portfolio interactivity (new file)       | Agent (Phase 2+)  |

---

## Confirmed Design System

### Colors
| Token              | Value     | Usage                          |
|--------------------|-----------|--------------------------------|
| `--bg`             | `#0d1117` | Page background                |
| `--surface`        | `#161b22` | Cards, navbar                  |
| `--border`         | `#30363d` | Card borders, dividers         |
| `--text-primary`   | `#e6edf3` | Headings                       |
| `--text-muted`     | `#8b949e` | Body text, dates               |
| `--accent`         | `#64ffda` | Teal — logo, links, highlights |
| `--badge-live`     | `#64ffda` | "Live" status badge            |
| `--badge-ongoing`  | `#f0a500` | "Ongoing" status badge         |
| `--badge-upcoming` | `#8b949e` | "Upcoming" status badge        |

### Fonts
- **Inter** — headings and body text
- **Fira Code** — logo, section numbers, tech tags (monospace)

### Layout
- Max content width: `900px`, centered
- Section padding: `100px 0` desktop / `60px 0` mobile
- Mobile breakpoint: `≤ 768px`

---

## Design Decisions — CONFIRMED ✅

- [x] Desktop hero: photo on the **right column** (text left, photo right)
- [x] Section order: **About → Projects → Skills → Experience → Contact**
- [x] Keep all 5 project cards (G2G Hub, DNA Counter, Garlic Research, Personal Portfolio, Generative AI concept)
- [x] Color palette `#0d1117` base **confirmed**
