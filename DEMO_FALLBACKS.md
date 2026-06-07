# Demo Fallbacks (If Anything Breaks Live)

Use this to stay calm and keep authority.
Never apologize at length. Reframe and continue.

## Core Rule

If a step fails, do this in order:
1) State what should have happened in one sentence.
2) Show a pre-run artifact (tab, diff, or prior result).
3) Move to the next beat immediately.

## Failure Map by Beat

## Beat 1 - chat response is slow

What to say:
- "This is normally a few-second architecture pass across both files."

What to do:
- Switch to a pre-run chat tab showing the answer.
- Point out cross-file references.

## Beat 2 - Cmd-K output is off-target

What to say:
- "Great example of why diff review matters; I will tighten the instruction."

What to do:
- Re-prompt with stricter scope:
  - "Only edit handleCompanySearch. Add 400ms debounce and graceful error message."
- If still slow, show a previously accepted diff.

## Beat 3 - agent run stalls

What to say:
- "I will use a completed run to focus on the governance behavior."

What to do:
- Open prior result and highlight error handling/loading state addition.
- Re-anchor to `.cursor/rules`.

## Beat 4 - multitask panel confusion

What to say:
- "Conceptually this is queued subagents in one session with independent progress."

What to do:
- Queue only one task from Queue Set C.
- Show status movement and continue.

## Beat 5 - marketplace or plugin UI not loading

What to say:
- "Plugin scope is personal or project; project scope standardizes team behavior."

What to do:
- Describe scope verbally and move on.
- Do not stay in settings screens.

## Beat 6 - research API returns weak/no data

What to say:
- "Research mode is best-effort on public sources; the key is structured synthesis."

What to do:
- Use pre-tested company input.
- If still weak, switch to previously generated result.

## Beat 7 - copy link fails

What to say:
- "The artifact can also be shared directly from stateful URL in the address bar."

What to do:
- Manually copy URL from browser bar.

## Time Compression Plan

If you are over time at minute 6:
- Skip plugin walkthrough.
- Keep only one multitask prompt.
- Go directly to honest Cursor vs Claude answer.
- Preserve final research artifact close.

## Tone Guardrails Under Pressure

- Keep voice steady and factual.
- Avoid blaming network or tool.
- Use "let me show the outcome" language.
- Protect the narrative, not the feature.

## Backup Prompt Snippets

Use these if you need one clean save:

```text
In index.html, add only a loading state around research requests. Keep behavior unchanged.
```

```text
In handleCompanySearch, add 400ms debounce and graceful error status text.
```

```text
Update ProjectRequirements.md with a concise Demo Readiness section.
```
