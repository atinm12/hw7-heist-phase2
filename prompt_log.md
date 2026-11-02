Prompt log
==========

Phase 1
-------

The folder I got had no prompt_log.md and no Phase 1 prompts, so there is nothing to copy here. The closest thing is the author's working log in PROGRESS.md, which I left unchanged.

======================================================================

Phase 2 (Atin Mathur)
---------------------

Model and tool: Claude Code in the Claude app, Claude Opus 5.5

My prompts are below, word for word. I ran the session from these. The first two prompts both got cut off at the end when I pasted them, so they stop mid-sentence here too.

**Prompt 1**

```text
I'm doing Phase 2 of a CMU class assignment (15-114, HW7 "Code Handoff"). The folder you're in is a classmate's Phase 1 browser game (a stealth heist game). I have to finish it based on their SPEC.md, in my OWN new public GitHub repo. Due tonight at 8:00 PM ET.

Original author's name: ________
My name: Atin Mathur (GitHub: atinm12)

Do the work in this order, committing after each step:

STEP 1 — Repo setup (before changing ANY file)
- Run `git status` and `git log`. If this folder already has a .git with the classmate's commits (or any remote pointing to their repo), show me the log, wait for my OK, then delete .git and run `git init -b main`. If there's no .git, just run `git init -b main`.
- Make sure .DS_Store is excluded (add a .gitignore with .DS_Store) — this is the only allowed change before the first commit.
- First commit, everything exactly as received: "Initial commit: unmodified code as received".
- Create a new PUBLIC GitHub repo under my account (atinm12), named something like hw7-heist-phase2, and push. Use `gh repo create atinm12/hw7-heist-phase2 --public --source=. --push` if gh is installed and logged in. If not, stop and tell me exactly what to click in GitHub Desktop or on github.com, then give me the commands to connect the remote and push.

STEP 2 — Read and run, change nothing
- Read SPEC.md first, then README.md, prompt_log.md, and all the code.
- Run the game (start a local server if needed) and check the README's claims against what actually works.
- Tell me in chat: how the code is structured, each acceptance criterion marked done / close / not started, where the docs and code disagree, and a bulleted list of raw observations about inheriting this (confusing names, missing docs, wrong README claims, what was easy, what cost time). I'll use these as notes for a report I write myself.

STEP 3 — Plan
- Pick the acceptance criteria to build, prioritizing the ones the author ranked highest. Prefer finishing whole criteria over fragments. Show me the plan, then proceed.

STEP 4 — Build
- Keep at least 75% of the original work. Work inside their design: keep their classes, file structure, naming style, and logic. Fix and extend, don't rewrite. Refactoring is OK only if logic is preserved, and must be noted in the README.
- Make small, scoped changes, one commit per change with a real message (e.g. "Add guard vision cone detection"). Test each change before committing. Push as you go.

STEP 5 — Documentation (separate files; don't merge them)
- SPEC.md: leave exactly as received. Any proposed additions go only in a section at the very bottom titled "## Proposed additions (Phase 2, Atin Mathur)".
- README.md: update it.
  - At the top: "Original design and Phase 1 foundation by [author]. Phase 2 by Atin Mathur."
  - An "Acceptance Criteria Report" walking EVERY criterion from SPEC.md one by one, marked Met / Partially met / Not met, with one sentence each. Say why any were skipped and flag any that were unclear.
  - Updated run instructions that work on a fresh machine.
  - A code map (what each file/major function does).
  - Known bugs, next steps in priority order, and any restructuring and
```

**Prompt 2**

