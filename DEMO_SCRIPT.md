# CTO Coffee Chat Demo Script (10 Minutes)

This is a low-cognitive-load cue sheet for live delivery.
Keep pace. If timing slips, cut optional beats.

## 0:00-0:45 | Open with outcome

Action:
- Open the Value Intelligence Platform in browser.

Talk track:
- "I built this in Cursor Agent mode to prep enterprise CTO conversations."
- "Let me show how it was built, because that is the product value."

Proof point:
- Real output, not a toy.

## 0:45-2:00 | Codebase reasoning (not autocomplete)

Action:
- Open `cursor-value-layers.html` and `ProjectRequirements.md`.
- In chat: ask architecture-level question with both files attached.

Talk track:
- "Autocomplete predicts the next token."
- "This reasons across the codebase and architecture."

Proof point:
- Cross-file understanding.

## 2:00-3:00 | Cmd-K surgical change + diff ownership

Action:
- Highlight `handleCompanySearch`.
- Prompt for debounce + graceful error handling.
- Review diff; accept.

Talk track:
- "Plain-English intent, precise edit, human-reviewed diff."
- "Engineer owns what ships."

Proof point:
- Control and accountability.

## 3:00-4:15 | Rules + governed agent behavior

Action:
- Open `.cursor/rules`.
- Run agent prompt: loading state during research call.

Talk track:
- "Rules are version-controlled and enforced at creation time."
- "This is governance in workflow, not policy in a wiki."

Proof point:
- Enterprise consistency.

## 4:15-6:15 | Cursor 3 multitask hero (cross-repo)

Action:
- Trigger multitask mode.
- In `Cursor Value Cards`, queue Task A1 from `DEMO_TASKS.md`.
- Switch to `value-cards-api`, queue API-A1 and API-A2 from `DEMO_TASKS.md`.
- Keep agent panel visible.

Talk track:
- "I can queue subagents without blocking on the first one."
- "Parallel work across UI and API repos in one session, with reviewed outputs."

Proof point:
- Orchestration across projects, not chat-only assistance.

## 6:15-7:15 | Split view + safe execution context

Action:
- Use split view and drag/drop an agent pane.
- Point to status indicators and review path.

Talk track:
- "Parallelism without overwrite chaos."
- "Each change is inspectable before merge."

Proof point:
- Safe concurrency for teams.

## 7:15-8:00 | Plugin/marketplace scale story (short)

Action:
- Open marketplace or plugin panel.
- Show install scope (personal vs project).

Talk track:
- "Project-scoped plugins become team defaults."
- "Agents inherit the same team context."

Proof point:
- Repeatability at org scale.

## 8:00-8:45 | Cloud handoff (Cursor agents)

Action:
- Keep one queued docs or test task selected.
- Run that task in cloud (`/cloud` flow or cloud runtime action in UI).
- Open `https://cursor.com/agents` and show active status.

Talk track:
- "Local for interactive edits, cloud for unattended execution."
- "If I leave my laptop, this keeps running in the same workflow."

Proof point:
- Runtime flexibility without changing tools.

## 8:45-9:15 | Honest Claude Code positioning

Action:
- Switch to Use Cases tab in app.

Talk track:
- "Claude Code is excellent for long autonomous runs."
- "Cursor is where teams do interactive, governed daily engineering."
- "Most mature orgs use both by workload."

Proof point:
- Credibility and buyer trust.

## 9:15-10:00 | Research close + artifact handoff

Action:
- Run Research mode with company name.
- Copy and share link.

Talk track:
- "This combines external signals with organizational context."
- "Now this becomes a reusable team artifact."

Proof point:
- Institutional memory + immediate value.

## 30-Second Debrief If Asked

"I optimized this around one objection: 'just a VS Code fork with autocomplete.'
Each beat visually contradicts that: codebase reasoning, governed edits, parallel subagents,
and team reuse. Then I positioned Cursor and Claude Code honestly by workload."

## Hard Cuts If Behind Time

1. Cut marketplace walkthrough first.
2. Keep only one multitask prompt if needed.
3. Never cut the honest Claude Code answer.

## How To Run This Live (Cross-Repo Setup)

1. Open a multi-root workspace containing:
   - `Cursor Value Cards`
   - `value-cards-api`
2. In `value-cards-api`, run:
   - `npm test` (confirm intentional failing test)
   - optional: `npm start` (if you want to show API endpoint behavior)
3. Keep these files pinned in tabs:
   - `Cursor Value Cards/DEMO_TASKS.md`
   - `value-cards-api/DEMO_TASKS.md`
   - `Cursor Value Cards/DEMO_FALLBACKS.md`
4. At minute ~4:15:
   - Trigger multitask mode
   - Queue one UI task + two API tasks (API-A1 + API-A2)
5. Narrate while tasks run:
   - "Same session, parallel subagents, separate repos, controlled review."
6. Review one diff from each repo before accepting.
7. If anything lags, switch to one fast task from each repo and continue.
