// tools/build_plan.js — Rebuild the 30-day plan (re-sequenced, exam-weighted) and
// re-key the day-coupled data files. Run: node tools/build_plan.js
// Mechanical only: places all KodeKloud pages as studyLinks, migrates hand-written
// content to its topic's new day, remaps questionIds by service. No content invented
// beyond the small authored cheat blocks for split-second days (below).
// tools/orig/ holds the PRE-rebuild data files = pristine generator input; the generator
// reads them (never data/*.js) so re-runs are idempotent. Do not overwrite tools/orig/.
"use strict";
const fs = require("fs");
const path = require("path");
const DATA = path.join(__dirname, "..", "data");
const SRC  = path.join(__dirname, "orig"); // pristine snapshot — generator is idempotent, never reads its own output

global.window = {};
require(path.join(SRC, "plan.js"));        const OLD   = window.DVA_PLAN;
require(path.join(SRC, "enrich.js"));       const ENRICH = window.DVA_ENRICH;
require(path.join(SRC, "daynotes.js"));     const NOTES  = window.DVA_DAYNOTES;
require(path.join(SRC, "diagrams.js"));     const DIAG   = window.DVA_DIAGRAMS;
require(path.join(SRC, "whitepapers.js"));  const WP     = window.DVA_WHITEPAPERS;
require(path.join(SRC, "notion.js"));       const NOTION = window.DVA_NOTION;
require(path.join(DATA, "questions.js"));    const QS     = window.DVA_QUESTIONS.questions; // read-only, generator never rewrites it

const oldByNum = {}; OLD.forEach(d => { oldByNum[d.day] = d; });

/* ── old day → primary new day (for re-keying coupled files) ── */
const OLD2NEW = {1:1,2:3,3:4,4:5,5:6,6:6,7:30,8:7,9:8,10:9,11:12,12:13,13:10,14:14,
  15:16,16:17,17:18,18:20,19:22,20:23,21:15,22:24,23:25,24:26,25:27,26:28,27:29,28:29,29:30,30:30};

/* ── slug → readable title ── */
function titleOf(slug){
  let t = slug.replace(/-/g," ");
  const fix = {"S3":/\bS3\b/gi,"IAM":/\bIAM\b/gi,"EC2":/\bEC2\b/gi,"EBS":/\bEBS\b/gi,"EFS":/\bEFS\b/gi,
    "API":/\bAPI\b/gi,"SQS":/\bSQS\b/gi,"SNS":/\bSNS\b/gi,"DynamoDB":/\bdynamodb\b/gi,"TTL":/\bttl\b/gi,
    "GSI":/\bgsi\b/gi,"LSI":/\blsi\b/gi,"KMS":/\bkms\b/gi,"DAX":/\bdax\b/gi,"VPC":/\bvpc\b/gi,
    "NACL":/\bnacls?\b/gi,"CDK":/\bcdk\b/gi,"CLI":/\bcli\b/gi,"SDK":/\bsdk\b/gi,"ECS":/\becs\b/gi,
    "ECR":/\becr\b/gi,"EKS":/\beks\b/gi,"CORS":/\bcors\b/gi,"ACL":/\bacl\b/gi,"ACM":/\bacm\b/gi,
    "WAF":/\bwaf\b/gi,"STS":/\bsts\b/gi,"RDS":/\brds\b/gi,"MSK":/\bmsk\b/gi,"CDN":/\bcdns?\b/gi,
    "SAM":/\bsam\b/gi,"REST":/\brest\b/gi,"TLS":/\btls\b/gi,"OpenAPI":/\bopenapi\b/gi};
  for (const rep in fix) t = t.replace(fix[rep], rep);
  t = t.replace(/\bTIps\b/g, "Tips").replace(/\bLoadBalancer\b/g, "Load Balancer");
  return t.replace(/\bEC2\)/,"EC2)").trim();
}
const isDemo = slug => /Demo|part-\d|Part-\d/.test(slug);

