#!/usr/bin/env python3
"""
Extend the DVA-C02 question bank beyond the 50 free questions.

Why 557 is not automatic:
  * ExamTopics (examtopics.com) reCAPTCHA-walls every page after page 1.
  * SecExams (secexams.com) mirror gives 5 pages (50 Qs) then a captcha interstitial.
  * certlibrary requires login; examice's API is obfuscated/JS-only.

This tool gives you two ways to keep going:

1) If SecExams lets you in again (quota reset / new IP / solving captcha):
     python3 tools/scrape_more.py --se-pages 6 7 8 9 10

2) Manually browse ExamTopics in a real browser, solve the reCAPTCHA on each
   page, and save the page HTML (Ctrl+S) to files, then:
     python3 tools/scrape_more.py --et-html page2.html page3.html ...

Every run re-merges data/questions_raw.json, writes data/questions.json and
regenerates data/questions.js for the site.

Answers:
  * Questions taken from ExamTopics pages keep the community-voted answer
    (most-voted, from the embedded vote tally) when available.
  * SecExams questions keep the mirror's marked answer.
All questions get key (dva-q-NNN) and source (examtopics URL + mirror URL).
"""

import argparse, json, os, re, sys, time, html as htmllib
import urllib.request

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(BASE, "data", "questions_raw.json")
OUT = os.path.join(BASE, "data", "questions.json")
JS = os.path.join(BASE, "data", "questions.js")
MIRROR = "https://www.secexams.com/exams/Amazon/aws-certified-developer-associate-dva-c02/view/{p}"
ET = "https://www.examtopics.com/exams/amazon/aws-certified-developer-associate-dva-c02/view/"

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9"}


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode("utf-8", "ignore")


