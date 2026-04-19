# Tmux Theme Studio

## What This Is

Tmux Theme Studio is a browser-based HTML interface for creating, editing, previewing, importing, and exporting tmux themes without hand-editing `tmux.conf`. It is aimed at tmux users who want a faster, more visual workflow for tuning status bar, pane, and message colors while still ending with plain tmux configuration they can use directly.

The first release is assumed to be a greenfield, local-first web app with no required backend. Users work in the browser, preview a simulated tmux UI, and export theme snippets compatible with modern tmux style syntax.

## Core Value

Make tmux theme creation feel visual and safe while producing configuration a tmux user can trust and apply immediately.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can create a tmux theme visually from scratch.
- [ ] User can preview theme changes before exporting configuration.
- [ ] User can import existing tmux theme snippets and refine them safely.
- [ ] User can export a valid tmux theme snippet for direct use in tmux.

### Out of Scope

- Multi-user collaboration or accounts — not necessary for validating the core editor workflow.
- Hosting or syncing themes through a backend service — local-first keeps v1 simpler and faster to ship.
- Full tmux configuration management beyond theme-related options — broader config editing dilutes the product focus.
- Pixel-perfect terminal emulation — a faithful preview is enough for v1; full emulation adds major complexity.

## Context

- The project starts from an empty repository.
- The user asked for an HTML interface to create and update themes for tmux terminal.
- tmux currently lists `3.6a` as the latest release on GitHub, so v1 should target modern tmux style syntax and avoid assumptions tied to much older releases.
- tmux style configuration supports named colors, 256-color values, and hexadecimal RGB colors in modern versions, which makes a visual editor practical.
- Browser file access is constrained by user-consent and secure-context rules, so import/export flows should use standard file inputs/downloads as the baseline and treat richer file system access as progressive enhancement.
- The likely deployment shape is a static frontend that can run locally or from a simple static host such as GitHub Pages.

## Constraints

- **Tech stack**: Browser-first HTML interface with no required backend — the request is specifically for an HTML interface, and local-first delivery reduces setup friction.
- **Compatibility**: Exported themes should target tmux `3.6a` style syntax first — this aligns v1 with the current official release rather than legacy edge cases.
- **File access**: Import/export must work with standard browser file APIs — user-consent and secure-context restrictions make direct filesystem assumptions unsafe.
- **Scope**: v1 should stay focused on theming, not general tmux configuration editing — this keeps the product narrow enough to validate quickly.
- **Deployment**: The app should be deployable as static assets — simplest path for sharing and iteration.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build a local-first frontend with no backend in v1 | Fastest path to a usable tool and matches the "HTML interface" request | — Pending |
| Target tmux 3.6a style syntax first | Use the current official release as the compatibility baseline | — Pending |
| Treat file open/save as import/export flows, with progressive enhancement for richer browser file APIs | Baseline browser support is more reliable than assuming advanced file access everywhere | — Pending |
| Focus v1 on theme editing, preview, import, export, and local persistence | These are the shortest path to validating the core value | — Pending |

---
*Last updated: 2026-04-19 after initialization*