/* ── page (section, slug) → new day ── */
function pageDay(section, slug){
  switch(section){
    case "Introduction": return 1;
    case "Conclusion":   return 29;
    case "AWS-Fundamentals":
      if (/CloudFormation|CDK/.test(slug)) return 26;
      if (/CLI|SDK|CloudShell/.test(slug)) return 2;
      if (/^EC2-Basics/.test(slug))        return 5;
      if (/^S3-Basics/.test(slug))         return 7;
      if (/VPC/.test(slug))                return 10;
      if (/Route53|Route-53/.test(slug))   return 11;
      return 1;
    case "Identity-and-Access-Management-IAM":
      return /STS|PassRole|Roles|Dynamic|Instance-Role/.test(slug) ? 4 : 3;
    case "Elastic-Compute-CloudEC2": return 5;
    case "Storage":
      if (/^S3/.test(slug)){
        if (/Encryption|ACL|Pres|CORS/.test(slug)) return 9;
        if (/Lifecycle|Replication|Static|Access-Point|Access-Logs|Review-Storage/.test(slug)) return 8;
        return 7;
      }
      return 6; // EBS/EFS/Instance Store
    case "Networking-Fundamentals":
      return /Route53|Route-53/.test(slug) ? 11 : 10;
    case "Load-Balancing-AutoScaling": return 12;
    case "Databases":
      if (/DynamoDB/.test(slug))
        return /Streams|TTL|Transaction|DAX|PartiQL|Optimistic|Conditional|Index/.test(slug) ? 15 : 14;
      return 13;
    case "CDNs-CloudFront": return 16;
    case "Serverless":
      if (/Destinations|DLQ|Dead-Letter|EventBridge|Execution-Context|Logging|Exam|Edge/.test(slug)) return 19;
      if (/Layers|Concurrency|Networking|Storage|Environment/.test(slug)) return 18;
      return 17;
    case "API-Gateway":
      return /Auth|Caching|Throttl|CORS|OpenAPI|Canary|Keys|Usage|Websocket/.test(slug) ? 21 : 20;
    case "Application-Integrations": return 22;
    case "Data-Analytics": return 23;
    case "Containers-on-AWS": return 24;
    case "Elastic-Beanstalk": return 25;
    case "Serverless-Application-Model-SAM": return 25;
    case "AWS-CICD-Developer-Tools": return 27;
    case "Miscellaneous-Services":
      return /MSK|Kafka/.test(slug) ? 23 : 28;
    case "Security": return 28;
    case "AWS-Monitoring": return 29;
    default: return null;
  }
}

/* ── build KodeKloud studyLinks per new day from the sitemap dump ── */
const urls = fs.readFileSync(path.join(__dirname,"kk_sitemap_dva.txt"),"utf8").trim().split("\n");
const kkByDay = {}; let placed = 0; const unplaced = [];
urls.forEach(u => {
  const m = u.match(/Associate\/([^/]+)\/([^/]+)\/page/);
  if (!m){ unplaced.push(u); return; }
  const [ ,section,slug] = m;
  const day = pageDay(section, slug);
  if (!day){ unplaced.push(section+"/"+slug); return; }
  (kkByDay[day] = kkByDay[day] || []).push({
    label: "KodeKloud: " + titleOf(slug),
    url: u,
    note: isDemo(slug) ? "(demo — follow along)" : ""
  });
  placed++;
});
// stable order within a day: concepts first, then demos, alpha by label
Object.keys(kkByDay).forEach(d => kkByDay[d].sort((a,b) =>
  (a.note===b.note ? a.label.localeCompare(b.label) : (a.note?1:-1))));

