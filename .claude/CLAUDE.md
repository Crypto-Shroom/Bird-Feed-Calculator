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
- **Research flow.** A Sonnet researcher drafts the evidence. Then a scripted cross-check verifies every source ID against `database/provenance/sources.json` and `food-reviews.json`. Then Claude Code reviews it. Manus is only for occasional deep multilingual research, and only started by the owner.
- **Jules specs.** Write the real issue number into every spec; never write a placeholder like `#<this issue>`. Label an issue `jules` only when it is focused and its work has not already been done.
- **Merging.** The owner approves each merge PR by PR. Keep one branch and PR per independent change.
- **Explaining.** Explain git and GitHub concepts plainly when they come up; the owner is learning them.