```text
I'm doing Phase 2 of a CMU class assignment (15-114, HW7 "Code Handoff"). The folder you're in is a classmate's Phase 1 browser game (a stealth heist game). I have to finish it based on their SPEC.md, in my OWN new public GitHub repo. Due tonight at 8:00 PM ET.

Original author's name: ________
My name: Atin Mathur (GitHub: atinm12)

MY WRITING STYLE — use this for everything you write in the README and prompt_log:
- Plain, direct sentences with simple transitions. Short and concise.
- Sounds like a college student writing for a class, not a polished corporate doc. Use first person ("I added...", "I couldn't get to...").
- No filler, no hype words ("seamless," "robust," "comprehensive," "leverage"), no em dashes, and no overly formal phrasing.
- Specific over vague: "the guard vision check was one function and easy to extend," not "the code was clean."

Do the work in this order, committing after each step:

STEP 1 — Repo setup (before changing ANY file)
- Run `git status` and `git log`. If this folder already has a .git with the classmate's commits (or any remote pointing to their repo), show me the log, wait for my OK, then delete .git and run `git init -b main`. If there's no .git, just run `git init -b main`.
- Make sure .DS_Store is excluded (add a .gitignore with .DS_Store). This is the only allowed change before the first commit.
- First commit, everything exactly as received: "Initial commit: unmodified code as received".
- Create a new PUBLIC GitHub repo under my account (atinm12), named something like hw7-heist-phase2, and push. Use `gh repo create atinm12/hw7-heist-phase2 --public --source=. --push` if gh is installed and logged in. If not, stop and tell me exactly what to click in GitHub Desktop or on github.com, then give me the commands to connect the remote and push.

STEP 2 — Read and run, change nothing
- Read SPEC.md first, then README.md, prompt_log.md, and all the code.
- Run the game (start a local server if needed) and check the README's claims against what actually works.
- Tell me in chat: how the code is structured, each acceptance criterion marked done / close / not started, and where the docs and code disagree.

STEP 3 — Plan
- Pick the acceptance criteria to build, prioritizing the ones the author ranked highest. Prefer finishing whole criteria over fragments. Show me the plan, then proceed.

STEP 4 — Build
- Keep at least 75% of the original work. Work inside their design: keep their classes, file structure, naming style, and logic. Fix and extend, don't rewrite. Refactoring is OK only if logic is preserved, and must be noted in the README.
- Make small, scoped changes, one commit per change with a real message (e.g. "Add guard vision cone detection"). Test each change before committing. Push as you go.

STEP 5 — Documentation (separate files; don't merge them)
- SPEC.md: leave exactly as received. Any proposed additions go only in a section at the very bottom titled "## Proposed additions (Phase 2, Atin Mathur)".
- README.md (in my writing style): update it.
  - At the top: "Original design and Phase 1 foundation by [author]. Phase 2 by Atin Mathur."
  - An "Acceptance Criteria Report" walking EVERY criterion from SPEC.md one by one, marked Met / Partially met / Not met, with one sentence each. Say why any were skipped and flag any that were unclear.
  - Updated run instructions that work on a fresh machine.
  - A code map (what each file/major function does).
  - Known bugs, next steps in priority order, and any restructuring and why.
  - Every claim must be true. Verify against the actual code.
- prompt_log.md (in my writing style): keep the original Phase 1 content and add a clearly separated Phase 2 section. Include the model/tool used ("Claude Code in the Claude app, Claude Opus 5.5") and my prompts VERBATIM, including this one. Add a section "AI did something I didn't want" with at least one real instance from this session (you changing more than asked, renaming things, a fix that broke something, etc.) and what was done about it, written in first person as me.
- HANDOFF_REPORT.md: the course requires me to write this myself without AI, so do NOT write sentences or paragraphs for it. Create the file with these five headings, and under each one put 2–4 short factual bullet notes (fragments, not sentences) from what you actually saw, which I'll rewrite in my own words and then delete:
  1. What did I read first, and did it help?
  2. Was the spec clear? Were the acceptance criteria checkable or vague?
  3. What made the code easy to work with?
```

**Prompt 3 (sent while Claude was working)**

```text
dont add '##' to any parts of the code or anything that is not supposed to be 100% ai generated
```

AI did something I didn't want
------------------------------

**The first setup command half ran.** I stopped the first run to paste an updated prompt, and Claude's tool said the commands were rejected. They had partly gone through anyway. The commit was made and the GitHub repo was created, but the remote was never set and the push didn't land, so my public repo was empty. When Claude ran setup again, it got "nothing to commit" and noticed a .git folder that it thought didn't exist. Instead of deleting it and starting over, it looked at the log, checked GitHub, added the remote and pushed. The first commit is still the unmodified code.

**It checked its work on old code.** After adding the start screen, Claude ran the game in the browser and the screen wasn't there. The browser was running cached JavaScript, so that test said nothing about the new code. Claude caught this, started a server with caching turned off, and checked again. The start screen worked after that.

**Its playtest bot was wrong at first.** The first bot got stuck for the full 10 minute limit on levels 1 and 2. That looked like the levels were broken, but the bug was in the bot. It reset its wait timer every frame and pressed up before lining up with doors. Claude fixed the bot and did not change any game code because of this.

**A conflict in my own instructions.** Partway through, I told Claude not to add hash mark headings to the code or to anything that isn't supposed to be all AI. That clashed with my instruction to title a SPEC.md section with one, so Claude left SPEC.md alone and added no section. The only ones left in this file are inside my quoted prompts above, because those have to be word for word.