/* ── authored light cheat/links for split-second & repurposed days ── */
const AUTH = {
  2: {
    links: [{label:"Slides: AWS CLI & SDK (p.238-247)", url:"AWS%20Certified%20Developer%20Slides%20v45.pdf", note:"CLI profiles, SDK credential chain"}],
    cheat: [
      "AWS CLI: configure with `aws configure` → stores keys in ~/.aws/credentials, region/output in ~/.aws/config. Named profiles: `--profile` or AWS_PROFILE.",
      "Credential provider chain (SDK & CLI order): env vars → SSO → shared config/credentials file → container creds → EC2 instance-profile (IMDS). First match wins.",
      "NEVER hard-code access keys in code. On EC2/Lambda/ECS use IAM roles; the SDK picks up temporary creds automatically.",
      "CloudShell = browser shell with your console identity + AWS CLI pre-installed, 1 GB persistent /home, free.",
      "AWS SDK exists per language (JS v3 modular, boto3 for Python…). Retries with exponential backoff are built in; region must be set.",
      "AWS CDK = define infra in real code (TS/Python) → synthesizes CloudFormation. `cdk synth` / `cdk deploy`. (Deep dive on Day 26.)"
    ],
    hands: [
      "Run `aws configure --profile dev` and set a region; then `aws sts get-caller-identity --profile dev`.",
      "List S3 buckets via CLI: `aws s3 ls`. Then the same call from an SDK snippet in CloudShell.",
      "Inspect the credential chain: unset env keys, confirm CLI still works off the profile file."
    ]
  },
  11: {
    links: [{label:"Slides: Route 53 (p.165-190)", url:"AWS%20Certified%20Developer%20Slides%20v45.pdf", note:"Routing policies, health checks"}],
    cheat: [
      "Route 53 = managed DNS + domain registration + health checks. TTL controls how long resolvers cache a record.",
      "Record types: A (IPv4), AAAA (IPv6), CNAME (alias to another name, NOT at zone apex), Alias (AWS-specific, free, works at apex → ELB/CloudFront/S3).",
      "Routing policies: Simple, Weighted, Latency, Failover (active/passive + health check), Geolocation, Geoproximity, Multivalue.",
      "Alias record beats CNAME for AWS resources: no charge, supports the zone apex (example.com).",
      "Health checks can trigger DNS failover; CloudWatch alarms can back them."
    ]
  },
  19: {
    links: [{label:"Slides: Lambda — events & integrations (p.560-601)", url:"AWS%20Certified%20Developer%20Slides%20v45.pdf", note:"Destinations, DLQ, EventBridge"}],
    cheat: [
      "Async invokes (S3, SNS, EventBridge) retry twice on failure, then drop → send failures to a DLQ (SQS/SNS) or use Lambda Destinations (onFailure/onSuccess) — Destinations carry richer context than a DLQ.",
      "Event source mappings (SQS, Kinesis, DynamoDB Streams) POLL the source; Lambda scales with shards/queue. Batch failures can partial-retry with ReportBatchItemFailures.",
      "EventBridge = event bus + rules (schedule or pattern match) → common Lambda trigger; replaces CloudWatch Events.",
      "Execution context is reused across invokes (warm start): init code + /tmp (512 MB–10 GB) persist. Put DB connections/SDK clients OUTSIDE the handler.",
      "Monitoring: Lambda auto-logs to CloudWatch Logs; enable X-Ray active tracing for latency breakdown. Key metrics: Throttles, Errors, Duration, IteratorAge, ConcurrentExecutions.",
      "Exam trigger: 'process failed events' → DLQ/Destinations; 'run on a schedule' → EventBridge rule; 'reuse DB connection' → init outside handler."
    ]
  },
  21: {
    links: [{label:"Slides: API Gateway — security & deployment (p.678-699)", url:"AWS%20Certified%20Developer%20Slides%20v45.pdf", note:"Auth, caching, throttling, stages"}],
    cheat: [
      "Authorizers: IAM (SigV4), Lambda authorizer (token or request — custom logic, cache by TTL), Cognito User Pool. HTTP API also does JWT.",
      "Caching is per-stage (0.5 GB–237 GB), TTL default 300 s, keyed by request params; client can bypass with Cache-Control: max-age=0 (needs permission).",
      "Throttling: account-level 10,000 rps / 5,000 burst by default; per-method limits + Usage Plans + API Keys for per-client quotas/rate.",
      "CORS is enforced by the browser — enable it on the API (OPTIONS preflight + Access-Control-* headers). Common exam trap for 'works in Postman, fails in browser'.",
      "Stages (dev/prod) hold deployments; stage variables parametrize (e.g. Lambda alias). Canary release splits a % of traffic on a stage.",
      "Import/export with OpenAPI (Swagger). Edge-optimized (CloudFront front) vs Regional vs Private endpoints."
    ]
  }
};

