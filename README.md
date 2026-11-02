Heist
=====

Original design and Phase 1 foundation by [author]. Phase 2 by Atin Mathur.

This is a top-down stealth game in the browser. You finish a chain of tasks, grab the treasure, and walk back to where you started without maxing out the alert counter. It has three levels, and it runs on plain JavaScript and HTML5 Canvas.

How to run
----------

You need a browser and nothing else. There is no build step and nothing to install.

1. Clone the repo: `git clone https://github.com/atinm12/hw7-heist-phase2.git`
2. Open `index.html` in a browser. Double clicking it works.
3. Press Enter on the start screen.

If you would rather use a local server, run `python3 -m http.server 8000` in the repo folder and go to `http://localhost:8000`.

To run the tests on a Mac with Google Chrome and python3 installed, run `zsh test/run.sh`. It takes about 40 seconds because the playtest bot plays all three levels. On any other system, open `test/test.html` in a browser and read the results on the page.

Controls
--------

- WASD or arrow keys: move
- F (hold): hack a computer
- Q: climb into a vent. E: drop out of a vent.
- X: X-Ray, from level 2 on
- C: Stealth Mode, from level 3 on
- R: restart the level
- Enter or Space: next level after a win, retry after a loss
- M: mute
- [ and ]: skip between levels. These are debug keys from Phase 1 and I left them in.

Acceptance Criteria Report
--------------------------

These are the four criteria from SPEC.md in the author's order.

**1. The player moves with WASD, and can (at times) go above to the main floor with two buttons (ex: Q and E).** Met. WASD works on every level, and Q and E move between the main floor and the vents on levels 2 and 3. This one was slightly unclear because it says "above to the main floor", so I read it as going up to the vent layer, which matches the rest of the spec.

**2. The levels have a main treasure and a set of tasks to complete before getting that treasure.** Met. All three levels have a treasure and a task chain, and the Phase 1 solver test shows that the treasure can't be reached until every task is done.

**3. The security system works accurately and difficulty is tuned well.** Partially met. Cameras, guards and lasers work and are tested, and I tuned the levels using a bot that plays with security on (alert 21, 48 and 63 out of 100 on levels 1, 2 and 3), but a bot is not the same as lots of people play testing it. This one was also unclear because the sub-bullet stops mid-sentence at "The player should not trip lasers or", so I couldn't check whatever the rest of it asks for.

**4. The game is sufficiently polished. Art, music, sound effects, and gamefeel don't feel unfinished.** Partially met. I added a start screen, guard route lines, and fixes for the hint overlap and cut off objective text, but decor is still not solid and the player can walk over desks. "Sufficiently polished" is also a judgment call and not something a test can check.

No criterion was skipped completely. The two I marked as partially met have the gaps listed above, and I ran out of time to do more about them.

Other parts of the spec's feature set
-------------------------------------

These aren't numbered criteria, but the spec asks for them and Phase 1 didn't have them, so I built them.

- Powerups are cumulative. Level 1 starts with none, beating level 1 gives Vent Crawling and X-Ray, and beating level 2 gives Stealth Mode.
- X-Ray shows locked rooms for 3 seconds with a 12 second cooldown.
- Stealth Mode hides you from all security for 2.5 seconds and has 2 uses per level.

What I changed
--------------

I kept 99.7% of the original lines (13 of 4978 were deleted or replaced), and I added 354 lines before this documentation.

- I added `js/powerups.js`, `test/playtest.test.js` and `test/powerups.test.js`.
- I added a start screen, guard route drawing, a powerup panel on the HUD, and an unlock message on the win screen.
- Level 1 guard: speed 1.5 to 1.3, vision 60 to 55 degrees, range 4 to 3.5, pause 0.4 to 0.6.
- Level 1 east corridor camera: vision 45 to 40 degrees, range 5 to 4, speed 25 to 20.
- Level 3 ring guards: speed 1.8 to 1.5, vision 70 to 60 degrees, range 4.5 to 4.
- I shortened one objective line on level 2 and one on level 3 because they were getting cut off.
- Level 1 used to score higher than level 2 on the bot, and level 3 scored 137 out of 100. That is why I changed the numbers above.

Restructuring: I didn't refactor any existing code. The only structural change is the new `js/powerups.js` file, because `vents.js` and `player.js` already had their own jobs. I left SPEC.md, HANDOFF.md and PROGRESS.md exactly as I got them, so HANDOFF.md still says the powerups aren't done. This README is the current one.

Code map
--------

| File | What it does |
|---|---|
| `index.html` | Canvas, controls text, and the script tags. Load order matters. |
| `js/config.js` | Tunable numbers (`Heist.CONFIG`) and tile characters. |
| `js/utils.js` | Geometry helpers: `lineOfSight`, `castRay`, `inCone`, `distToSegment`. |
| `js/input.js` | Key state: `isDown`, `wasPressed`, `endFrame`. |
| `js/level.js` | `registerLevel`, `parse`, room detection (`computeRegions`), the fog rule (`isRegionHidden`), collision checks. |
| `js/levels/level1.js` to `level3.js` | Level data: map, tasks, security, decor, and `unlocks`. |
| `js/levels/README.md` | The level file format. |
| `js/player.js` | `create`, movement and collision in `update`, and `isDetectable`. |
| `js/tasks.js` | Keycards, doors, computers, treasure, escape. `check` reads requirement strings like `key:red`. |
| `js/security.js` | Cameras, guards and lasers. `update` does detection, `draw` does cones, beams and guard routes. |
| `js/vents.js` | Q and E, the temperature sensor, and vent drawing. |
| `js/powerups.js` | New. `update` handles the X and C keys and the timers, and `xrayOn` tells the renderer to skip fog. |
| `js/render.js` | World, decor, fog, player and HUD. Also `drawPowerups`, `drawStartScreen`, `drawOverlay`. |
| `js/audio.js` | Sound effects and music made with WebAudio, no asset files. |
| `js/game.js` | State, main loop, win and lose, `loadLevel`, `powerupsFor`, and `step` for tests. |
| `test/` | `test.html` and `run.sh` run everything. `harness.js` is the mini framework. There are 75 tests in the core, security, vents, levels, powerups and playtest files. |

Known bugs
----------

- Decor isn't solid, so you can walk over desks. This came from Phase 1. The spec says decor has no function, so I left it.
- Pressing C inside a vent uses up a Stealth Mode charge even though you can't be seen in there anyway.
- Playing again after level 3 goes back to level 1, and powerups reset with it.
- Paintings sit on wall tiles because there is no `onWall` flag. This came from Phase 1.
- The test named "real levels l1 and l2 are registered in order" has an old name, since there are three levels now.
- `test/run.sh` only works on a Mac because the Chrome path is hard coded.
- The bot only follows one route with simple waiting, so its scores are a rough measure of difficulty.
- The optional guard `angle` field still isn't in `js/levels/README.md`.

Next steps, in priority order
-----------------------------

1. Have real people play all three levels and adjust the guard and camera numbers from what happens.
2. Ask the original author how the cut off sub-bullet in criterion 3 was supposed to end.
3. Add more task types. HANDOFF.md has ideas like a keypad code and a power breaker.
4. Add a level select menu and take out the `[` and `]` debug keys.
5. Fix the small bugs listed above.
