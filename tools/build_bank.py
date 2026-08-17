#!/usr/bin/env python3
"""Integrate question_bank.json into the DVA-C02 app.

Reads question_bank.json (150 scraped questions), cleans the text so nothing
renders with broken glyphs, reuses manually verified answers where available,
assigns each question to a day by related AWS service, balances to ~5 per day,
and writes data/questions.js + updates plan.js questionIds.
"""
import json, re, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, "question_bank.json")
QJS = os.path.join(ROOT, "data", "questions.js")
PLAN = os.path.join(ROOT, "data", "plan.js")

EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\u2190-\u21FF\uFE0F\u2764]"
)

def clean_opt(o):
    o = re.sub(r"^[A-E]\.\s*", "", o)
    o = o.replace("Most Voted", "").strip()
    o = re.sub(r"\s+", " ", o).strip()
    return o

def clean_q(q):
    m = re.search(r"\n[A-E]\.\s", q)
    stem = q[: m.start()].strip() if m else q
    return re.sub(r"\s+", " ", stem).strip()

def strip_emoji(s):
    return EMOJI.sub("", s).replace("\u200b", "").strip()

def main():
    with open(BANK, encoding="utf-8") as f:
        bank = json.load(f)

    verified = {}
    try:
        with open(os.path.join(ROOT, "data", "questions.json"), encoding="utf-8") as f:
            old = json.load(f)
        for q in old.get("questions", []):
            if q.get("answer_verified"):
                verified[q["number"]] = q
    except Exception as e:
        print("warn: could not read existing questions.json:", e)

    questions = []
    for item in bank:
        n = int(item["question_number"])
        stem = strip_emoji(clean_q(item["question"]))
        opts = []
        for i, o in enumerate(item.get("options", [])):
            letter = chr(ord("A") + i)
            txt = strip_emoji(clean_opt(o))
            opts.append({"letter": letter, "text": txt})
        answer = item.get("correct_answer", "").strip().upper()
        prev = verified.get(n)
        q = {
            "key": "dva-q-%03d" % n,
            "source": "https://www.examtopics.com/exams/amazon/aws-certified-developer-associate-dva-c02/view/#question-%d" % n,
            "mirror": "https://www.secexams.com/exams/Amazon/aws-certified-developer-associate-dva-c02/view/1",
            "number": n,
            "question": stem,
            "options": opts,
            "answer": answer,
            "answer_verified": bool(prev),
            "most_voted_et": prev.get("most_voted_et") if prev else (answer if not answer.isupper() or len(answer) <= 2 else None),
            "explanation": "",
            "service": item.get("related_aws_service", ""),
        }
        if prev:
            q["most_voted_et"] = prev.get("most_voted_et") or answer
            if prev.get("answer") == answer:
                q["answer_verified"] = True
        questions.append(q)

    questions.sort(key=lambda q: q["number"])

    # ---- day assignment by service ----
    SERVICE_DAY = {
        "Amazon S3": [8, 9, 10, 21, 22, 28, 29, 30, 14],
        "Amazon API Gateway": [18, 19, 16, 17, 27],
        "AWS Secrets Manager": [26, 28, 10, 3],
        "Amazon EventBridge": [19, 20, 27, 21],
        "Amazon DynamoDB": [14, 21, 28, 20],
        "AWS Lambda": [16, 17, 27, 19, 18],
        "Amazon CloudWatch": [27, 28, 11, 17, 30],
        "AWS Elastic Beanstalk": [23, 24, 25],
        "AWS CloudFormation": [24, 25, 22, 30],
        "AWS CodePipeline": [25, 24, 30],
        "Amazon ElastiCache": [12, 14, 28, 21],
        "Amazon CloudFront": [15, 10, 8],
        "Elastic Load Balancing": [11, 12, 5],
        "AWS Step Functions": [20, 19, 21],
        "AWS (General)": [1, 7, 29, 30, 28],
        "Amazon EC2": [4, 5, 11, 6],
        "Amazon Kinesis": [20, 21, 14],
        "AWS Auto Scaling": [11, 4, 5],
        "AWS Systems Manager Parameter Store": [26, 3, 2],
        "AWS Systems Manager": [26, 23, 24],
        "AWS Amplify": [25, 18, 24],
        "AWS KMS": [26, 10, 3, 2],
        "AWS CodeDeploy": [25, 23, 24],
        "AWS CloudTrail": [27, 3, 2],
        "Amazon Cognito": [26, 18, 17],
        "AWS CodeArtifact": [25, 24],
        "AWS CodeCommit": [25, 24],
    }
    TARGET = 5  # 150 / 30 days
    used_days = {}
    assigned = {}
    leftover = []

    by_service = {}
    for q in questions:
        by_service.setdefault(q["service"], []).append(q)
    # biggest services first so they claim their preferred days
    order = sorted(by_service, key=lambda s: -len(by_service[s]))

    for svc in order:
        qs = by_service[svc]
        days = SERVICE_DAY.get(svc, [1, 29, 30])
        i = 0
        for q in qs:
            placed = False
            for _ in days:
                d = days[i % len(days)]
                i += 1
                if used_days.get(d, 0) < TARGET:
                    assigned[q["number"]] = d
                    used_days[d] = used_days.get(d, 0) + 1
                    placed = True
                    break
            if not placed:
                leftover.append(q)

    for q in leftover:
        d = min(range(1, 31), key=lambda x: used_days.get(x, 0))
        assigned[q["number"]] = d
        used_days[d] = used_days.get(d, 0) + 1

    # ---- write questions.js ----
    out = ["window.DVA_QUESTIONS = {", ' "exam": "AWS Certified Developer - Associate (DVA-C02)",',
           ' "total": %d,' % len(questions), ' "questions": [']
    for q in questions:
        out.append("  {")
        out.append('   "key": %s,' % json.dumps(q["key"]))
        out.append('   "source": %s,' % json.dumps(q["source"]))
        out.append('   "mirror": %s,' % json.dumps(q["mirror"]))
        out.append('   "number": %d,' % q["number"])
        out.append('   "question": %s,' % json.dumps(q["question"]))
        out.append('   "options": [')
        for o in q["options"]:
            out.append('    { "letter": %s, "text": %s },' % (json.dumps(o["letter"]), json.dumps(o["text"])))
        out.append("   ],")
        out.append('   "answer": %s,' % json.dumps(q["answer"]))
        out.append('   "answer_verified": %s,' % ("true" if q["answer_verified"] else "false"))
        out.append('   "most_voted_et": %s,' % json.dumps(q["most_voted_et"]))
        out.append('   "explanation": "",')
        out.append('   "service": %s' % json.dumps(q["service"]))
        out.append("  },")
    out.append(" ]")
    out.append("};")
    with open(QJS, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")

    # ---- update plan.js questionIds ----
    with open(PLAN, encoding="utf-8") as f:
        plan = f.read()

    # Split into day objects by tracking brace depth so the replacement never
    # crosses a day boundary.
    day_pat = re.compile(r'"day":\s*(\d+)')
    out_blocks = []
    depth = 0
    start = 0
    day_num = None
    i = 0
    in_str = False
    esc = False
    last_end = 0
    while i < len(plan):
        c = plan[i]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                in_str = False
            i += 1
            continue
        if c == '"':
            in_str = True
            i += 1
            continue
        if c == "{":
            if depth == 0:
                start = i
                day_num = None
            depth += 1
            i += 1
            continue
        if c == "}":
            depth -= 1
            if depth == 0:
                block = plan[start:i + 1]
                m = day_pat.search(block)
                day_num = int(m.group(1)) if m else None
                if day_num is not None:
                    ids = sorted(n for n, d in assigned.items() if d == day_num)
                    new_ids = json.dumps(ids)
                    block = re.sub(r'"questionIds":\s*\[[^\]]*\]',
                                   '"questionIds": ' + new_ids, block, count=1)
                out_blocks.append(plan[last_end:start])
                out_blocks.append(block)
                last_end = i + 1
            i += 1
            continue
        i += 1
    out_blocks.append(plan[last_end:])

    new_plan = "".join(out_blocks)
    with open(PLAN, "w", encoding="utf-8") as f:
        f.write(new_plan)

    # ---- report ----
    print("integrated %d questions" % len(questions))
    print("verified kept:", sum(1 for q in questions if q["answer_verified"]))
    per_day = {}
    for n, d in assigned.items():
        per_day.setdefault(d, []).append(n)
    for d in range(1, 31):
        print("  day %2d: %d questions %s" % (d, len(per_day.get(d, [])), per_day.get(d, [])))

if __name__ == "__main__":
    main()