/* ── NEW day spec: baseOld drives inherited cheat/hands/nonKK-links ── */
const NEW = [
  {d:1, w:1, base:[1],  title:"AWS Fundamentals & Getting Started", module:"Course Introduction + AWS Global Infrastructure"},
  {d:2, w:1, base:[],   title:"AWS Access & Developer Tooling — CLI, SDK, CloudShell, CDK", module:"AWS CLI, SDK, CloudShell",
    goal:"Set up and master the AWS access toolchain — CLI profiles, the SDK credential chain, CloudShell, and a first look at the CDK — the developer's daily interface to AWS."},
  {d:3, w:1, base:[2],  title:"IAM — Users, Groups, Policies", module:"AWS Identity & Access Management (IAM)"},
  {d:4, w:1, base:[3],  title:"IAM Advanced — Roles, STS, PassRole, Policy Evaluation", module:"IAM Roles & Policies"},
  {d:5, w:1, base:[4],  title:"EC2 — Instances, Pricing, Placement, User Data", module:"Amazon EC2"},
  {d:6, w:1, base:[5,6],title:"Block & File Storage — EBS, Snapshots, AMI, Instance Store, EFS", module:"EC2 Instance Storage + EFS",
    goal:"Master EBS volumes/snapshots/AMIs, instance store, and EFS shared storage — persistence, performance tiers, and when to pick each."},
  {d:7, w:2, base:[8],  title:"S3 Basics — Buckets, Objects, Storage Classes, Versioning", module:"Amazon S3 — Basics"},
  {d:8, w:2, base:[9],  title:"S3 Advanced — Lifecycle, Replication, Access Points, Static Hosting", module:"Amazon S3 — Advanced"},
  {d:9, w:2, base:[10], title:"S3 Security — Encryption, Bucket Policies, Presigned URLs, CORS", module:"Amazon S3 — Security"},
  {d:10,w:2, base:[13], title:"VPC & Networking Fundamentals", module:"Amazon VPC — Subnets, IGW, NAT, SG/NACL",
    goal:"Understand core VPC networking — subnets, route tables, internet/NAT gateways, security groups vs NACLs, and VPC endpoints — the backbone every service runs on."},
  {d:11,w:2, base:[],   title:"Networking II + Route 53", module:"Route 53 + Networking exam tips",
    goal:"Master Route 53 routing policies, alias vs CNAME, health-check failover, and the networking exam traps."},
  {d:12,w:2, base:[11], title:"High Availability — ELB + Auto Scaling Groups", module:"Elastic Load Balancing & Auto Scaling"},
  {d:13,w:3, base:[12], title:"Relational Databases — RDS, Aurora, RDS Proxy, ElastiCache", module:"RDS, Aurora & ElastiCache"},
  {d:14,w:3, base:[14], title:"DynamoDB Basics — Tables, Keys, Capacity, Indexes", module:"Amazon DynamoDB — Basics",
    goal:"Learn DynamoDB core — tables, partition/sort keys, RCU/WCU capacity modes, and GSIs/LSIs — the single most-tested database on the DVA exam."},
  {d:15,w:3, base:[21], title:"DynamoDB Advanced — Streams, TTL, Transactions, DAX, PartiQL", module:"Amazon DynamoDB — Advanced"},
  {d:16,w:3, base:[15], title:"CloudFront + CDN + Lambda@Edge", module:"Amazon CloudFront"},
  {d:17,w:3, base:[16], title:"Lambda I — Basics, Triggers, Sync vs Async, Versions & Aliases", module:"AWS Lambda — Basics"},
  {d:18,w:3, base:[17], title:"Lambda II — Environment, Layers, Concurrency, VPC, Storage", module:"AWS Lambda — Configuration"},
  {d:19,w:4, base:[],   title:"Lambda III — Destinations, DLQ, EventBridge, Context, Logging", module:"AWS Lambda — Events & Observability",
    goal:"Finish Lambda: async failure handling (DLQ vs Destinations), event source mappings, EventBridge triggers, execution-context reuse, and CloudWatch/X-Ray monitoring."},
  {d:20,w:4, base:[18], title:"API Gateway I — REST vs HTTP, Stages, Integrations", module:"Amazon API Gateway — Basics"},
  {d:21,w:4, base:[],   title:"API Gateway II — Auth, Caching, Throttling, CORS, OpenAPI, Canary", module:"Amazon API Gateway — Security & Deployment",
    goal:"Master API Gateway operations — authorizers (IAM/Lambda/Cognito), per-stage caching, throttling & usage plans, CORS, OpenAPI import, and canary releases."},
  {d:22,w:4, base:[19], title:"Messaging & Orchestration — SQS, SNS, EventBridge, Step Functions", module:"Application Integration",
    goal:"Master decoupling: SQS queues (visibility timeout, DLQ, FIFO), SNS pub/sub fan-out, EventBridge routing, and Step Functions state machines."},
  {d:23,w:4, base:[20], title:"Streaming & Analytics — Kinesis, Athena, OpenSearch, MSK", module:"Data Analytics & Streaming",
    goal:"Understand real-time streaming with Kinesis (Data Streams/Firehose/Analytics), plus Athena, OpenSearch, and MSK for the analytics-flavored exam questions."},
  {d:24,w:4, base:[22], title:"Containers on AWS — ECS, ECR, EKS, Fargate", module:"Containers on AWS"},
  {d:25,w:5, base:[23], title:"Elastic Beanstalk + AWS SAM", module:"Elastic Beanstalk + Serverless Application Model",
    goal:"Understand Elastic Beanstalk environment tiers and deployment policies, then SAM (serverless CloudFormation) — templates, `sam build/deploy`, and local testing."},
  {d:26,w:5, base:[24], title:"Infrastructure as Code — CloudFormation + CDK", module:"AWS CloudFormation & CDK",
    goal:"Master CloudFormation template anatomy, intrinsic functions, stacks/drift/nested stacks and change sets — then how the CDK synthesizes to it."},
  {d:27,w:5, base:[25], title:"CI/CD Developer Tools — CodeCommit, CodeBuild, CodeDeploy, CodePipeline", module:"AWS CI/CD Suite"},
  {d:28,w:5, base:[26], title:"Security — KMS, Secrets Manager, SSM Parameter Store, Cognito, ACM, WAF", module:"AWS Security Services"},
  {d:29,w:5, base:[27,28], title:"Monitoring & Troubleshooting — CloudWatch, X-Ray, CloudTrail, Optimization", module:"Monitoring, Troubleshooting & Optimization",
    goal:"Master observability (CloudWatch metrics/logs/alarms, X-Ray tracing, CloudTrail audit) and the Troubleshooting & Optimization domain — retries, backoff, throttling."},
  {d:30,w:5, base:[7,29,30], title:"Mock Exams + Exam-Day Cheat Sheet + Final Strategy", module:"Final Review & Practice",
    goal:"Two timed 65-question mocks, targeted weak-area review, and consolidation of the exam-day cheat sheet and test-taking strategy."}
];

