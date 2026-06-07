# Cursor Value Intelligence Platform

## Purpose
A live sales tool used by Cursor Field Engineers to map Cursor capabilities to
business outcomes for enterprise prospects. Built for use in CTO, CISO, CFO,
and CPO conversations — outcome-first language, no feature marketing. Zero
friction: no login, no build step, no backend.

## Audience
- Primary: Field Engineers running enterprise discovery and demo calls
- Secondary: C-suite buyers evaluating Cursor for engineering orgs

## Architecture
- Single-file SPA — all HTML, CSS, JavaScript, and data in index.html
- No framework, no build process, no npm or package.json
- All data (capabilities, outcomes, industry language, use cases) embedded
  as JavaScript objects directly in the script block
- URL hash encodes state (mode, industry, company) for shareable links
- Deployed via GitHub Pages: jrstiefeling.github.io/cursor-value-cards

## Application Modes (tabs)

### Developer (mode: dev)
Two-column board: Cursor Capabilities → Business Outcomes.
Clicking a capability on the left highlights the outcomes it drives on the right.
Use case: IC engineer or eng manager discovery conversation.

### Executive (mode: exec)
Flipped two-column board: Business Outcomes → Cursor Capabilities.
Persona filter (CTO, CISO, CFO, CPO/VP Eng) shows only relevant outcome cards.
Use case: C-suite or VP-level conversation, outcome-first framing.

### Use Cases (mode: guidance)
Three-column board: Use Case list → Cursor approach → Claude Code approach.
Each use case (feature build, refactor, test coverage, bug fix, onboarding,
legacy code, security review) shows when to use Cursor vs Claude Code side by side.
Use case: Answering "how does this work in practice?" and handling the
Claude Code objection honestly.

### Research (mode: research)
Company name input → runs live research (DuckDuckGo, SEC EDGAR, FRED macro).
Infers priority buckets, resonant stories, and tailored card language.
"Apply" checkbox rewrites visible cards with company-specific language.
Use case: Pre-call prep or live CTO/executive conversation with a named account.

### ROI (mode: roi)
Calculator inputs (team size, avg salary, velocity gain %, hours saved/week).
Outputs: annual value delivered, license cost comparison, payback framing.
Use case: CFO or finance-oriented objection handling.

## Key Data Structures

### Capabilities (10 total)
Each has: id, title, sub, detail, outcomes[]
- tab — Tab completion (always-on multi-line prediction)
- cmdk — Inline edit ⌘K (highlight → describe → review diff → accept)
- chat — Codebase chat (natural language across repos, @file context)
- agent — Agent mode (multi-file autonomous execution with human review)
- bugbot — BugBot (automated PR review, finds bugs before human review)
- rules — Team rules (version-controlled standards in every AI interaction)
- automations — Automations (event-triggered background agents)
- privacy — Privacy & security (SOC 2, zero retention, self-hosted option)
- mcp — MCP integrations (connects Cursor to internal systems and tools)
- models — Model choice (route tasks to best model per speed/quality/cost)

### Outcomes (8 total)
Each has: id, title, sub, detail, caps[], cs (case study HTML with links)
- velocity — Engineering velocity (Salesforce: 30%+ gains)
- quality — Code quality at scale (Salesforce EAC: 85% legacy coverage reduction)
- security — Security posture (Team Rules + Privacy Mode)
- compliance — Compliance & governance (self-hosting, zero-retention routing)
- scale — Engineering scale (Grab: 98% MAU, 1/3 of all PRs)
- retention — Developer retention (Coinbase adoption playbook)
- cost — Engineering cost efficiency (ROI model: $5.4M value vs $480K license)
- onboarding — Onboarding speed (codebase chat compresses weeks to hours)

### Executive Persona Affinity
- CTO: velocity, quality, scale, security, onboarding
- CISO: security, compliance
- CFO: velocity, scale, compliance, cost
- CPO/VP Eng: velocity, quality, retention, scale, onboarding

### Industry Language
Five verticals with outcome-specific language overrides:
fintech, tech, defense, health, retail

### Use Cases (7 total)
feature, refactor, tests, bugs, onboarding, legacy, security
Each has: Cursor approach cards + Claude Code approach cards + industry variants

## UI Behavior
- Card click (Dev mode): selecting a capability highlights related outcomes
- Card click (Exec mode): selecting an outcome opens its info panel and case study
- Info button (ⓘ): reveals detail text in amber panel
- Case study link: opens evidence panel with sourced stats
- Copy link button: copies current URL with hash state to clipboard
- Research button: runs company research pipeline, rewrites cards on Apply
- Responsive: single-column layout below 920px viewport width

## Key Files
- index.html — entire application (HTML, CSS, JS, data). ~1,780 lines.
- ProjectRequirements.md — this file
- .cursor/rules — AI governance rules for development of this project
- auth.js — authentication utility (JWT pattern, not active in Pages deployment)
- .cursor/skills/granola-skill.mdc — meeting notes → feature spec skill