def clean(s):
    s = re.sub(r"<br\s*/?>", "\n", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = htmllib.unescape(s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n", s)
    return s.strip()


def parse_se(htmltext, questions):
    """Parse SecExams page HTML; merge into dict keyed by question number."""
    for chunk in re.split(r"<h5>Question #", htmltext)[1:]:
        m = re.match(r"(\d+)", chunk)
        if not m:
            continue
        num = int(m.group(1))
        qm = re.search(r'<div class="question-description option-text\s*">(.*?)</div>', chunk, re.S)
        qtext = clean(qm.group(1)) if qm else ""
        options, most_voted = [], ""
        ol = re.search(r"<ol[^>]*>(.*?)</ol>", chunk, re.S)
        if ol:
            for li in re.finditer(r"<li[^>]*>(.*?)</li>", ol.group(1), re.S):
                lm = re.search(r'option-circle">([A-Z])</div>', li.group(1))
                tm = re.search(r'option-text">(.*?)</div>', li.group(1), re.S)
                letter, text = (lm.group(1) if lm else ""), (clean(tm.group(1)) if tm else "")
                if "Most Voted" in li.group(1):
                    most_voted = letter
                if letter and text:
                    options.append({"letter": letter, "text": text})
        am = re.search(r'<span class="correct-answer">([A-Z]+)</span>', chunk)
        em = re.search(r'<span class="answer-description">(.*?)</span>', chunk, re.S)
        gm = re.search(r"GPT.*?</strong>\s*</div>\s*<hr>\s*<div class=\"option-text\">(.*?)</div>", chunk, re.S)
        questions[num] = {
            "number": num, "question": qtext, "options": options,
            "answer": am.group(1) if am else "",
            "explanation": (clean(em.group(1)) if em else (clean(gm.group(1)) if gm else "")),
            "most_voted_se": most_voted, "verified": False,
        }


def parse_et(htmltext, questions):
    """Parse ExamTopics page HTML; merge community-voted answers into dict."""
    for card in re.findall(r'<div class="card exam-question-card">(.*?)<!-- / Question', htmltext, re.S):
        m = re.search(r"Question\s*#(\d+)", card)
        if not m:
            continue
        num = int(m.group(1))
        votes = []
        for vm in re.finditer(r'<script id="[^"]*" type="application/json">(\[.*?\])</script>', card, re.S):
            try:
                votes = json.loads(vm.group(1))
            except Exception:
                pass
        am = re.search(r'<span class="correct-answer">([A-Z]+)</span>', card)
        most = am.group(1) if am else ""
        if votes:
            most = max(votes, key=lambda v: v.get("vote_count", 0)).get("voted_answers", most)
        qm = re.search(r'<div class="card-text">(.*?)</div>', card, re.S)
        cur = questions.get(num, {"number": num, "question": "", "options": [], "answer": "",
                                  "explanation": "", "verified": False})
        if qm:
            cur["question"] = clean(qm.group(1))
        # options from the card
        if not cur["options"]:
            opts = []
            for om in re.finditer(r'<div class="multi-choice-item-cw-radiobutton">.*?<span class="choice-letter[^"]*">([A-Z])</span>(.*?)</div>', card, re.S):
                opts.append({"letter": om.group(1), "text": clean(om.group(2))})
            if opts:
                cur["options"] = opts
        if most:
            cur["answer"] = most
            cur["verified"] = True
        questions[num] = cur


def load_raw():
    if os.path.exists(RAW):
        try:
            return json.load(open(RAW)).get("questions", {})
        except Exception:
            return {}
    return {}


def save_raw(questions):
    os.makedirs(os.path.dirname(RAW), exist_ok=True)
    lst = sorted(questions.values(), key=lambda q: q["number"])
    json.dump({"total": len(lst), "questions": lst}, open(RAW, "w"), ensure_ascii=False, indent=1)


def regenerate():
    raw = load_raw()
    if not raw:
        print("Nothing to regenerate: data/questions_raw.json is empty.")
        return
    lst = []
    for num in sorted(raw):
        q = dict(raw[num])
        q["key"] = "dva-q-%03d" % num
        q["source"] = ET + "#question-%d" % num
        q["mirror"] = MIRROR.format(p=((num - 1) // 10) + 1)
        q["number"] = num
        lst.append(q)
    out = {
        "exam": "AWS Certified Developer - Associate (DVA-C02)",
        "total": len(lst),
        "questions": lst,
        "note": "Answers verified against ExamTopics community votes where available (answer_verified).",
    }
    json.dump(out, open(OUT, "w"), ensure_ascii=False, indent=1)
    js = "window.DVA_QUESTIONS = " + json.dumps(out, ensure_ascii=False, indent=1) + ";"
    open(JS, "w").write(js)
    nv = sum(1 for q in lst if q.get("answer_verified"))
    print("data/questions.js regenerated: %d questions (%d verified vs ExamTopics)" % (len(lst), nv))


def main():
    ap = argparse.ArgumentParser(description="Extend the DVA-C02 question bank.")
    ap.add_argument("--se-pages", nargs="*", type=int, default=[],
                    help="SecExams mirror page numbers to fetch (e.g. 6 7 8)")
    ap.add_argument("--et-html", nargs="*", default=[],
                    help="Local ExamTopics HTML files saved after solving reCAPTCHA")
    args = ap.parse_args()

    if not args.se_pages and not args.et_html:
        ap.print_help()
        print("\nExample:\n  python3 tools/scrape_more.py --se-pages 6 7 8 9 10")
        print("  python3 tools/scrape_more.py --et-html ~/Downloads/et2.html ~/Downloads/et3.html")
        return

    questions = load_raw()
    before = len(questions)

    for p in args.se_pages:
        try:
            h = fetch(MIRROR.format(p=p))
        except Exception as e:
            print("se page %d ERROR: %s" % (p, e))
            continue
        n0 = len(questions)
        parse_se(h, questions)
        print("se page %d: +%d (total %d)" % (p, len(questions) - n0, len(questions)))
        time.sleep(1)

    for f in args.et_html:
        if not os.path.exists(f):
            print("missing file:", f)
            continue
        h = open(f, encoding="utf-8", errors="ignore").read()
        n0 = len(questions)
        parse_et(h, questions)
        print("et file %s: +%d (total %d)" % (os.path.basename(f), len(questions) - n0, len(questions)))

    if len(questions) == before:
        print("No new questions parsed. Check that captcha-free pages returned real content.")
        return

    save_raw(questions)
    regenerate()
    print("Done. Total questions now: %d / 557" % len(questions))


if __name__ == "__main__":
    main()