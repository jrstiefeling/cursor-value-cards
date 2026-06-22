# .cursor/rules
# Governance rules for Cursor Value Intelligence Platform
# These rules apply to all AI interactions in this project.

## Architecture Constraints
- This is a single-file SPA. All logic, CSS, and data stay in index.html
  unless explicitly asked to extract a module. Do not introduce a build step,
  package.json, or external dependencies without explicit instruction.
- GitHub Pages deployment — all asset paths must be relative, no server-side logic.
- The script block contains three categories of data: capabilities[], outcomes[],
  and guidanceUseCases[]. Maintain this structure when adding new data.

## Data Schema — Do Not Break
When adding or editing capability cards, use this exact schema:
  { id, title, sub, detail, outcomes[] }

When adding or editing outcome cards, use this exact schema:
  { id, title, sub, detail, caps[], cs }
  — cs is HTML string, may contain anchor tags with target="_blank"
  — caps[] must only reference valid capability ids

When adding use cases to guidanceUseCases[], use:
  { id, title, base, industry: { fintech, tech, defense, health, retail },
    cursor: [{ title, sub, tags[] }], claude: [{ title, sub, tags[] }] }

## Code Quality
- All new JavaScript functions must include a JSDoc comment describing
  purpose, parameters, and return value.
- No console.log in production code — remove before committing.
- State mutations must go through the state object and trigger render().
  Do not directly manipulate DOM outside of render() and its helpers.
- URL hash is the only persistence layer. writeHash() and parseHash() own it.

## Required Rules
- Never use string concatenation in SQL queries
  (parameterized queries only)
- Flag any use of eval() or exec() for review
- All passwords hashed with bcrypt, minimum 12 rounds
- All new functions require a docstring
- Keep functions under 20 lines
- Error handling required on all external API calls
- No credentials or API keys in source files
- Privacy Mode: enabled — zero retention
- Code never leaves your infrastructure

## Security
- Never embed API keys or tokens in index.html or any client-side file.
- The Research mode pipeline uses DuckDuckGo and SEC EDGAR via public endpoints.
  Do not add calls to authenticated APIs without explicit instruction.
- Case study links must use target="_blank" rel="noopener noreferrer".

## AI Behavior in This Project
- Use outcome-first language in all card copy. Lead with business result.
  WRONG: "Cursor's codebase indexing helps engineers find files faster."
  RIGHT: "Engineers onboard in days instead of weeks — Cursor answers
          architecture questions across the full codebase instantly."
- Do not remove quantified evidence stats from cs fields without flagging it.
  The Salesforce 30%, 85%, and Grab 98% numbers are load-bearing in demos.
- When editing industryLanguage overrides, preserve all five verticals:
  fintech, tech, defense, health, retail.
- When modifying executiveOutcomeAffinity, verify that every persona
  (cto, ciso, cfo, cpo) still maps to at least two outcome ids.

## Demo Readiness
- The app must load without errors in a fresh browser tab with no network
  beyond Google Fonts and the app's own GitHub Pages URL.
- Research mode is best-effort (public APIs only) — failure states must
  show a graceful error in researchStatus, never a thrown exception.
- All five industry filters and all four persona filters must produce
  at least one visible card — no empty states during a live demo.
- The ROI calculator must output a positive value for any reasonable input
  (team size 10–10,000, velocity gain 10–50%, salary $80K–$300K).
