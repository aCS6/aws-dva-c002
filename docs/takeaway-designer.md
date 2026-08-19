# Takeaway Designer — Knowledgebase

**Purpose:** design a new day's **Key Takeaways** for the DVA-C02 prep app from exam Q&A content, in a fresh session, **without re-reading the codebase**. Read this file, then follow the workflow. Everything you need — data schema, diagram catalog, the exact injection script, and verification — is here.

> Written from the Day-2 implementation. Day-1 and Day-2 already exist as working examples in `data/plan.js`.

---

## TL;DR workflow

1. User gives you Q&A content (question, options, community answer, "MY ANSWER").
2. Convert each question → one takeaway object (see [Design recipe](#design-recipe)).
3. Fill the `takeaways = [...]` list in the [injector script](#injector-script), set `DAY = <n>`.
4. Run the injector → it splices `keyTakeaways` into that day in `data/plan.js` (Day-1 style, surgical, zero drift).
5. Verify: `node --check js/app.js` + the [headless render check](#verification). Expect **0 console errors** and counts matching your design.
6. Report. Commit only if asked.

**Adding takeaways is DATA-ONLY** — no `app.js`/`css` change needed. The renderer, all diagram types, and all styles already exist. You only touch `data/plan.js`. (Exception: inventing a brand-new diagram type — see [Extending](#extending-new-diagram-type).)

---

## Where things live

| Thing | Location |
|---|---|
| Takeaway **data** | `data/plan.js` → `window.DVA_PLAN` is an array of 30 day objects; day _N_ is index _N−1_; takeaways go in that day's `keyTakeaways` array |
| **Renderer** | `js/app.js` → `takeawaysPanel(day)` (builds each topic) + `renderDiagram(d)` (builds each diagram) |
| **Styles** | `css/style.css` → `.kt-*` (topic/head/theory/note) and `.d-*` (diagrams, roles, keymap) |
| **Tab wiring** | `js/app.js` `renderDay()` auto-adds a "🎯 Key Takeaways (N)" tab **only if** `day.keyTakeaways.length > 0`. No wiring needed. |

`plan.js` shape: `window.DVA_PLAN = [ {day:1,...}, {day:2,...}, ... ];`, **1-space indent**, hand-curated (leaf scalar arrays are often inline). The injector below preserves this.

---

## Takeaway object schema

Each entry in `keyTakeaways`:

```js
{
  "icon": "🔐",                       // one emoji, topic-relevant
  "title": "Short punchy title",       // ideally "trigger = answer" phrasing
  "theory": "2–4 sentences: why the right answer, why the traps are wrong.",
  "diagrams": [ /* 1–2 diagram objects, see catalog */ ],
  "correction": "Optional. Include ONLY if the user marked their answer wrong/partial.",
  "remember": "The one-line 'Memorize this' trigger."
}
```

Rendered by `takeawaysPanel`: numbered badge → `icon + title` → `theory` → diagrams → `correction` (red box, if present) → `remember` (orange box).

---

## Diagram catalog

`renderDiagram(d)` dispatches on `d.type`. Every diagram may have a `title` (rendered as an uppercase caption). Types:

### `flow` — left-to-right pipeline (the "Picture")
```js
{ "type":"flow", "title":"...",
  "steps":[ node, node, ... ] }   // arrows auto-inserted between
```
- A **node** is either a plain string, or `{"t":"label","role":"key|win|trap"}` for color.
- **Use for:** the request path / sequence. Convention: first node `role:"key"` (the trigger/source), final/answer node `role:"win"`.

### `stack` — vertical rows with a right-aligned note ("Answer vs traps")
```js
{ "type":"stack", "title":"Answer vs traps",
  "rows":[ ["name","right-note","role?"], ... ] }   // role optional: win|trap
```
- **Use for:** listing all options with why-right / why-wrong. Convention: winner row `"win"` prefixed `✅`, decoys `"trap"` with a short "why wrong" note.

### `compare` — side-by-side columns
```js
{ "type":"compare", "title":"...",
  "cols":[ {"head":"X","tag":"optional","items":["...","..."],"tone":"win|trap"}, ... ] }
```
- **Use for:** comparing services/commands (e.g. `sam sync` vs `sam init` vs `cdk …`, or DynamoDB vs RDS vs …). Winner column `tone:"win"`, losers `tone:"trap"`.

### `fanout` — one source → several targets
```js
{ "type":"fanout", "title":"...",
  "from": node,                      // string or {t,role}
  "to":   [ node, node, ... ] }
```
- **Use for:** "choose TWO" / one thing splitting into parallel steps. Mark required steps `role:"win"`.

### `keymap` — partition/sort key hero (DynamoDB-style)
```js
{ "type":"keymap", "title":"Composite key design",
  "table":"Table name (optional)",
  "pk":"Partition key value", "sk":"Sort key value",
  "out":["output 1","output 2"] }   // rendered as green result nodes
```
- **Use for:** key-design / data-modeling answers. PK card is accent-colored, SK card blue, outputs green.

### `decision` — yes/no diamond (pre-existing, unused in Day-2)
```js
{ "type":"decision", "title":"...", "label":"Question?", "yes":"...", "no":"...", "no2":"optional note" }
```

### Color roles (the "brain" system)
`role`/`tone` values map to CSS: **`win`** = green (answer; the win node pulses/glows), **`trap`** = red (decoy, dimmed), **`key`** = orange (the trigger/source). Available on: `flow`/`fanout` nodes (`role`), `stack` row 3rd element (`role`), `compare` column (`tone`). CSS classes: `.d-node.is-win|.is-trap|.is-key`, `.d-col.is-win|.is-trap`, `.d-layer.is-win|.is-trap`. Takeaway diagrams also get bolder nodes + animated arrows (`.kt-topic .diagram …`, honoring `prefers-reduced-motion`).

---

## Design recipe

Per question → one takeaway:

- **icon**: relevant emoji (🔐 security, 🚀 deploy, 🔑 keys/auth, 🔗 integration, 📱 mobile, ⚡ perf/DB…).
- **title**: short, ideally `trigger = answer` ("Massive Scale + Low Latency + Key Queries = DynamoDB").
- **theory**: 2–4 sentences — state the right answer and *why*, then dismiss the trap category in one clause.
- **diagram 1**: almost always a **`flow`** built from the user's "Picture" (key → … → win).
- **diagram 2**: pick by shape —
  - comparing options/services/commands → **`compare`** (winner `tone:"win"`),
  - "which option & why not the others" → **`stack`** "Answer vs traps" (all options, ✅ win + red traps + one-line why),
  - key/data modeling → **`keymap`**,
  - choose-TWO / multi-step → **`fanout`** (both steps `win`).
- **correction**: include **only** when the user marked `MY ANSWER: X (wrong)` or a partial multi-select. Name what they picked, why the right one wins. (Great for memory.)
- **remember**: the user's "Memorize this" line, tightened.

Typically 2 diagrams per takeaway (one flow + one stack/compare/keymap/fanout).

---

## Injector script

Fill `takeaways`, set `DAY`, save as `/tmp/inject_day.py`, run `python3 /tmp/inject_day.py`. It parses `plan.js`, builds the block with a **style-matching serializer** (all-scalar arrays inline, object/nested arrays expanded), and **splices** it in after the target day's `questionIds` — so Day-1 and every other day stay **byte-identical** (no full re-dump; a full `json.dump` reflows the hand-curated inline arrays and churns other days).

```python
#!/usr/bin/env python3
"""Splice keyTakeaways into ONE day of data/plan.js, preserving its formatting."""
import json

PLAN = "/home/vivasoft/Documents/dva/data/plan.js"
DAY  = 3   # <-- target day number (1-based). Day index = DAY-1.

takeaways = [
  # ---- paste the designed takeaway objects here ----
  # { "icon":"…","title":"…","theory":"…","diagrams":[…],"correction":"…","remember":"…" },
]

SCALARS = (str, int, float, bool)
def ser(obj, ind):
    """Match plan.js style: all-scalar arrays inline; else expanded one-per-line."""
    sp, csp = " " * ind, " " * (ind + 1)
    if obj is None or isinstance(obj, SCALARS):
        return json.dumps(obj, ensure_ascii=False)
    if isinstance(obj, list):
        if all(x is None or isinstance(x, SCALARS) for x in obj):
            return "[" + ", ".join(json.dumps(x, ensure_ascii=False) for x in obj) + "]"
        return "[\n" + ",\n".join(csp + ser(x, ind + 1) for x in obj) + "\n" + sp + "]"
    if isinstance(obj, dict):
        return "{\n" + ",\n".join(
            csp + json.dumps(k, ensure_ascii=False) + ": " + ser(v, ind + 1)
            for k, v in obj.items()) + "\n" + sp + "}"
    raise TypeError(type(obj))

txt = open(PLAN, encoding="utf-8").read()
plan = json.loads(txt[txt.index("["):txt.rindex("]") + 1])
assert plan[DAY - 1]["day"] == DAY, "index/day mismatch"
assert not plan[DAY - 1].get("keyTakeaways"), "day already has keyTakeaways"

# keyTakeaways is inserted right before the day object's closing brace,
# i.e. immediately after its LAST key (questionIds) — true for any day
# that has no takeaways yet. Anchor on that day's unique questionIds ints.
qids = plan[DAY - 1]["questionIds"]
anchor = '  "questionIds": [\n' + ",\n".join("   %d" % q for q in qids) + "\n  ]"
assert txt.count(anchor) == 1, "questionIds anchor not unique (count=%d)" % txt.count(anchor)

block = '  "keyTakeaways": ' + ser(takeaways, 2)
end = txt.index(anchor) + len(anchor)   # points just after the closing "  ]"
txt = txt[:end] + ",\n" + block + txt[end:]   # -> "  ],\n  \"keyTakeaways\": …" then the existing "\n }" / "\n },"
open(PLAN, "w", encoding="utf-8").write(txt)
print("day %d: spliced %d takeaways, %d block lines" % (DAY, len(takeaways), block.count("\n") + 1))
```

After running, **confirm the diff is clean**:
```bash
git diff --stat data/plan.js                    # want: 1 file, +N insertions, 0 deletions
git diff data/plan.js | grep -cE '^-[^-]'        # want: 0 (no other day reflowed)
# JSON still parses + right count (set N to the target day):
node -e 'require("./data/plan.js");const p=global.DVA_PLAN||window.DVA_PLAN' 2>/dev/null || \
python3 -c 'import json,re;t=open("data/plan.js").read();p=json.loads(t[t.index("["):t.rindex("]")+1]);N=3;print("days",len(p),"| day",N,"kt",len(p[N-1].get("keyTakeaways",[])))'
```
`0 deletions` is the pass signal. If you see deletions in other days, you accidentally re-dumped — `git checkout data/plan.js` and use this splicer.

---

## Verification

**1. Syntax:** `node --check js/app.js` (only needed if you touched app.js).

**2. Headless render** (no `chromium-cli` on this box; use `google-chrome` + CDP). Set `DAY`, save as `/tmp/drive.mjs`, run `node /tmp/drive.mjs`. Expect `panelActive:true`, topic/diagram counts matching your design, and **`CONSOLE ERRORS: 0`**. A screenshot lands at `/tmp/day.png` — **open it** and check green answers pop, red traps recede, keymap/compare render.

```js
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os'; import { join } from 'node:path';
const DAY = 3, PORT = 8123, CDP = 9222, ROOT = '/home/vivasoft/Documents/dva';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const srv = spawn('python3', ['-m','http.server',String(PORT)], {cwd:ROOT, stdio:'ignore'});
const prof = mkdtempSync(join(tmpdir(),'chr-'));
const chrome = spawn('/usr/bin/google-chrome', ['--headless=new',`--remote-debugging-port=${CDP}`,
  `--user-data-dir=${prof}`,'--hide-scrollbars','--window-size=1280,2600','--disable-gpu'], {stdio:'ignore'});
let id = 0;
const rpc = (ws,method,params={}) => new Promise((res,rej)=>{const mid=++id;
  const on=e=>{const m=JSON.parse(e.data); if(m.id===mid){ws.removeEventListener('message',on); m.error?rej(new Error(m.error.message)):res(m.result);}};
  ws.addEventListener('message',on); ws.send(JSON.stringify({id:mid,method,params}));});
(async () => {
  await sleep(800);
  let wsUrl;
  for (let i=0;i<50 && !wsUrl;i++){ try{ const r=await fetch(`http://127.0.0.1:${CDP}/json/new?http://127.0.0.1:${PORT}/index.html`,{method:'PUT'}); wsUrl=(await r.json()).webSocketDebuggerUrl; }catch{} await sleep(200); }
  const ws = new WebSocket(wsUrl); await new Promise(r=>ws.addEventListener('open',r,{once:true}));
  const errors=[]; ws.addEventListener('message',e=>{const m=JSON.parse(e.data);
    if(m.method==='Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text||'exception');
    if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error') errors.push(m.params.args.map(a=>a.value||a.description||'').join(' '));});
  await rpc(ws,'Runtime.enable'); await rpc(ws,'Page.enable');
  await rpc(ws,'Page.navigate',{url:`http://127.0.0.1:${PORT}/index.html`}); await sleep(1500);
  const out = await rpc(ws,'Runtime.evaluate',{returnByValue:true, expression:`(function(){
    var n=document.querySelector('#planGrid .milestone-node[data-day="${DAY}"]'); if(!n)return{err:'no day node'}; n.click();
    var t=document.querySelector('#dayDetail .tab-btn[data-tab="takeaways"]'); if(!t)return{err:'no takeaways tab'}; t.click();
    var p=document.querySelector('#tab-takeaways'), q=s=>p.querySelectorAll(s).length;
    return {tabLabel:t.textContent.trim(), panelActive:p.classList.contains('active'), topics:q('.kt-topic'),
      diagrams:q('.diagram'), keymap:q('.d-keymap'), win:q('.d-node.is-win'), key:q('.d-node.is-key'),
      colWin:q('.d-col.is-win'), layerTrap:q('.d-layer.is-trap'), corrections:q('.kt-correction'),
      remembers:q('.kt-remember'), arrows:q('.d-arrow')};})()`});
  console.log('DRIVE:', JSON.stringify(out.result.value,null,2));
  const shot = await rpc(ws,'Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
  writeFileSync('/tmp/day.png', Buffer.from(shot.data,'base64'));
  console.log('SCREENSHOT /tmp/day.png | CONSOLE ERRORS:', errors.length, errors.slice(0,8));
  ws.close(); chrome.kill(); srv.kill(); process.exit(0);
})().catch(e=>{console.error('FAIL',e); chrome.kill(); srv.kill(); process.exit(1);});
```

**3. Cleanup:** `fuser -k 8123/tcp 9222/tcp 2>/dev/null` then `rm -f /tmp/drive.mjs /tmp/inject_day.py /tmp/day.png`.
- Do **not** `rm -rf /tmp/chr-*` (broad-glob delete is blocked by the sandbox classifier; the temp profiles are harmless).

---

## Extending: new diagram type

Only if a takeaway needs a shape none of the 6 types cover:
1. `js/app.js` `renderDiagram(d)` — add an `else if (d.type === "yourtype")` branch emitting `.d-yourtype …`. Reuse `nodeHTML(n)` for color-coded nodes and `roleClass(role)` for `win|trap|key`.
2. `css/style.css` — add `.d-yourtype …` styles after the keymap block; put role/answer colors so they read on the **light** diagram card (nodes sit on white/cream even in dark theme).
3. Keep it **backward-compatible** (don't change existing branches' field contracts) so earlier days keep rendering.
4. Re-run `node --check` + the headless check.

---

## Gotchas

- **plan.js is hand-curated** — never full-`json.dump` it (reflows inline arrays → churns Day-1). Use the splicer.
- **Diagram card is light in both themes** by design; role colors are tuned for that. Don't assume a dark background.
- **`role` vs `tone`**: nodes (flow/fanout) and stack rows use `role`; compare columns use `tone`. Both accept `win|trap|key` (key mainly for nodes).
- **Node = string OR `{t,role}`** — plain strings still work (that's why old days are unaffected).
- **Takeaways tab appears only when `keyTakeaways.length>0`** — nothing else to wire.
- **Final day (30)** closes with ` }` (no comma) before `]`; the splicer inserts before whatever follows the `questionIds` `]`, so it still works.
- **Commit only when asked.** Repo commits direct to `main` (solo project).
```
