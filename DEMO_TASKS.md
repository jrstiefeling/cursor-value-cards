# Cursor 3 Demo Tasks (Copy/Paste Ready)

Use these in multitask mode so you can queue subagents fast without typing.
The prompts are scoped to this single-file app and its existing rules.

## Queue Set A (Primary Live Sequence)

### Task A1 - UI polish in Research mode
```text
Improve the Research mode UX in cursor-value-layers.html with a small visual polish:
1) Add a subtle loading shimmer to the research status area while a lookup is in progress.
2) Keep all behavior unchanged.
3) Follow project rules and keep code style consistent.
4) Show me a concise plan first, then apply.
```

### Task A2 - error handling hardening
```text
In cursor-value-layers.html, review all external API fetch calls used by Research mode and ensure each has explicit try/catch and a graceful user-facing message in researchStatus. Do not change data schema. Keep edits minimal and show me a diff summary before applying.
```

### Task A3 - docs update
```text
Update ProjectRequirements.md with a short "Demo Readiness" section that documents:
- Research mode graceful failure behavior
- Copy link behavior
- Why this app is good for live FE discovery demos
Keep wording concise and enterprise-facing.
```

## Queue Set B (Backup Sequence)

### Task B1 - debounce tuning
```text
In handleCompanySearch inside cursor-value-layers.html, add a 400ms debounce so search does not fire on every keystroke. Preserve existing behavior and keep function readability high.
```

### Task B2 - ROI input validation
```text
In cursor-value-layers.html ROI mode logic, add guardrails so invalid or empty inputs show a helpful inline message instead of producing NaN or empty output. Keep UI tone calm and executive-friendly.
```

### Task B3 - accessibility quick pass
```text
Apply a lightweight accessibility pass in cursor-value-layers.html:
- Add aria-labels to icon-only controls
- Ensure buttons and tabs have clear focus states
- Do not redesign the layout
Summarize what changed.
```

## Queue Set C (Fast 60-second saves)

### Task C1 - copy-link microcopy
```text
Improve the copy link success feedback text so it confirms the URL includes current mode, persona, and company state. Keep the message under 14 words.
```

### Task C2 - use cases micro-clarity
```text
In guidance/use-cases card copy, tighten one Cursor column and one Claude Code column description to make workload split clearer (interactive vs autonomous). Keep current structure and tone.
```

## Optional Multi-Root Demo (If using two repos)

If you open a second repo in a multi-root workspace, queue one task in each repo:
- Repo 1 (this app): Task A1
- Repo 2 (worker/docs): "Add one passing test and one README note"

Narration line:
"Same session, parallel subagents, different repositories, controlled review before merge."

## Delivery Notes

- Start with Queue Set A.
- If anything is slow, switch to Queue Set C.
- Always narrate before clicking accept:
  - "Plan"
  - "Diff"
  - "Review"
  - "Apply"
