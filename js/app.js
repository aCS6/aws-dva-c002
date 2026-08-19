(function () {
  "use strict";

  var PLAN      = window.DVA_PLAN      || [];
  var BANK      = window.DVA_QUESTIONS || { questions: [] };
  var QUESTIONS = BANK.questions       || [];
  var ENRICH    = window.DVA_ENRICH    || {};
  var DAYNOTES  = window.DVA_DAYNOTES  || {};
  var NOTION    = window.DVA_NOTION    || {};
  var WHITEPAPERS = window.DVA_WHITEPAPERS || {};
  var DIAGRAMS  = window.DVA_DIAGRAMS  || {};
  var KEY_PREFIX = "dva-progress-v1";
  var STATE = { completed: {}, activeDay: null, activeTab: null, revealAll: false };

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  /* ═══════════════════════════════════════════
     STORAGE
  ═══════════════════════════════════════════ */
  function load() {
    try { STATE.completed = JSON.parse(localStorage.getItem(KEY_PREFIX) || "{}"); }
    catch (e) { STATE.completed = {}; }
  }
  function save() {
    try { localStorage.setItem(KEY_PREFIX, JSON.stringify(STATE.completed)); } catch (e) {}
  }

  /* ═══════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════ */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escAttr(s) { return esc(s); }

  // Escape HTML, then turn literal "\n" (from source data) into real line breaks.
  // Any double-quoted phrase is wrapped in <strong> so it renders bold.
  function fmt(s) {
    var str = String(s == null ? "" : s).replace(/\\n/g, "\n");
    var parts = [], idx = 0;
    str = str.replace(/"([^"\n]*)"/g, function (m, p1) {
      parts.push('<strong class="q-quote">"' + esc(p1) + '"</strong>');
      return "\u0000" + (idx++) + "\u0000";
    });
    str = esc(str);
    return str.replace(/\u0000(\d+)\u0000/g, function (m, n) {
      return parts[+n];
    });
  }

  function qsByNumber(n) {
    for (var i = 0; i < QUESTIONS.length; i++) if (QUESTIONS[i].number === n) return QUESTIONS[i];
    return null;
  }
  function qsForDay(day) {
    var ids = day.questionIds || [];
    var out = [];
    for (var i = 0; i < ids.length; i++) { var q = qsByNumber(ids[i]); if (q) out.push(q); }
    return out;
  }
  function completedCount() {
    var c = 0; for (var k in STATE.completed) if (STATE.completed[k]) c++;
    return c;
  }

  /* ═══════════════════════════════════════════
     PROGRESS / XP
  ═══════════════════════════════════════════ */
  function updateProgress() {
    var done  = completedCount();
    var total = PLAN.length;
    var pct   = Math.round(done / total * 100);

    // Header numbers
    var doneEl = $("#doneCount"); if (doneEl) doneEl.textContent = done;
    var pBar   = $("#progressBar");
    if (pBar) pBar.style.width = pct + "%";

    // Q count badges
    $$(".q-badge-count").forEach(function(el){ el.textContent = QUESTIONS.length; });

    // XP bar in plan view header
    var xpBar  = $("#xpBarFill");
    var xpText = $("#xpText");
    var lvlEl  = $("#playerLevel");
    if (xpBar) xpBar.style.width = pct + "%";
    if (xpText) xpText.textContent = done + " / " + total + " days";
    if (lvlEl) {
      var lvl = Math.floor(done / 5) + 1;           // level up every 5 days
      lvlEl.textContent = "LVL " + lvl;
    }

    // streak badge
    var streakEl = $("#streakCount");
    if (streakEl) streakEl.textContent = done;
  }

  /* ═══════════════════════════════════════════
     VIEWS
  ═══════════════════════════════════════════ */
  function showView(name) {
    $$(".view").forEach(function (v) { v.classList.remove("active"); });
    var target = $("#view-" + name);
    if (target) target.classList.add("active");
    $$(".nav-btn").forEach(function (b) { b.classList.toggle("active", b.dataset.view === name); });
    window.scrollTo(0, 0);

    // Lazy-render bank only when it becomes active
    if (name === "bank") renderBank();
  }

  /* ═══════════════════════════════════════════
     CHEAT SHEET
  ═══════════════════════════════════════════ */
  function renderCheatSheet() {
    var master = PLAN[PLAN.length - 1];               // Day 30 = exam-day master sheet
    var totalLines = PLAN.reduce(function (n, d) { return n + (d.cheatSheet || []).length; }, 0);

    // Pinned master block (strategy, domain weights, keyword triggers, logistics).
    var html = '<div class="panel-card cheat-master"><h3>Exam-day master sheet — ' + esc(master.title) + '</h3>' +
      '<p>Your last-minute quick-recall sheet. The full ' + totalLines +
      '-point roll-up from all 30 days follows below, grouped by week.</p>' +
      '<ul class="cheat-list">';
    (master.cheatSheet || []).forEach(function (line) { html += '<li>' + esc(line) + '</li>'; });
    html += '</ul></div>';

    // Roll up every other day's cheat lines, grouped by week.
    var byWeek = {};
    PLAN.forEach(function (d) {
      if (d === master) return;                       // master already shown on top
      (byWeek[d.week] = byWeek[d.week] || []).push(d);
    });
    Object.keys(byWeek).sort(function (a, b) { return a - b; }).forEach(function (wk) {
      var days = byWeek[wk];
      html += '<div class="panel-card"><h3>Week ' + wk +
        ' <span class="cheat-week-count">· ' + days.length + ' days</span></h3>';
      days.forEach(function (d) {
        var lines = d.cheatSheet || [];
        if (!lines.length) return;
        html += '<h4 class="cheat-day">Day ' + d.day + ' · ' + esc(d.title) + '</h4>' +
          '<ul class="cheat-list">';
        lines.forEach(function (line) { html += '<li>' + esc(line) + '</li>'; });
        html += '</ul>';
      });
      html += '</div>';
    });
    $("#cheatContent").innerHTML = html;
  }

  /* ═══════════════════════════════════════════
     GAMING PLAN GRID
  ═══════════════════════════════════════════ */
  // Domain → colour mapping for milestone node colour
  var DOMAIN_COLOURS = {
    1: "#f08a24", // week 1 — orange
    2: "#2ea043", // week 2 — green
    3: "#1f6feb", // week 3 — blue
    4: "#a371f7", // week 4 — purple
    5: "#e85757"  // week 5 — red
  };

  var WEEK_NAMES = {
    1: "Core Compute & Storage",
    2: "High Availability & Databases",
    3: "Serverless & Integration",
    4: "Deployment, Security & Monitoring",
    5: "Troubleshooting & Exam Prep"
  };

  function renderPlan() {
    var done  = completedCount();
    var total = PLAN.length;
    // First unlocked day = first incomplete day
    var firstIncomplete = -1;
    for (var i = 0; i < PLAN.length; i++) {
      if (!STATE.completed[PLAN[i].day]) { firstIncomplete = PLAN[i].day; break; }
    }

    var html = "";
    var lastWeek = null;

    PLAN.forEach(function (day, idx) {
      var isDone   = !!STATE.completed[day.day];
      var isActive = (day.day === firstIncomplete);
      var isLocked = !isDone && day.day > firstIncomplete + 2; // show 3 days ahead max

      if (day.week !== lastWeek) {
        if (lastWeek !== null) html += '</div></div>'; // close prev week
        lastWeek = day.week;
        var colour = DOMAIN_COLOURS[day.week] || "#f08a24";
        html +=
          '<div class="quest-chapter" data-week="' + day.week + '">' +
          '<div class="quest-chapter-head" style="--w-color:' + colour + '">' +
            '<span class="quest-chapter-badge">WEEK ' + day.week + '</span>' +
            '<span class="quest-chapter-title">' + esc(WEEK_NAMES[day.week] || ("Chapter " + day.week)) + '</span>' +
            '<span class="quest-chapter-days">' +
              PLAN.filter(function(d){ return d.week === day.week && STATE.completed[d.day]; }).length +
              ' / ' +
              PLAN.filter(function(d){ return d.week === day.week; }).length + ' done' +
            '</span>' +
          '</div>' +
          '<div class="milestone-path">';
      }

      var stateClass = isDone ? "ms-done" : (isActive ? "ms-active" : (isLocked ? "ms-locked" : "ms-open"));
      var icon = isDone ? "✓" : (isActive ? "▶" : (isLocked ? "🔒" : String(day.day)));
      var qCount = qsForDay(day).length;

      html +=
        '<div class="milestone-node ' + stateClass + '" data-day="' + day.day + '">' +
          '<div class="ms-connector"></div>' +
          '<div class="ms-badge">' +
            '<div class="ms-icon">' + icon + '</div>' +
          '</div>' +
          '<div class="ms-card">' +
            '<div class="ms-day-label">DAY ' + day.day + '</div>' +
            '<div class="ms-title">' + esc(day.title) + '</div>' +
            '<div class="ms-module">' + esc(day.module) + '</div>' +
            '<div class="ms-footer">' +
              '<span class="ms-time">⏱ ' + day.minutes + 'min</span>' +
              '<span class="ms-qs">' + qCount + ' Qs</span>' +
              (isDone ? '<span class="ms-xp">+' + day.minutes + ' XP</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
    });

    if (lastWeek !== null) html += '</div></div>'; // close last week

    $("#planGrid").innerHTML = html;

    // HUD chapter count — derived from distinct weeks in the plan
    var weekCount = {};
    PLAN.forEach(function (d) { weekCount[d.week] = 1; });
    var chapterEl = $("#chapterCount");
    if (chapterEl) chapterEl.textContent = Object.keys(weekCount).length;

    // wire click
    $$("#planGrid .milestone-node").forEach(function (node) {
      if (node.classList.contains("ms-locked")) return;
      node.addEventListener("click", function () {
        openDay(parseInt(node.dataset.day, 10));
      });
    });
  }

  /* ═══════════════════════════════════════════
     DAY DETAIL
  ═══════════════════════════════════════════ */
  function openDay(n) {
    var day = PLAN[n - 1];
    if (!day) return;
    STATE.activeDay = n;
    STATE.activeTab = "study";
    renderDay();
    showView("day");
  }

  function renderDay() {
    var day = PLAN[STATE.activeDay - 1];
    if (!day) return;
    var done = !!STATE.completed[day.day];
    var html =
      '<div class="day-head">' +
        '<h2>Day ' + day.day + ' — ' + esc(day.title) + '</h2>' +
        '<div class="module">' + esc(day.module) + '</div>' +
        '<div class="goal">' + esc(day.goal) + '</div>' +
        '<div class="session-breakdown">' +
          '<span class="session-chip">📖 Study <b>' + day.session.study + ' min</b></span>' +
          '<span class="session-chip">❓ Questions <b>' + day.session.questions + ' min</b></span>' +
          '<span class="session-chip">🛠 Hands-On <b>' + day.session.handsOn + ' min</b></span>' +
          '<span class="session-chip">🔁 Review <b>' + day.session.review + ' min</b></span>' +
        '</div>' +
        '<button class="btn-ghost mark-done" id="markDone">' +
          (done ? "✅ Completed — tap to undo" : "Mark day complete ＋XP") +
        '</button>' +
      '</div>' +
      '<div class="tabs">' +
        '<button class="tab-btn active" data-tab="study">📖 Study Links</button>' +
        '<button class="tab-btn" data-tab="questions">❓ Questions (' + qsForDay(day).length + ')</button>' +
        '<button class="tab-btn" data-tab="cheat">📝 Cheat Sheet</button>' +
        ((day.keyTakeaways && day.keyTakeaways.length) ? '<button class="tab-btn" data-tab="takeaways">🎯 Key Takeaways (' + day.keyTakeaways.length + ')</button>' : '') +
        '<button class="tab-btn" data-tab="hands">🛠 Hands-On</button>' +
      '</div>' +
      '<div class="tab-panel active" id="tab-study">'     + studyPanel(day)     + '</div>' +
      '<div class="tab-panel" id="tab-questions">'        + questionsPanel(day) + '</div>' +
      '<div class="tab-panel" id="tab-cheat">'            + cheatPanel(day)     + '</div>' +
      ((day.keyTakeaways && day.keyTakeaways.length) ? '<div class="tab-panel" id="tab-takeaways">' + takeawaysPanel(day) + '</div>' : '') +
      '<div class="tab-panel" id="tab-hands">'            + handsPanel(day)     + '</div>';

    $("#dayDetail").innerHTML = html;

    $("#markDone").addEventListener("click", function () {
      STATE.completed[day.day] = !STATE.completed[day.day];
      save(); updateProgress(); renderPlan(); renderDay();
    });
    $$("#dayDetail .tab-btn").forEach(function (b) {
      b.addEventListener("click", function () { switchTab(b.dataset.tab); });
    });
    wireQuestions("#dayDetail");
  }

  function switchTab(tab) {
    STATE.activeTab = tab;
    $$("#dayDetail .tab-btn").forEach(function(b){ b.classList.toggle("active", b.dataset.tab === tab); });
    $$("#dayDetail .tab-panel").forEach(function(p){ p.classList.toggle("active", p.id === "tab-" + tab); });
  }

  function topicsForDay(n) {
    var out = [];
    for (var id in NOTION) {
      if (Object.prototype.hasOwnProperty.call(NOTION, id) && NOTION[id].days.indexOf(n) !== -1) out.push(id);
    }
    return out.sort();
  }

  function studyPanel(day) {
    var links = (day.studyLinks || []).slice();
    var html = '<div class="panel-card"><h3>Read & watch</h3><ul class="link-list">';
    links.forEach(function (l) {
      var url = l.url || "#";
      html += '<li>' +
        (url === "#"
          ? '<span class="label">' + esc(l.label) + '</span>'
          : '<a href="' + escAttr(url) + '" target="_blank" rel="noopener"><span class="label">' + esc(l.label) + '</span></a>') +
        (l.note ? '<span class="note">' + esc(l.note) + '</span>' : '') +
        '</li>';
    });
    html += '</ul></div>';

    var wps = WHITEPAPERS[day.day] || [];
    if (wps.length) {
      html += '<div class="panel-card"><h3>📖 AWS Whitepapers & guides</h3><ul class="link-list">';
      wps.forEach(function (w) {
        html += '<li><a href="' + escAttr(w.url) + '" target="_blank" rel="noopener"><span class="label">' + esc(w.label) + '</span></a>' +
          (w.note ? '<span class="note">' + esc(w.note) + '</span>' : '') + '</li>';
      });
      html += '</ul></div>';
    }

    if (DAYNOTES[day.day]) {
      html += '<div class="panel-card"><h3>📄 Condensed study note</h3>' +
        '<p class="muted">Exam-focused summary — plain-language must-knows and memory triggers.</p>' +
        '<button type="button" class="note-link" data-daynote="' + day.day + '">📖 Read Day ' + day.day + ' note</button></div>';
    }

    var topics = topicsForDay(day.day);
    if (topics.length) {
      html += '<div class="panel-card"><h3>📚 Deeper dive — community notes</h3>' +
        '<ul class="link-list topic-list">';
      topics.forEach(function (id) {
        html += '<li><button type="button" class="note-link" data-topic="' + escAttr(id) + '">🔍 <span class="label">' + esc(NOTION[id].title) + '</span></button></li>';
      });
      html += '</ul></div>';
    }
    return html;
  }

  function questionsPanel(day) {
    var qs = qsForDay(day);
    if (!qs.length) {
      return '<div class="panel-card"><div class="empty-note">⚠️ No bank questions mapped to this topic yet.</div></div>';
    }
    return '<div class="panel-card"><p class="muted">' + qs.length + ' question(s) mapped. Click an option to answer.</p></div>' + questionCards(qs);
  }

  /* Key Takeaways — per-day exam-scenario notes: theory + infographic + trigger.
     Diagrams reuse renderDiagram() so they match the app's infographic style. */
  function takeawaysPanel(day) {
    var items = day.keyTakeaways || [];
    if (!items.length) {
      return '<div class="panel-card"><div class="empty-note">No key takeaways for this day yet.</div></div>';
    }
    var html = '<div class="panel-card"><p class="muted">' + items.length +
      ' exam-scenario takeaway(s) from this day. Each = short theory + an infographic + one trigger line to memorize.</p></div>';
    items.forEach(function (t, idx) {
      var diagrams = "";
      (t.diagrams || []).forEach(function (d) {
        diagrams += '<div class="diagram"><div class="diagram-title">' + esc(d.title || '') + '</div>' + renderDiagram(d) + '</div>';
      });
      html +=
        '<div class="kt-topic">' +
          '<div class="kt-head">' +
            '<span class="kt-idx">' + (idx + 1) + '</span>' +
            '<span class="kt-title">' + esc((t.icon ? t.icon + '  ' : '') + t.title) + '</span>' +
          '</div>' +
          (t.theory ? '<p class="kt-theory">' + esc(t.theory) + '</p>' : '') +
          diagrams +
          (t.correction ? '<div class="kt-note kt-correction"><b>Correction:</b> ' + esc(t.correction) + '</div>' : '') +
          (t.remember   ? '<div class="kt-note kt-remember"><b>Remember:</b> ' + esc(t.remember) + '</div>' : '') +
        '</div>';
    });
    return html;
  }

  // Inline light-markdown for cheat text: `code`, **bold**, *italic*. esc() first, so HTML is safe.
  function csFmt(s) {
    s = esc(s == null ? "" : String(s));
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    s = s.replace(/\*([^*]+)\*/g, '<i>$1</i>');
    return s;
  }

  function csTable(sec) {
    var h = '<div class="cs-tablewrap"><table class="cs-table"><thead><tr>';
    (sec.cols || []).forEach(function (c) { h += '<th>' + csFmt(c) + '</th>'; });
    h += '</tr></thead><tbody>';
    (sec.rows || []).forEach(function (r) {
      h += '<tr>';
      r.forEach(function (cell, ci) { h += '<td' + (ci === 0 ? ' class="cs-tool"' : '') + '>' + csFmt(cell) + '</td>'; });
      h += '</tr>';
    });
    return h + '</tbody></table></div>';
  }

  function csChain(sec) {
    var h = '';
    if (sec.mnemonic) {
      h += '<div class="cs-mnem"><span class="cs-mnem-tag">🧠 Mnemonic</span><b class="cs-mnem-phrase">' + csFmt(sec.mnemonic.phrase) + '</b>';
      if (sec.mnemonic.hint) h += '<span class="cs-mnem-hint">' + esc(sec.mnemonic.hint) + '</span>';
      h += '</div>';
    }
    h += '<ol class="cs-stair">';
    (sec.steps || []).forEach(function (st, i) {
      h += '<li class="cs-step" style="margin-left:' + (i * 18) + 'px">'
        + '<span class="cs-step-n">' + (i + 1) + '</span>'
        + (st.k ? '<span class="cs-key">' + esc(st.k) + '</span>' : '')
        + '<span class="cs-step-body"><b>' + csFmt(st.label) + '</b>'
        + (st.note ? '<span class="cs-step-note">' + csFmt(st.note) + '</span>' : '')
        + '</span></li>';
    });
    h += '</ol><div class="cs-stair-foot">⬇ First match wins — miss a step, fall to the next</div>';
    return h;
  }

  function csTraps(sec) {
    var h = '<ul class="cs-traps">';
    (sec.items || []).forEach(function (it) {
      h += '<li class="cs-trap"><span class="cs-trap-ic">' + esc(it.icon || "⚠️") + '</span>'
        + '<div class="cs-trap-body"><b class="cs-trap-label">' + csFmt(it.label) + '</b>'
        + '<span class="cs-trap-text">' + csFmt(it.text) + '</span></div></li>';
    });
    return h + '</ul>';
  }

  function csRecall(sec) {
    var h = '<div class="cs-recall">';
    (sec.cards || []).forEach(function (c, i) {
      h += '<details class="cs-rcard"><summary class="cs-rq"><span class="cs-rq-n">' + (i + 1) + '</span>'
        + '<span class="cs-rq-text">' + csFmt(c.q) + '</span><span class="cs-rq-cue">Reveal</span></summary>'
        + '<div class="cs-ra">' + csFmt(c.a) + '</div></details>';
    });
    return h + '</div>';
  }

  function csTips(sec) {
    var h = '<ol class="cs-tips">';
    (sec.items || []).forEach(function (t) { h += '<li>' + csFmt(t) + '</li>'; });
    return h + '</ol>';
  }

  function cheatSectionHTML(sec) {
    var head = '<div class="cs-sec-head"><span class="cs-ic">' + esc(sec.icon || "") + '</span><h4>' + csFmt(sec.title) + '</h4>';
    if (sec.flag) head += '<span class="cs-flag">' + esc(sec.flag) + '</span>';
    head += '</div>';
    if (sec.subtitle) head += '<p class="cs-desc">' + csFmt(sec.subtitle) + '</p>';
    var body = "";
    if (sec.type === "table") body = csTable(sec);
    else if (sec.type === "chain") body = csChain(sec);
    else if (sec.type === "traps") body = csTraps(sec);
    else if (sec.type === "recall") body = csRecall(sec);
    else if (sec.type === "tips") body = csTips(sec);
    return '<section class="cs-sec cs-' + esc(sec.type) + '">' + head + body + '</section>';
  }

  function cheatSheetV2HTML(cs) {
    var h = '<div class="panel-card cs-sheet"><div class="cs-hero"><h3>' + csFmt(cs.heading || "Cheat sheet") + '</h3>';
    if (cs.subtitle) h += '<span class="cs-hero-tag">' + esc(cs.subtitle) + '</span>';
    h += '</div>';
    (cs.sections || []).forEach(function (sec) { h += cheatSectionHTML(sec); });
    return h + '</div>';
  }

  function cheatPanel(day) {
    var enrich = ENRICH[day.day] || {};
    var html = day.cheatSheetV2
      ? cheatSheetV2HTML(day.cheatSheetV2)
      : '<div class="panel-card"><h3>Exam-day cheat sheet — ' + esc(day.title) + '</h3><ul class="cheat-list">'
          + (day.cheatSheet || []).map(function (line) { return '<li>' + esc(line) + '</li>'; }).join("")
          + '</ul></div>';
    if (enrich.hooks && enrich.hooks.length) {
      html += '<div class="panel-card memory-hooks"><h3>🎯 Exam memory hooks</h3><ul class="cheat-list hooks">';
      enrich.hooks.forEach(function (h) { html += '<li>' + esc(h) + '</li>'; });
      html += '</ul></div>';
    }
    return html;
  }

  function handsPanel(day) {
    var html = '<div class="panel-card"><h3>Hands-on exercise</h3><ul class="hands-list">';
    (day.handsOn || []).forEach(function (step) { html += '<li>' + esc(step) + '</li>'; });
    return html + '</ul></div>';
  }

  /* ═══════════════════════════════════════════
     DIAGRAM RENDERER
  ═══════════════════════════════════════════ */
  // A node may be a plain string, or {t, role} where role ∈ win|trap|key
  // to colour-code it (green answer / red trap / accent trigger).
  function roleClass(role) {
    return role === "win" ? " is-win" : role === "trap" ? " is-trap" : role === "key" ? " is-key" : "";
  }
  function nodeHTML(n, extra) {
    var text = (n && typeof n === "object") ? n.t : n;
    var cls = "d-node" + (extra || "") + (n && typeof n === "object" ? roleClass(n.role) : "");
    return '<div class="' + cls + '">' + esc(text) + '</div>';
  }

  function renderDiagram(d) {
    var out = "";
    if (d.type === "flow") {
      out = '<div class="d-flow">';
      d.steps.forEach(function (s, i) {
        if (i) out += '<div class="d-arrow">→</div>';
        out += nodeHTML(s);
      });
      out += '</div>';
    } else if (d.type === "compare") {
      out = '<div class="d-compare">';
      d.cols.forEach(function (c) {
        out += '<div class="d-col' + roleClass(c.tone) + '"><div class="d-col-head">' + esc(c.head) + '</div>';
        if (c.tag) out += '<div class="d-col-tag">' + esc(c.tag) + '</div>';
        out += '<ul class="d-items">';
        c.items.forEach(function (i) { out += '<li>' + esc(i) + '</li>'; });
        out += '</ul></div>';
      });
      out += '</div>';
    } else if (d.type === "fanout") {
      out = '<div class="d-fanout">' + nodeHTML(d.from, " d-src") +
        '<div class="d-fanmid">⇊</div><div class="d-fanto">';
      d.to.forEach(function (t) { out += nodeHTML(t); });
      out += '</div></div>';
    } else if (d.type === "keymap") {
      // DynamoDB-style hero: partition key + sort key → outputs
      out = '<div class="d-keymap">';
      if (d.table) out += '<div class="d-km-table">' + esc(d.table) + '</div>';
      out += '<div class="d-km-keys">' +
        '<div class="d-km-key d-km-pk"><span class="d-km-role">Partition key</span>' +
          '<span class="d-km-val">' + esc(d.pk) + '</span></div>' +
        '<div class="d-km-plus">+</div>' +
        '<div class="d-km-key d-km-sk"><span class="d-km-role">Sort key</span>' +
          '<span class="d-km-val">' + esc(d.sk) + '</span></div>' +
        '</div>';
      if (d.out && d.out.length) {
        out += '<div class="d-fanmid">⇊</div><div class="d-km-out">';
        d.out.forEach(function (o) { out += '<div class="d-node is-win">' + esc(o) + '</div>'; });
        out += '</div>';
      }
      out += '</div>';
    } else if (d.type === "stack") {
      out = '<div class="d-stack">';
      d.rows.forEach(function (r) {
        out += '<div class="d-layer' + roleClass(r[2]) + '"><div class="d-layer-name">' + esc(r[0]) + '</div>' +
          '<div class="d-layer-note">' + esc(r[1] || '') + '</div></div>';
      });
      out += '</div>';
    } else if (d.type === "decision") {
      out = '<div class="d-decision"><div class="d-diamond">' + esc(d.label) + '</div>' +
        '<div class="d-branches">' +
        '<div class="d-branch"><span class="d-tag yes">Yes</span><div class="d-node">' + esc(d.yes) + '</div></div>' +
        '<div class="d-branch"><span class="d-tag no">No</span><div class="d-node">' + esc(d.no) + '</div>' +
        (d.no2 ? '<div class="d-branch-note">' + esc(d.no2) + '</div>' : '') + '</div>' +
        '</div></div>';
    }
    return out;
  }

  /* ═══════════════════════════════════════════
     NOTES READER
  ═══════════════════════════════════════════ */
  function dayNoteHTML(n) {
    var h = '<h2>Day ' + n.day + ' — ' + esc(n.title) + '</h2>';
    if (n.intro) h += '<p class="note-intro">' + esc(n.intro) + '</p>';
    var diagrams = DIAGRAMS[n.day] || [];
    if (diagrams.length) {
      h += '<h3>📊 Visual</h3>';
      diagrams.forEach(function (d) {
        h += '<div class="diagram"><div class="diagram-title">' + esc(d.title) + '</div>' + renderDiagram(d) + '</div>';
      });
    }
    if (n.mustKnow && n.mustKnow.length) {
      h += '<h3>Must know</h3><ul class="must-list">';
      n.mustKnow.forEach(function (b) { h += '<li>' + esc(b) + '</li>'; });
      h += '</ul>';
    }
    if (n.triggers && n.triggers.length) {
      h += '<h3>🚩 Exam triggers</h3><ul class="trigger-list">';
      n.triggers.forEach(function (t) { h += '<li>' + esc(t) + '</li>'; });
      h += '</ul>';
    }
    if (n.table && n.table.length) {
      h += '<h3>Quick reference</h3><table class="ref-table">';
      n.table.forEach(function (row, i) {
        h += '<tr>';
        row.forEach(function (cell) { h += (i === 0 ? '<th>' : '<td>') + esc(cell) + (i === 0 ? '</th>' : '</td>'); });
        h += '</tr>';
      });
      h += '</table>';
    }
    return h;
  }

  function openDayNote(n) {
    var note = DAYNOTES[n];
    if (!note) return;
    note.day = n;
    $("#noteTitle").textContent = "Day " + n + " — " + note.title;
    $("#noteBody").innerHTML = dayNoteHTML(note);
    $("#noteBody").scrollTop = 0;
    $("#noteReader").hidden = false;
    document.body.classList.add("reader-open");
  }

  function closeNote() {
    $("#noteReader").hidden = true;
    document.body.classList.remove("reader-open");
  }

  function openTopic(tid) {
    var t = NOTION[tid];
    if (!t) return;
    var h = '<h2>' + esc(t.title) + '</h2>';
    h += '<p class="note-intro">Condensed digest of <strong>' + esc(t.title) + '</strong> — rewritten for the exam.</p>';
    var tdiags = (DIAGRAMS.topics && DIAGRAMS.topics[tid]) || [];
    if (tdiags.length) {
      h += '<h3>📊 Visual</h3>';
      tdiags.forEach(function (d) {
        h += '<div class="diagram"><div class="diagram-title">' + esc(d.title) + '</div>' + renderDiagram(d) + '</div>';
      });
    }
    h += '<h3>Must know</h3><ul class="must-list">';
    t.mustKnow.forEach(function (b) { h += '<li>' + esc(b) + '</li>'; });
    h += '</ul>';
    if (t.triggers && t.triggers.length) {
      h += '<h3>🚩 Exam triggers</h3><ul class="trigger-list">';
      t.triggers.forEach(function (b) { h += '<li>' + esc(b) + '</li>'; });
      h += '</ul>';
    }
    h += '<p class="source-link">📎 Source: <a href="' + escAttr(t.url) + '" target="_blank" rel="noopener">' + esc(t.title) + ' on Notion</a></p>';
    $("#noteTitle").textContent = t.title;
    $("#noteBody").innerHTML = h;
    $("#noteBody").scrollTop = 0;
    $("#noteReader").hidden = false;
    document.body.classList.add("reader-open");
  }

  function wireNotes() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-daynote]") : null;
      if (t) { e.preventDefault(); openDayNote(parseInt(t.dataset.daynote, 10)); return; }
      var p = e.target.closest ? e.target.closest("[data-topic]") : null;
      if (p) { e.preventDefault(); openTopic(p.dataset.topic); }
    });
  }

  /* ═══════════════════════════════════════════
     INLINE ANSWER FEEDBACK ON CARD
     ─────────────────────────────────────────
     Clicking an option immediately marks the
     card (correct / wrong highlights) and
     shows a result strip + "Show Explanation"
     button.  The modal is explanation-only.
  ═══════════════════════════════════════════ */

  /* ── Build the "explain this for me" prompt for an external LLM ── */
  // Source text sometimes carries a literal "\n"; turn it into a real break.
  function plain(s) { return String(s == null ? "" : s).replace(/\\n/g, "\n").trim(); }

  function buildLLMPrompt(q, pickedLetter) {
    var optionsText = (q.options || []).map(function (o) {
      return o.letter + ". " + plain(o.text);
    }).join("\n");

    var answerPretty = String(q.answer || "").split("").join(", "); // "AC" -> "A, C"
    var picked = pickedLetter || "";
    var pickedNote = "";
    if (picked) {
      var wasRight = q.answer.indexOf(picked) !== -1;
      pickedNote = "\nMY ANSWER: " + picked + " (" + (wasRight ? "correct" : "wrong") + ")";
    }

    return [
      "You are a sharp AWS instructor helping me pass the DVA-C02 exam. I am short on time and under real pressure, so I need SIGNAL, not a lecture. Be calm, plain, and brief. No hype, no emoji spam, no pep talk, no storytelling.",
      "",
      "Here is an exam question I just answered:",
      "",
      "QUESTION:",
      plain(q.question),
      "",
      "OPTIONS:",
      optionsText,
      "",
      "COMMUNITY-VOTED ANSWER (from a dump site — NOT guaranteed correct): " + answerPretty + pickedNote,
      "",
      "VERIFY FIRST, SILENTLY: The voted answer can be wrong — voting is not proof, wrong stays wrong no matter how many vote for it. Before you reply, work out the real answer yourself from your AWS knowledge and the official docs. Do NOT narrate this step. Only cite a source if you need it to PROVE the community answer wrong.",
      "",
      "Then reply in EXACTLY this structure and nothing else:",
      "",
      "**Answer:** <letter(s)> — say 'matches the community pick' OR 'community pick is WRONG, real answer is X'. Then ONE sentence (max 25 words) on why. State the answer once; never repeat it after this line.",
      "**Why:** 2-3 sentences on the core concept only. No fictional names, no worked-example story.",
      "**Traps:** one line per wrong option, format `X: <specific reason it fails, max 15 words>`.",
      "**Picture:** Include a small ASCII diagram ONLY if this concept is a flow, structure, or relationship (e.g. a request path, envelope encryption, VPC layout, token exchange, stream to consumer) — something a picture makes clearer. Max 8 lines, drawn ONCE. If the answer is a plain fact, limit, or single API call, write `Picture: (not needed here)` and move on. Do not force a diagram.",
      "**Memorize this:** exactly ONE text takeaway — a single trigger sentence OR one short mnemonic (the diagram above is your visual, so keep this one verbal).",
      "",
      "HARD RULES — breaking these makes the answer useless to me:",
      "- Keep the prose UNDER 180 words (the diagram lines do not count). Shorter is better.",
      "- At most ONE diagram in the entire reply, in the Picture slot only. Never redraw the same diagram anywhere else.",
      "- No intro, no recap, no closing motivation. No repeating yourself. If you start repeating, stop.",
      "- Plain sentences over decoration. This is a quick-reference card, not an article."
    ].join("\n");
  }

  /* ── Copy text to clipboard, with a file:// / http fallback ── */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error("execCommand copy failed"));
      } catch (e) { reject(e); }
    });
  }

  /* ── Handle a "Copy for LLM" click: build prompt, copy, flash feedback ── */
  function copyForLLM(q, pickedLetter, btn) {
    copyToClipboard(buildLLMPrompt(q, pickedLetter)).then(function () {
      var original = btn.innerHTML;
      btn.classList.add("copied");
      btn.innerHTML = "✅ Copied!";
      setTimeout(function () {
        btn.classList.remove("copied");
        btn.innerHTML = original;
      }, 1600);
    }).catch(function () {
      btn.innerHTML = "⚠️ Copy failed";
      setTimeout(function () { btn.innerHTML = "📋 Copy for LLM"; }, 1600);
    });
  }

  /** Called when the user clicks an option button on a card */
  function submitInlineAnswer(card, q, pickedLetter) {
    // Prevent re-answering an already-answered card
    if (card.classList.contains("q-answered")) return;
    card.classList.add("q-answered");

    var isRight = q.answer.indexOf(pickedLetter) !== -1;

    // Highlight every option: correct = green, picked-wrong = red
    Array.prototype.slice.call(card.querySelectorAll(".q-opt-btn")).forEach(function (btn) {
      var letter = btn.dataset.letter;
      btn.disabled = true;
      if (q.answer.indexOf(letter) !== -1) {
        btn.classList.add("opt-correct");
      } else if (letter === pickedLetter) {
        btn.classList.add("opt-wrong");
      }
    });

    // Inject result strip + explanation button after .q-options
    var resultHtml =
      '<div class="q-inline-result ' + (isRight ? "is-correct" : "is-wrong") + '">' +
        (isRight
          ? '<span class="q-inline-icon">✅</span> <strong>Correct!</strong> Answer: <strong>' + esc(q.answer) + '</strong>'
          : '<span class="q-inline-icon">❌</span> <strong>Wrong.</strong> Correct answer: <strong>' + esc(q.answer) + '</strong>') +
        '<span class="q-inline-actions">' +
          '<button class="btn-copy-llm" data-qnum="' + q.number + '" data-picked="' + escAttr(pickedLetter) + '" title="Copy a detailed prompt to paste into ChatGPT / Claude">' +
            '📋 Copy for LLM' +
          '</button>' +
          '<button class="btn-explanation" data-qnum="' + q.number + '" data-picked="' + escAttr(pickedLetter) + '">' +
            '💬 Show Explanation' +
          '</button>' +
        '</span>' +
      '</div>';

    var optsDiv = card.querySelector(".q-options");
    optsDiv.insertAdjacentHTML("afterend", resultHtml);

    // Wire the explanation button
    var explBtn = card.querySelector(".btn-explanation");
    if (explBtn) {
      explBtn.addEventListener("click", function () {
        openExplanationModal(q, pickedLetter);
      });
    }

    // Wire the "Copy for LLM" button
    var copyBtn = card.querySelector(".btn-copy-llm");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        copyForLLM(q, pickedLetter, copyBtn);
      });
    }
  }

  /* ═══════════════════════════════════════════
     EXPLANATION MODAL (explanation-only)
  ═══════════════════════════════════════════ */
  var MODAL_Q  = null;

  function openExplanationModal(q, pickedLetter) {
    MODAL_Q = q;
    var modal = $("#answerModal");
    var body  = $("#answerModalBody");
    body.innerHTML = buildExplanationBody(q, pickedLetter);
    $("#answerModalOverlay").classList.add("show");
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    body.scrollTop = 0;
    // wire discussion toggle
    var discToggle = body.querySelector(".disc-toggle");
    if (discToggle) {
      discToggle.addEventListener("click", function () {
        var open = discToggle.classList.toggle("open");
        discToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  }

  function buildExplanationBody(q, pickedLetter) {
    var isRight = pickedLetter && q.answer.indexOf(pickedLetter) !== -1;

    var html =
      '<div class="modal-q-header">' +
        '<span class="modal-q-num">Q' + q.number + '</span>' +
        '<span class="modal-q-svc">' + esc(q.service || '') + '</span>' +
      '</div>' +
      '<div class="modal-q-text">' + fmt(q.question) + '</div>' +
      // recap options read-only with correct/wrong highlights
      '<div class="modal-options modal-options-readonly">';

    (q.options || []).forEach(function (o) {
      var isCorrect = q.answer.indexOf(o.letter) !== -1;
      var isPicked  = pickedLetter === o.letter;
      var cls = "modal-option";
      if (isCorrect)              cls += " correct";
      if (isPicked && !isCorrect) cls += " wrong";
      html +=
        '<div class="' + cls + '">' +
          '<span class="mo-letter">' + esc(o.letter) + '</span>' +
          '<span class="mo-text">' + fmt(o.text) + '</span>' +
        '</div>';
    });
    html += '</div>';

    // result banner
    html +=
      '<div class="modal-result ' + (isRight ? "correct" : "wrong") + '">' +
        (isRight
          ? '✅ Correct! Answer: <strong>' + esc(q.answer) + '</strong>'
          : '❌ Wrong. Correct answer: <strong>' + esc(q.answer) + '</strong>') +
      '</div>';

    // community votes
    if (q.community_votes && q.community_votes.length) {
      html += '<div class="community-votes"><span class="cv-label">Community votes:</span>';
      q.community_votes.forEach(function (v) { html += '<span class="cv-item">' + esc(v) + '</span>'; });
      html += '</div>';
    }

    // discussion
    if (q.discussion && q.discussion.length) {
      html +=
        '<div class="discussion-section">' +
          '<button type="button" class="disc-toggle" aria-expanded="false">' +
            '<span>💬 Top community comments</span>' +
            '<span class="disc-count">(' + q.discussion.length + ')</span>' +
            '<span class="disc-caret">▸</span>' +
          '</button>' +
          '<div class="disc-comments">';
      q.discussion.forEach(function (c) {
        html +=
          '<div class="disc-comment">' +
            '<div class="disc-poster">' + esc(c.poster) + '</div>' +
            '<div class="disc-content">' + fmt(c.content) + '</div>' +
          '</div>';
      });
      html += '</div></div>';
    }

    html += '<div class="modal-source"><a href="' + escAttr(q.source) + '" target="_blank" rel="noopener">📎 View on ExamTopics</a></div>';
    return html;
  }

  function closeAnswerModal() {
    $("#answerModal").classList.remove("open");
    $("#answerModalOverlay").classList.remove("show");
    document.body.classList.remove("modal-open");
    MODAL_Q = null;
  }

  /* ═══════════════════════════════════════════
     QUESTION CARDS
  ═══════════════════════════════════════════ */
  function questionCards(qs) {
    var html = "";
    var total = qs.length;
    qs.forEach(function (q, i) {
      html += '<div class="question-card" data-qnum="' + q.number + '">' + questionCardInner(q, i + 1, total) + '</div>';
    });
    return html;
  }

  // seq/total optional: page-local serial (1 of n). Origin Q# always shown.
  function questionCardInner(q, seq, total) {
    var opts = "";
    (q.options || []).forEach(function (o) {
      opts +=
        '<button class="q-opt-btn" data-qnum="' + q.number + '" data-letter="' + escAttr(o.letter) + '">' +
          '<span class="opt-letter">' + esc(o.letter) + '</span>' +
          '<span class="opt-text">' + fmt(o.text) + '</span>' +
        '</button>';
    });
    var seqBadge = (seq && total)
      ? '<span class="q-seq">' + seq + ' of ' + total + '</span>'
      : '';
    return (
      '<div class="q-meta">' +
        seqBadge +
        '<span class="q-num">Q' + q.number + '</span>' +
        '<span class="q-service">' + esc(q.service || '') + '</span>' +
      '</div>' +
      '<div class="q-text">' + fmt(q.question) + '</div>' +
      '<div class="q-options">' + opts + '</div>'
    );
  }

  /** Wire option buttons on a DOM subtree — inline answer flow */
  function wireQuestions(scope) {
    var root = typeof scope === "string" ? $(scope) : scope;
    Array.prototype.slice.call(root.querySelectorAll(".q-opt-btn")).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var card = btn.closest(".question-card");
        var q    = qsByNumber(parseInt(btn.dataset.qnum, 10));
        if (q && card) submitInlineAnswer(card, q, btn.dataset.letter);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     VIRTUAL SCROLL — QUESTION BANK
     ─────────────────────────────────────────────────────────
     Only renders a window of PAGE_SIZE cards at a time.
     Uses IntersectionObserver on a sentinel at the bottom
     to load more as the user scrolls — no freeze.
  ═══════════════════════════════════════════════════════════ */
  var PAGE_SIZE        = 20;   // cards rendered per batch
  var bankFiltered     = [];   // current filtered set
  var bankRenderedCount = 0;   // how many are in the DOM
  var bankObserver     = null; // IntersectionObserver

  function buildServiceList() {
    var seen = {};
    QUESTIONS.forEach(function (q) { seen[q.service || "AWS (General)"] = 1; });
    return Object.keys(seen).sort();
  }

  function getFilteredQuestions() {
    var service = ($("#bankServiceFilter").value || "");
    return QUESTIONS.filter(function (item) {
      if (service && (item.service || "AWS (General)") !== service) return false;
      return true;
    });
  }

  /** Render the next batch of cards into #questionList */
  function renderNextBatch() {
    var list = $("#questionList");
    if (!list) return;

    var end = Math.min(bankRenderedCount + PAGE_SIZE, bankFiltered.length);
    var frag = document.createDocumentFragment();

    for (var i = bankRenderedCount; i < end; i++) {
      var q = bankFiltered[i];
      var card = document.createElement("div");
      card.className = "question-card";
      card.dataset.qnum = q.number;
      card.innerHTML = questionCardInner(q);
      // Wire buttons — read card from DOM at click time to avoid var-loop closure bug
      Array.prototype.slice.call(card.querySelectorAll(".q-opt-btn")).forEach(function(btn){
        btn.addEventListener("click", function(e){
          e.preventDefault();
          var liveCard = btn.closest(".question-card");
          if (!liveCard || liveCard.classList.contains("q-answered")) return;
          var qq = qsByNumber(parseInt(btn.dataset.qnum, 10));
          if (qq) submitInlineAnswer(liveCard, qq, btn.dataset.letter);
        });
      });
      frag.appendChild(card);
    }
    bankRenderedCount = end;

    // remove old sentinel if exists
    var oldSentinel = list.querySelector(".bank-sentinel");
    if (oldSentinel) oldSentinel.remove();

    list.appendChild(frag);

    // add new sentinel if more items remain
    if (bankRenderedCount < bankFiltered.length) {
      var sentinel = document.createElement("div");
      sentinel.className = "bank-sentinel";
      sentinel.style.cssText = "height:1px;";
      list.appendChild(sentinel);
      observeSentinel(sentinel);
    } else {
      // show end marker
      var endMarker = document.createElement("div");
      endMarker.className = "bank-end-marker";
      endMarker.textContent = "✓ All " + bankFiltered.length + " questions loaded";
      list.appendChild(endMarker);
    }
  }

  function observeSentinel(sentinel) {
    if (bankObserver) bankObserver.disconnect();
    bankObserver = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        bankObserver.disconnect();
        renderNextBatch();
      }
    }, { rootMargin: "200px" });
    bankObserver.observe(sentinel);
  }

  /** Full re-render triggered by filter/search changes */
  function renderBank() {
    var list = $("#questionList");
    if (!list) return;

    // kill previous observer
    if (bankObserver) { bankObserver.disconnect(); bankObserver = null; }

    bankFiltered      = getFilteredQuestions();
    bankRenderedCount = 0;

    list.innerHTML = "";

    if (!bankFiltered.length) {
      list.innerHTML = '<div class="panel-card"><div class="no-data">No questions match your filter.</div></div>';
      return;
    }

    renderNextBatch();
  }

  /* ── Jump to question ── */
  function jumpToQuestion() {
    var val = parseInt($("#bankJump").value, 10);
    if (isNaN(val) || val < 1) return;
    showView("bank");
    $("#bankServiceFilter").value = "";
    renderBank();

    // wait until enough cards rendered to scroll
    function tryScroll(attempts) {
      var target = document.querySelector('[data-qnum="' + val + '"]');
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("highlight-jump");
        setTimeout(function () { target.classList.remove("highlight-jump"); }, 2000);
        $("#bankJump").value = "";
        return;
      }
      if (attempts > 0) {
        // load more and retry
        renderNextBatch();
        setTimeout(function(){ tryScroll(attempts - 1); }, 80);
      }
    }
    setTimeout(function(){ tryScroll(30); }, 100);
  }

  /* ═══════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════ */
  function syncStickyHead() {
    var head = document.querySelector(".sticky-head");
    if (head) {
      document.documentElement.style.setProperty("--sticky-head-h", head.offsetHeight + "px");
    }
  }

  function init() {
    load();
    updateProgress();
    renderPlan();
    renderCheatSheet();

    // Populate service filter dropdown
    var svcSel = $("#bankServiceFilter");
    if (svcSel) {
      buildServiceList().forEach(function (s) {
        var opt = document.createElement("option");
        opt.value = s; opt.textContent = s;
        svcSel.appendChild(opt);
      });
    }

    // Do NOT render bank on init — only when user clicks the tab
    wireNotes();

    // Nav
    $$(".nav-btn").forEach(function (b) {
      b.addEventListener("click", function () { showView(b.dataset.view); });
    });
    $("#logoHome").addEventListener("click", function () { showView("plan"); });
    $("#noteBack").addEventListener("click", closeNote);
    $("#resetBtn").addEventListener("click", function () {
      if (confirm("Clear all day-completion progress?")) {
        STATE.completed = {}; save(); updateProgress(); renderPlan();
        if ($("#view-day").classList.contains("active")) renderDay();
      }
    });

    // Bank filters
    $("#bankServiceFilter").addEventListener("change", renderBank);

    // Service badge toggle
    var badgeToggle = $("#bankBadgeToggle");
    if (badgeToggle) {
      badgeToggle.addEventListener("click", function () {
        var list = $("#questionList");
        if (!list) return;
        var hidden = list.classList.toggle("hide-service-badge");
        badgeToggle.classList.toggle("active", hidden);
        badgeToggle.textContent = hidden ? "🏷 Show Service" : "🏷 Hide Service";
      });
    }

    // Jump
    var jumpBtn   = $("#bankJumpBtn");
    var jumpInput = $("#bankJump");
    if (jumpBtn)   jumpBtn.addEventListener("click", jumpToQuestion);
    if (jumpInput) jumpInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") jumpToQuestion();
    });

    // Answer modal close
    $("#answerModalClose").addEventListener("click", closeAnswerModal);
    $("#answerModalOverlay").addEventListener("click", closeAnswerModal);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAnswerModal();
    });

    // Sticky bank toolbar offset must track the sticky header height
    syncStickyHead();
    window.addEventListener("resize", syncStickyHead);

    // Hash routing
    if (location.hash.indexOf("#day-") === 0) {
      var n = parseInt(location.hash.replace("#day-", ""), 10);
      if (n >= 1 && n <= PLAN.length) openDay(n);
    } else if (location.hash === "#bank") {
      showView("bank");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