/* ── helpers to merge inherited content ── */
const uniq = arr => { const seen=new Set(), out=[]; arr.forEach(x=>{const k=JSON.stringify(x); if(!seen.has(k)){seen.add(k);out.push(x);}}); return out; };
function inheritCheat(base){ let a=[]; base.forEach(o=>a=a.concat(oldByNum[o].cheatSheet||[])); return uniq(a); }
function inheritHands(base){ let a=[]; base.forEach(o=>a=a.concat(oldByNum[o].handsOn||[])); return uniq(a); }
function inheritNonKK(base){ let a=[]; base.forEach(o=>a=a.concat((oldByNum[o].studyLinks||[]).filter(l=>!/kodekloud/.test(l.url||"")))); return uniq(a); }

/* ── service → candidate new days (questionIds remap) ── */
const SVC = {
  "AWS Lambda":[17,18,19], "Amazon S3":[7,8,9], "Amazon API Gateway":[20,21], "Amazon DynamoDB":[14,15],
  "AWS CloudFormation":[26], "Amazon EC2":[5,6], "Amazon CloudWatch":[29], "AWS X-Ray":[29],
  "Amazon CloudFront":[16], "Elastic Load Balancing":[12], "AWS Auto Scaling":[12],
  "Amazon RDS":[13], "Amazon Aurora":[13], "Amazon ElastiCache":[13], "Amazon DocumentDB":[13],
  "AWS Elastic Beanstalk":[25], "AWS SAM":[25],
  "AWS CodePipeline":[27],"AWS CodeCommit":[27],"AWS CodeBuild":[27],"AWS CodeDeploy":[27],"AWS CodeArtifact":[27],"AWS Amplify":[27],"AWS CodeStar":[27],
  "AWS Step Functions":[22],"Amazon SQS":[22],"Amazon SNS":[22],"Amazon EventBridge":[22],"Amazon MQ":[22],
  "Amazon Kinesis":[23],"Amazon Redshift":[23],"Amazon Athena":[23],"Amazon MSK":[23],
  "AWS Fargate":[24],"Amazon ECS":[24],"Amazon EKS":[24],"AWS Batch":[24],"Amazon ECR":[24],
  "AWS Secrets Manager":[28],"AWS KMS":[28],"Amazon Cognito":[28],"AWS Systems Manager Parameter Store":[28],
  "AWS Certificate Manager":[28],"AWS WAF":[28],"AWS AppConfig":[28],
  "AWS IAM":[4]
};
const GENERAL = [1,2,3,4,10,11,29,30]; // include IAM days 3,4 — bank has only 1 IAM-tagged Q
const svcCounter = {};
function qDay(svc){
  const cands = SVC[svc] || GENERAL;
  const i = (svcCounter[svc] = (svcCounter[svc]||0)+1) - 1;
  return cands[i % cands.length];
}
const qByDay = {}; for(let d=1; d<=30; d++) qByDay[d]=[];
QS.slice().sort((a,b)=>a.number-b.number).forEach(q => qByDay[qDay(q.service||"AWS (General)")].push(q.number));

