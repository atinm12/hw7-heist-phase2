NOTES ONLY. Rewrite in my own words, then delete these bullets.

1. What did I read first, and did it help?

- SPEC.md first, then HANDOFF.md, PROGRESS.md, js/levels/README.md
- No README.md or prompt_log.md in the folder
- HANDOFF.md: file table, frame order, next steps list
- HANDOFF.md claim "scripted playthrough wins": teleport + stealth on in levels.test.js

2. Was the spec clear? Were the acceptance criteria checkable or vague?

- Criterion 3 sub-bullet cut off: "The player should not trip lasers or"
- Criterion 1 wording: "go above to the main floor"
- Criteria 3 and 4 not measurable: "tuned well", "sufficiently polished"
- Powerups in feature set, not in acceptance criteria

3. What made the code easy to work with?

- One global `Heist`, no build step
- Reserved hooks: `state.powerups`, `player.stealth`, `isDetectable`
- 68 passing tests at handoff, `T.load` / `T.hold` / `T.teleport` helpers
- Level tuning = data edits in level files, no logic changes
