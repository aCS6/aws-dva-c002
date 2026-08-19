# Cheat-Sheet Designer — Knowledgebase

**Purpose:** rebuild any day's **Cheat Sheet** tab into a brain-friendly, top-notch UI from a user-supplied markdown cheat sheet, in a fresh session, **without re-reading the codebase**. Read this file, then follow the workflow.

> Companion to `docs/takeaway-designer.md` (that's the *Key Takeaways* tab; this is the *Cheat Sheet* tab). Day-2 is the working reference implementation.

---

## TL;DR workflow

1. User gives a markdown cheat sheet for a day + "make the UI/UX top-notch, brain-friendly, don't be a copy-cat."
2. Map its parts → `cheatSheetV2` sections (see [catalog](#section-catalog)). Preserve the *content*; elevate the *presentation*.
3. Fill `cs = {...}` + set the day in the [injector](#injector-script). Run it → splices `cheatSheetV2` into that day in `data/plan.js`.
4. Verify: `node --check js/app.js` + the [headless check](#verification). Expect **0 console errors** + counts matching your design. **Look at the screenshot.**
5. Report. Commit only if asked.

**Data-only** — the renderer (`cheatPanel` + `cs*` helpers), all section types, and all `.cs-*` styles already exist. You only touch `data/plan.js`. (New section type → see [Extending](#extending).)

---

## The two-field model (important — don't break the global view)

`cheatSheet` on each day is a **`string[]`** and is rendered in **two** places:
- **Per-day Cheat Sheet tab** — `cheatPanel(day)` in `js/app.js`.
- **Global "Exam-Day Cheat Sheet" view** — `renderCheatSheet()` rolls up **every** day's `cheatSheet` lines into a master sheet, grouped by week. It does `esc(line)` on each — **it only understands strings.**

So the design is **additive**:
- **Keep** the day's existing `cheatSheet` string[] (feeds the global master rollup — no loss, no regression).
- **Add** a new `cheatSheetV2` object. `cheatPanel` renders `cheatSheetV2` when present, else falls back to the plain string list. Days without it are unchanged.

**Never** convert `cheatSheet` itself to an object — that would render `[object Object]` in the global view.

---

## Where things live

| Thing | Location |
|---|---|
| Cheat **data** | `data/plan.js` → day _N_ (index _N−1_) gets a `cheatSheetV2` object **plus** its existing `cheatSheet` string[] |
| **Renderer** | `js/app.js` → `cheatPanel(day)` picks V2 or fallback; helpers `cheatSheetV2HTML`, `cheatSectionHTML`, `csTable`, `csChain`, `csTraps`, `csRecall`, `csTips`, `csFmt` |
| **Styles** | `css/style.css` → the `.cs-*` block (hero, table, staircase, mnemonic, traps, recall `<details>`, tips) |
| Global rollup | `js/app.js` `renderCheatSheet()` — untouched; still reads `cheatSheet` strings |

---

## `cheatSheetV2` schema

```js
"cheatSheetV2": {
  "heading": "🚀 AWS Developer Tooling & Access",   // shown in hero (csFmt: code/bold/italic ok)
  "subtitle": "Exam Edition",                        // optional pill in hero
  "sections": [ /* section objects, in display order */ ]
}
```

Rendered as **one** `.panel-card` (`cheatPanel` also appends the `enrich.hooks` "Exam memory hooks" card afterward, if that day has hooks).

**Inline formatting (`csFmt`)** — every text/label/cell/note runs through it: `` `code` `` → `<code>`, `**bold**` → `<b>`, `*italic*` → `<i>`. HTML is `esc()`-ed first, so content is safe. Use backticks for commands/paths/identifiers, bold for the key phrase, italic for asides.

### Section catalog

Every section has `type`, `icon` (emoji), `title`, optional `subtitle`, optional `flag` (small warn-colored pill, e.g. `"High Yield"`).

**`table`** — reference grid (tool stack, service compare):
```js
{ "type":"table", "icon":"🧰", "title":"The Core Tool Stack",
  "cols":["Tool","What it is","Key Exam Details"],
  "rows":[ ["**AWS CLI**","Command-line interface","Config via `aws configure` …"], … ] }
```
First column auto-emphasized (`.cs-tool`, accent, no-wrap). Wraps in a horizontal scroller. `cols`/each row = all-scalar → serialize inline.

**`chain`** — ordered fall-through with mnemonic + visual staircase (credential chain, precedence order):
```js
{ "type":"chain", "icon":"🔐", "title":"Credential Provider Chain", "flag":"High Yield",
  "subtitle":"How the SDK/CLI finds credentials. **First match wins!**",
  "mnemonic":{ "phrase":"Exam Students Should Check Everything", "hint":"E · S · S · C · E" },
  "steps":[ {"k":"E","label":"Env Vars","note":"`AWS_ACCESS_KEY_ID` …"}, … ] }
```
`k` = one-char key badge (accent). Steps indent progressively (inline `margin-left`, the "staircase") + a green "first match wins" footer. `mnemonic` optional.

**`traps`** — red-flag callouts (golden rules / "what AWS tricks you on"):
```js
{ "type":"traps", "icon":"🚨", "title":"Golden Rules & Exam Traps",
  "subtitle":"The exact scenarios AWS uses to trick you.",
  "items":[ {"icon":"🚫","label":"Never hardcode keys","text":"On EC2/Lambda/ECS **always use IAM Roles** …"}, … ] }
```
Each item = red left-border card, emoji, red label, text.

**`recall`** — active-recall cover-to-reveal cards (native `<details>`, no JS, accessible):
```js
{ "type":"recall", "icon":"🧠", "title":"Brain-Cache Active Recall",
  "subtitle":"Test yourself first — tap a card to reveal the answer.",
  "cards":[ {"q":"Exact order of the Credential Provider Chain?","a":"Env → SSO → Shared → Container → EC2 *(first match wins)*"}, … ] }
```
Closed shows Q + orange "Reveal" pill; open reveals a green answer + "✓ Reveal". Answers are always in the DOM (`.cs-ra`) — the cover is CSS/native.

**`tips`** — closing memorization tips (ordered list):
```js
{ "type":"tips", "icon":"💡", "title":"Cache It In Your Brain",
  "items":[ "**Read it aloud** — especially the mnemonic *…*", … ] }
```

### Mapping the user's markdown → sections
- A markdown **table** → `table`.
- An **ordered/precedence list with a mnemonic** (chain, resolution order, lifecycle) → `chain` (pull the mnemonic into `mnemonic`, each `1️⃣ X (note)` → a step; set `k` to its mnemonic letter).
- A **"traps / golden rules / gotchas"** bullet list → `traps` (keep each emoji as the item `icon`).
- A **Q&A / active-recall** block → `recall`.
- A **tips / how-to-memorize** block → `tips`.
- Section header emoji → the section `icon`; a "HIGH YIELD"-type marker → `flag`.
- **Preserve the content** (commands, numbers, wording); only tighten. Keep the day's existing `cheatSheet` string[] as-is for the global rollup — just *add* `cheatSheetV2`.

---

## Injector script

Fill `cs`, set `DAY`, save `/tmp/inject_cheat.py`, run `python3 /tmp/inject_cheat.py`. Same style-matching serializer as the takeaway flow; anchors on the day's **last `cheatSheet` string** (unique text) and inserts `cheatSheetV2` right after the `cheatSheet` array — so no other day reflows.

```python
#!/usr/bin/env python3
import json
PLAN = "/home/vivasoft/Documents/dva/data/plan.js"
DAY  = 3   # <-- target day (1-based)

cs = { "heading":"…", "subtitle":"…", "sections":[ /* paste section dicts */ ] }

SCALARS = (str, int, float, bool)
def ser(obj, ind):
    sp, csp = " " * ind, " " * (ind + 1)
    if obj is None or isinstance(obj, SCALARS):
        return json.dumps(obj, ensure_ascii=False)
    if isinstance(obj, list):
        if all(x is None or isinstance(x, SCALARS) for x in obj):
            return "[" + ", ".join(json.dumps(x, ensure_ascii=False) for x in obj) + "]"
        return "[\n" + ",\n".join(csp + ser(x, ind + 1) for x in obj) + "\n" + sp + "]"
    if isinstance(obj, dict):
        return "{\n" + ",\n".join(csp + json.dumps(k, ensure_ascii=False) + ": " + ser(v, ind + 1)
                                  for k, v in obj.items()) + "\n" + sp + "}"
    raise TypeError(type(obj))

txt = open(PLAN, encoding="utf-8").read()
plan = json.loads(txt[txt.index("["):txt.rindex("]") + 1])
assert plan[DAY - 1]["day"] == DAY, "index/day mismatch"
assert not plan[DAY - 1].get("cheatSheetV2"), "day already has cheatSheetV2 — see re-design note"

# Anchor on this day's LAST cheatSheet line (unique text) + the array close.
last = plan[DAY - 1]["cheatSheet"][-1]
anchor = "   " + json.dumps(last, ensure_ascii=False) + "\n  ],\n"
assert txt.count(anchor) == 1, "anchor not unique (count=%d) — extend it with the 2nd-last line" % txt.count(anchor)

block = "  \"cheatSheetV2\": " + ser(cs, 2) + ",\n"
idx = txt.index(anchor) + len(anchor)
txt = txt[:idx] + block + txt[idx:]
open(PLAN, "w", encoding="utf-8").write(txt)
p2 = json.loads(txt[txt.index("["):txt.rindex("]") + 1])
print("OK day", DAY, "| sections", len(p2[DAY-1]["cheatSheetV2"]["sections"]),
      "| cheatSheet strings kept", len(p2[DAY-1]["cheatSheet"]), "| days", len(p2))
```

Then confirm the diff is clean:
```bash
git diff --stat data/plan.js                 # want: 1 file, +N, 0 deletions
git diff data/plan.js | grep -cE '^-[^-]'     # want: 0
```

**Re-designing a day that already has `cheatSheetV2`:** the `assert not …cheatSheetV2` guards against a double-insert. To redo — if the change is uncommitted, `git checkout data/plan.js` first; if committed, delete that day's existing `cheatSheetV2` block by hand (it's one contiguous `"cheatSheetV2": { … },`) — then run the injector.

---

## Verification

**1. Syntax:** `node --check js/app.js` (only if you touched app.js).

**2. Headless render** (no `chromium-cli`; use `google-chrome` + CDP). Set `DAY`, save `/tmp/drive_cheat.mjs`, run `node /tmp/drive_cheat.mjs`. Selectors: `#planGrid .milestone-node[data-day="N"]` → `#dayDetail .tab-btn[data-tab="cheat"]` → panel `#tab-cheat`. Assert `panelActive:true`, `.cs-sheet`=1, `.cs-sec`=#sections, `.cs-table tbody tr`=#rows, `.cs-step`=#chain-steps, `.cs-trap`=#traps, `.cs-rcard`=`.cs-ra`=#recall-cards, `.cs-tips li`=#tips, and **`CONSOLE ERRORS: 0`**. Screenshot `/tmp/cheat.png` — **open it** and check: hero underline, table (orange tool names + styled code), mnemonic banner, cascading staircase with key badges, red trap flags, recall pills, green revealed answer.

Use the driver in `docs/takeaway-designer.md` (§Verification) with the cheat selectors above, or the Day-2 driver saved as `/tmp/drive_cheat.mjs`. Pick **fresh ports** (e.g. `PORT=8124, CDP=9223`) and **don't** pre-`fuser -k` unconfirmed ports (the sandbox classifier blocks broad process kills) — just run on a port you know is free.

**3. Cleanup:** `rm -f /tmp/inject_cheat.py /tmp/drive_cheat.mjs /tmp/cheat.png`. Leave `/tmp/chr-*` profiles (broad-glob delete is blocked; they're harmless).

---

## Extending

New section type (something none of table/chain/traps/recall/tips fits):
1. `js/app.js` — add `csYourType(sec)` and an `else if (sec.type === "yourtype")` branch in `cheatSectionHTML`. Reuse `csFmt` for all text.
2. `css/style.css` — add `.cs-yourtype …` in the cheat block; use theme vars (`--bg-2`, `--bg-3`, `--border`, `--text`, `--muted`, `--accent`, `--accent-2` green, `--accent-3` blue, `--warn`) so it adapts to light/dark. Red has no var — use `#f0736a`/`#ff8a80` (as traps do).
3. Keep existing branches' contracts unchanged (older days keep rendering).
4. Re-run `node --check` + the headless check.

---

## Gotchas

- **Keep `cheatSheet` string[]** — it feeds the global master-sheet rollup. Only *add* `cheatSheetV2`.
- **Never full-`json.dump` plan.js** — reflows hand-curated inline arrays → churns other days. Use the splicer; verify 0 deletions.
- **`csFmt` runs on nearly everything** — use backticks/`**`/`*`; raw `<`/`>`/`&` are escaped, so they're safe but literal.
- **`recall` answers live in the DOM** — the cover is native `<details>`/CSS. Don't put anything secret there; it's a study aid, not a lock.
- **Theme-aware:** style with vars; the app has a light theme too. Hardcode only the reds and the on-accent text (`#1a1205`), which read on both.
- **Serializer indent:** call `ser(cs, 2)` — day-object key values sit at 2-space; its keys land at 3-space, matching the file.
- **Commit only when asked.** Repo commits direct to `main`.
```