/* ── assemble new plan ── */
const plan = NEW.map(spec => {
  const kk = kkByDay[spec.d] || [];
  const auth = AUTH[spec.d] || {};
  const nonKK = auth.links ? auth.links : inheritNonKK(spec.base);
  const cheat = auth.cheat ? auth.cheat : inheritCheat(spec.base);
  const hands = auth.hands ? auth.hands : inheritHands(spec.base);
  return {
    day: spec.d, week: spec.w, title: spec.title, module: spec.module,
    goal: spec.goal || (spec.base.length ? oldByNum[spec.base[0]].goal : ""),
    minutes: 120,
    session: { study:45, questions:30, handsOn:25, review:20 },
    studyLinks: kk.concat(nonKK),
    cheatSheet: cheat,
    handsOn: hands.length ? hands : (spec.base.length ? inheritHands(spec.base) : []),
    questionIds: qByDay[spec.d].sort((a,b)=>a-b)
  };
});

/* ── re-key coupled files via OLD2NEW (merge on collision) ── */
function rekeyArrays(src){ // value is an array → concat
  const out={};
  Object.keys(src).forEach(k=>{
    if(k==="topics"){ out.topics=src.topics; return; }
    const nk=OLD2NEW[+k]; if(!nk) return;
    out[nk]=(out[nk]||[]).concat(src[k]);
  });
  return out;
}
function rekeyEnrich(src){ // value is {hooks:[...]} (+maybe more) → merge hooks
  const out={};
  Object.keys(src).forEach(k=>{
    const nk=OLD2NEW[+k]; if(!nk) return;
    if(!out[nk]) out[nk]=JSON.parse(JSON.stringify(src[k]));
    else { for(const f in src[k]){ if(Array.isArray(src[k][f])) out[nk][f]=(out[nk][f]||[]).concat(src[k][f]); } }
  });
  return out;
}
function rekeyNotes(src){ // daynote object → merge array fields, keep first title/intro
  const out={};
  Object.keys(src).forEach(k=>{
    const nk=OLD2NEW[+k]; if(!nk) return;
    const n=JSON.parse(JSON.stringify(src[k]));
    if(!out[nk]) out[nk]=n;
    else { ["mustKnow","triggers","table"].forEach(f=>{ if(n[f]) out[nk][f]=(out[nk][f]||[]).concat(n[f]); }); }
  });
  return out;
}
function rekeyNotion(src){ // topic.days arrays remapped through OLD2NEW
  const out=JSON.parse(JSON.stringify(src));
  Object.keys(out).forEach(id=>{
    const days=(out[id].days||[]).map(d=>OLD2NEW[d]).filter(Boolean);
    out[id].days=Array.from(new Set(days)).sort((a,b)=>a-b);
  });
  return out;
}

