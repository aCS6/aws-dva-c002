# AWS Certified Developer — Associate (DVA-C02) Prep Companion

A **self-contained, offline-first** study companion for the **AWS Certified Developer – Associate (DVA-C02)** exam.

It bundles a 30-day study plan, a 551-question learning bank with explanations, exam-day cheat sheets, architecture diagrams, a light "gamified" progress tracker, and a **full timed mock-exam simulator (387 questions)** into a single static HTML page — **no server, no build step, no dependencies, no API keys**.

Everything runs from local files. The only network calls are the outbound study links you choose to click.

---

## Table of Contents

- [What's Inside](#whats-inside)
- [The Two Question Pools](#the-two-question-pools-important)
- [Mock Test Simulator](#mock-test-simulator)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Data Files & Globals](#data-files--globals)
- [Data Sources](#data-sources)
- [Data Pipelines & Regenerating Content](#data-pipelines--regenerating-content)
- [Persistence (localStorage)](#persistence-localstorage)
- [Architecture Notes](#architecture-notes)
- [Disclaimer](#disclaimer)
- [Credits](#credits)

---

## What's Inside

The app is a single-page shell (`index.html`) with four top-level views plus supporting overlays.

### 1. 30-Day Study Plan
A day-by-day roadmap covering all four DVA-C02 domains, re-sequenced and exam-weighted. Each of the 30 days includes:
- **Goal & session breakdown** with a per-day time budget (study / questions / hands-on / review)
- **Study links** — KodeKloud notes, the local slide deck, AWS docs, Notion references
- **A mapped question set** drawn from that day's topics
- **Key takeaways**, a per-day cheat sheet, and hands-on lab suggestions
- **Day notes, architecture diagrams, whitepaper references, and enrichment notes** where available

A **gamified HUD** sits on top of the plan: an XP bar, a level ring (level up every 5 days), a streak/days-done counter, and section/question totals. Progress persists in the browser.

### 2. Question Bank — 551 questions (learning mode)
ExamTopics-sourced practice questions built for **studying**, not timed testing:
- Per-question **AWS service tags** with a service filter
- **Instant inline answer feedback** (correct/wrong) with option highlighting
- An **Explanation modal** — recap, result, community votes, and top community comments
- **Copy-for-LLM** button to hand a question + your pick to an external model for a deeper explanation
- **Jump-to-question** navigation and **virtual scrolling** (stays fast on low-end machines)

### 3. Exam-Day Cheat Sheet
One consolidated, print-friendly page for last-minute revision the morning of the exam.

### 4. Mock Test Simulator — 387 questions (exam mode)
A timed, real-exam simulation. See the [dedicated section below](#mock-test-simulator).

**Supporting overlays:** a day-note reader, an architecture-diagram renderer, and the explanation modal.

---

## The Two Question Pools (important)

The app keeps **two completely separate question sets**. They come from different sources and serve different purposes — they are never mixed.

| | **Study Question Bank** | **Mock Test pool** |
|---|---|---|
| **Purpose** | Learn topic-by-topic | Simulate the real timed exam |
| **Count** | 551 questions | 387 questions |
| **Source** | ExamTopics (mirrored) + SecExams | [Ditectrev DVA-C02 Practice Tests](https://github.com/Ditectrev/Amazon-Web-Services-AWS-Developer-Associate-DVA-C02-Practice-Tests-Exams-Questions-Answers) (GitHub) |
| **Data file** | `data/questions.js` (`window.DVA_QUESTIONS`) | `data/mocktests.js` (`window.DVA_MOCKTESTS`) |
| **Source of truth** | `question_bank.json` | Ditectrev repo `README.md` |
| **Mode** | Untimed, inline feedback, explanations | Timed, no feedback until submit, scored |
| **Extras** | Community votes/comments, service tags | Question images (19 files in `mock-images/`) |

> The mock pool was intentionally sourced separately from the study bank so that exam simulation uses fresh, unseen questions.

---

## Mock Test Simulator

Mirrors the **real AWS DVA-C02 exam rules** (per the AWS certification guide).

### Exam rules enforced
- **65 questions** per test, **130-minute** countdown
- **Multiple choice** (1 correct of 4) and **multiple response** (2+ correct of 5+)
- Scaled score **100–1000**, **pass ≥ 720**
- Scaled-score formula: `scaled = round(100 + 900 × correct / total)`
- **Multiple-response grading is exact-set match** — you must select *all* correct options and *no* extras to get the point
- **Unanswered = incorrect** (no penalty), per AWS rules

### Test layout
All 387 questions are split into **6 static tests** plus a **random test**:

| Test | Questions |
|---|---|
| Mock Test 1–5 | 65 each |
| Mock Test 6 | 62 |
| **Mock Test (Random)** | Fresh 65 drawn (shuffled) each attempt |

Static slices cover all 387 questions with no gaps or overlaps.

### Runtime features
- **One question at a time** with a **question-grid navigator** (answered / current / flagged states)
- Sticky **countdown timer** — warns under 10 min, turns red under 5 min, and **auto-submits at 0:00**
- **Mark for review**, Prev/Next, and keyboard shortcuts (←/→ navigate, `F` flag, letter keys select)
- **Radio inputs** for single-answer, **checkbox toggle** for multiple-response (shows "Select N · X selected")
- **Refresh-safe** — an in-progress attempt (answers, flags, position, deadline) is saved to `localStorage` and resumes with the correct remaining time
- **Best score per test** shown on the landing cards

### Result & report
On submit (or auto-submit at time-out):
- A result screen with **scaled score, PASS/FAIL, correct/total, accuracy %, and time used**
- A scrollable **per-question review** — your answer vs. the correct answer, ✓/✗
- **Download `.md`** — a Markdown report containing the score summary and *every* question with its options (correct ones marked ✅), your answer, the correct answer, and pass/fail per question (e.g. `DVA-C02-Mock-Test-1-result.md`)

### Data integrity (verified)
The generated `data/mocktests.js` was cross-checked against the source README:
- **387/387** questions pulled — 0 dropped, none hiding under other heading levels
- **1619/1619** option lines and **447/447** correct marks matched
- **0** correct-answer mismatches, **0** orphan/empty correct references
- **53** multiple-response questions (47×2-answer, 5×3-answer, 1×4-answer) + 334 single = 387

---

## Getting Started

No installation, no dependencies.

**Option A — open directly**
```bash
xdg-open index.html      # Linux
open index.html          # macOS
start index.html         # Windows
```

**Option B — serve locally (recommended)**
```bash
python3 -m http.server 8000
# visit http://localhost:8000
```
Serving over HTTP keeps sticky layouts, relative links, and mock-test images behaving like a real site.

> The slide deck (`AWS Certified Developer Slides v45.pdf`) and split per-topic slides (`slides/01-…`–`29-…`) ship with the repo; study links resolve to them by relative path.

---

## Project Structure

```
dva/
├── index.html                          # SPA shell: nav, views, modal, overlays
├── README.md
│
├── css/
│   └── style.css                       # All styling (dark gaming theme, responsive, light-theme aware)
│
├── js/
│   ├── app.js                          # Core app: views, plan, bank, cheat sheet, HUD, modal, progress
│   └── mock.js                         # Mock-exam engine (self-contained): timer, navigator, grading, .md export
│
├── data/                               # Content as plain JS globals (loaded by index.html)
│   ├── plan.js                         # window.DVA_PLAN        — 30-day plan
│   ├── questions.js                    # window.DVA_QUESTIONS   — 551 study questions (ExamTopics)
│   ├── mocktests.js                    # window.DVA_MOCKTESTS   — 387 mock questions (Ditectrev) [GENERATED]
│   ├── daynotes.js                     # window.DVA_DAYNOTES    — daily study notes
│   ├── diagrams.js                     # window.DVA_DIAGRAMS    — architecture diagrams
│   ├── enrich.js                       # window.DVA_ENRICH      — per-day enrichment hooks
│   ├── notion.js                       # window.DVA_NOTION      — Notion topic references
│   ├── whitepapers.js                  # window.DVA_WHITEPAPERS — AWS whitepaper references
│   ├── questions.json                  # intermediate (study-bank pipeline)
│   ├── questions_raw.json              # scraped raw (study-bank pipeline)
│   └── question_bank.json*             # study-bank source of truth (*at repo root)
│
├── mock-images/                        # 19 images referenced by mock questions
│
├── slides/                             # 29 split per-topic slide PDFs (01-intro … 29-conclusion)
├── AWS Certified Developer Slides v45.pdf   # Full Maarek slide deck
│
└── tools/                              # Optional build/scrape utilities (not needed to run the app)
    ├── build_mocktests.py              # Ditectrev README  → data/mocktests.js + mock-images/
    ├── build_bank.py                   # question_bank.json → data/questions.js + plan questionIds
    ├── build_plan.js                   # Rebuild the 30-day plan (re-sequenced, exam-weighted)
    ├── scrape_more.py                  # Harvest more questions from ExamTopics / SecExams
    ├── split_slides.py                 # Split the full PDF into slides/01…29
    ├── kk_sitemap_dva.txt              # KodeKloud sitemap used for study-link curation
    └── orig/                           # Pre-enrichment snapshots of the data/*.js files
```

---

## Data Files & Globals

Each `data/*.js` file assigns one global that `index.html` loads via `<script>` before `js/app.js`.

| File | Global | Contents |
|---|---|---|
| `plan.js` | `DVA_PLAN` | 30-day array: goal, session, minutes, study links, cheat sheet, `questionIds`, key takeaways |
| `questions.js` | `DVA_QUESTIONS` | `{ exam, total: 551, questions[] }` — options, answer, service tag, community votes/comments |
| `mocktests.js` | `DVA_MOCKTESTS` | `{ durationMinutes:130, passingScore:720, questionsPerTest:65, questions[387], staticTests[6] }` |
| `daynotes.js` | `DVA_DAYNOTES` | Day-keyed study notes (26 days) |
| `diagrams.js` | `DVA_DIAGRAMS` | Day-keyed architecture diagrams (27 days) |
| `enrich.js` | `DVA_ENRICH` | Day-keyed enrichment hooks (30 days) |
| `notion.js` | `DVA_NOTION` | Topic-keyed Notion references (30 topics, e.g. `ec2`, `lambda`) |
| `whitepapers.js` | `DVA_WHITEPAPERS` | Day-keyed AWS whitepaper links (10 days) |

`data/mocktests.js` is **generated** — do not hand-edit it (see below).

---

## Data Sources

| Content | Source |
|---|---|
| 30-day curriculum, cheat sheets, day notes, diagrams, enrichment | Curated from **KodeKloud DVA notes** + **Stéphane Maarek** slide deck |
| **Study Question Bank (551)** | **ExamTopics** (mirrored) + **SecExams**, with community-voted answers/comments where available |
| **Mock Test questions (387)** | **[Ditectrev DVA-C02 Practice Tests](https://github.com/Ditectrev/Amazon-Web-Services-AWS-Developer-Associate-DVA-C02-Practice-Tests-Exams-Questions-Answers)** repo `README.md` (the [Ditectrev Practice-Tests-Exams-Platform](https://github.com/Ditectrev/Practice-Tests-Exams-Platform) is only a renderer — no extra questions) |
| Notion references | `arkalim.notion.site` topic pages |
| Whitepapers | AWS official documentation |
| Exam structure, domains, scoring rules | [AWS DVA-C02 certification guide](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html) |
| Slides | Stéphane Maarek — *AWS Certified Developer Slides v45* |

---

## Data Pipelines & Regenerating Content

You do **not** need to run any tool — all committed `data/*.js` files are up to date and are what the app loads. The tools exist so you can re-harvest or extend the content yourself.

### Study Question Bank pipeline (551)
```
scrape_more.py ──> data/questions_raw.json ──> data/questions.json ──> data/questions.js
build_bank.py  ──> reads question_bank.json ──> rewrites data/questions.js + plan.js questionIds
```

### Mock Test pipeline (387)
`build_mocktests.py` reads the Ditectrev repo README, so clone it to `/tmp` first:
```bash
git clone --depth 1 \
  https://github.com/Ditectrev/Amazon-Web-Services-AWS-Developer-Associate-DVA-C02-Practice-Tests-Exams-Questions-Answers.git \
  /tmp/ditectrev-dva

python3 tools/build_mocktests.py
# → writes data/mocktests.js and copies referenced images into mock-images/
```
The script parses every `### question` block and its `- [ ]` / `- [x]` options (`[x]` = correct), assigns option letters A–J, rewrites image paths to `mock-images/`, splits questions into 65-per-test static slices, and prints a summary (question/single/multi/image counts). The committed `data/mocktests.js` is the source of truth — never hand-edit it.

### 30-day plan
```bash
node tools/build_plan.js     # rebuild the re-sequenced, exam-weighted plan
```

### Slides
```bash
python3 tools/split_slides.py   # split the full PDF into slides/01…29
```

---

## Persistence (localStorage)

All state is browser-local; nothing leaves the machine.

| Key | Written by | Holds |
|---|---|---|
| `dva-progress-v1` | `js/app.js` | Day-completion state (drives XP / level / streak) |
| `dva_mock_attempt_v1` | `js/mock.js` | In-progress mock attempt (test id, question order, answers, flags, current index, deadline) — enables refresh-resume |
| `dva_mock_best_v1` | `js/mock.js` | Best scaled score per static test (shown on landing cards) |

Use **Reset progress** in the header to clear day-completion state.

---

## Architecture Notes

- **No framework, no build.** Plain HTML + CSS + ES5-style JS. Data is loaded as `window.DVA_*` globals from `data/*.js` script tags.
- **View switching is convention-based.** `js/app.js` binds every `.nav-btn` click to `showView(dataset.view)`, which toggles `.view` sections by `#view-<name>` id. A new nav button + matching `#view-…` section wire in with zero JS changes — this is exactly how the Mock Test view was added.
- **`js/mock.js` is a fully self-contained IIFE.** It renders into `#view-mock`, manages its own state machine (`landing → exam → result`), timer, grading, and Markdown export, and touches nothing in `app.js`.
- **Themed** for a dark "gaming" look with light-theme awareness; responsive down to mobile widths.

---

## Disclaimer

Not affiliated with Amazon Web Services. **DVA-C02** is a trademark of Amazon Web Services, Inc. Practice questions are mirrored from public exam-discussion sites and open-source practice-test repositories; study notes and slides are drawn from third-party training material (KodeKloud, Stéphane Maarek). **For personal study only.**

---

## Credits

- **30-day curriculum & cheat sheets** — curated from KodeKloud DVA notes and the Stéphane Maarek slide deck
- **Study Question Bank (551)** — ExamTopics (mirrored) + SecExams, with community-voted answers where available
- **Mock Test questions (387)** — [Ditectrev](https://github.com/Ditectrev) open-source DVA-C02 practice tests
- **Exam structure, domains & scoring** — AWS official certification documentation
