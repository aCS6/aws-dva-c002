# AWS Certified Developer — Associate (DVA-C02) Prep Companion

A self-contained, offline-first study companion for the **AWS Certified Developer – Associate (DVA-C02)** exam.
It packs the full 30-day study plan, a 551-question practice bank with explanations, exam-day cheat sheets,
diagrams, and a light "gamified" progress tracker into a single static HTML page — no server, no build step.

---

## Features

- **30-Day Study Plan** — a day-by-day roadmap covering all 4 DVA-C02 domains, each day with:
  - Study links (KodeKloud notes, the local slide deck, AWS docs)
  - A question set mapped to that day's topics
  - A one-page cheat sheet
  - Hands-on lab suggestions
  - Time budget breakdown (study / questions / hands-on / review)
- **Question Bank (551 questions)** — ExamTopics-sourced practice questions with:
  - Per-question AWS service tags and a service filter
  - Instant inline answer feedback (correct/wrong) with option highlighting
  - An explanation modal with the recap, result, community votes, and top community comments
  - Jump-to-question navigation and virtual scrolling (fast even on low-end machines)
- **Exam-Day Cheat Sheet** — one consolidated page for last-minute revision, printable-friendly.
- **Gamified Progress Tracker** — XP bar, level (every 5 days), streak counter, and day-completion
  status. Progress persists in your browser (`localStorage`).
- **Rich Study Content** — day notes reader, architecture diagrams, Notion/whitepaper references,
  and enrichment notes.
- **Fully Offline** — everything (except external study links) runs from local files; no network or
  API keys required.

---

## Getting Started

No installation or dependencies. Any of these works:

**Option A — open directly in a browser**

```bash
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

**Option B — serve locally (recommended, keeps sticky layouts/links behaving like a real site)**

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

> Note: the slide deck (`AWS Certified Developer Slides v45.pdf`) is included in the repo.
> Slide links are relative, so they resolve to the PDF wherever the repo lives.

---

## Project Structure

```
├── index.html                # Single-page app shell (views, modal, overlays)
├── css/
│   └── style.css             # All styling (dark gaming theme, responsive)
├── js/
│   └── app.js                # App logic: views, plan, bank, modal, progress
├── data/                     # Content as plain JS objects (loaded by index.html)
│   ├── plan.js               # 30-day plan: goals, links, cheat sheets, question IDs
│   ├── questions.js          # 551 questions with options/answers/discussions
│   ├── daynotes.js           # Daily study notes
│   ├── diagrams.js           # Architecture diagrams
│   ├── notion.js             # Notion reference links
│   ├── whitepapers.js        # AWS whitepaper references
│   └── enrich.js             # Extra enrichment content
├── tools/                    # Optional Python build/scrape utilities
│   ├── scrape_more.py        # Extend the question bank from ExamTopics/SecExams
│   └── build_bank.py         # Regenerate data/questions.js + plan.js question IDs
├── AWS Certified Developer Slides v45.pdf   # Local slide deck (study links point here)
└── .gitignore
```

### How the data pipeline works

`data/questions.js` is generated from scraped/intermediate JSON:

```
scrape_more.py ──> data/questions_raw.json ──> data/questions.json ──> data/questions.js
build_bank.py ───> reads question_bank.json ──> rewrites data/questions.js + plan.js questionIds
```

You do **not** need to run the tools — the committed `data/*.js` files are fully up to date and are
what the app loads. The tools exist so you can re-harvest or extend the question bank yourself.

---

## Usage Tips

- **Mark a day complete** from its day page to earn XP and level up (every 5 days).
- **Answer questions inline** in the bank, or open the **Explanation** modal for the full breakdown.
- Use **Reset progress** in the header to clear all day-completion state.
- The question-bank filter bar and header/nav stay sticky while you scroll.

---

## Disclaimer

Not affiliated with Amazon Web Services. **DVA-C02** is a trademark of Amazon Web Services, Inc.
Practice questions are mirrored from public exam-discussion sites; study notes and slides are drawn
from third-party training material (KodeKloud, Stéphane Maarek). Use for personal study only.

---

## Credits

- 30-day curriculum & cheat sheets: curated from KodeKloud DVA notes and the Stéphane Maarek slide deck
- Question bank: ExamTopics (mirrored) + SecExams, with community-voted answers where available
- Exam structure & domains: AWS official documentation