const newEnrich = rekeyEnrich(ENRICH);
/* authored hooks for the 4 split days with no old-day source */
const AUTH_ENRICH = {
  2: { hooks: [
    "Credential provider chain (CLI & SDK), first match wins: env vars → SSO → shared config/credentials file → container creds → EC2 instance-profile (IMDS).",
    "NEVER hard-code access keys. On EC2/Lambda/ECS attach an IAM role — the SDK auto-fetches temporary creds.",
    "`aws configure --profile dev`; switch with `--profile` or AWS_PROFILE env var. Keys in ~/.aws/credentials, region/output in ~/.aws/config.",
    "CloudShell = browser shell with your console identity, CLI pre-installed, 1 GB persistent /home, free.",
    "SDKs retry with exponential backoff automatically; region must always be set.",
    "CDK writes infra in real code (TS/Python) → `cdk synth` produces CloudFormation → `cdk deploy` (deep dive Day 26)."
  ]},
  11: { hooks: [
    "Alias vs CNAME: Alias is free, works at the zone apex (example.com), points only to AWS targets (ELB/CloudFront/S3); CNAME can't sit at the apex.",
    "Routing policies: Simple, Weighted, Latency, Failover (health-check active/passive), Geolocation, Geoproximity, Multivalue.",
    "TTL controls how long resolvers cache a record — low TTL = faster failover but more queries.",
    "Health checks drive DNS failover and can watch CloudWatch alarms.",
    "Route 53 = DNS + domain registration + health checks (it is NOT a firewall/load balancer)."
  ]},
  19: { hooks: [
    "Async invokes (S3/SNS/EventBridge) retry twice then DROP → send failures to a DLQ (SQS/SNS) or use Lambda Destinations (onSuccess + onFailure, richer context than a DLQ).",
    "Event source mappings (SQS/Kinesis/DynamoDB Streams) POLL the source; use ReportBatchItemFailures for partial-batch retry.",
    "Execution context (init code + /tmp) is reused on warm starts → create DB connections / SDK clients OUTSIDE the handler.",
    "EventBridge rule = schedule (cron) or event-pattern trigger; it replaces CloudWatch Events.",
    "Observability: auto CloudWatch Logs; enable X-Ray active tracing. Watch Throttles, Errors, Duration, IteratorAge, ConcurrentExecutions."
  ]},
  21: { hooks: [
    "Authorizers: IAM (SigV4), Lambda authorizer (token or request, cached by TTL), Cognito user pool; HTTP API also supports JWT.",
    "Caching is per-stage, default TTL 300 s; a client can bypass with Cache-Control: max-age=0 (needs permission).",
    "Throttling: 10,000 rps / 5,000 burst account default; Usage Plans + API Keys give per-client quotas.",
    "CORS is enforced by the BROWSER (OPTIONS preflight) — classic 'works in Postman, fails in browser' trap.",
    "Stages hold deployments; stage variables parametrize (e.g. Lambda alias); canary release splits a % of traffic."
  ]}
};
Object.keys(AUTH_ENRICH).forEach(k => { if(!newEnrich[k]) newEnrich[k] = AUTH_ENRICH[k]; });
const newDiag   = rekeyArrays(DIAG);
const newWP     = rekeyArrays(WP);
const newNotes  = rekeyNotes(NOTES);
const newNotion = rekeyNotion(NOTION);

