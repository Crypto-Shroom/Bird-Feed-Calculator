# CLAUDE.md

All repository guidance for Claude Code lives in AGENTS.md, shared with the other agents working on this repository.

@../AGENTS.md

## Product owner's working preferences for Claude Code

When the product owner states a general way of working, add it to this section in the same session, so it carries over to future sessions.

- **Orchestrate to save tokens.**
  - Do small, targeted checks yourself, roughly up to five tool calls.
  - Delegate to subagents when that is cheaper: large reads (exports, long logs), long multi-step implementation, or work that can run in parallel.
  - Give each subagent a tight prompt: exact file paths, the exact question, the expected output size, and whether it is read-only, so it does not spend tokens exploring.
- **Choose the model by task.**
  - Sonnet: reading, extraction and research.
  - Haiku: purely mechanical checks.
  - Opus-class: only hard code such as the solver. Opus is too expensive for research.
- **Research flow.** A Sonnet researcher drafts the evidence. Then a scripted cross-check verifies every source ID against `database/provenance/sources.json` and `food-reviews.json`. Then Claude Code reviews it. Manus is no longer available (owner, 2026-10-10). Deep or multilingual research is done by the owner, manually or with an outside AI (not Claude Code, to save tokens), who posts the findings as a comment for Claude Code to check. Whatever tool is used, its output is checked the same way: every source ID against the register, full pages read, no snippets.
- **Jules specs.** Write the real issue number into every spec; never write a placeholder like `#<this issue>`. Label an issue `jules` only when it is focused and its work has not already been done.
- **One issue per change, research or not.** When a report needs research and then a change, both steps stay in the same issue. Research findings and the proposed options go in comments on that issue, the owner's approval comment on the same issue is the go-ahead, and the implementation PR links the same issue. Do not open a second issue for the implementation step.
- **Merging.** The owner approves each merge PR by PR. Keep one branch and PR per independent change.
- **PR follow-through.** After opening a PR, subscribe to its activity. Always read every review comment, bot finding and failed check on it, and answer or fix each one.
- **Explaining.** Explain git and GitHub concepts plainly when they come up; the owner is learning them.
