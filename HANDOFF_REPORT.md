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

4. What cost me time?

- Playthrough tests used teleport + stealth, so no proof of a win with security on
- Had to build a playtest bot just to measure difficulty; rates never tuned in Phase 1
- Level 1 scored above level 2 on the bot, level 3 at 137/100
- No README, prompt log, or author name in the folder

5. One thing I’d ask the author to do differently

- Candidate: finish criterion 3's sub-bullet, cut off at "should not trip lasers or"
- Candidate: playtest with security on before writing "scripted playthrough wins"
- Candidate: include a README and prompt log in the handoff
