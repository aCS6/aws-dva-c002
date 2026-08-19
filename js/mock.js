/* ════════════════════════════════════════════════════════════
   Mock Test engine — real-exam simulator (self-contained).
   Data: window.DVA_MOCKTESTS (data/mocktests.js). Renders into #mockRoot.
   Questions are sourced from the Ditectrev DVA-C02 repo, independent of
   the study Question Bank.
   ════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var DATA      = window.DVA_MOCKTESTS || {};
  var Q         = DATA.questions    || [];
  var STATIC    = DATA.staticTests  || [];
  var DURATION  = (DATA.durationMinutes || 130) * 60; // seconds
  var PASS      = DATA.passingScore || 720;
  var SCALE_MIN = DATA.scaleMin     || 100;
  var SCALE_MAX = DATA.scaleMax     || 1000;
  var PER_TEST  = DATA.questionsPerTest || 65;

  var LS_ATTEMPT = "dva_mock_attempt_v1";
  var LS_BEST    = "dva_mock_best_v1";

  var state      = null;  // active attempt (see startTest)
  var lastResult = null;  // last graded result (for re-render)
  var ticker     = null;  // setInterval handle
  var keyHandler = null;  // active keydown listener

  function root() { return document.getElementById("mockRoot"); }

  // ── utils ─────────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function fmt(s) { return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>"); }
  function multiline(s) { return fmt(s).replace(/\n/g, "<br>"); }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function fmtClock(sec) {
    if (sec < 0) sec = 0;
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return pad(h) + ":" + pad(m) + ":" + pad(s);
  }
  function fmtDur(sec) {
    if (sec < 0) sec = 0;
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    var out = [];
    if (h) out.push(h + "h");
    if (m || h) out.push(m + "m");
    out.push(s + "s");
    return out.join(" ");
  }
  var WORDS = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN"];
  function numWord(n) { return WORDS[n] || String(n); }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    var x = a.slice().sort(), y = b.slice().sort();
    for (var i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
    return true;
  }
  function now() { return Date.now(); }

  // ── storage ───────────────────────────────────────────────
  function loadBest() {
    try { return JSON.parse(localStorage.getItem(LS_BEST)) || {}; }
    catch (e) { return {}; }
  }
  function recordBest(testId, result) {
    if (!testId || testId === "random") return;
    var best = loadBest();
    var prev = best[testId];
    if (!prev || result.scaled > prev.scaled) {
      best[testId] = { scaled: result.scaled, pct: result.pct, passed: result.passed };
      try { localStorage.setItem(LS_BEST, JSON.stringify(best)); } catch (e) {}
    }
  }
  function saveAttempt() {
    if (!state) return;
    try { localStorage.setItem(LS_ATTEMPT, JSON.stringify(state)); } catch (e) {}
  }
  function loadAttempt() {
    try {
      var s = JSON.parse(localStorage.getItem(LS_ATTEMPT));
      if (s && s.order && s.order.length && s.deadline) return s;
    } catch (e) {}
    return null;
  }
  function clearAttempt() {
    try { localStorage.removeItem(LS_ATTEMPT); } catch (e) {}
  }

  // ── test definitions ──────────────────────────────────────
  function defById(id) {
    if (id === "random") {
      return { id: "random", title: "Mock Test (Random)", isRandom: true,
               count: Math.min(PER_TEST, Q.length) };
    }
    for (var i = 0; i < STATIC.length; i++) if (STATIC[i].id === id) return STATIC[i];
    return null;
  }
  function buildOrder(def) {
    if (def.isRandom) {
      var all = [];
      for (var i = 0; i < Q.length; i++) all.push(i);
      return shuffle(all).slice(0, def.count);
    }
    var order = [];
    for (var j = 0; j < def.count; j++) order.push(def.start + j);
    return order;
  }

  // ══════════════════════════════════════════════════════════
  //  LANDING
  // ══════════════════════════════════════════════════════════
  function renderLanding() {
    stopTimer();
    unbindKeys();
    var el = root();
    if (!el) return;
    var best = loadBest();
    var attempt = loadAttempt();

    var html = "";
    html += '<div class="mock-head">';
    html += '  <h2>Mock Tests <span class="mock-exam-name">' + esc(DATA.exam || "") + '</span></h2>';
    html += '  <p class="muted">Real-exam simulation — <strong>' + PER_TEST + ' questions</strong>, <strong>' +
            Math.round(DURATION / 60) + ' minutes</strong>, passing score <strong>' + PASS + '/1000</strong>. ' +
            'One question at a time, mark &amp; review, auto-submit when time runs out. ' +
            Q.length + ' questions across ' + STATIC.length + ' fixed tests + a random draw.</p>';
    html += '  <p class="mock-source muted">Questions: ' + esc(DATA.source || "") + '. Distinct from the study Question Bank.</p>';
    html += '</div>';

    // resume banner
    if (attempt) {
      var remain = Math.max(0, Math.round((attempt.deadline - now()) / 1000));
      var answered = countAnswered(attempt);
      html += '<div class="mock-resume">';
      html += '  <div class="mock-resume-info"><span class="mock-resume-tag">⏸ In progress</span>' +
              '<strong>' + esc(attempt.title) + '</strong> — ' + answered + '/' + attempt.order.length +
              ' answered · ' + (remain > 0 ? fmtClock(remain) + ' left' : 'time expired') + '</div>';
      html += '  <div class="mock-resume-actions">' +
              '<button class="btn-primary" data-act="resume">' + (remain > 0 ? 'Resume exam' : 'See result') + '</button>' +
              '<button class="btn-ghost" data-act="discard">Discard</button></div>';
      html += '</div>';
    }

    // cards
    html += '<div class="mock-grid">';
    STATIC.forEach(function (t, i) {
      var b = best[t.id];
      html += testCard(t.id, t.title, t.count, "Questions " + (t.start + 1) + "–" + (t.start + t.count),
                       b, (i % 4) + 1, false);
    });
    html += testCard("random", "Mock Test (Random)", Math.min(PER_TEST, Q.length),
                     "Fresh random draw every attempt", null, 0, true);
    html += '</div>';

    el.innerHTML = html;

    // bind
    el.querySelectorAll(".mock-card[data-test]").forEach(function (card) {
      card.addEventListener("click", function () { attemptStart(card.getAttribute("data-test")); });
    });
    var rb = el.querySelector('[data-act="resume"]');
    if (rb) rb.addEventListener("click", resumeAttempt);
    var db = el.querySelector('[data-act="discard"]');
    if (db) db.addEventListener("click", function () {
      openModal("Discard attempt?", "<p>Your in-progress answers will be lost. This cannot be undone.</p>", [
        { label: "Cancel", cls: "btn-ghost" },
        { label: "Discard", cls: "btn-danger", onClick: function () { clearAttempt(); renderLanding(); } }
      ]);
    });
  }

  function countAnswered(s) {
    var c = 0;
    for (var i = 0; i < s.answers.length; i++) if (s.answers[i] && s.answers[i].length) c++;
    return c;
  }

  function testCard(id, title, count, sub, best, colorIdx, isRandom) {
    var badge = "";
    if (best) {
      badge = '<div class="mock-card-best ' + (best.passed ? "pass" : "fail") + '">' +
              (best.passed ? "✔ " : "") + "Best " + best.scaled + "/1000</div>";
    }
    var icon = isRandom ? "🎲" : "📝";
    return '<button class="mock-card' + (isRandom ? " mock-card-random" : "") + ' mc-' + colorIdx +
           '" data-test="' + esc(id) + '">' +
           '<div class="mock-card-top"><span class="mock-card-icon">' + icon + '</span>' + badge + '</div>' +
           '<div class="mock-card-title">' + esc(title) + '</div>' +
           '<div class="mock-card-sub muted">' + esc(sub) + '</div>' +
           '<div class="mock-card-meta"><span>❓ ' + count + ' Q</span><span>⏱ ' +
           Math.round(DURATION / 60) + ' min</span></div>' +
           '<span class="mock-card-cta">Start ▸</span></button>';
  }

  // ══════════════════════════════════════════════════════════
  //  START / RESUME
  // ══════════════════════════════════════════════════════════
  function attemptStart(id) {
    var def = defById(id);
    if (!def) return;
    var existing = loadAttempt();
    if (existing) {
      openModal("Start a new exam?",
        "<p>You have an unfinished <strong>" + esc(existing.title) + "</strong>. Starting a new test will discard it.</p>",
        [ { label: "Cancel", cls: "btn-ghost" },
          { label: "Discard & start", cls: "btn-primary", onClick: function () { doStart(def); } } ]);
      return;
    }
    doStart(def);
  }

  function doStart(def) {
    var count = def.isRandom ? def.count : def.count;
    openModal(def.title,
      '<ul class="mock-rules">' +
        '<li><strong>' + count + '</strong> questions</li>' +
        '<li><strong>' + Math.round(DURATION / 60) + ' minutes</strong> — the timer auto-submits at 0</li>' +
        '<li>Passing score <strong>' + PASS + '/1000</strong></li>' +
        '<li>You can move between questions and flag them for review</li>' +
        '<li>Answers are graded only after you finish — no feedback during the exam</li>' +
      '</ul>',
      [ { label: "Cancel", cls: "btn-ghost" },
        { label: "Start exam ▸", cls: "btn-primary", onClick: function () {
            var order = buildOrder(def);
            state = {
              testId: def.id, title: def.title, isRandom: !!def.isRandom,
              order: order,
              answers: order.map(function () { return []; }),
              flags: order.map(function () { return false; }),
              current: 0,
              startedAt: now(),
              deadline: now() + DURATION * 1000,
              phase: "exam"
            };
            saveAttempt();
            mountExam();
        } } ]);
  }

  function resumeAttempt() {
    var s = loadAttempt();
    if (!s) { renderLanding(); return; }
    state = s;
    state.phase = "exam";
    if (state.deadline - now() <= 0) { finish(true); return; }
    mountExam();
  }

  // ══════════════════════════════════════════════════════════
  //  EXAM RUNTIME
  // ══════════════════════════════════════════════════════════
  function mountExam() {
    var el = root();
    if (!el || !state) return;

    var html = "";
    html += '<div class="exam-bar">';
    html += '  <div class="exam-bar-left"><span class="exam-title">' + esc(state.title) + '</span>' +
            '<span class="exam-count" id="examCount"></span></div>';
    html += '  <div class="exam-timer" id="examTimer">--:--:--</div>';
    html += '  <div class="exam-bar-right">' +
            '<button class="btn-ghost" id="examQuit">Quit</button>' +
            '<button class="btn-primary" id="examFinish">Finish exam</button></div>';
    html += '</div>';

    html += '<div class="exam-body">';
    html += '  <div class="exam-main">';
    html += '    <div id="examQ" class="exam-q"></div>';
    html += '    <div class="exam-foot">';
    html += '      <button class="btn-ghost" id="examPrev">◂ Previous</button>';
    html += '      <button class="btn-flag" id="examFlag">⚑ Mark for review</button>';
    html += '      <button class="btn-primary" id="examNext">Next ▸</button>';
    html += '    </div>';
    html += '  </div>';
    html += '  <aside class="exam-side">';
    html += '    <div class="exam-side-head">Question navigator</div>';
    html += '    <div id="examNav" class="exam-nav"></div>';
    html += '    <div class="exam-legend">' +
            '<span><i class="lg lg-ans"></i> Answered</span>' +
            '<span><i class="lg lg-cur"></i> Current</span>' +
            '<span><i class="lg lg-flag"></i> Flagged</span>' +
            '<span><i class="lg lg-none"></i> Unseen</span></div>';
    html += '    <button class="btn-primary exam-side-finish" id="examFinish2">Finish exam</button>';
    html += '  </aside>';
    html += '</div>';

    el.innerHTML = html;

    el.querySelector("#examPrev").addEventListener("click", function () { goto(state.current - 1); });
    el.querySelector("#examNext").addEventListener("click", function () { goto(state.current + 1); });
    el.querySelector("#examFlag").addEventListener("click", toggleFlag);
    el.querySelector("#examFinish").addEventListener("click", confirmFinish);
    el.querySelector("#examFinish2").addEventListener("click", confirmFinish);
    el.querySelector("#examQuit").addEventListener("click", confirmQuit);

    // navigator delegation
    el.querySelector("#examNav").addEventListener("click", function (e) {
      var cell = e.target.closest("[data-i]");
      if (cell) goto(parseInt(cell.getAttribute("data-i"), 10));
    });
    // option delegation
    el.querySelector("#examQ").addEventListener("click", function (e) {
      var opt = e.target.closest("[data-letter]");
      if (opt) selectAnswer(opt.getAttribute("data-letter"));
    });

    bindKeys();
    paintTimer();
    paintQuestion();
    paintNav();
    startTimer();
  }

  function paintQuestion() {
    var el = root();
    var pos = state.current;
    var q = Q[state.order[pos]];
    var sel = state.answers[pos] || [];
    var need = q.correct.length;

    var tag = q.multi
      ? '<span class="q-tag q-tag-multi">Multiple response — select ' + numWord(need) + '</span>'
      : '<span class="q-tag q-tag-single">Multiple choice</span>';

    var imgs = "";
    (q.images || []).forEach(function (src) {
      imgs += '<img class="exam-q-img" src="' + esc(src) + '" alt="question figure" loading="lazy">';
    });

    var opts = "";
    q.options.forEach(function (o) {
      var on = sel.indexOf(o.letter) !== -1;
      var oimg = o.image ? '<img class="mock-opt-img" src="' + esc(o.image) + '" alt="option ' + esc(o.letter) + '" loading="lazy">' : "";
      opts += '<div class="exam-opt' + (on ? " selected" : "") + '" data-letter="' + esc(o.letter) + '">' +
              '<span class="exam-opt-mark ' + (q.multi ? "box" : "radio") + '">' + (on ? (q.multi ? "✓" : "●") : "") + '</span>' +
              '<span class="exam-opt-letter">' + esc(o.letter) + '</span>' +
              '<span class="exam-opt-text">' + fmt(o.text) + oimg + '</span>' +
              '</div>';
    });

    var hint = q.multi
      ? '<div class="exam-q-hint">Select ' + need + ' answer' + (need > 1 ? "s" : "") +
        ' · <span id="selCount">' + sel.length + '</span> selected</div>'
      : "";

    el.querySelector("#examQ").innerHTML =
      '<div class="exam-q-head">' + tag +
        '<span class="exam-q-num">Question ' + (pos + 1) + ' of ' + state.order.length + '</span></div>' +
      '<div class="exam-q-text">' + multiline(q.question) + '</div>' +
      imgs +
      '<div class="exam-opts">' + opts + '</div>' + hint;

    el.querySelector("#examCount").textContent = "Q " + (pos + 1) + " / " + state.order.length;

    var prev = el.querySelector("#examPrev");
    var next = el.querySelector("#examNext");
    prev.disabled = pos === 0;
    next.disabled = pos === state.order.length - 1;

    var flag = el.querySelector("#examFlag");
    var flagged = state.flags[pos];
    flag.classList.toggle("active", flagged);
    flag.textContent = flagged ? "⚑ Marked" : "⚑ Mark for review";
  }

  function selectAnswer(letter) {
    var pos = state.current;
    var q = Q[state.order[pos]];
    var sel = state.answers[pos] || [];
    if (q.multi) {
      var i = sel.indexOf(letter);
      if (i === -1) sel.push(letter); else sel.splice(i, 1);
    } else {
      sel = (sel.length === 1 && sel[0] === letter) ? [] : [letter];
    }
    state.answers[pos] = sel;
    saveAttempt();
    paintQuestion();
    paintNav();
  }

  function paintNav() {
    var el = root();
    var html = "";
    for (var i = 0; i < state.order.length; i++) {
      var cls = "nav-cell";
      if (i === state.current) cls += " cur";
      if (state.answers[i] && state.answers[i].length) cls += " ans";
      if (state.flags[i]) cls += " flag";
      html += '<button class="' + cls + '" data-i="' + i + '">' + (i + 1) +
              (state.flags[i] ? '<i class="nav-flag">⚑</i>' : "") + '</button>';
    }
    el.querySelector("#examNav").innerHTML = html;
  }

  function goto(idx) {
    if (idx < 0 || idx >= state.order.length) return;
    state.current = idx;
    saveAttempt();
    paintQuestion();
    paintNav();
    var m = document.querySelector(".exam-main");
    if (m) m.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function toggleFlag() {
    state.flags[state.current] = !state.flags[state.current];
    saveAttempt();
    paintQuestion();
    paintNav();
  }

  // ── timer ─────────────────────────────────────────────────
  function startTimer() {
    stopTimer();
    ticker = setInterval(function () {
      paintTimer();
      if (state && state.deadline - now() <= 0) finish(true);
    }, 500);
  }
  function stopTimer() { if (ticker) { clearInterval(ticker); ticker = null; } }
  function paintTimer() {
    var t = document.getElementById("examTimer");
    if (!t || !state) return;
    var remain = Math.max(0, Math.round((state.deadline - now()) / 1000));
    t.textContent = fmtClock(remain);
    t.classList.toggle("warn", remain <= 600 && remain > 300);
    t.classList.toggle("danger", remain <= 300);
  }

  // ── keyboard ──────────────────────────────────────────────
  function bindKeys() {
    unbindKeys();
    keyHandler = function (e) {
      if (!state || state.phase !== "exam") return;
      if (document.querySelector(".mock-modal")) return;
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "ArrowRight") { goto(state.current + 1); }
      else if (e.key === "ArrowLeft") { goto(state.current - 1); }
      else if (e.key === "f" || e.key === "F") { toggleFlag(); }
      else if (/^[a-fA-F]$/.test(e.key)) {
        var q = Q[state.order[state.current]];
        var letter = e.key.toUpperCase();
        if (q.options.some(function (o) { return o.letter === letter; })) selectAnswer(letter);
      }
    };
    document.addEventListener("keydown", keyHandler);
  }
  function unbindKeys() {
    if (keyHandler) { document.removeEventListener("keydown", keyHandler); keyHandler = null; }
  }

  // ══════════════════════════════════════════════════════════
  //  FINISH / GRADE
  // ══════════════════════════════════════════════════════════
  function confirmQuit() {
    openModal("Quit this exam?",
      "<p>Your progress is saved — you can resume later from the Mock Test list. Or discard it entirely.</p>",
      [ { label: "Keep going", cls: "btn-ghost" },
        { label: "Leave (save)", cls: "btn-primary", onClick: function () {
            saveAttempt(); stopTimer(); unbindKeys(); state = null; renderLanding();
        } },
        { label: "Discard", cls: "btn-danger", onClick: function () {
            clearAttempt(); stopTimer(); unbindKeys(); state = null; renderLanding();
        } } ]);
  }

  function confirmFinish() {
    var unanswered = 0;
    for (var i = 0; i < state.answers.length; i++)
      if (!state.answers[i] || !state.answers[i].length) unanswered++;
    var flagged = state.flags.filter(Boolean).length;
    var body = "<p>You are about to submit <strong>" + esc(state.title) + "</strong>.</p><ul class='mock-rules'>" +
      "<li>" + (state.order.length - unanswered) + " answered</li>" +
      "<li>" + unanswered + " unanswered (scored as incorrect)</li>" +
      (flagged ? "<li>" + flagged + " flagged for review</li>" : "") +
      "</ul><p>You can't change answers after submitting.</p>";
    openModal("Submit exam?", body, [
      { label: "Back to exam", cls: "btn-ghost" },
      { label: "Submit & grade", cls: "btn-primary", onClick: function () { finish(false); } }
    ]);
  }

  function finish(auto) {
    if (!state) return;
    stopTimer();
    unbindKeys();
    var result = grade();
    lastResult = result;
    recordBest(state.testId, result);
    clearAttempt();
    state.phase = "result";
    renderResult(result, auto);
  }

  function grade() {
    var total = state.order.length, correct = 0;
    var items = [];
    for (var i = 0; i < total; i++) {
      var q = Q[state.order[i]];
      var sel = (state.answers[i] || []).slice();
      var ok = sameSet(sel, q.correct);
      if (ok) correct++;
      items.push({ q: q, sel: sel, ok: ok, answered: sel.length > 0 });
    }
    var pct = total ? correct / total : 0;
    var scaled = Math.round(SCALE_MIN + (SCALE_MAX - SCALE_MIN) * pct);
    var used = Math.min(DURATION, Math.round((now() - state.startedAt) / 1000));
    return {
      title: state.title, testId: state.testId,
      total: total, correct: correct, pct: pct,
      scaled: scaled, passed: scaled >= PASS,
      timeUsed: used, items: items
    };
  }

  // ══════════════════════════════════════════════════════════
  //  RESULT
  // ══════════════════════════════════════════════════════════
  function renderResult(r, auto) {
    stopTimer();
    unbindKeys();
    var el = root();
    if (!el) return;
    var pctTxt = (r.pct * 100).toFixed(1);

    var html = "";
    html += '<div class="mock-result">';
    if (auto) html += '<div class="mock-timesup">⏱ Time expired — your exam was submitted automatically.</div>';

    html += '  <div class="result-hero ' + (r.passed ? "pass" : "fail") + '">';
    html += '    <div class="result-verdict">' + (r.passed ? "PASS ✅" : "FAIL ❌") + '</div>';
    html += '    <div class="result-score">' + r.scaled + '<span>/1000</span></div>';
    html += '    <div class="result-scale"><div class="result-scale-fill" style="width:' +
            Math.max(0, Math.min(100, ((r.scaled - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100)) + '%"></div>' +
            '<div class="result-scale-pass" style="left:' +
            (((PASS - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100) + '%" title="Passing ' + PASS + '"></div></div>';
    html += '    <div class="result-sub">Passing score ' + PASS + '/1000</div>';
    html += '  </div>';

    html += '  <div class="result-stats">';
    html += stat(r.correct + " / " + r.total, "Correct");
    html += stat(pctTxt + "%", "Accuracy");
    html += stat(fmtDur(r.timeUsed), "Time used");
    html += stat(esc(r.title), "Test");
    html += '  </div>';

    html += '  <div class="result-actions">' +
            '<button class="btn-primary" id="dlMd">⬇ Download result (.md)</button>' +
            '<button class="btn-secondary" id="retake">↻ Retake</button>' +
            '<button class="btn-ghost" id="backList">Back to list</button></div>';

    // review
    html += '<div class="result-review"><h3>Answer review</h3>';
    r.items.forEach(function (it, i) {
      html += reviewItem(it, i);
    });
    html += '</div></div>';

    el.innerHTML = html;

    el.querySelector("#dlMd").addEventListener("click", function () {
      download(fileName(r), buildMarkdown(r));
    });
    el.querySelector("#retake").addEventListener("click", function () { attemptStart(r.testId); });
    el.querySelector("#backList").addEventListener("click", function () { state = null; renderLanding(); });
    window.scrollTo(0, 0);
  }

  function stat(v, label) {
    return '<div class="result-stat"><div class="result-stat-v">' + v + '</div>' +
           '<div class="result-stat-l muted">' + esc(label) + '</div></div>';
  }

  function reviewItem(it, i) {
    var q = it.q;
    var tag = q.multi ? "Multiple response — select " + numWord(q.correct.length) : "Multiple choice";
    var imgs = "";
    (q.images || []).forEach(function (src) {
      imgs += '<img class="exam-q-img" src="' + esc(src) + '" alt="question figure" loading="lazy">';
    });
    var opts = "";
    q.options.forEach(function (o) {
      var isCorrect = q.correct.indexOf(o.letter) !== -1;
      var isSel = it.sel.indexOf(o.letter) !== -1;
      var cls = "rev-opt";
      if (isCorrect) cls += " correct";
      if (isSel && !isCorrect) cls += " wrong";
      var mark = isCorrect ? "✅" : (isSel ? "❌" : "");
      var oimg = o.image ? '<img class="mock-opt-img" src="' + esc(o.image) + '" alt="">' : "";
      opts += '<div class="' + cls + '"><span class="rev-opt-mark">' + mark + '</span>' +
              '<span class="exam-opt-letter">' + esc(o.letter) + '</span>' +
              '<span class="exam-opt-text">' + fmt(o.text) + oimg +
              (isSel ? ' <em class="rev-your">(your answer)</em>' : "") + '</span></div>';
    });
    var yourTxt = it.sel.length ? it.sel.slice().sort().join(", ") : "— not answered —";
    return '<div class="rev-item ' + (it.ok ? "ok" : "no") + '">' +
      '<div class="rev-head"><span class="rev-badge">' + (it.ok ? "✓" : "✗") + " Q" + (i + 1) + '</span>' +
      '<span class="rev-tag">' + esc(tag) + '</span></div>' +
      '<div class="rev-q">' + multiline(q.question) + '</div>' + imgs +
      '<div class="rev-opts">' + opts + '</div>' +
      '<div class="rev-answer"><strong>Your answer:</strong> ' + esc(yourTxt) +
      ' &nbsp;·&nbsp; <strong>Correct:</strong> ' + esc(q.correct.slice().sort().join(", ")) + '</div>' +
      '</div>';
  }

  // ── markdown export ───────────────────────────────────────
  function fileName(r) {
    return "DVA-C02-" + String(r.title).replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-result.md";
  }
  function buildMarkdown(r) {
    var d = new Date();
    var L = [];
    L.push("# AWS DVA-C02 — " + r.title + " — Result");
    L.push("");
    L.push("- **Date:** " + d.toString());
    L.push("- **Result:** " + (r.passed ? "PASS ✅" : "FAIL ❌"));
    L.push("- **Scaled score:** " + r.scaled + " / 1000  (passing " + PASS + ")");
    L.push("- **Correct answers:** " + r.correct + " / " + r.total + "  (" + (r.pct * 100).toFixed(1) + "%)");
    L.push("- **Time used:** " + fmtDur(r.timeUsed) + " of " + Math.round(DURATION / 60) + " minutes");
    L.push("- **Source:** " + (DATA.source || ""));
    L.push("");
    L.push("---");
    L.push("");
    L.push("## Answer Review");
    L.push("");
    r.items.forEach(function (it, i) {
      var q = it.q;
      var tag = q.multi ? " _(Multiple response — select " + numWord(q.correct.length) + ")_"
                        : " _(Multiple choice)_";
      L.push("### Q" + (i + 1) + ". " + q.question.replace(/\n/g, " ") + tag);
      if (q.images && q.images.length) L.push("> 🖼 Includes image(s): " + q.images.join(", "));
      L.push("");
      q.options.forEach(function (o) {
        var isCorrect = q.correct.indexOf(o.letter) !== -1;
        var isSel = it.sel.indexOf(o.letter) !== -1;
        var line = "- " + o.letter + ". " + o.text.replace(/\n/g, " ");
        if (o.image) line += " _(image: " + o.image + ")_";
        if (isCorrect) line += "  ✅ **correct**";
        if (isSel) line += (isCorrect ? "" : "  ❌") + " ← your answer";
        L.push(line);
      });
      L.push("");
      L.push("**Your answer:** " + (it.sel.length ? it.sel.slice().sort().join(", ") : "_(blank)_"));
      L.push("**Correct answer:** " + q.correct.slice().sort().join(", "));
      L.push("**Result:** " + (it.ok ? "✓ Correct" : "✗ Incorrect"));
      L.push("");
    });
    return L.join("\n");
  }
  function download(name, text) {
    var blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }

  // ── modal ─────────────────────────────────────────────────
  function openModal(title, bodyHtml, buttons) {
    closeModal();
    var wrap = document.createElement("div");
    wrap.className = "mock-modal-overlay";
    var btns = "";
    (buttons || []).forEach(function (b, i) {
      btns += '<button class="' + (b.cls || "btn-ghost") + '" data-b="' + i + '">' + esc(b.label) + "</button>";
    });
    wrap.innerHTML =
      '<div class="mock-modal" role="dialog" aria-modal="true">' +
      '<div class="mock-modal-title">' + esc(title) + '</div>' +
      '<div class="mock-modal-body">' + bodyHtml + '</div>' +
      '<div class="mock-modal-foot">' + btns + '</div></div>';
    document.body.appendChild(wrap);
    document.body.classList.add("modal-open");
    (buttons || []).forEach(function (b, i) {
      wrap.querySelector('[data-b="' + i + '"]').addEventListener("click", function () {
        closeModal();
        if (b.onClick) b.onClick();
      });
    });
    wrap.addEventListener("click", function (e) { if (e.target === wrap) closeModal(); });
  }
  function closeModal() {
    var m = document.querySelector(".mock-modal-overlay");
    if (m) m.parentNode.removeChild(m);
    document.body.classList.remove("modal-open");
  }

  // ══════════════════════════════════════════════════════════
  //  ROUTING / INIT
  // ══════════════════════════════════════════════════════════
  function route() {
    if (state && state.phase === "result" && lastResult) { renderResult(lastResult, false); return; }
    if (state && state.phase === "exam") {
      if (state.deadline - now() <= 0) { finish(true); return; }
      mountExam();
      return;
    }
    renderLanding();
  }

  function init() {
    if (!Q.length) return;
    // question-count badge in the nav
    var badges = document.querySelectorAll(".mock-badge-count");
    for (var i = 0; i < badges.length; i++) badges[i].textContent = Q.length;

    // (re)render whenever the Mock Test tab is clicked. A refresh mid-exam
    // lands on the landing screen, which shows a Resume banner (from
    // localStorage) rather than silently running a timer in a hidden view.
    document.querySelectorAll('.nav-btn[data-view="mock"]').forEach(function (b) {
      b.addEventListener("click", route);
    });

    route();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else
    init();
})();