/* ── write files ── */
function writeGlobal(file, varName, obj){
  fs.writeFileSync(path.join(DATA,file), "window."+varName+" = "+JSON.stringify(obj,null,1)+";\n");
}
writeGlobal("plan.js","DVA_PLAN",plan);
writeGlobal("enrich.js","DVA_ENRICH",newEnrich);
writeGlobal("diagrams.js","DVA_DIAGRAMS",newDiag);
writeGlobal("whitepapers.js","DVA_WHITEPAPERS",newWP);
writeGlobal("daynotes.js","DVA_DAYNOTES",newNotes);
writeGlobal("notion.js","DVA_NOTION",newNotion);

/* ── verification ── */
console.log("KK pages placed:", placed, "/", urls.length, " unplaced:", unplaced.length, unplaced.slice(0,8));
const linkUrls = new Set();
plan.forEach(d=>d.studyLinks.forEach(l=>{ if(/kodekloud/.test(l.url)) linkUrls.add(l.url); }));
const siteSet = new Set(urls);
const missing = urls.filter(u=>!linkUrls.has(u));
const extra = [...linkUrls].filter(u=>!siteSet.has(u));
console.log("KK links in plan:", linkUrls.size, " missing vs sitemap:", missing.length, " dead:", extra.length);
const allQ = new Set(); plan.forEach(d=>d.questionIds.forEach(n=>allQ.add(n)));
const bank = new Set(QS.map(q=>q.number));
console.log("questions mapped:", allQ.size, "/", bank.size,
  " orphans:", [...bank].filter(n=>!allQ.has(n)).length,
  " dangling:", [...allQ].filter(n=>!bank.has(n)).length);
console.log("per-day questionIds:", plan.map(d=>d.questionIds.length).join(","));
console.log("per-day studyLinks :", plan.map(d=>d.studyLinks.length).join(","));
const badEnrich = Object.keys(newEnrich).filter(k=>+k<1||+k>30);
const badNotion = Object.values(newNotion).flatMap(t=>t.days).filter(d=>d<1||d>30);
console.log("enrich keys:", Object.keys(newEnrich).length, " diag keys:", Object.keys(newDiag).filter(k=>k!=="topics").length,
  " notes keys:", Object.keys(newNotes).length, " wp keys:", Object.keys(newWP).join(","),
  " notion.days out-of-range:", badNotion.length, " enrich out-of-range:", badEnrich.length);
console.log("DONE");
