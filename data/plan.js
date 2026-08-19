window.DVA_PLAN = [
 {
  "day": 1,
  "week": 1,
  "title": "AWS Fundamentals & Getting Started",
  "module": "Course Introduction + AWS Global Infrastructure",
  "goal": "Understand AWS global infrastructure, regions/AZs/edge, the shared responsibility model, and how the DVA-C02 exam is structured (4 domains).",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Accessing AWS",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/Accessing-AWS/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AWS Account Setup",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-Account-Setup/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AWS Global Infrastructure",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-Global-Infrastructure/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Billing 2FA",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/Billing-2FA/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Certification Details",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Introduction/Certification-Details/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Course Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Introduction/Course-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exploring the AWS Console",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/Exploring-the-AWS-Console/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Registering for the Exam",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Introduction/Registering-for-the-Exam/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: What is AWS",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/What-is-AWS/page",
    "note": ""
   },
   {
    "label": "Slides — Getting Started & Course Intro",
    "url": "slides/01-intro.pdf",
    "note": "21 slides · p1-21 of full deck"
   }
  ],
  "cheatSheet": [
   "Exam: 65 questions, 130 min, passing 720/1000. Domains: Development(32%), Security(26%), Deployment(24%), Troubleshooting(18%).",
   "Region = cluster of AZs (3-6). AZ = one+ data center, isolated from failures, connected with low-latency links.",
   "Edge Locations (400+) = CloudFront CDN cache points; Regional Caches sit behind them.",
   "Shared responsibility: AWS = 'security OF the cloud' (hardware, hypervisor, managed services). You = 'security IN the cloud' (IAM, data, OS, network config on EC2).",
   "Global services: IAM, Route 53, CloudFront, S3 (global namespace, regional storage).",
   "Anything you configure (IAM users, VPC, keys) is per-account, not per-region unless noted.",
   "Service models: IaaS (EC2, EBS, VPC), PaaS (RDS, Elastic Beanstalk), Serverless/SaaS (Lambda, S3, DynamoDB, API Gateway).",
   "AWS budgets/credits: use Free Tier account for all hands-on labs.",
   "Exam tip: questions often test 'LEAST management overhead' vs 'LEAST cost' — read the qualifier word."
  ],
  "handsOn": [
   "Create a free AWS account (or log in to your sandbox).",
   "Open the Console, switch regions, note how IAM and S3 appear in all regions (global).",
   "Open CloudShell (bottom-left) and run: aws sts get-caller-identity",
   "Explore the AWS Management Console home: services menu, cost explorer, budget alerts.",
   "Skim the shared responsibility model page (aws.amazon.com/compliance/shared-responsibility-model/)."
  ],
  "questionIds": [
   2,
   79,
   141,
   246,
   354,
   415,
   468,
   510
  ],
  "keyTakeaways": [
   {
    "icon": "🔐",
    "title": "Application Configuration vs Secrets",
    "theory": "AWS splits runtime needs into two buckets. Non-sensitive configuration (URLs, feature flags, settings) lives in Systems Manager Parameter Store; sensitive values (passwords, API keys, DB credentials) live in Secrets Manager, which adds automatic rotation. Both are read through the same lightweight SDK call at startup — no extra application code. KMS only encrypts; it is not a place to fetch config from.",
    "diagrams": [
     {
      "title": "Where each value lives",
      "type": "fanout",
      "from": "Your app — one SDK call at startup",
      "to": [
       "Parameter Store — config: URLs, flags, settings",
       "Secrets Manager — secrets: passwords, keys, rotation"
      ]
     }
    ],
    "remember": "Parameter Store = configuration. Secrets Manager = secrets. KMS only encrypts — never a config source."
   },
   {
    "icon": "🚀",
    "title": "CodeDeploy Lifecycle Hooks",
    "theory": "Every CodeDeploy deployment runs a fixed hook sequence split into two independent families. The application spine stops the old version, installs the new one, and starts it — ValidateService always runs LAST, after ApplicationStart, never mid-way. The traffic family (Blue/Green + traffic shifting) is a separate Before → Action → After pattern for blocking or allowing traffic. Don't merge the two families.",
    "diagrams": [
     {
      "title": "Application hook spine (in-place & Auto Scaling)",
      "type": "flow",
      "steps": [
       "ApplicationStop",
       "DownloadBundle",
       "BeforeInstall",
       "Install",
       "AfterInstall",
       "ApplicationStart",
       "ValidateService (LAST)"
      ]
     },
     {
      "title": "Traffic hook family (Blue/Green + shifting)",
      "type": "flow",
      "steps": [
       "BeforeBlockTraffic",
       "BlockTraffic",
       "AfterBlockTraffic",
       "BeforeAllowTraffic",
       "AllowTraffic",
       "AfterAllowTraffic"
      ]
     },
     {
      "title": "What runs, by deployment type",
      "type": "stack",
      "rows": [
       ["In-place", "Application hooks + traffic hooks"],
       ["Blue/Green new instances", "Application hooks + AllowTraffic family"],
       ["Blue/Green original instances", "BlockTraffic family only"],
       ["Rollback", "Traffic hooks fire again, reversed"]
      ]
     }
    ],
    "correction": "An earlier draft stated the wrong hook order. ValidateService is confirmed LAST — right after ApplicationStart, not before it.",
    "remember": "STOP → INSTALL → START → VALIDATE. Traffic is always BLOCK → ALLOW."
   },
   {
    "icon": "🌊",
    "title": "Streaming Data: Kinesis vs Firehose vs SNS/SQS",
    "theory": "When many independent consumers must read the SAME real-time stream in parallel — cheaply and at high volume — use Kinesis Data Streams: each consumer tracks its own position and reads independently. Firehose is a one-way delivery pipe to a single destination (S3, Redshift), not a multi-consumer read surface. SNS+SQS fanout also allows many consumers but needs one queue per consumer, adding cost and management at high volume.",
    "diagrams": [
     {
      "title": "Many independent consumers, one stream",
      "type": "fanout",
      "from": "Kinesis Data Streams — millions of events",
      "to": ["Consumer A", "Consumer B", "Consumer C"]
     },
     {
      "title": "Pick the right service",
      "type": "compare",
      "cols": [
       {
        "head": "Kinesis Data Streams",
        "tag": "many readers",
        "items": ["Multiple independent consumers", "Real-time, high volume", "Each tracks its own position"]
       },
       {
        "head": "Firehose",
        "tag": "one destination",
        "items": ["Delivery pipe only", "S3 / Redshift / OpenSearch", "Not multi-consumer"]
       },
       {
        "head": "SNS + SQS",
        "tag": "queue per consumer",
        "items": ["Fanout works", "One queue each", "Overhead at scale"]
       }
      ]
     }
    ],
    "remember": "One stream, many independent consumers, real-time, cheap → Kinesis Data Streams."
   },
   {
    "icon": "🌍",
    "title": "Multi-Region Deployment: CloudFormation StackSets",
    "theory": "To deploy identical infrastructure across many Regions or accounts with no custom orchestration code, use CloudFormation StackSets: one template pushed centrally to a target list of Regions/accounts. A Lambda that triggers per-Region stack creation, or manually running create-stack per Region, reintroduces the custom code or manual repetition StackSets exist to remove.",
    "diagrams": [
     {
      "title": "One template, many targets",
      "type": "fanout",
      "from": "CloudFormation template → StackSet",
      "to": ["Region / Account A", "Region / Account B", "Region / Account C"]
     }
    ],
    "remember": "StackSet = one template → many Regions/accounts, no custom code."
   },
   {
    "icon": "⚙️",
    "title": "Dynamic Configuration Without Redeploying: AWS AppConfig",
    "theory": "When settings (limits, feature flags, thresholds) must change repeatedly WITHOUT redeploying or restarting the app, use AWS AppConfig. An agent alongside the app polls AppConfig for updated values. Rollout strategies (e.g. a canary percentage over a time window) apply changes gradually and auto-rollback on CloudWatch alarms. This differs from CodeDeploy, which ships application code, not live config values.",
    "diagrams": [
     {
      "title": "Config updates without redeploy",
      "type": "flow",
      "steps": [
       "AppConfig",
       "Agent on ECS/EC2/Lambda",
       "Live config value",
       "Canary rollout %, auto-rollback on alarm"
      ]
     }
    ],
    "remember": "AppConfig = change configuration WITHOUT redeploying the application."
   },
   {
    "icon": "🔑",
    "title": "KMS Key Deletion Timing",
    "theory": "Standard KMS keys cannot be deleted instantly — deletion requires a mandatory 7–30 day waiting window by design, to prevent accidental data loss. The only way to make a key unusable IMMEDIATELY, with AWS managing the infrastructure, is a customer-managed key with IMPORTED key material: deleting the imported material (crypto-shredding) disables the key at once.",
    "diagrams": [
     {
      "title": "How fast can the key die?",
      "type": "stack",
      "rows": [
       ["AWS-managed key", "No immediate deletion possible"],
       ["Customer-managed key", "Delete → 7–30 day mandatory wait"],
       ["Customer key + imported material", "Delete material → INSTANT (crypto-shred)"]
      ]
     }
    ],
    "remember": "Instant kill + no infra to manage → imported key material, delete the material."
   },
   {
    "icon": "🌐",
    "title": "AWS STS Endpoints and Latency",
    "theory": "STS has one legacy global endpoint (sts.amazonaws.com, physically anchored in the US) plus a Regional endpoint in every Region. An app that calls the global endpoint pays cross-continent latency on every AssumeRole/GetSessionToken call. The fix is simply pointing the SDK at the Regional STS endpoint closest to the app — the auth method (SAML, web identity) does not change.",
    "diagrams": [
     {
      "title": "Global vs Regional STS",
      "type": "compare",
      "cols": [
       {
        "head": "Global endpoint",
        "tag": "slow",
        "items": ["sts.amazonaws.com", "US-anchored", "Cross-continent latency", "Legacy default"]
       },
       {
        "head": "Regional endpoint",
        "tag": "fast",
        "items": ["sts.<region>.amazonaws.com", "Closest to the app", "Low latency", "Recommended"]
       }
      ]
     }
    ],
    "remember": "Regional app + STS latency → point the SDK at the Regional STS endpoint."
   },
   {
    "icon": "📦",
    "title": "Temporary Access + Auto-Cleanup: S3 Presigned URLs + Lifecycle",
    "theory": "For files that must be temporarily accessible to a specific customer and auto-deleted after a retention window, with the LEAST operational overhead: store the object in S3 (any size, including >1 MB), hand out a presigned URL with a built-in expiration for temporary access, and attach an S3 Lifecycle rule to delete it after N days. No polling Lambda, cron job, or expiry database to manage — S3 handles both natively.",
    "diagrams": [
     {
      "title": "Temporary access + auto-cleanup",
      "type": "fanout",
      "from": "Report object in S3 (encrypted, any size)",
      "to": ["Presigned URL — expires in 8h", "Lifecycle rule — auto-delete after 2 days"]
     }
    ],
    "remember": "Large file + temporary access + auto-delete → S3 + presigned URL + Lifecycle rule."
   }
  ]
 },
 {
  "day": 2,
  "week": 1,
  "title": "AWS Access & Developer Tooling — CLI, SDK, CloudShell, CDK",
  "module": "AWS CLI, SDK, CloudShell",
  "goal": "Set up and master the AWS access toolchain — CLI profiles, the SDK credential chain, CloudShell, and a first look at the CDK — the developer's daily interface to AWS.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: AWS CLI",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-CLI/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AWS CloudShell",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-CloudShell/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AWS SDK",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-SDK/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AWS CLI Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-CLI-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: AWS CloudShell Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-CloudShell-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: AWS SDK Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-SDK-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — AWS CLI & SDK",
    "url": "slides/09-cli-sdk.pdf",
    "note": "10 slides · p238-247 of full deck"
   },
   {
    "label": "Slides — AWS CDK (Cloud Development Kit)",
    "url": "slides/23-cdk.pdf",
    "note": "12 slides · p745-756 of full deck"
   }
  ],
  "cheatSheet": [
   "AWS CLI: configure with `aws configure` → stores keys in ~/.aws/credentials, region/output in ~/.aws/config. Named profiles: `--profile` or AWS_PROFILE.",
   "Credential provider chain (SDK & CLI order): env vars → SSO → shared config/credentials file → container creds → EC2 instance-profile (IMDS). First match wins.",
   "NEVER hard-code access keys in code. On EC2/Lambda/ECS use IAM roles; the SDK picks up temporary creds automatically.",
   "CloudShell = browser shell with your console identity + AWS CLI pre-installed, 1 GB persistent /home, free.",
   "AWS SDK exists per language (JS v3 modular, boto3 for Python…). Retries with exponential backoff are built in; region must be set.",
   "AWS CDK = define infra in real code (TS/Python) → synthesizes CloudFormation. `cdk synth` / `cdk deploy`. (Deep dive on Day 26.)",
   "Region resolution order: explicit param → AWS_REGION env → profile's region in ~/.aws/config. No region set = error for most services.",
   "List/query APIs cap results (e.g. S3 ListObjects = 1000 keys). Use paginators or loop on NextToken/ContinuationToken to get everything.",
   "IAM Identity Center (SSO): `aws configure sso` sets up a profile; `aws sso login` refreshes the short-lived session creds.",
   "CLI exit codes: 0 = success, 255 = error. In scripts use `set -euo pipefail` and check `$?` so a silent failure doesn't cascade."
  ],
  "cheatSheetV2": {
   "heading": "🚀 AWS Developer Tooling & Access",
   "subtitle": "Exam Edition",
   "sections": [
    {
     "type": "table",
     "icon": "🧰",
     "title": "The Core Tool Stack",
     "cols": ["Tool", "What it is", "Key Exam Details"],
     "rows": [
      ["**AWS CLI**", "Command-line interface", "Config via `aws configure`. Keys in `~/.aws/credentials`, region in `~/.aws/config`. Switch profiles with `--profile` or `AWS_PROFILE`."],
      ["**CloudShell**", "Browser-based terminal", "🌐 Uses console identity. CLI pre-installed. **1 GB persistent** `/home`. 100% free."],
      ["**AWS SDK**", "Language libraries", "🧩 JS v3 (modular), Python (`boto3`). **Auto-retries** with exponential backoff. Region *must* be set."],
      ["**AWS CDK**", "Infra as Code (real code)", "🏗️ Write TS/Python → synthesizes to CloudFormation. `cdk synth` → `cdk deploy`."]
     ]
    },
    {
     "type": "chain",
     "icon": "🔐",
     "title": "Credential Provider Chain",
     "flag": "High Yield",
     "subtitle": "How the SDK/CLI finds credentials. **First match wins!**",
     "mnemonic": {
      "phrase": "Exam Students Should Check Everything",
      "hint": "E · S · S · C · E"
     },
     "steps": [
      {
       "k": "E",
       "label": "Env Vars",
       "note": "`AWS_ACCESS_KEY_ID` …"
      },
      {
       "k": "S",
       "label": "SSO",
       "note": "IAM Identity Center"
      },
      {
       "k": "S",
       "label": "Shared Files",
       "note": "`~/.aws/credentials`"
      },
      {
       "k": "C",
       "label": "Container Creds",
       "note": "ECS Task Role"
      },
      {
       "k": "E",
       "label": "EC2 Instance Profile",
       "note": "IMDS"
      }
     ]
    },
    {
     "type": "traps",
     "icon": "🚨",
     "title": "Golden Rules & Exam Traps",
     "subtitle": "The exact scenarios AWS uses to trick you.",
     "items": [
      {
       "icon": "🚫",
       "label": "Never hardcode keys",
       "text": "On EC2/Lambda/ECS **always use IAM Roles** — the SDK auto-fetches temporary credentials."
      },
      {
       "icon": "🌍",
       "label": "Region resolution order",
       "text": "`Explicit param` → `AWS_REGION` env → `~/.aws/config` profile. *No region = error.*"
      },
      {
       "icon": "📦",
       "label": "The pagination trap",
       "text": "List APIs (S3 `ListObjects`) **cap at 1,000 items**. Use **Paginators** or loop on `NextToken` / `ContinuationToken`."
      },
      {
       "icon": "💥",
       "label": "CLI exit codes",
       "text": "`0` = success, `255` = error. In bash use `set -euo pipefail` so silent failures don't cascade."
      },
      {
       "icon": "🎟️",
       "label": "SSO commands",
       "text": "`aws configure sso` (set up profile) → `aws sso login` (refresh short-lived session)."
      }
     ]
    },
    {
     "type": "recall",
     "icon": "🧠",
     "title": "Brain-Cache Active Recall",
     "subtitle": "Test yourself first — tap a card to reveal the answer.",
     "cards": [
      {
       "q": "Exact order of the Credential Provider Chain?",
       "a": "Env → SSO → Shared → Container → EC2 *(first match wins)*"
      },
      {
       "q": "Where does the CLI store keys vs. region?",
       "a": "Keys → `~/.aws/credentials`; region → `~/.aws/config`"
      },
      {
       "q": "You list 5,000 S3 objects via CLI — what happens?",
       "a": "It caps at 1,000. Use a Paginator or `NextToken`."
      },
      {
       "q": "Securely give a Lambda access to DynamoDB?",
       "a": "Attach an **IAM Role** to the Lambda. Never hardcode keys!"
      },
      {
       "q": "Which CDK command generates the CloudFormation template?",
       "a": "`cdk synth`"
      }
     ]
    },
    {
     "type": "tips",
     "icon": "💡",
     "title": "Cache It In Your Brain",
     "items": ["**Read it aloud** — especially the mnemonic *Exam Students Should Check Everything*.", "**Visualize the staircase** — 5 credential steps; miss step 1, you fall to step 2, and so on.", "**Hunt the traps** — AWS tests what you *shouldn't* do (hardcoding keys) and edge cases (the 1,000-item cap)."]
    }
   ]
  },
  "handsOn": [
   "Run `aws configure --profile dev` and set a region; then `aws sts get-caller-identity --profile dev`.",
   "List S3 buckets via CLI: `aws s3 ls`. Then the same call from an SDK snippet in CloudShell.",
   "Inspect the credential chain: unset env keys, confirm CLI still works off the profile file.",
   "Force full pagination: `aws s3api list-objects-v2 --bucket X --no-paginate` vs the default, and note the NextToken behaviour.",
   "Set up a second identity with `aws configure sso` (or a `--profile`) and switch between the two in one shell."
  ],
  "questionIds": [
   4,
   102,
   175,
   251,
   358,
   416,
   470,
   516
  ],
  "keyTakeaways": [
   {
    "icon": "🔐",
    "title": "Private Downloads at Global Scale",
    "theory": "Firmware/software downloads that must be private AND global: store the files in S3 and serve them through CloudFront with signed URLs. A signed URL controls WHO may download and FOR HOW LONG (time-limited), while CloudFront adds global caching at low cost — with no extra application tier. Lambda@Edge, API Gateway, or one distribution per customer all add cost or complexity you don't need.",
    "diagrams": [
     {
      "title": "Secure global download path",
      "type": "flow",
      "steps": [
       {
        "t": "Customer",
        "role": "key"
       },
       "CloudFront + signed URL (expires)",
       {
        "t": "Amazon S3 — private firmware",
        "role": "win"
       }
      ]
     },
     {
      "title": "Answer vs traps",
      "type": "stack",
      "rows": [
       ["✅ A — CloudFront + signed URLs", "secure, global, lowest cost", "win"],
       ["B — one Distribution per customer", "costly + hard to operate", "trap"],
       ["C — CloudFront + Lambda@Edge", "overkill for signed-URL auth", "trap"],
       ["D — API Gateway + Lambda", "extra layer + compute cost", "trap"]
      ]
     }
    ],
    "correction": "You picked C (Lambda@Edge). Correct = A. A signed URL already authorises the download — Lambda@Edge only adds cost for logic you don't need here.",
    "remember": "Secure private downloads + global delivery = CloudFront + signed URLs (S3 origin)."
   },
   {
    "icon": "🚀",
    "title": "Fast Serverless Iteration: sam sync",
    "theory": "For a tight build-test loop on serverless, sam sync pushes ONLY the changed resources to AWS instead of redeploying the whole stack on every commit — it is built for accelerated development. The decoys are real commands that do other jobs; know what each actually does.",
    "diagrams": [
     {
      "title": "sam sync loop",
      "type": "flow",
      "steps": [
       {
        "t": "Code change",
        "role": "key"
       },
       "sam sync",
       "only CHANGED resources",
       {
        "t": "AWS — test in seconds",
        "role": "win"
       }
      ]
     },
     {
      "title": "What each command actually does",
      "type": "compare",
      "cols": [
       {
        "head": "sam sync",
        "tag": "✅ deploy incremental",
        "items": ["syncs only changed resources", "rapid dev/test loop"],
        "tone": "win"
       },
       {
        "head": "sam init",
        "items": ["scaffolds a NEW app", "no deploy"],
        "tone": "trap"
       },
       {
        "head": "cdk synth",
        "items": ["emits a CFN template", "no deploy"],
        "tone": "trap"
       },
       {
        "head": "cdk bootstrap",
        "items": ["preps env for CDK", "no deploy"],
        "tone": "trap"
       }
      ]
     }
    ],
    "correction": "You picked D (cdk bootstrap). bootstrap only prepares an environment for CDK — it deploys nothing. The incremental-deploy answer is sam sync (A).",
    "remember": "Serverless dev speed = sam sync (pushes only changed resources)."
   },
   {
    "icon": "🔑",
    "title": "Hide an API Key: Public REST API + HTTP Integration",
    "theory": "A public single-page app must call a third-party API that needs a secret key in a header — but the key must never reach the browser. API Gateway holds the key server-side: a PUBLIC REST API with a direct HTTP integration injects the key into the integration request headers before forwarding. No Lambda needed = cheapest. 'Private' REST APIs are for VPC-only clients, so they don't fit a public browser app.",
    "diagrams": [
     {
      "title": "Key stays server-side",
      "type": "flow",
      "steps": [
       {
        "t": "Browser (public SPA)",
        "role": "key"
       },
       {
        "t": "API Gateway REST API + secret header",
        "role": "win"
       },
       "Third-party HTTP API"
      ]
     },
     {
      "title": "Answer vs traps",
      "type": "stack",
      "rows": [
       ["✅ C — Public REST API + HTTP integration", "key hidden, no compute cost", "win"],
       ["A — PRIVATE REST API + HTTP integration", "private ≠ public browser access", "trap"],
       ["B — Private + Lambda proxy", "private + needless compute", "trap"],
       ["D — Public + Lambda proxy", "works, but extra Lambda cost", "trap"]
      ]
     }
    ],
    "remember": "Hide a key behind a simple forward = public API Gateway REST API, HTTP integration, no Lambda."
   },
   {
    "icon": "🔗",
    "title": "SQS → Enrich → Target, Least Code: EventBridge Pipes",
    "theory": "Point-to-point 'take from a source, optionally enrich, hand to a target' is exactly what EventBridge Pipes do — with no code to write for polling or orchestration. Source = the SQS queue, a built-in enrichment step, target = the fulfillment system. Lambda+SNS, Step Functions, or EMR all add moving parts and development effort.",
    "diagrams": [
     {
      "title": "The Pipe does it all",
      "type": "flow",
      "steps": [
       {
        "t": "SQS queue (orders)",
        "role": "key"
       },
       {
        "t": "EventBridge Pipe — Enrichment step",
        "role": "win"
       },
       "Fulfillment system"
      ]
     },
     {
      "title": "Answer vs traps (by effort)",
      "type": "stack",
      "rows": [
       ["✅ D — EventBridge Pipe", "source → enrich → target, least code", "win"],
       ["A — Lambda poll + SNS", "custom polling + extra infra", "trap"],
       ["B — Step Functions + Lambda", "orchestration overhead", "trap"],
       ["C — EMR cluster", "a cluster for simple enrich = overkill", "trap"]
      ]
     }
    ],
    "remember": "SQS → transform/enrich → target with minimal code = EventBridge Pipes."
   },
   {
    "icon": "📱",
    "title": "Mobile MFA = Cognito User Pool + Enable MFA (choose TWO)",
    "theory": "App end-user authentication with MFA is a Cognito User Pool job, and it takes TWO steps: (A) create the user pool and its users, and (C) turn on MFA for that pool. MFA is a pool setting, not something you hand-code with SNS. IAM users are for AWS resource access, not app end-users — a classic decoy.",
    "diagrams": [
     {
      "title": "Two steps — both required",
      "type": "fanout",
      "from": {
       "t": "Mobile app users need MFA",
       "role": "key"
      },
      "to": [
       {
        "t": "Step A — create Cognito User Pool + users",
        "role": "win"
       },
       {
        "t": "Step C — enable MFA on the pool",
        "role": "win"
       }
      ]
     },
     {
      "title": "Right identity service",
      "type": "compare",
      "cols": [
       {
        "head": "Cognito User Pool",
        "tag": "app end-users",
        "items": ["sign-up / sign-in", "built-in MFA toggle"],
        "tone": "win"
       },
       {
        "head": "IAM users",
        "tag": "AWS resource access",
        "items": ["not for app end-users"],
        "tone": "trap"
       },
       {
        "head": "Manual SNS codes",
        "tag": "hand-rolled",
        "items": ["bypasses built-in MFA"],
        "tone": "trap"
       }
      ]
     }
    ],
    "correction": "'Choose TWO' — the answer is A AND C. You selected only C; enabling MFA (C) needs the pool to exist first (A). Always match the number of picks the question asks for.",
    "remember": "App users + MFA = Cognito User Pool (A) + enable MFA (C). Two steps."
   },
   {
    "icon": "⚡",
    "title": "Massive Scale + Low Latency + Key Queries = DynamoDB",
    "theory": "Time-series readings that must scale with zero downtime and serve low-latency 'current + historical' lookups per location = DynamoDB. Model location ID as the partition key and timestamp as the sort key: that composite key answers both 'latest reading' and 'range over time' fast. RDS needs capacity management, ElastiCache is a cache (not a durable store), and S3+Athena is for analytics — not on-demand low latency.",
    "diagrams": [
     {
      "title": "Composite key design",
      "type": "keymap",
      "table": "Smart-meter readings",
      "pk": "Location ID",
      "sk": "Timestamp",
      "out": ["Current usage — point lookup", "Historical usage — range query"]
     },
     {
      "title": "Right store for the job",
      "type": "compare",
      "cols": [
       {
        "head": "DynamoDB",
        "tag": "✅ scale + low latency",
        "items": ["auto-scales, no downtime", "key-based current & historical"],
        "tone": "win"
       },
       {
        "head": "RDS",
        "items": ["capacity to manage", "weaker for huge time-series"],
        "tone": "trap"
       },
       {
        "head": "ElastiCache",
        "items": ["cache, not a durable source"],
        "tone": "trap"
       },
       {
        "head": "S3 + Athena",
        "items": ["analytics, not low latency"],
        "tone": "trap"
       }
      ]
     }
    ],
    "remember": "Huge scale + low latency + key queries = DynamoDB (PK = location, SK = timestamp)."
   }
  ]
 },
 {
  "day": 3,
  "week": 1,
  "title": "IAM — Users, Groups, Policies",
  "module": "AWS Identity & Access Management (IAM)",
  "goal": "Master IAM identities, policies, MFA, access keys, and least privilege — IAM underpins ~1 in 4 DVA exam questions.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: IAM Overview",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/IAM-Overview/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: IAM Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/IAM-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — IAM — Users, Groups, Policies",
    "url": "slides/02-iam.pdf",
    "note": "18 slides · p22-39 of full deck"
   }
  ],
  "cheatSheet": [
   "IAM = global identity service. Root account = full access, never use for daily work, enable MFA on it.",
   "Users = one physical person; Groups = collections of users (policies attach to group). Groups cannot be nested.",
   "Roles = identity with temporary credentials, assumed by users/services (no long-term keys). Role for service = grant AWS service access on your behalf.",
   "Policies = JSON documents; key elements: Version ('2012-10-17'), Statement[Effect, Action, Resource, Condition, Principal].",
   "Action: 's3:*' or 's3:GetObject'; Resource: 'arn:aws:s3:::mybucket/*'; wildcards allowed.",
   "Least privilege: grant only needed permissions; use IAM Access Analyzer + Credentials Report to audit.",
   "Access Keys = Access Key ID + Secret Access Key; used for CLI/SDK/API (NOT console). Delete unused keys; rotate regularly.",
   "MFA: virtual (Google Auth), U2F key, or hardware. IAM MFA protects console + CLI (via session token).",
   "Password policy: length, complexity, rotation enforced at account level.",
   "IAM policy simulator (console) tests whether an identity can perform an action — exam loves it.",
   "Explicit DENY always overrides ALLOW. No explicit allow = implicit deny."
  ],
  "handsOn": [
   "Create an IAM group 'Developers' and attach AdministratorAccess to it.",
   "Create user 'dev-user' with console password + an access key; add to group.",
   "Create a second user with NO policy; try S3 ListBuckets from CloudShell using its key (expect AccessDenied).",
   "Set up a password policy and virtual MFA on your own user.",
   "Generate an IAM Credentials Report and check access key ages."
  ],
  "questionIds": [
   8,
   104,
   190,
   255,
   361,
   425,
   471,
   527
  ]
 },
 {
  "day": 4,
  "week": 1,
  "title": "IAM Advanced — Roles, STS, PassRole, Policy Evaluation",
  "module": "IAM Roles & Policies",
  "goal": "Deep-dive IAM roles for services, STS AssumeRole, PassRole, dynamic policies, and how requests are evaluated — the hardest IAM exam topics.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Dynamic Policies",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/Dynamic-Policies/page",
    "note": ""
   },
   {
    "label": "KodeKloud: IAM PassRole for AWS Services",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/IAM-PassRole-for-AWS-Services/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Roles for AWS Services",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/Roles-for-AWS-Services/page",
    "note": ""
   },
   {
    "label": "KodeKloud: STSSecurity Token Service",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/STSSecurity-Token-Service/page",
    "note": ""
   },
   {
    "label": "KodeKloud: EC2 Instance Roles Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/EC2-Instance-Roles-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: IAM PassRole for AWS Services Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/IAM-PassRole-for-AWS-Services-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Roles for AWS Services Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/Roles-for-AWS-Services-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Advanced IAM & STS",
    "url": "slides/25-iam-advanced.pdf",
    "note": "21 slides · p805-825 of full deck"
   }
  ],
  "cheatSheet": [
   "Never put long-term credentials in code, EC2 UserData, or environment vars. Use an EC2 Instance Role (instance profile) instead.",
   "STS AssumeRole returns temporary credentials (AccessKey + SecretKey + SessionToken); default 1hr, max 12hr (via duration setting).",
   "AssumeRole requires: a trust policy on the role (who can assume) + a permissions policy on the role + the caller needs sts:AssumeRole permission.",
   "Role trust policy uses Principal; permissions policy uses Action/Resource. Trust = WHO, policy = WHAT.",
   "PassRole (iam:PassRole): lets a service assume a role you created. User needs PassRole on that specific role ARN, service needs it for the service-linked role.",
   "Dynamic policies: ${aws:username}, ${aws:PrincipalTag}, ${aws:accountid} etc. enable per-user policies with one statement.",
   "EC2 Instance Metadata Service (IMDSv2, token-based): curl http://169.254.169.254/latest/meta-data/iam/security-credentials/<role-name> gives temp creds.",
   "Credentials precedence: env vars > shared config (~/.aws/credentials) > instance profile.",
   "Request evaluation order: context (S3/STS) → resource policy → identity policy → explicit deny wins → allow only if no deny.",
   "AWS Organizations SCPs: boundary policies at OU level; effective permission = intersection of all policies.",
   "Exam tip: 'developer needs EC2 to access S3 without keys' → always an IAM instance role, never hardcoded keys."
  ],
  "handsOn": [
   "Create an IAM role for EC2 with s3:ReadOnly, launch a micro EC2 instance, attach the role (instance profile).",
   "SSH in, run: aws s3 ls — no keys configured, works because of the instance role.",
   "Query instance metadata: curl -s -H 'X-aws-ec2-metadata-token: $(curl -s -X PUT ...latest/api/token)' http://169.254.169.254/latest/meta-data/iam/security-credentials/",
   "Create a role with a trust policy for your own user (sts:AssumeRole) and assume it via aws sts assume-role.",
   "Write a dynamic policy using ${aws:username} granting each user access only to their home 'folder' in S3."
  ],
  "questionIds": [
   13,
   105,
   191,
   269,
   274,
   375,
   432,
   481,
   535
  ]
 },
 {
  "day": 5,
  "week": 1,
  "title": "EC2 — Instances, Pricing, Placement, User Data",
  "module": "Amazon EC2",
  "goal": "Understand EC2 instance types, pricing models, security groups, user data, and placement groups.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: EC2 Basics",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/EC2-Basics/page",
    "note": ""
   },
   {
    "label": "KodeKloud: EC2 Placement",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/EC2-Placement/page",
    "note": ""
   },
   {
    "label": "KodeKloud: EC2 Pricing",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/EC2-Pricing/page",
    "note": ""
   },
   {
    "label": "KodeKloud: EC2 Storage",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/EC2-Storage/page",
    "note": ""
   },
   {
    "label": "KodeKloud: EC2 Userdata",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/EC2-Userdata/page",
    "note": ""
   },
   {
    "label": "KodeKloud: EC2 Userdata demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/EC2-Userdata-demo/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: EC2 Basics Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/EC2-Basics-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Amazon EC2",
    "url": "slides/03-ec2.pdf",
    "note": "32 slides · p40-71 of full deck"
   }
  ],
  "cheatSheet": [
   "Instance families (mnemonic): m=general, t=burst, c=compute, r=memory, g/gr=GPU, i=storage, x=memory-optimized, p=GPU compute.",
   "Pricing: On-Demand (flexible), Reserved (1-3yr, up to 72% off), Spot (up to 90% off, can be terminated at 2-min notice), Dedicated Host (compliance).",
   "Spot: save big on stateless workloads; can be interrupted → architect for resilience (ASG with mixed instances).",
   "Security Groups = instance-level virtual firewall, stateful, default DENY inbound / ALLOW all outbound. SGs reference other SGs or CIDRs.",
   "SGs allow only ALLOW rules (no deny). If both SG and NACL allow, traffic passes; NACL is stateless and evaluated before SG.",
   "User Data runs as root at first boot (only on launch). Scripts begin with #!/bin/bash.",
   "Metadata (not user data) available at http://169.254.169.254/latest/meta-data/.",
   "Placement groups: Cluster (low latency, same rack — single point of failure), Spread (max HA, 7/group), Partition (distributed across racks, up to 7 partitions).",
   "Elastic IP = static public IPv4 (charged while unattached). Prefer ALB + public DNS in production.",
   "Exam tip: 'EC2 must run custom script on boot' → User Data; 'must persist data' → EBS (not instance store)."
  ],
  "handsOn": [
   "Launch a t2.micro with user data that installs httpd and writes an index.html greeting.",
   "SSH in and confirm the web server is running; hit its public IP in the browser.",
   "Restrict the inbound Security Group to your own IP on port 22 and 80; observe a blocked connection from another source.",
   "Create a placement group (spread) and note the limit of 7 instances per group.",
   "Stop and start the instance — note the public IP changes (no Elastic IP attached)."
  ],
  "questionIds": [
   1,
   22,
   89,
   129,
   165,
   181,
   216,
   299,
   363,
   401,
   438,
   526
  ]
 },
 {
  "day": 6,
  "week": 1,
  "title": "Block & File Storage — EBS, Snapshots, AMI, Instance Store, EFS",
  "module": "EC2 Instance Storage + EFS",
  "goal": "Master EBS volumes/snapshots/AMIs, instance store, and EFS shared storage — persistence, performance tiers, and when to pick each.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: EBS",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/EBS/page",
    "note": ""
   },
   {
    "label": "KodeKloud: EFS",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/EFS/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Instance Store",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/Instance-Store/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: EBS Demo 1",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/EBS-Demo-1/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: EBS Demo 2",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/EBS-Demo-2/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: EFS Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/EFS-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Instance Store Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/Instance-Store-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — EC2 Instance Storage — EBS, EFS, AMI",
    "url": "slides/04-ec2-storage.pdf",
    "note": "23 slides · p72-94 of full deck"
   }
  ],
  "cheatSheet": [
   "EBS = network drive attached to ONE instance in the SAME AZ (some EBS types support multi-attach). Persists independently of instance life.",
   "EBS types: gp2/gp3 (general SSD), io1/io2 (provisioned IOPS, for DBs), st1/sc1 (throughput/cold HDD), Magnetic (legacy).",
   "EBS deleted with instance by default unless 'DeleteOnTermination=false'. Root volume cannot be set false by default.",
   "Snapshots: point-in-time backup stored in S3 (not visible as S3), incremental, can be copied to other regions, restore to new EBS.",
   "Snapshot lifecycle: EBS Snapshot Lifecycle Manager automates retention.",
   "AMI = Amazon Machine Image (from a snapshot) → templates for launching identical instances; AMIs are REGIONAL, copy cross-region.",
   "AMIs can be public, shared with accounts, or private; market AMIs exist.",
   "Instance Store = ephemeral block storage physically on the host: extremely fast, LOSES data on stop/terminate/reboot(host fail).",
   "Exam: 'need persistent data' → EBS/EFS/S3, NEVER instance store. 'fast temp scratch' → instance store.",
   "EFS = shared network file system (NFS) for many Linux instances across AZs; EBS is block, EFS is file.",
   "RAID 0 = striping (performance, no redundancy); RAID 1 = mirroring (redundancy, EBS multi-AZ not supported so use EFS/S3).",
   "EFS = managed NFS, shared across MANY EC2 instances in the SAME VPC (multi-AZ), scales automatically, pay-as-you-go.",
   "EFS uses Security Groups to allow NFS (port 2049) from EC2 instances. Mount with: mount -t nfs4 -o nfsvers=4.1 <dns>:/",
   "EFS is LINUX ONLY (NFS). Windows shared storage = FSx for Windows File Server.",
   "EFS throughput modes: Bursting (default, scales with size) vs Provisioned; performance modes: General Purpose vs Max I/O.",
   "EFS classes: Standard + EFS-IA (infrequent access, lifecycle policies to transition).",
   "EBS = block storage, one instance (snapshots for sharing). EFS = file storage, many instances. S3 = object storage, many apps.",
   "AWS CLI: aws configure sets access key/secret/region/output. Named profiles via --profile.",
   "AWS SDK: language-specific libs (boto3, aws-sdk-js...). SDK default retries and exponential backoff on throttling.",
   "Credentials precedence: CLI env vars > shared credentials file > instance profile. Never commit keys to git.",
   "Exam tip: 'multiple EC2 instances share a file system' → EFS. 'Windows file share' → FSx."
  ],
  "handsOn": [
   "Launch an instance with a 10GB gp3 root volume; SSH in and check df -h.",
   "Create a new EBS volume, attach it to the instance, partition, format (mkfs.xfs), mount to /data, write a file.",
   "Take a snapshot of the volume, modify instance type, and confirm the file persists.",
   "Create an AMI from the instance; launch a second instance from that AMI and verify identical config.",
   "Compare: stop the instance, attach the EBS to a different instance to prove EBS portability.",
   "Install AWS CLI (or use CloudShell) and run: aws configure (paste your dev-user keys).",
   "Verify with aws sts get-caller-identity and aws s3 ls.",
   "Create an EFS filesystem, add a mount target in your default subnets.",
   "Launch two instances, mount the same EFS on both (install nfs-utils), create a file on one and read it on the other.",
   "Use the SDK in CloudShell: python3 -c \"import boto3; print(boto3.client('s3').list_buckets())\""
  ],
  "questionIds": [
   17,
   65,
   112,
   146,
   172,
   186,
   297,
   330,
   367,
   419,
   476,
   547
  ]
 },
 {
  "day": 7,
  "week": 2,
  "title": "S3 Basics — Buckets, Objects, Storage Classes, Versioning",
  "module": "Amazon S3 — Basics",
  "goal": "Master S3 buckets/objects, storage classes, versioning, and core concepts — S3 is the most-tested service on DVA-C02.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: S3 Basics",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/S3-Basics/page",
    "note": ""
   },
   {
    "label": "KodeKloud: S3 Events",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Events/page",
    "note": ""
   },
   {
    "label": "KodeKloud: S3 Versioning",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Versioning/page",
    "note": ""
   },
   {
    "label": "KodeKloud: S3 Basics Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/S3-Basics-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: S3 Storage Classes Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Storage-Classes-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: S3 Versioning Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Versioning-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Amazon S3 — Basics",
    "url": "slides/08-s3.pdf",
    "note": "25 slides · p213-237 of full deck"
   }
  ],
  "cheatSheet": [
   "S3 = object storage (files + metadata + version ID), buckets have GLOBALLY UNIQUE names, stored in a chosen region.",
   "Objects up to 5TB; multipart upload for >100MB (recommended), required for >5GB.",
   "Storage classes (hot→cold): Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant, Glacier Flexible, Glacier Deep Archive.",
   "Lifecycle rules transition objects automatically (e.g., Standard→IA after 30d→Glacier after 90d).",
   "Versioning: keeps every version of an object; delete creates a DELETE MARKER (recoverable); permanent delete removes a version ID.",
   "Suspending versioning keeps existing versions; you cannot remove versioning once enabled (only suspend).",
   "Versioning enables S3 Replication (CRR cross-region / SRR same-region) and MFA Delete.",
   "S3 is strong eventual consistency: after a write you may read stale, but no 'first-write-wins' conflict; updates are atomic.",
   "Encryption overview: SSE-S3 (AES-256, managed), SSE-KMS, SSE-C (customer keys), client-side encryption.",
   "Exam tip: 'cost optimize old data' → lifecycle rules to Glacier. 'read-after-write' is a near-synonym of strong consistency now."
  ],
  "handsOn": [
   "aws s3 mb s3://dva-demo-<unique> and upload a file with aws s3 cp.",
   "Enable versioning; upload the same key twice, list and confirm both versions exist.",
   "Delete the object; confirm a delete marker was created, then restore by deleting the marker.",
   "Create a lifecycle rule transitioning to Standard-IA after 30 days and Glacier after 90 days.",
   "Create a bucket with a globally unique name across two regions and enable CRR between them."
  ],
  "questionIds": [
   3,
   16,
   29,
   51,
   74,
   117,
   153,
   178,
   205,
   223,
   256,
   280,
   301,
   319,
   337,
   353,
   372,
   393,
   431,
   441,
   457,
   465,
   484,
   494,
   542,
   549
  ]
 },
 {
  "day": 8,
  "week": 2,
  "title": "S3 Advanced — Lifecycle, Replication, Access Points, Static Hosting",
  "module": "Amazon S3 — Advanced",
  "goal": "Go deeper: bucket policies vs ACLs, replication, access points, static website hosting, events, and object lock.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: S3 Access Logs",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Access-Logs/page",
    "note": ""
   },
   {
    "label": "KodeKloud: S3 Access Points",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Access-Points/page",
    "note": ""
   },
   {
    "label": "KodeKloud: S3 Review Storage Classes",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Review-Storage-Classes/page",
    "note": ""
   },
   {
    "label": "KodeKloud: S3 Static Website Hosting",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Static-Website-Hosting/page",
    "note": ""
   },
   {
    "label": "KodeKloud: S3 Access Points Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Access-Points-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: S3 Static Website Hosting Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Static-Website-Hosting-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Amazon S3 — Advanced",
    "url": "slides/10-s3-advanced.pdf",
    "note": "13 slides · p248-260 of full deck"
   }
  ],
  "cheatSheet": [
   "Bucket policy (resource-based, JSON) applies to the whole bucket; ACLs (legacy) per-object/bucket grants. IAM policies = identity-based.",
   "A user is authorized if the union of identity policy + resource policy allows it (minus explicit denies).",
   "Use bucket policies to: grant cross-account access, make bucket public, enforce encryption/HTTPS (Condition aws:SecureTransport).",
   "Static website hosting: enable on bucket, set index/error docs → endpoint http://<bucket>.s3-website-<region>.amazonaws.com. No HTTPS without CloudFront.",
   "S3 Events → SNS, SQS, Lambda (async); enable EventBridge integration for more event types. Versioning must be on for some events.",
   "Replication requires versioning; CRR (cross-region) for DR/latency, SRR (same-region) for log aggregation/security. Replicate only new objects by default (replica of replicas off).",
   "S3 Access Points: named endpoints with own policy + VPC endpoint; simplify large data sharing.",
   "S3 Object Lock: WORM — Compliance mode (no one can delete/overwrite, not even root) vs Governance mode (with retention/legal hold).",
   "Server access logging: write logs of all requests to another bucket; best with a lifecycle to delete old logs.",
   "Exam tip: 'encrypt everything + prevent HTTP' → bucket policy with aws:SecureTransport condition."
  ],
  "handsOn": [
   "Enable static website hosting on a bucket, upload index.html + error.html, browse the endpoint.",
   "Write a bucket policy granting s3:GetObject to Principal '*' (make the site public).",
   "Write a bucket policy with aws:SecureTransport=false → Deny; test an http:// vs https:// request.",
   "Set up S3 event notification → SQS queue and put an object; check the queue receives a JSON event.",
   "Enable CRR replication (with versioning) and confirm an object copy lands in the destination bucket."
  ],
  "questionIds": [
   7,
   18,
   45,
   58,
   83,
   119,
   154,
   192,
   206,
   235,
   264,
   284,
   312,
   320,
   339,
   360,
   377,
   420,
   433,
   442,
   463,
   469,
   488,
   499,
   546,
   550
  ]
 },
 {
  "day": 9,
  "week": 2,
  "title": "S3 Security — Encryption, Bucket Policies, Presigned URLs, CORS",
  "module": "Amazon S3 — Security",
  "goal": "Master S3 encryption options, presigned URLs, CORS, and access logging — heavy security focus on the DVA exam.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: S3 ACL and Resource Policies",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-ACL-and-Resource-Policies/page",
    "note": ""
   },
   {
    "label": "KodeKloud: S3 Encryption",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Encryption/page",
    "note": ""
   },
   {
    "label": "KodeKloud: S3 Pres Signed URLs",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Pres-Signed-URLs/page",
    "note": ""
   },
   {
    "label": "KodeKloud: S3 ACL and Resource Policies Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-ACL-and-Resource-Policies-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: S3 Encryption Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Encryption-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: S3 Pres Signed URLs Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Pres-Signed-URLs-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Amazon S3 — Security & Encryption",
    "url": "slides/11-s3-security.pdf",
    "note": "20 slides · p261-280 of full deck"
   }
  ],
  "cheatSheet": [
   "Encryption options: SSE-S3 (AES-256, AWS manages key, header x-amz-server-side-encryption:AES256), SSE-KMS (KMS key, audit via CloudTrail), SSE-C (you manage the key, S3 discards it), client-side encryption.",
   "SSE-KMS enables envelope encryption, granular key access, and encryption context. KMS is region-scoped, KMS keys are resources.",
   "Force encryption with a bucket policy: Deny s3:PutObject unless x-amz-server-side-encryption present/valid.",
   "Presigned URLs: temporary (default 1hr, max 7 days) authorized access generated with your credentials — for uploads/downloads without exposing keys.",
   "Presigned URL generation: aws s3 presign s3://bucket/key --expires-in 3600, or SDK generate_presigned_url.",
   "CORS (Cross-Origin Resource Sharing): browser-level; S3 bucket must have a CORS configuration allowing Origin/methods to serve client-side JS from another domain.",
   "CORS config: AllowedOrigins, AllowedMethods (GET/PUT...), AllowedHeaders, ExposeHeaders, MaxAgeSeconds.",
   "S3 Access Logs to a target bucket; Amazon S3 server access log format includes requester, bucket, key, action.",
   "Data protection: Object Lock + MFA Delete (bucket-level, needs versioning) prevent deletion.",
   "Exam tip: 'upload large files from a web app' → presigned PUT URL + multipart upload; 'encryption must be enforced even for new objects' → bucket policy."
  ],
  "handsOn": [
   "Upload a file with SSE-S3 and SSE-KMS headers; verify encryption in the console.",
   "Generate a presigned GET URL, expire it, and confirm 403 after expiry.",
   "Generate a presigned PUT URL and upload with curl -X PUT -T file '<url>'.",
   "Create a static site on bucket A that loads an image via <img> from bucket B; add a CORS config to B and test with the browser console.",
   "Add a bucket policy enforcing aws:SecureTransport and try an http request (expect 403)."
  ],
  "questionIds": [
   14,
   26,
   46,
   60,
   99,
   144,
   155,
   200,
   207,
   247,
   279,
   286,
   318,
   336,
   344,
   371,
   378,
   428,
   439,
   455,
   464,
   474,
   490,
   534,
   548
  ]
 },
 {
  "day": 10,
  "week": 2,
  "title": "VPC & Networking Fundamentals",
  "module": "Amazon VPC — Subnets, IGW, NAT, SG/NACL",
  "goal": "Understand core VPC networking — subnets, route tables, internet/NAT gateways, security groups vs NACLs, and VPC endpoints — the backbone every service runs on.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Elastic IP",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Elastic-IP/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Internet Gateway",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Internet-Gateway/page",
    "note": ""
   },
   {
    "label": "KodeKloud: NAT Gateway",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/NAT-Gateway/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Public vs Private Subnets",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Public-vs-Private-Subnets/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Routing in VPCs",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Routing-in-VPCs/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Security Groups NACL",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Security-Groups-NACLs/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Subnets",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Subnets/page",
    "note": ""
   },
   {
    "label": "KodeKloud: VPC Basics",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/VPC-Basics/page",
    "note": ""
   },
   {
    "label": "KodeKloud: VPC Peering",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/VPC-Peering/page",
    "note": ""
   },
   {
    "label": "KodeKloud: VPC Recap",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/VPC-Recap/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Custom VPC Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/Custom-VPC-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Default VPC Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/Default-VPC-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Elastic IP Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Elastic-IP-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Internet Gateway Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Internet-Gateway-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: NACL Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/NACLs-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: NAT Gateway Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/NAT-Gateway-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Routing Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Routing-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Security Groups Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Security-Groups-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Subnets Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Subnets-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: VPC Peering Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/VPC-Peering-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Route 53 & VPC Networking",
    "url": "slides/07-networking.pdf",
    "note": "48 slides · p165-212 of full deck"
   }
  ],
  "cheatSheet": [
   "Route 53 = AWS DNS service. Records: A (IPv4), AAAA (IPv6), CNAME (alias to another name), MX, TXT, alias records.",
   "Alias records point to AWS resources (ALB, CloudFront, S3) — free, no CNAME chaining limits, auto health-check aware.",
   "Routing policies: Simple (one record), Weighted (% traffic), Latency (lowest latency region), Failover (primary/standby with health checks), Geolocation, Geoproximity (bias), Multi-Value (round robin w/ health checks).",
   "Health checks monitor endpoint, can be linked to failover routing; Route 53 cannot load balance directly (that's ALB).",
   "VPC = virtual network (CIDR). Subnets = AZ-scoped segments: public (via IGW) vs private (via NAT Gateway for outbound).",
   "IGW attaches to VPC, 1-to-1; NAT Gateway (managed, in public subnet) lets private instances reach internet but not be reached.",
   "Security Groups: stateful, instance-level, allow rules only, default deny inbound. NACLs: stateless (both directions evaluated), subnet-level, allow AND deny rules, ordered.",
   "VPC Peering: connect two VPCs (no transitive, no overlapping CIDRs). VPC endpoints (Gateway for S3/DynamoDB; Interface for others) keep traffic private.",
   "Exam tip: 'Route 53 returns different servers per region to minimize latency' → Latency routing. 'failover between DR region' → Failover routing."
  ],
  "handsOn": [
   "Create a custom VPC with 2 public and 2 private subnets, IGW, and a NAT gateway in a public subnet.",
   "Launch an instance in a public subnet (associate a public IP) and one in a private subnet; test internet from each.",
   "Write a simple EC2 app and register an A record + ALIAS record to its ALB in Route 53.",
   "Create a latency-based record pointing to two regions; use dig to confirm.",
   "Set up VPC endpoints: S3 gateway endpoint and verify private-subnet instance reaches S3 without NAT."
  ],
  "questionIds": [
   27,
   107,
   195,
   278,
   383,
   445,
   483,
   541
  ]
 },
 {
  "day": 11,
  "week": 2,
  "title": "Networking II + Route 53",
  "module": "Route 53 + Networking exam tips",
  "goal": "Master Route 53 routing policies, alias vs CNAME, health-check failover, and the networking exam traps.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Route53 Basics",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/Route53-Basics/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Route53 Basics Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/Route53-Basics-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Route 53 & VPC Networking",
    "url": "slides/07-networking.pdf",
    "note": "48 slides · p165-212 of full deck"
   }
  ],
  "cheatSheet": [
   "Route 53 = managed DNS + domain registration + health checks. TTL controls how long resolvers cache a record.",
   "Record types: A (IPv4), AAAA (IPv6), CNAME (alias to another name, NOT at zone apex), Alias (AWS-specific, free, works at apex → ELB/CloudFront/S3).",
   "Routing policies: Simple, Weighted, Latency, Failover (active/passive + health check), Geolocation, Geoproximity, Multivalue.",
   "Alias record beats CNAME for AWS resources: no charge, supports the zone apex (example.com).",
   "Health checks can trigger DNS failover; CloudWatch alarms can back them.",
   "Failover routing needs a health check on the primary; on failure Route 53 serves the secondary (active/passive DR).",
   "Weighted routing splits traffic by integer weights (e.g. 90/10) — DNS-level canary / blue-green.",
   "Latency routing sends users to the Region with the lowest measured latency (not the nearest by distance).",
   "Multivalue = up to 8 healthy records returned at random — poor-man's load balancing, not a substitute for an ELB.",
   "Route 53 Resolver does hybrid DNS: inbound endpoints (on-prem → VPC) and outbound endpoints (VPC → on-prem)."
  ],
  "handsOn": [
   "Create a hosted zone for a test domain; add an A-Alias record pointing at an ELB or CloudFront distribution.",
   "Add a weighted 90/10 pair on the same name; resolve repeatedly with `dig` and watch the split.",
   "Configure a primary/secondary failover pair with a health check; disable the primary and confirm failover.",
   "Try a CNAME at the zone apex (fails), then an Alias at the apex (works) — see why Alias exists.",
   "Lower a record's TTL, change its target, and time how quickly resolvers pick up the new value."
  ],
  "questionIds": [
   39,
   113,
   214,
   281,
   384,
   446,
   487,
   543
  ]
 },
 {
  "day": 12,
  "week": 2,
  "title": "High Availability — ELB + Auto Scaling Groups",
  "module": "Elastic Load Balancing & Auto Scaling",
  "goal": "Understand load balancing (ALB/NLB/GLB), target groups, sticky sessions, and Auto Scaling Groups — core for the Deployment domain.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Application Load Balancer",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Application-Load-Balancer/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Autoscaling Groups Overview",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Autoscaling-Groups-Overview/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Elastic Load Balancer Overview",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Elastic-LoadBalancer-Overview/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Gateway Load Balancer",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Gateway-Load-Balancer/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Network Load Balancer",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Network-Load-Balancer/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Sticky sessions",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Sticky-sessions/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Application Loadbalancer Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Application-Loadbalancer-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Autoscaling Groups Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Autoscaling-Groups-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — ELB & Auto Scaling",
    "url": "slides/05-elb-asg.pdf",
    "note": "43 slides · p95-137 of full deck"
   }
  ],
  "cheatSheet": [
   "ALB = Layer 7 (HTTP/HTTPS), path-based (/api vs /images) and host-based routing, target groups, WebSocket, redirects. Best default.",
   "NLB = Layer 4 (TCP/UDP), ultra-low latency, handles millions rps, static IPs/EIP, ideal for extreme performance or non-HTTP.",
   "GLB = Layer 3/4 for third-party virtual appliances (firewalls/IDS) — health checks then forwards.",
   "Target groups: EC2 instances, IPs, Lambda, ALB. Health checks (HTTP path) decide draining.",
   "Sticky sessions (session affinity) via cookie (ALB-generated or app cookie) pin a client to one instance — requires a Load Balancer cookie duration.",
   "Cross-zone load balancing ON by default for ALB; NLB charges for cross-zone.",
   "ASG: minimum/desired/maximum; launches instances from a LAUNCH TEMPLATE (with user data, AMI, IAM role, key).",
   "Scaling policies: Target Tracking (CPU), Simple, Step, Scheduled. Metrics: CPUUtilization, custom CloudWatch, SQS queue depth.",
   "ASG + ELB: instances registered automatically as targets; health check integration terminates/replaces unhealthy.",
   "Instances are available sooner if you PRE-BAKE the AMI (Golden AMI) instead of a slow user-data boot — classic exam trap.",
   "Exam tip: 'web app with /api path' → ALB listener rules. 'handle 1M TCP connections with static IP' → NLB."
  ],
  "handsOn": [
   "Launch 2 instances with a simple HTTP app; create an ALB, target group, register both, test round-robin.",
   "Add a path-based rule: /images → target group B (second app).",
   "Enable sticky sessions and confirm the same instance serves repeat requests (check instance-id header).",
   "Create an ASG with a launch template, min 1 / max 3, target tracking on CPU; generate load and watch it scale out then in.",
   "Update the AMI in the launch template, trigger a rolling replace, and note the faster bootstrap."
  ],
  "questionIds": [
   15,
   50,
   66,
   137,
   147,
   156,
   238,
   253,
   276,
   285,
   373,
   379,
   407,
   409,
   467,
   485,
   528
  ]
 },
 {
  "day": 13,
  "week": 3,
  "title": "Relational Databases — RDS, Aurora, RDS Proxy, ElastiCache",
  "module": "RDS, Aurora & ElastiCache",
  "goal": "Understand managed relational databases: RDS (multi-AZ, read replicas, backups), Aurora (storage, serverless), ElastiCache (Redis/Memcached) and RDS Proxy.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Aurora",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/Aurora/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AWS RDS Overview",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/AWS-RDS-Overview/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Elasticache Overview",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/Elasticache-Overview/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/Exam-TIps/page",
    "note": ""
   },
   {
    "label": "KodeKloud: MemoryDB for Redis",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/MemoryDB-for-Redis/page",
    "note": ""
   },
   {
    "label": "KodeKloud: RDS Proxy",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/RDS-Proxy/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Aurora Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/Aurora-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: AWS RDS Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/AWS-RDS-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — RDS, Aurora & ElastiCache",
    "url": "slides/06-databases.pdf",
    "note": "27 slides · p138-164 of full deck"
   }
  ],
  "cheatSheet": [
   "RDS = managed SQL DB (Aurora, MySQL, PostgreSQL, MariaDB, Oracle, SQL Server). AWS handles patching, backups, failover.",
   "Multi-AZ = synchronous replica in another AZ for DR — failover in ~60-120s, single DNS name, no manual intervention. Read replicas are ASYNC (for read scale).",
   "Read replicas: up to 15 (Aurora) / 5 (RDS), cross-region possible, promote to standalone for DR.",
   "Backups: automated (retention 1-35 days) + manual snapshots (retain forever); restore to new instance.",
   "Aurora: proprietary MySQL/Postgres-compatible; 6 copies across 3 AZs, auto-scaling storage (up to 128TB), Aurora Serverless scales compute on demand.",
   "Aurora supports Aurora Replicas (up to 15) + Global Database (cross-region, RPO<1s) + Backtrack (rewind in-place).",
   "RDS Proxy: connection pooling for Lambda/EC2 → reduces connection churn, handles failover, IAM auth. Ideal with serverless + RDS.",
   "ElastiCache = managed Redis/Memcached: in-memory cache, sub-ms reads, use for read-heavy workloads; patterns: lazy loading, write-through, TTL.",
   "Cache invalidation: set short TTL, use Redis Pub/Sub or Streams to invalidate. Never rely on cache for authoritative writes.",
   "Exam tip: 'read-heavy MySQL without managing replicas' → RDS read replicas; 'high availability + auto failover DB' → RDS Multi-AZ; 'connection pool for Lambda' → RDS Proxy."
  ],
  "handsOn": [
   "Create an RDS MySQL (free tier) with automated backups; verify snapshot + restore to a new instance.",
   "Create a read replica and point a test query at it.",
   "Enable Multi-AZ (or inspect the console's failover options) and note the endpoint behavior.",
   "Create an ElastiCache Redis cluster, connect with redis-cli, cache a key/value, and wire a tiny app to read from cache then DB.",
   "Create an RDS Proxy in front of your RDS instance and test a Lambda function connecting through it."
  ],
  "questionIds": [
   31,
   78,
   109,
   115,
   132,
   135,
   168,
   183,
   218,
   304,
   342,
   343,
   381,
   417,
   452
  ]
 },
 {
  "day": 14,
  "week": 3,
  "title": "DynamoDB Basics — Tables, Keys, Capacity, Indexes",
  "module": "Amazon DynamoDB — Basics",
  "goal": "Learn DynamoDB core — tables, partition/sort keys, RCU/WCU capacity modes, and GSIs/LSIs — the single most-tested database on the DVA exam.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: DynamoDB API",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-API/page",
    "note": ""
   },
   {
    "label": "KodeKloud: DynamoDB DAX",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Dax/page",
    "note": ""
   },
   {
    "label": "KodeKloud: DynamoDB Overview",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Overview/page",
    "note": ""
   },
   {
    "label": "KodeKloud: DynamoDB Pricing Throughput",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Pricing-Throughput/page",
    "note": ""
   },
   {
    "label": "KodeKloud: DynamoDB Basics Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Basics-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: DynamoDB CLI Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-CLI-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: DynamoDB DAX Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Dax-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: DynamoDB Pricing Throughput Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Pricing-Throughput-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: DynamoDB SDK Part1 Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-SDK-Part1-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: DynamoDB SDK Part2 Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-SDK-Part2-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Amazon DynamoDB",
    "url": "slides/19-dynamodb.pdf",
    "note": "54 slides · p602-655 of full deck"
   }
  ],
  "cheatSheet": [
   "DynamoDB = serverless NoSQL key-value/document store, millisecond latency, unlimited scale, SSD-backed, 3-AZ replication.",
   "Table = collection of items; item = attributes. Every item needs a partition key (hash) + optional sort key (range).",
   "Partition key → partition; sort key allows range queries within a partition (BEGINS_WITH, BETWEEN...).",
   "Capacity: ON-DEMAND (pay per request, auto-scales, no planning) vs PROVISIONED (RCU/WCU with auto scaling; 1 RCU = 1 strongly-consistent read of 4KB/s, 1 WCU = 1 write of 1KB/s).",
   "Reads: strongly consistent (default is EVENTUAL) — use ConsistentRead:true for read-after-write in same partition.",
   "Query = on primary key (partition, optional sort key conditions), fast; Scan = whole table (slow, expensive, filter after).",
   "GSI (Global Secondary Index): different partition+sort key, must define projection, SPARSE index possible, has own capacity.",
   "LSI (Local Secondary Index): same partition key, different sort key; can only be created at table creation; shares table capacity.",
   "Items ≤ 400KB; Batch operations max 16MB/100 items (BatchGetItem returns UnprocessedKeys → retry with backoff).",
   "Exam tip: 'query employees by department' → design partition key = department; 'flexible query patterns' → GSI."
  ],
  "handsOn": [
   "Create a DynamoDB table (PartitionKey: userId, SortKey: timestamp) in on-demand mode.",
   "PutItem/GetItem/UpdateItem via CLI (aws dynamodb put-item --item ...).",
   "Run a Query with a sort-key condition and a Scan; compare latency/cost notions.",
   "Create a GSI on 'status' and query it; observe projected attributes.",
   "Review week 2 cheat sheets (S3, HA, RDS, Route53/VPC, DDB) and re-do wrong questions."
  ],
  "questionIds": [
   21,
   52,
   72,
   85,
   96,
   127,
   133,
   164,
   196,
   241,
   248,
   267,
   288,
   293,
   302,
   322,
   332,
   398,
   408,
   444,
   462,
   498,
   514,
   521,
   545
  ]
 },
 {
  "day": 15,
  "week": 3,
  "title": "DynamoDB Advanced — Streams, TTL, Transactions, DAX, PartiQL",
  "module": "Amazon DynamoDB — Advanced",
  "goal": "Go deep on DynamoDB: streams, TTL, transactions, conditional writes, optimistic locking, DAX, and integration with Lambda — heavy exam weight.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: DynamoDB Conditional writes",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Conditional-writes/page",
    "note": ""
   },
   {
    "label": "KodeKloud: DynamoDB Indexes GSI LSI",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Indexes-GSI-LSI/page",
    "note": ""
   },
   {
    "label": "KodeKloud: DynamoDB Optimistic Locking",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Optimistic-Locking/page",
    "note": ""
   },
   {
    "label": "KodeKloud: DynamoDB Streams",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Streams/page",
    "note": ""
   },
   {
    "label": "KodeKloud: DynamoDB Transactions",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Transactions/page",
    "note": ""
   },
   {
    "label": "KodeKloud: DynamoDB TTL",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-TTL/page",
    "note": ""
   },
   {
    "label": "KodeKloud: DynamoDB Indexes GSI LSI Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Indexes-GSI-LSI-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: DynamoDB Streams Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Streams-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: DynamoDB TTL Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-TTL-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Amazon DynamoDB",
    "url": "slides/19-dynamodb.pdf",
    "note": "54 slides · p602-655 of full deck"
   }
  ],
  "cheatSheet": [
   "Conditional writes: ConditionExpression on Put/Update/Delete (e.g., 'attribute_not_exists(pk)') → atomic 'insert if absent' or 'update only if version matches'.",
   "Optimistic locking: read item with a version attribute, update with ConditionExpression on that version → retry if conflict (prevents lost updates).",
   "Transactions: TransactWriteItems (all-or-nothing, up to 100 items / 4MB), TransactGetItems; 2x the cost of normal writes.",
   "DynamoDB Streams: ordered stream of changes (INSERT/MODIFY/REMOVE, keys + new/old images), 24h retention, enabled per table → trigger Lambda or Kinesis.",
   "TTL: set a TTL attribute (epoch seconds) → DynamoDB auto-deletes expired items (can take ~48h), no extra cost, ideal for sessions/expiry.",
   "DAX (DynamoDB Accelerator): in-memory cache cluster, microsecond latency, drop-in (same API), write-through; NOT for write-heavy/hot keys on a single node.",
   "Global tables: multi-region replication (active-active) with conflict resolution (last-writer-wins by default).",
   "PartiQL: SQL-compatible query language for DynamoDB (CLI/SDK), supports INSERT/SELECT/UPDATE/DELETE.",
   "Backup/restore: on-demand (full) + point-in-time recovery (35 days) to protect from accidents.",
   "Exam tip: 'sub-ms reads for hot read app' → DAX. 'process every change of a table' → DynamoDB Streams → Lambda. 'expire sessions automatically' → TTL. 'atomic multi-item update' → TransactWriteItems."
  ],
  "handsOn": [
   "Enable DynamoDB Streams (new+old images) and a Lambda trigger; update an item and log the stream event.",
   "Add a TTL attribute (epoch + 60s), wait, and confirm the item disappears.",
   "Run a TransactWriteItems with 2 puts and confirm atomicity (one fails → none written).",
   "Implement optimistic locking with a version attribute and a conditional update.",
   "Create a DAX cluster (or read about it), point the SDK (dax: endpoints) and compare latency in CloudWatch."
  ],
  "questionIds": [
   36,
   55,
   82,
   88,
   100,
   131,
   143,
   167,
   210,
   244,
   252,
   273,
   292,
   294,
   309,
   329,
   382,
   405,
   430,
   447,
   496,
   503,
   519,
   539
  ]
 },
 {
  "day": 16,
  "week": 3,
  "title": "CloudFront + CDN + Lambda@Edge",
  "module": "Amazon CloudFront",
  "goal": "Master CloudFront distributions, cache behaviors, signed URLs/cookies, and Lambda@Edge — a top DVA-C02 topic.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Cache Key Caching Policies Cache Behavior",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/CDNs-CloudFront/Cache-Key-Caching-Policies-Cache-Behavior/page",
    "note": ""
   },
   {
    "label": "KodeKloud: CDN CloudFront Basics",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/CDNs-CloudFront/CDN-CloudFront-Basics/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Cloudfront Geographic Restriction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/CDNs-CloudFront/Cloudfront-Geographic-Restriction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/CDNs-CloudFront/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Signed URLs",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/CDNs-CloudFront/Signed-URLs/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Cache Key Caching Policies Cache Behavior Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/CDNs-CloudFront/Cache-Key-Caching-Policies-Cache-Behavior-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: CloudFront Basics Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/CDNs-CloudFront/CloudFront-Basics-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Amazon CloudFront",
    "url": "slides/12-cloudfront.pdf",
    "note": "31 slides · p281-311 of full deck"
   },
   {
    "label": "AWS Docs: CloudFront developer guide (key concepts)",
    "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
    "note": "Distributions, origins, cache behaviors"
   },
   {
    "label": "AWS Docs: Lambda@Edge events",
    "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-edge-trigger-events.html",
    "note": "viewer-request/response, origin-request/response"
   },
   {
    "label": "AWS Docs: Signed URLs and Cookies",
    "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html",
    "note": "Restrict access to content"
   }
  ],
  "cheatSheet": [
   "CloudFront = global CDN: caches content at 400+ edge locations, integrates with S3/ALB/HTTP origins, provides HTTPS + DDoS protection.",
   "Distribution = config (origin + cache behaviors); origin: S3 bucket (with OAC — Origin Access Control), ALB, EC2, custom HTTP.",
   "OAC (Origin Access Control) replaces OAI: lets CloudFront authenticate to S3 private bucket via IAM, then bucket policy allows only CloudFront.",
   "Cache behavior: path pattern + TTL (Default TTL 24h). Cache invalidation vs versioned filenames (better: use unique names).",
   "Geo restriction: allow/blocklist by country (or via Lambda@Edge / CloudFront geo headers).",
   "Signed URLs (for one file) vs Signed Cookies (multiple files, e.g., members-only site). Both need CloudFront Key Pairs or trusted signer.",
   "Lambda@Edge: run functions at 4 edge hooks (viewer-request, origin-request, origin-response, viewer-response) for A/B testing, auth, header rewriting, image resize.",
   "CloudFront for S3 static sites: enables HTTPS on the S3 website endpoint + global caching + cheaper data egress.",
   "Exam tip: 'serve content globally with low latency from S3, must be HTTPS' → CloudFront + S3 (NOT the S3 website endpoint alone)."
  ],
  "handsOn": [
   "Create an S3 bucket with private objects; create a CloudFront distribution with OAC.",
   "Test: direct S3 URL (denied) vs CloudFront URL (works) using curl -I.",
   "Set a cache TTL of 60s, update the object, and use invalidation to refresh.",
   "Configure geo restriction and test with a VPN/proxy from a blocked region (or inspect headers).",
   "Add a Lambda@Edge viewer-request function that adds a custom header / redirects /admin; deploy and verify."
  ],
  "questionIds": [
   5,
   30,
   56,
   87,
   201,
   203,
   245,
   324,
   328,
   380,
   497,
   506
  ]
 },
 {
  "day": 17,
  "week": 3,
  "title": "Lambda I — Basics, Triggers, Sync vs Async, Versions & Aliases",
  "module": "AWS Lambda — Basics",
  "goal": "Master Lambda functions: triggers, versions/aliases, environment variables, limits, and execution roles — the heart of the Serverless domain.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Lambda Application Load Balancer",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Application-LoadBalancer/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Lambda Basics",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Basics/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Lambda Versions Aliases",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Versions-Aliases/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Permissions Resource Policies",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Permissions-Resource-Policies/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Synchronous vs Asynchronous",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Synchronous-vs-Asynchronous/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Lambda Application Load Balancer Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Application-LoadBalancer-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Lambda Basics Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Basics-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Lambda Versions Aliases Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Versions-Aliases-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Lambda with CLI Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-with-CLI-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Permissions Resource Policies Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Permissions-Resource-Policies-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — AWS Lambda",
    "url": "slides/18-lambda.pdf",
    "note": "75 slides · p527-601 of full deck"
   },
   {
    "label": "AWS Docs: Lambda basics (execution environment, limits)",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-concepts.html",
    "note": "Invocation model, limits"
   },
   {
    "label": "AWS Docs: Lambda versions & aliases",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html",
    "note": "Versioning, canary deployments"
   },
   {
    "label": "AWS Docs: Lambda execution role",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html",
    "note": "IAM role for permissions"
   }
  ],
  "cheatSheet": [
   "Lambda = serverless compute, pay per invocation (requests + GB-seconds), auto-scales, no servers. Supported: Python, Node, Java, Go, .NET, Ruby, Rust, custom runtimes.",
   "Triggers: S3 events, DynamoDB streams, Kinesis, SQS/SNS, API Gateway, EventBridge, HTTP (function URL).",
   "Sync invoke (caller waits): API Gateway (proxy), ALB, Cognito triggers. Async invoke (fire-and-forget): S3, EventBridge, SNS, SQS → Lambda; retried twice on failure.",
   "Stream-based (DynamoDB/Kinesis): polls, processes batches, scales by shard; errors block the shard (or → DLQ/on-failure destination).",
   "Versions: immutable snapshots of code+config; $LATEST is the mutable one. Aliases = pointers to versions (e.g., 'prod'), enable weighted canary routing.",
   "Env vars: set config, encrypted with KMS by default; use for non-secret config only (secrets → Secrets Manager / SSM).",
   "Execution role (IAM) grants Lambda permissions to other services (S3, DDB, CloudWatch Logs...).",
   "Key limits: 512MB-10GB memory (also sets CPU), /tmp = 512MB-10GB (ephemeral), timeout up to 15 min, payload 6MB sync / 256KB async.",
   "Best practice: make functions STATELESS (no local state), store state in S3/DDB; minimize cold starts (provisioned concurrency for latency-critical).",
   "Exam tip: 'call DB but too many connections' → RDS Proxy or connection pool; 'function URL for public HTTP' → Lambda function URLs (auth: IAM vs NONE)."
  ],
  "handsOn": [
   "Create a Python Lambda with a test event; print event and return a JSON response.",
   "Add a Lambda layer (e.g., boto3 upgrade or a custom lib) and use it.",
   "Publish version 1, create alias 'dev' and 'prod', and route 10% traffic to v2 via the prod alias (weighted alias).",
   "Attach an execution role granting S3 read; add an S3 PUT trigger and log the object key.",
   "Stress the timeout: set 3s timeout with a sleep(5) and observe the 502/timeout in CloudWatch logs."
  ],
  "questionIds": [
   6,
   20,
   38,
   61,
   68,
   77,
   91,
   106,
   116,
   128,
   150,
   162,
   188,
   202,
   219,
   236,
   265,
   277,
   295,
   306,
   333,
   350,
   355,
   368,
   395,
   412,
   436,
   451,
   461,
   473,
   482,
   495,
   522
  ]
 },
 {
  "day": 18,
  "week": 3,
  "title": "Lambda II — Environment, Layers, Concurrency, VPC, Storage",
  "module": "AWS Lambda — Configuration",
  "goal": "Go deep on Lambda concurrency, reserved/provisioned concurrency, VPC access, layers, and common pitfalls tested on the exam.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Environment Variables",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Environment-Variables/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Lambda Layers",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Layers/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Lambda Networking",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Networking/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Lambda Storage",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Storage/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Limits Concurrency",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Limits-Concurrency/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Environment Variables Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Environment-Variables-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Lambda Layers Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Layers-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Lambda Networking Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Networking-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Limits Concurrency Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Limits-Concurrency-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — AWS Lambda",
    "url": "slides/18-lambda.pdf",
    "note": "75 slides · p527-601 of full deck"
   },
   {
    "label": "AWS Docs: Lambda concurrency",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html",
    "note": "Reserved vs provisioned"
   },
   {
    "label": "AWS Docs: Configuring VPC access",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html",
    "note": "ENIs, security groups, NAT for egress"
   },
   {
    "label": "AWS Docs: Lambda layers",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html",
    "note": "Share libs across functions"
   },
   {
    "label": "AWS Docs: Lambda best practices",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html",
    "note": "Stateless, cold starts, SDK clients"
   }
  ],
  "cheatSheet": [
   "Concurrency: per-region account limit (e.g., 1000). Reserved concurrency guarantees slots but throttles the rest; provisioned concurrency pre-warms to avoid cold starts.",
   "Throttling: sync invokes return 429 (caller can retry); async invokes go to retry queue + DLQ; streams use on-failure destinations.",
   "VPC access: Lambda gets an ENI in your VPC subnets + SG → can reach private resources (RDS, Elasticache); WITHOUT a NAT it has NO internet egress.",
   "Lambda in VPC + internet: attach NAT Gateway (or use VPC endpoints) — classic 'why can't my Lambda reach the internet' trap.",
   "Layers: shared code/libs/runtimes up to 5 layers, unzipped into /opt. Ideal for the same Python lib used by multiple functions.",
   "Cold start: new container → init → invoke. Mitigate: provisioned concurrency, minimize deps, smaller memory isn't always faster (more memory = faster CPU).",
   "CPU-bound work: increase memory (up to 10GB) → more CPU; /tmp for files <10MB (check 512MB default, raise to 10GB); streams for large data.",
   "Error handling: idempotent functions (async retries can duplicate); use DLQ/on-failure destination for async + stream events.",
   "Environment config: read AWS_REGION, AWS_LAMBDA_FUNCTION_NAME, AWS_REQUEST_ID at runtime.",
   "Exam tip: 'share one Python library across 2 Lambdas' → layer. 'consistent low latency' → provisioned concurrency. 'private DB + no internet needed' → VPC + SG + VPC endpoints."
  ],
  "handsOn": [
   "Create a Lambda in your default VPC; try to curl a public endpoint (fails) then add a NAT gateway and retry (works).",
   "Set reserved concurrency to 2 on a function; fire 10 concurrent invocations and observe 429s.",
   "Set provisioned concurrency (or Application Auto Scaling) and compare cold-start latency in CloudWatch.",
   "Build a layer containing a Python package, attach to 2 functions, import and use it in both.",
   "Write an idempotent S3→Lambda→DynamoDB handler using a client-side idempotency key."
  ],
  "questionIds": [
   9,
   32,
   41,
   63,
   69,
   81,
   94,
   110,
   121,
   148,
   151,
   179,
   193,
   213,
   221,
   242,
   271,
   289,
   296,
   310,
   335,
   351,
   356,
   387,
   400,
   413,
   440,
   456,
   466,
   475,
   491,
   513,
   524
  ]
 },
 {
  "day": 19,
  "week": 4,
  "title": "Lambda III — Destinations, DLQ, EventBridge, Context, Logging",
  "module": "AWS Lambda — Events & Observability",
  "goal": "Finish Lambda: async failure handling (DLQ vs Destinations), event source mappings, EventBridge triggers, execution-context reuse, and CloudWatch/X-Ray monitoring.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Dead Letter Queue",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Dead-Letter-Queue/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Execution Context and tmp",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Execution-Context-and-tmp/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Lambda Destinations",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Destinations/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Lambda EventBridge Integration",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-EventBridge-Integration/page",
    "note": ""
   },
   {
    "label": "KodeKloud: LambdaEdge Cloudfront Functions",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/LambdaEdge-Cloudfront-Functions/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Logging Monitoring",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Logging-Monitoring/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Dead Letter Queue Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Dead-Letter-Queue-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Execution Context and tmp Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Execution-Context-and-tmp-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Lambda Destinations Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-Destinations-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Lambda EventBridge Integration Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless/Lambda-EventBridge-Integration-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — AWS Lambda",
    "url": "slides/18-lambda.pdf",
    "note": "75 slides · p527-601 of full deck"
   }
  ],
  "cheatSheet": [
   "Async invokes (S3, SNS, EventBridge) retry twice on failure, then drop → send failures to a DLQ (SQS/SNS) or use Lambda Destinations (onFailure/onSuccess) — Destinations carry richer context than a DLQ.",
   "Event source mappings (SQS, Kinesis, DynamoDB Streams) POLL the source; Lambda scales with shards/queue. Batch failures can partial-retry with ReportBatchItemFailures.",
   "EventBridge = event bus + rules (schedule or pattern match) → common Lambda trigger; replaces CloudWatch Events.",
   "Execution context is reused across invokes (warm start): init code + /tmp (512 MB–10 GB) persist. Put DB connections/SDK clients OUTSIDE the handler.",
   "Monitoring: Lambda auto-logs to CloudWatch Logs; enable X-Ray active tracing for latency breakdown. Key metrics: Throttles, Errors, Duration, IteratorAge, ConcurrentExecutions.",
   "Exam trigger: 'process failed events' → DLQ/Destinations; 'run on a schedule' → EventBridge rule; 'reuse DB connection' → init outside handler.",
   "SQS source: Lambda deletes messages only after the batch succeeds; on failure they reappear after the visibility timeout → set a redrive policy + DLQ on the QUEUE (not the function).",
   "Kinesis/DynamoDB Streams: records are ordered per shard and a failing batch BLOCKS that shard until success or expiry → use BisectBatchOnFunctionError + MaximumRetryAttempts/RecordAge + an on-failure destination.",
   "Reserved concurrency caps a function's max (protects downstream / other functions). Provisioned concurrency pre-warms instances to kill cold starts — it costs money even when idle.",
   "Rising IteratorAge = you're falling behind the stream. Add shards, raise batch size, or speed up the function to catch up."
  ],
  "handsOn": [
   "Wire an S3 put-event → async Lambda; force an error and confirm 2 retries then delivery to an SQS DLQ.",
   "Add a Lambda Destination (onFailure → SNS) and compare its payload richness against a plain DLQ message.",
   "Create an EventBridge schedule rule (rate(5 minutes)) → Lambda; confirm periodic runs in CloudWatch Logs.",
   "Move a DB/SDK client above the handler; log a timestamp in init vs handler to observe warm-start reuse.",
   "Enable X-Ray active tracing, invoke a few times, and inspect the service map + subsegments."
  ],
  "questionIds": [
   11,
   34,
   57,
   67,
   71,
   90,
   103,
   114,
   126,
   149,
   161,
   187,
   197,
   215,
   231,
   262,
   275,
   291,
   300,
   315,
   341,
   352,
   359,
   389,
   406,
   429,
   450,
   459,
   472,
   479,
   493,
   517,
   533
  ]
 },
 {
  "day": 20,
  "week": 4,
  "title": "API Gateway I — REST vs HTTP, Stages, Integrations",
  "module": "Amazon API Gateway — Basics",
  "goal": "Master API Gateway: REST vs HTTP APIs, integration types, authorization, caching, throttling, and WebSocket — core serverless front door.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: API Gateway Basics",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/API-Gateway-Basics/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Integration Types mapping Templates",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Integration-Types-mapping-Templates/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Stages Deployments",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Stages-Deployments/page",
    "note": ""
   },
   {
    "label": "KodeKloud: API Gateway Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/API-Gateway-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Integration Types mapping Templates Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Integration-Types-mapping-Templates-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Stages Deployments Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Stages-Deployments-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Amazon API Gateway",
    "url": "slides/20-apigateway.pdf",
    "note": "44 slides · p656-699 of full deck"
   },
   {
    "label": "AWS Docs: API Gateway concepts",
    "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-basic-concept.html",
    "note": "REST vs HTTP vs WebSocket"
   },
   {
    "label": "AWS Docs: API Gateway auth (Lambda authorizer, Cognito)",
    "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html",
    "note": "Cognito pools, IAM, custom authorizers"
   },
   {
    "label": "AWS Docs: API Gateway caching & throttling",
    "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html",
    "note": "Cache, quotas, throttles"
   }
  ],
  "cheatSheet": [
   "Types: REST API (full features, staging, API keys, usage plans), HTTP API (cheaper, simpler, ~50% less latency, native OIDC/OAuth2), WebSocket (persistent 2-way).",
   "Integration types: Lambda proxy (default, pass whole request, Lambda handles mapping) vs custom (VTL mapping templates) vs HTTP vs Mock.",
   "Proxy integration: Lambda receives the raw event incl. method, headers, query params, body; return a properly-shaped response {statusCode, headers, body}.",
   "Auth: IAM (SigV4), Cognito User Pools (token), Lambda authorizer (custom JWT/session), or native OIDC/JWT for HTTP APIs.",
   "Endpoint types: Edge-optimized (CloudFront + global), Regional (same region, use with your own CloudFront), Private (VPC via interface endpoint).",
   "Stages: deploy API to stages (dev/prod), each with its own URL, throttling and cache settings; stage variables like env vars.",
   "Caching: per-stage, per-method cache (default TTL 300s); reduces backend load; remember to flush on deploy.",
   "Throttling: account-level + per-stage + per-method; burst vs steady state; returns 429. Quotas via usage plans + API keys.",
   "Canary deployments per stage (blue/green with % traffic); CloudWatch access logging; X-Ray tracing.",
   "Exam tip: 'expose Lambda via HTTPS with API keys' → REST API + usage plan; 'JWT from OIDC provider' → HTTP API with JWT authorizer; 'real-time chat' → WebSocket."
  ],
  "handsOn": [
   "Create a REST API with a Lambda proxy integration; deploy to 'dev' stage and curl the endpoint.",
   "Add a usage plan + API key; test that requests without the key get 403.",
   "Add Cognito User Pool auth to a method and test a valid token.",
   "Create an HTTP API with a JWT authorizer (test with a dummy JWT).",
   "Set per-stage caching on a method and observe a cache hit via CloudWatch."
  ],
  "questionIds": [
   23,
   35,
   40,
   48,
   53,
   93,
   111,
   125,
   145,
   170,
   174,
   184,
   194,
   204,
   229,
   239,
   254,
   260,
   307,
   314,
   345,
   347,
   365,
   374,
   386,
   410,
   424,
   437,
   448,
   515,
   536,
   551
  ]
 },
 {
  "day": 21,
  "week": 4,
  "title": "API Gateway II — Auth, Caching, Throttling, CORS, OpenAPI, Canary",
  "module": "Amazon API Gateway — Security & Deployment",
  "goal": "Master API Gateway operations — authorizers (IAM/Lambda/Cognito), per-stage caching, throttling & usage plans, CORS, OpenAPI import, and canary releases.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: API Keys Usage Plans",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/API-Keys-Usage-Plans/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Authentication Authorization",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Authentication-Authorization/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Caching",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Caching/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Canary",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Canary/page",
    "note": ""
   },
   {
    "label": "KodeKloud: CORS",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/CORS/page",
    "note": ""
   },
   {
    "label": "KodeKloud: OpenAPI",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/OpenAPI/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Websockets vs REST API",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Websockets-vs-REST-API/page",
    "note": ""
   },
   {
    "label": "KodeKloud: API Keys Usage Plans Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/API-Keys-Usage-Plans-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Authentication Authorization Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Authentication-Authorization-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Caching Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Caching-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Canary Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/Canary-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: OpenAPI Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/API-Gateway/OpenAPI-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Amazon API Gateway",
    "url": "slides/20-apigateway.pdf",
    "note": "44 slides · p656-699 of full deck"
   }
  ],
  "cheatSheet": [
   "Authorizers: IAM (SigV4), Lambda authorizer (token or request — custom logic, cache by TTL), Cognito User Pool. HTTP API also does JWT.",
   "Caching is per-stage (0.5 GB–237 GB), TTL default 300 s, keyed by request params; client can bypass with Cache-Control: max-age=0 (needs permission).",
   "Throttling: account-level 10,000 rps / 5,000 burst by default; per-method limits + Usage Plans + API Keys for per-client quotas/rate.",
   "CORS is enforced by the browser — enable it on the API (OPTIONS preflight + Access-Control-* headers). Common exam trap for 'works in Postman, fails in browser'.",
   "Stages (dev/prod) hold deployments; stage variables parametrize (e.g. Lambda alias). Canary release splits a % of traffic on a stage.",
   "Import/export with OpenAPI (Swagger). Edge-optimized (CloudFront front) vs Regional vs Private endpoints.",
   "Lambda authorizer returns an IAM policy (Allow/Deny) + principalId + optional context; cache the result by token for a TTL to cut authorizer invocations.",
   "Cognito User Pool authorizer validates the pool JWT and rejects at the gateway before your integration ever runs — no custom code.",
   "Mapping templates (VTL) reshape request/response for non-proxy integrations; Lambda-proxy integration passes the raw event through and expects a specific response shape.",
   "Usage Plan + API Key ties a client to a rate/burst/quota; exceeding it returns 429 Too Many Requests."
  ],
  "handsOn": [
   "Add a Lambda authorizer to a method; call with and without a valid token and observe 403 vs 200.",
   "Enable stage caching (TTL 60s); hit an endpoint twice and confirm the second response is served from cache.",
   "Attach a Usage Plan + API Key with a tiny quota; exceed it and confirm the 429 response.",
   "Enable CORS on a resource; call it from a browser page and confirm the OPTIONS preflight succeeds.",
   "Create a canary on the prod stage (10% traffic) pointing at a new Lambda alias, then promote it after checks."
  ],
  "questionIds": [
   24,
   37,
   43,
   49,
   92,
   101,
   124,
   138,
   159,
   171,
   176,
   189,
   198,
   228,
   237,
   243,
   257,
   305,
   308,
   316,
   346,
   362,
   370,
   376,
   397,
   414,
   434,
   443,
   509,
   530,
   538
  ]
 },
 {
  "day": 22,
  "week": 4,
  "title": "Messaging & Orchestration — SQS, SNS, EventBridge, Step Functions",
  "module": "Application Integration",
  "goal": "Master decoupling: SQS queues (visibility timeout, DLQ, FIFO), SNS pub/sub fan-out, EventBridge routing, and Step Functions state machines.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Amazon EventBridge",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/Amazon-EventBridge/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AWS SQS Overview",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/AWS-SQS-Overview/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AWS Step Functions",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/AWS-Step-Functions/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/Exam-TIps/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: SNS Overview",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/SNS-Overview/page",
    "note": ""
   },
   {
    "label": "KodeKloud: SQS Dead Letter Queue",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/SQS-Dead-Letter-Queue/page",
    "note": ""
   },
   {
    "label": "KodeKloud: SQS Settings",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/SQS-Settings/page",
    "note": ""
   },
   {
    "label": "KodeKloud: SQS Settings demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/SQS-Settings-demo/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Amazon EventBridge Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/Amazon-EventBridge-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: AWS Step Functions Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/AWS-Step-Functions-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: SNS Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/SNS-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: SQS Basics Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/SQS-Basics-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: SQS Dead Letter Queue Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Application-Integrations/SQS-Dead-Letter-Queue-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Integration & Messaging — SQS, SNS, Kinesis, Step Functions",
    "url": "slides/16-messaging.pdf",
    "note": "42 slides · p427-468 of full deck"
   },
   {
    "label": "AWS Docs: SQS standard vs FIFO",
    "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-basic-architecture.html",
    "note": "Ordering, exactly-once, DLQ"
   },
   {
    "label": "AWS Docs: SQS visibility timeout",
    "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
    "note": "Message locking mechanics"
   },
   {
    "label": "AWS Docs: SNS + fanout",
    "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-types-of-event-notifications.html",
    "note": "SNS→SQS, Lambda, email"
   }
  ],
  "cheatSheet": [
   "SQS = fully managed message queue. Pull-based (consumers poll). Default retention 4 days (min 1m, max 14d). Message limit 256KB.",
   "Standard queue: at-least-once, best-effort ordering, high throughput. FIFO queue: exactly-once (dedup), strict ordering, limited throughput (300 msg/s/batch).",
   "Visibility timeout: after a consumer receives a message, it's hidden; if the job isn't done before timeout, the message reappears (retry). Set longer than processing time.",
   "Delete after successful processing (DeleteMessage) — otherwise messages are redelivered → make consumers IDEMPOTENT.",
   "Dead Letter Queue (DLQ): after maxReceiveCount, messages move to a DLQ for later analysis. Inspect DLQ → re-drive to main queue.",
   "Long polling (ReceiveMessage with WaitTimeSeconds=20) reduces cost + empty responses; short polling returns immediately (may be empty).",
   "SQS + ASG pattern: queue depth metric (ApproximateNumberOfMessages) drives scaling — decouples producers from consumers.",
   "SNS = pub/sub, PUSH-based. Topics fan out to subscribers: SQS queues, Lambda, HTTP(S), email, SMS, mobile push.",
   "Fan-out: SNS → multiple SQS queues (each service gets its own copy) = reliable multi-subscriber messaging.",
   "SNS supports message filtering (subscription filter policies) and FIFO topics + SQS FIFO for ordering (uses MessageGroupId).",
   "Exam tip: 'send order to multiple downstream systems reliably' → SNS fan-out to SQS. 'duplicates unacceptable + ordering' → SQS FIFO. 'retry failed processing' → DLQ."
  ],
  "handsOn": [
   "Create a standard SQS queue; send 5 messages via CLI; receive them with short and long polling.",
   "Set visibility timeout = 5s; receive a message, wait 8s without deleting, receive again (it reappears).",
   "Configure a DLQ with maxReceiveCount=2; consume a message twice and watch it move to the DLQ.",
   "Create an SNS topic with 2 SQS subscriptions; publish once and confirm both queues got a copy (fan-out).",
   "Build the SNS→SQS→Lambda pattern and log the processed messages."
  ],
  "questionIds": [
   80,
   173,
   185,
   208,
   226,
   259,
   261,
   427,
   435,
   489,
   525,
   540
  ]
 },
 {
  "day": 23,
  "week": 4,
  "title": "Streaming & Analytics — Kinesis, Athena, OpenSearch, MSK",
  "module": "Data Analytics & Streaming",
  "goal": "Understand real-time streaming with Kinesis (Data Streams/Firehose/Analytics), plus Athena, OpenSearch, and MSK for the analytics-flavored exam questions.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Athena",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Data-Analytics/Athena/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Data-Analytics/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Kinesis",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Data-Analytics/Kinesis/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Kinesis Data analytics",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Data-Analytics/Kinesis-Data-analytics/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Kinesis Data Streams",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Data-Analytics/Kinesis-Data-Streams/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Kinesis Firehose",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Data-Analytics/Kinesis-Firehose/page",
    "note": ""
   },
   {
    "label": "KodeKloud: MSK Kafka",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Miscellaneous-Services/MSK-Kafka/page",
    "note": ""
   },
   {
    "label": "KodeKloud: OpenSearch",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Data-Analytics/OpenSearch/page",
    "note": ""
   },
   {
    "label": "KodeKloud: SQS vs SNS vs Kineses",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Data-Analytics/SQS-vs-SNS-vs-Kineses/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Athena Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Data-Analytics/Athena-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Kinesis Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Data-Analytics/Kinesis-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Integration & Messaging — SQS, SNS, Kinesis, Step Functions",
    "url": "slides/16-messaging.pdf",
    "note": "42 slides · p427-468 of full deck"
   },
   {
    "label": "Slides — Advanced & Misc — Nitro, MSK, Macie",
    "url": "slides/27-advanced-misc.pdf",
    "note": "23 slides · p870-892 of full deck"
   },
   {
    "label": "AWS Docs: Kinesis Data Streams basics",
    "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html",
    "note": "Shards, records, retention"
   },
   {
    "label": "AWS Docs: Step Functions concepts",
    "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-overview.html",
    "note": "State machines, states"
   },
   {
    "label": "AWS Docs: Step Functions patterns (sync/async/fan-out)",
    "url": "https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-sync-service.html",
    "note": "Express vs Standard, orchestration"
   }
  ],
  "cheatSheet": [
   "Kinesis Data Streams: real-time streaming, records stored in SHARDS (ordered), retention 24h (default) to 365 days, producers push, consumers pull.",
   "Scaling = add shards (1 shard = 1MB/s write, 2MB/s read). Partition key determines which shard a record goes to (same key = same shard = ordering).",
   "Producers: SDK, Kinesis Producer Library, Kinesis Agent. Consumers: SDK, Lambda (batch by shard), KCL, Firehose.",
   "Kinesis Data Firehose: near-real-time delivery to S3/Redshift/Elasticsearch/Splunk (buffered, ~60s), managed, no shards to manage.",
   "Kinesis Data Analytics: SQL/flink real-time analytics on streams.",
   "Lambda reads streams by shard, in order, processes in batches; errors retry and can BLOCK the shard → set retry/DLQ/on-failure destination.",
   "Step Functions = state machine orchestration (visual workflow) using Amazon States Language (JSON). States: Task, Choice, Wait, Parallel, Map, Pass, Succeed, Fail.",
   "Standard Workflows: long-running (up to 1 yr), exactly-once, auditable. Express Workflows: high-volume, short (up to 5 min), at-least-once.",
   "Use Step Functions to chain Lambda + branching/retries (e.g., order processing, human approval via wait).",
   "Exam tip: 'streaming analytics, must replay 7 days' → Kinesis Data Streams (retention). 'coordinate multiple Lambdas with retries/rollback' → Step Functions. 'decouple and buffer for S3' → Firehose."
  ],
  "handsOn": [
   "Create a Kinesis data stream with 2 shards; PutRecord with a partition key; GetRecords and inspect ordering by key.",
   "Attach a Lambda consumer (batch size, checkpointing) and log records.",
   "Create a Kinesis Firehose delivery stream to S3 and push test data through it.",
   "Build a Step Functions state machine: Choice → (valid order) → Lambda; (invalid) → SNS email + SQS. Run with both payloads.",
   "Add a Wait state and a Map state to fan out over a list."
  ],
  "questionIds": [
   140,
   212,
   364,
   366,
   394,
   504
  ]
 },
 {
  "day": 24,
  "week": 4,
  "title": "Containers on AWS — ECS, ECR, EKS, Fargate",
  "module": "Containers on AWS",
  "goal": "Understand container orchestration on AWS: ECS (Fargate vs EC2), ECR, task definitions, secrets, and EKS basics.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Containers Overview",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Containers-on-AWS/Containers-Overview/page",
    "note": ""
   },
   {
    "label": "KodeKloud: ECR",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Containers-on-AWS/ECR/page",
    "note": ""
   },
   {
    "label": "KodeKloud: ECS Overview",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Containers-on-AWS/ECS-Overview/page",
    "note": ""
   },
   {
    "label": "KodeKloud: EKS Overview",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Containers-on-AWS/EKS-Overview/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Containers-on-AWS/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Updating ECS Task",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Containers-on-AWS/Updating-ECS-Task/page",
    "note": ""
   },
   {
    "label": "KodeKloud: ECR Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Containers-on-AWS/ECR-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: ECS Demo Part 1",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Containers-on-AWS/ECS-Demo-Part-1/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: ECS Demo Part 2",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Containers-on-AWS/ECS-Demo-Part-2/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Updating ECS Task Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Containers-on-AWS/Updating-ECS-Task-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Containers — ECS, ECR, EKS, Fargate",
    "url": "slides/13-containers.pdf",
    "note": "42 slides · p312-353 of full deck"
   },
   {
    "label": "AWS Docs: ECS concepts",
    "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html",
    "note": "Clusters, tasks, services, Fargate"
   },
   {
    "label": "AWS Docs: Task definitions & secrets",
    "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html",
    "note": "secrets, env vars, log config"
   },
   {
    "label": "AWS Docs: ECR basics",
    "url": "https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html",
    "note": "Private/public registries"
   }
  ],
  "cheatSheet": [
   "ECS = managed container orchestration. Two launch types: Fargate (serverless, no EC2 management — recommended) vs EC2 (you manage capacity, more control/cost).",
   "ECS cluster → services (maintain desired task count, integrate with ALB) → tasks (instances of task definitions) → containers.",
   "Task definition (JSON): image, cpu/memory, port mappings, env vars, secrets, volumes, IAM task role, log driver.",
   "ECR = private Docker registry (push/pull with docker login, uses IAM auth token). Image: <account>.dkr.ecr.<region>.amazonaws.com/<repo>:<tag>.",
   "Secrets in ECS: SSM Parameter Store or Secrets Manager values referenced in task definition (not in plaintext env vars).",
   "IAM: task role (what the container can do) vs task execution role (pull image, get secrets, write logs).",
   "ECS service scaling: target tracking on CPU/memory or ALB request count; capacity providers with Fargate.",
   "Deployments: rolling update, blue/green via CodeDeploy; ECS supports 'RunTask' for one-off jobs (with EventBridge scheduling).",
   "EKS = managed Kubernetes control plane (nodes = EC2 or Fargate). If the exam mentions 'Kubernetes' → EKS.",
   "Exam tip: 'run containers without managing servers' → ECS Fargate. 'use Kubernetes API' → EKS. 'store container images privately' → ECR."
  ],
  "handsOn": [
   "Dockerize a tiny web app locally (or use a sample image).",
   "Create an ECR repo, authenticate, push the image.",
   "Create an ECS Fargate cluster + task definition + service with an ALB; deploy and hit the endpoint.",
   "Store a DB password in Secrets Manager and reference it as a secret env var in the task definition.",
   "Scale the service to 3 tasks and confirm the ALB balances; then blue/green deploy a new image tag."
  ],
  "questionIds": [
   25,
   44,
   97,
   177,
   321,
   327,
   478
  ]
 },
 {
  "day": 25,
  "week": 5,
  "title": "Elastic Beanstalk + AWS SAM",
  "module": "Elastic Beanstalk + Serverless Application Model",
  "goal": "Understand Elastic Beanstalk environment tiers and deployment policies, then SAM (serverless CloudFormation) — templates, `sam build/deploy`, and local testing.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Deployment Options",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Beanstalk/Deployment-Options/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Ebextensions",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Beanstalk/Ebextensions/page",
    "note": ""
   },
   {
    "label": "KodeKloud: ebextensions demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Beanstalk/ebextensions-demo/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Elastic BeanStalk Basics",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Beanstalk/Elastic-BeanStalk-Basics/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Elastic Beanstalk Basics demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Beanstalk/Elastic-Beanstalk-Basics-demo/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Beanstalk/Exam-tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless-Application-Model-SAM/Exam-tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Lifecycle Policies",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Beanstalk/Lifecycle-Policies/page",
    "note": ""
   },
   {
    "label": "KodeKloud: SAM Basics",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless-Application-Model-SAM/SAM-Basics/page",
    "note": ""
   },
   {
    "label": "KodeKloud: SAM Policy Templates",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless-Application-Model-SAM/SAM-Policy-Templates/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Beanstalk/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Deployment Modes Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Beanstalk/Deployment-Modes-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Lifecycle Policies Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Beanstalk/Lifecycle-Policies-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: SAM Advanced Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless-Application-Model-SAM/SAM-Advanced-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: SAM Basics Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Serverless-Application-Model-SAM/SAM-Basics-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Elastic Beanstalk",
    "url": "slides/14-beanstalk.pdf",
    "note": "25 slides · p354-378 of full deck"
   },
   {
    "label": "Slides — AWS SAM (Serverless Application Model)",
    "url": "slides/22-sam.pdf",
    "note": "12 slides · p733-744 of full deck"
   },
   {
    "label": "AWS Docs: Elastic Beanstalk concepts",
    "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html",
    "note": "Environment tiers, components"
   },
   {
    "label": "AWS Docs: Deployment policies",
    "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html",
    "note": "All-at-once, rolling, blue/green, immutable"
   },
   {
    "label": "AWS Docs: Beanstalk environments & configuration",
    "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html",
    "note": "EB CLI, .ebextensions"
   }
  ],
  "cheatSheet": [
   "Elastic Beanstalk = PaaS: deploys your app (code+config) onto managed AWS resources (EC2, ALB, ASG, RDS) automatically.",
   "Components: application → environment(s) (dev/prod) → version → configuration; EB handles capacity, health, patching.",
   "Two environment tiers: Web server (with ALB, full-featured) vs Worker (SQS + cron via CloudWatch events → processes jobs).",
   "Deployment policies: All-at-once (fast, downtime), Rolling (replace some instances, keeps capacity), Rolling with additional batch (keeps old capacity), Immutable (new ASG, zero downtime, costlier), Blue/Green (swap environment URL with Route53/CNAME).",
   "Immutable deployments = best for 'zero downtime + rollback'; launches a whole new ASG, health check then swaps.",
   "Blue/green: deploy new version to a separate 'green' environment, then flip the CNAME/Route53 alias — instant rollback by flipping back.",
   "RDS inside Beanstalk: lifecycle tied to environment (deleted with env) — best practice: launch RDS separately and reference via env vars.",
   "Configuration: environment properties (env vars), .ebextensions (YAML, e.g., install packages, create files), EB CLI (eb deploy/status).",
   "Canary testing: Beanstalk supports load balancer canary (gradual % of traffic to new version) via configuration.",
   "Exam tip: 'zero downtime + ability to keep both versions' → blue/green. 'quickest' → all-at-once. 'no downtime, new ASG' → immutable."
  ],
  "handsOn": [
   "Create a simple Node/Python app and deploy it to Elastic Beanstalk with eb init && eb create.",
   "Change a version and deploy with 'immutable' policy; observe the new ASG during deploy.",
   "Add an environment property (e.g., DB_URL) and read it in code.",
   "Set up a blue/green swap: create a second environment, deploy new code, flip the CNAME.",
   "Add an .ebextensions config file (e.g., install nginx extra package) and redeploy."
  ],
  "questionIds": [
   12,
   33,
   70,
   118,
   166,
   232,
   369,
   421,
   422,
   453,
   511,
   532
  ]
 },
 {
  "day": 26,
  "week": 5,
  "title": "Infrastructure as Code — CloudFormation + CDK",
  "module": "AWS CloudFormation & CDK",
  "goal": "Master CloudFormation template anatomy, intrinsic functions, stacks/drift/nested stacks and change sets — then how the CDK synthesizes to it.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: AWS CDK",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-CDK/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AWS CloudFormation",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-CloudFormation/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AWS CDK Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-CDK-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: AWS CloudFormation Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Fundamentals/AWS-CloudFormation-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — AWS CloudFormation",
    "url": "slides/15-cloudformation.pdf",
    "note": "48 slides · p379-426 of full deck"
   },
   {
    "label": "Slides — AWS CDK (Cloud Development Kit)",
    "url": "slides/23-cdk.pdf",
    "note": "12 slides · p745-756 of full deck"
   },
   {
    "label": "AWS Docs: CloudFormation template reference",
    "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html",
    "note": "Sections + functions"
   },
   {
    "label": "AWS Docs: CloudFormation intrinsic functions",
    "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html",
    "note": "Ref, Fn::GetAtt, Fn::Sub, Fn::If..."
   },
   {
    "label": "AWS Docs: stack updates & drift",
    "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html",
    "note": "Change sets, drift detection"
   }
  ],
  "cheatSheet": [
   "CloudFormation = IaC: templates (YAML/JSON) define resources; a STACK is the collection created from a template. Updates = new stack operation.",
   "Template sections: Parameters, Mappings, Conditions, Resources (REQUIRED), Outputs, Metadata, Transform.",
   "Parameters: let users pass values (e.g., InstanceType with allowed values, NoEcho for passwords, Type: AWS::EC2::KeyPair::KeyName).",
   "Conditions (Fn::If, Condition) control whether resources are created (e.g., create prod resources only if Env=prod).",
   "Outputs: export values for cross-stack references (Fn::ImportValue) — careful: can't delete a stack whose output is imported elsewhere.",
   "Key intrinsic functions: Ref (returns value or physical ID), Fn::GetAtt (attribute), Fn::Sub (string substitution with ${}), Fn::Join, Fn::FindInMap, Fn::GetAZs.",
   "Change sets: preview what a stack update will change before applying — no risk. Drift detection: detect manual changes vs template.",
   "Update behaviors: UPDATE_WITHOUT_INTERRUPTION (e.g., SG), UPDATE_WITH_INTERRUPTION (e.g., EBS), REPLACE (e.g., instance with immutable attrs).",
   "Stack sets: deploy identical stacks across multiple accounts/regions (used by control towers).",
   "Nested stacks: compose stacks referencing other templates via Stack resource; 'service catalog' for reusable blueprints.",
   "Deletion policy: Retain/Delete/Snapshot decides what happens to resources when the stack is deleted.",
   "Exam tip: 'reuse the same infra in many accounts/regions' → stack sets. 'test the change before applying' → change sets. 'define params when launching' → Parameters."
  ],
  "handsOn": [
   "Write a template creating an S3 bucket + an EC2 instance with Parameters and Outputs; deploy with aws cloudformation create-stack.",
   "Add a Condition that creates a bucket only when Env=prod; redeploy with a param change.",
   "Create a change set and review the planned changes before executing.",
   "Modify a resource directly in the console, run drift detection, and see the drift.",
   "Create a nested stack (parent references a child template) and verify both stacks."
  ],
  "questionIds": [
   10,
   19,
   28,
   54,
   64,
   75,
   95,
   98,
   108,
   120,
   123,
   142,
   169,
   182,
   209,
   230,
   233,
   234,
   240,
   249,
   266,
   268,
   283,
   290,
   298,
   313,
   317,
   323,
   326,
   338,
   396,
   399,
   403,
   423,
   477,
   508,
   537
  ]
 },
 {
  "day": 27,
  "week": 5,
  "title": "CI/CD Developer Tools — CodeCommit, CodeBuild, CodeDeploy, CodePipeline",
  "module": "AWS CI/CD Suite",
  "goal": "Understand the AWS CI/CD suite and CodeDeploy lifecycle hooks — a guaranteed area on the exam.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: Amplify",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/Amplify/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Cloud9",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/Cloud9/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Code Artifact",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/Code-Artifact/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Code Whisperer",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/Code-Whisperer/page",
    "note": ""
   },
   {
    "label": "KodeKloud: CodeBuild",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodeBuild/page",
    "note": ""
   },
   {
    "label": "KodeKloud: CodeCommit",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodeCommit/page",
    "note": ""
   },
   {
    "label": "KodeKloud: CodeDeploy",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodeDeploy/page",
    "note": ""
   },
   {
    "label": "KodeKloud: CodeGuru",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodeGuru/page",
    "note": ""
   },
   {
    "label": "KodeKloud: CodePipeline",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodePipeline/page",
    "note": ""
   },
   {
    "label": "KodeKloud: CodeStar",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodeStar/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Cloud9 Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/Cloud9-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: CodeBuild Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodeBuild-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: CodeCommit Demo part 1",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodeCommit-Demo-part-1/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: CodeCommit Demo part 2",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodeCommit-Demo-part-2/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: CodeDeploy Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodeDeploy-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: CodeDeploy with codepipeline Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodeDeploy-with-codepipeline-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: CodePipeline Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-CICD-Developer-Tools/CodePipeline-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — CI/CD — CodeCommit, CodeBuild, CodeDeploy, CodePipeline",
    "url": "slides/21-cicd.pdf",
    "note": "33 slides · p700-732 of full deck"
   },
   {
    "label": "AWS Docs: CodePipeline overview",
    "url": "https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html",
    "note": "Stages, actions, transitions"
   },
   {
    "label": "AWS Docs: CodeBuild concepts",
    "url": "https://docs.aws.amazon.com/codebuild/latest/userguide/concepts.html",
    "note": "buildspec.yml"
   },
   {
    "label": "AWS Docs: CodeDeploy AppSpec + hooks",
    "url": "https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html",
    "note": "Hook order — exam favourite"
   },
   {
    "label": "AWS Docs: CodeCommit basics",
    "url": "https://docs.aws.amazon.com/codecommit/latest/userguide/welcome.html",
    "note": "Managed git repos"
   }
  ],
  "cheatSheet": [
   "CodeCommit = managed Git (private repos, IAM auth, integrates with CodePipeline).",
   "CodeBuild = build service (compile, test, package) using buildspec.yml (phases: install, pre_build, build, post_build; artifacts).",
   "CodeDeploy = deploy to EC2/on-prem (agent) or Lambda/ECS. In-place vs Blue/green deployments.",
   "AppSpec (appssepec.yml) defines files + hooks. For EC2/on-prem: hooks in order — BeforeInstall → AfterInstall → ApplicationStart → ValidateService (also BeforeAllowTraffic, AfterAllowTraffic for LB).",
   "CodeDeploy hook order (EC2 in-place, memorise): ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService.",
   "CodeDeploy deployments: All-at-once, Half-at-a-time, One-at-a-time, Blue/Green; rollback triggers on failed instance health.",
   "CodePipeline = orchestration: Source (CodeCommit/S3/GitHub) → Build (CodeBuild) → Deploy (CodeDeploy/EB/CFN) with manual approval stages.",
   "Pipeline stages: Source, Build, Test, Deploy, Invoke (Lambda), Approval. Artifacts stored in S3.",
   "Lambda can be a pipeline stage (e.g., run a migration); approval actions need IAM permission to 'approve'.",
   "Exam tip: 'run unit tests then deploy on commit' → CodePipeline; 'order of hooks for in-place' → ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService."
  ],
  "handsOn": [
   "Create a CodeCommit repo, push code, set up a CodeBuild project with buildspec.yml that runs a test and packages.",
   "Build a CodePipeline: CodeCommit → CodeBuild → CodeDeploy to EC2 (in-place with LB).",
   "Read the CodeDeploy hook order docs and write an appspec.yml with all EC2 hooks.",
   "Add a manual approval stage to the pipeline and approve it from the console.",
   "Trigger a rollback by failing ValidateService and observe the automatic rollback."
  ],
  "questionIds": [
   42,
   47,
   59,
   84,
   86,
   122,
   157,
   160,
   163,
   225,
   263,
   272,
   325,
   331,
   348,
   349,
   357,
   385,
   390,
   418,
   426,
   480,
   505,
   507,
   518,
   531
  ]
 },
 {
  "day": 28,
  "week": 5,
  "title": "Security — KMS, Secrets Manager, SSM Parameter Store, Cognito, ACM, WAF",
  "module": "AWS Security Services",
  "goal": "Master KMS keys/encryption SDK, SSM Parameter Store vs Secrets Manager, and Cognito user/identity pools — the Security domain backbone.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: ACM",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/ACM/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AppConfig",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Miscellaneous-Services/AppConfig/page",
    "note": ""
   },
   {
    "label": "KodeKloud: AWS Systems Manager",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Miscellaneous-Services/AWS-Systems-Manager/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Cognito",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/Cognito/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: KMSKey Management Service",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/KMSKey-Management-Service/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Parameter Store",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/Parameter-Store/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Secrets Manager",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/Secrets-Manager/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Miscellaneous-Services/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: WAF",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/WAF/page",
    "note": ""
   },
   {
    "label": "KodeKloud: ACM Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/ACM-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: AWS Systems Manager Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Miscellaneous-Services/AWS-Systems-Manager-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Cognito Identity Pool Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/Cognito-Identity-Pool-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Cognito User Pool Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/Cognito-User-Pool-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: KMS Basics Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/KMS-Basics-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: KMS Encryption SDK Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/KMS-Encryption-SDK-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: KMS Envelope Encryption Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/KMS-Envelope-Encryption-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Parameter Store Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/Parameter-Store-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "KodeKloud: Secrets Manager Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Security/Secrets-Manager-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Amazon Cognito",
    "url": "slides/24-cognito.pdf",
    "note": "48 slides · p757-804 of full deck"
   },
   {
    "label": "Slides — Security & Encryption — KMS, CloudHSM, SSM, Secrets Manager",
    "url": "slides/26-security.pdf",
    "note": "44 slides · p826-869 of full deck"
   },
   {
    "label": "AWS Docs: KMS concepts",
    "url": "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html",
    "note": "CMKs, envelope encryption, key rotation"
   },
   {
    "label": "AWS Docs: SSM Parameter Store",
    "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html",
    "note": "Standard vs SecureString"
   },
   {
    "label": "AWS Docs: Secrets Manager",
    "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html",
    "note": "Rotation, RDS creds"
   },
   {
    "label": "AWS Docs: Cognito pools",
    "url": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html",
    "note": "User pools + identity pools"
   }
  ],
  "cheatSheet": [
   "KMS: managed keys (CMKs). Envelope encryption: data key encrypts data, KMS encrypts data key. Decrypt/encrypt ≤4KB per call.",
   "KMS keys: AWS managed (service-managed), customer managed (you control rotation/policy/alias), AWS-owned. Enable automatic key rotation (annual for CMKs).",
   "KMS grants + key policies (resource policies) control who can use the key; key material can be imported or generated in HSMs.",
   "SSM Parameter Store: store config + secrets; types Standard (4KB) / Advanced (8KB) / SecureString (encrypted w/ KMS); hierarchical paths /app/db/password; free.",
   "Secrets Manager: for RDS/DB credentials with AUTOMATIC ROTATION (integration with RDS, 30-day default), IAM-based retrieval, ~$0.40/secret/month.",
   "Choose: Parameter Store (config, many free values, SecureString for secrets) vs Secrets Manager (rotating DB passwords, secrets lifecycle).",
   "AWS Encryption SDK: client-side encryption library with envelope encryption + data key caching (for data larger than 4KB).",
   "Cognito User Pools = identity provider/directory (sign-up, sign-in, MFA, forgot password, user groups, app clients).",
   "Cognito Identity Pools = federated identities (get AWS credentials via STS for authenticated/guest users) → access S3/DynamoDB with limited IAM roles.",
   "User pool auth flows: SRP (secure remote password), refresh tokens (30min default), OAuth2/OIDC, social IdPs (Google/Facebook/Amazon).",
   "Exam tip: 'store DB creds, must rotate automatically' → Secrets Manager. 'free config + some secrets' → Parameter Store SecureString. 'give mobile users AWS access' → Identity Pool."
  ],
  "handsOn": [
   "Create a customer-managed KMS key; encrypt and decrypt a small file with the CLI (aws kms encrypt/decrypt).",
   "Store a value in SSM Parameter Store as Standard and SecureString; retrieve with aws ssm get-parameter --with-decryption.",
   "Store a fake DB password in Secrets Manager, enable rotation (or read rotation docs), retrieve via SDK.",
   "Create a Cognito User Pool + an app client; sign up and confirm a test user; get tokens.",
   "Create an Identity Pool, attach a role allowing S3 GetObject only in a /<userid>/ folder, and map a user pool token → temp credentials."
  ],
  "questionIds": [
   62,
   180,
   217,
   224,
   227,
   270,
   303,
   388,
   404,
   411,
   501
  ]
 },
 {
  "day": 29,
  "week": 5,
  "title": "Monitoring & Troubleshooting — CloudWatch, X-Ray, CloudTrail, Optimization",
  "module": "Monitoring, Troubleshooting & Optimization",
  "goal": "Master observability (CloudWatch metrics/logs/alarms, X-Ray tracing, CloudTrail audit) and the Troubleshooting & Optimization domain — retries, backoff, throttling.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "KodeKloud: CloudTrail",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Monitoring/CloudTrail/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Cloudwatch Alarm",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Monitoring/Cloudwatch-Alarm/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Cloudwatch Basics",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Monitoring/Cloudwatch-Basics/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Conclusion",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Conclusion/Conclusion/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Exam Tips",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Monitoring/Exam-Tips/page",
    "note": ""
   },
   {
    "label": "KodeKloud: Section Introduction",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Monitoring/Section-Introduction/page",
    "note": ""
   },
   {
    "label": "KodeKloud: CloudTrail Demo",
    "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/AWS-Monitoring/CloudTrail-Demo/page",
    "note": "(demo — follow along)"
   },
   {
    "label": "Slides — Monitoring — CloudWatch, X-Ray, CloudTrail",
    "url": "slides/17-monitoring.pdf",
    "note": "58 slides · p469-526 of full deck"
   },
   {
    "label": "AWS Docs: CloudWatch Logs",
    "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html",
    "note": "Log groups, streams, filters"
   },
   {
    "label": "AWS Docs: X-Ray overview",
    "url": "https://docs.aws.amazon.com/xray/latest/devguide/xray-services.html",
    "note": "Trace segments, service maps"
   },
   {
    "label": "AWS Docs: CloudTrail basics",
    "url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
    "note": "API activity audit"
   },
   {
    "label": "AWS Docs: Error retries & exponential backoff",
    "url": "https://docs.aws.amazon.com/general/latest/gr/api-retries.html",
    "note": "SDK default retries"
   },
   {
    "label": "AWS Docs: AWS SDK best practices",
    "url": "https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-sdk-best-practices.html",
    "note": "Reuse clients, keep-alive, exponential backoff"
   },
   {
    "label": "AWS Docs: Lambda errors & throttling",
    "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html",
    "note": "Async retries, DLQ, on-failure destinations"
   }
  ],
  "cheatSheet": [
   "CloudWatch Metrics: default service metrics (CPUUtilization, requests...); custom metrics via PutMetricData; standard 1-min resolution, detailed 1-sec.",
   "CloudWatch Logs: applications stream logs to log GROUPS (per app/service), log streams (per instance/source); subscribe to S3/Kinesis/Lambda; real-time filters to S3 via subscription filter.",
   "CloudWatch Alarms: trigger actions (EC2 stop/terminate/reboot, ASG scale, SNS) when a metric crosses a threshold for N periods.",
   "CloudWatch Events/EventBridge: near-real-time events (EC2 state changes, CodeDeploy, scheduled cron) → targets (Lambda, SNS, SQS, Step Functions, EC2).",
   "Lambda logs go to CloudWatch Logs automatically (log group /aws/lambda/<name>); use print/log statements.",
   "X-Ray = distributed tracing across Lambda, API Gateway, EC2 apps, DynamoDB: trace segments → service map + trace timeline. SDK auto-instrumented in Lambda/API GW.",
   "X-Ray needs: X-Ray SDK in your code (or auto-instrumentation), X-Ray daemon on EC2 (or AWS_XRAY env var on Lambda), IAM permissions + tracing enabled (sampling).",
   "X-Ray annotations (indexed for filters) vs metadata (non-indexed). Trace headers propagate via HTTP (X-Amzn-Trace-Id).",
   "CloudTrail = audit log of ALL API calls (who, when, from where, which API) — enabled by default, management events 90 days; create a trail to S3 for long-term.",
   "Exam tip: 'find which IAM user made a delete call' → CloudTrail. 'find why Lambda is slow across services' → X-Ray. 'react to an EC2 state change' → EventBridge.",
   "Throttling (429, LimitExceeded, ProvisionedThroughputExceeded): always implement exponential backoff + jitter; AWS SDKs retry by default.",
   "SDK client best practices: create ONE client and reuse (connection pooling); enable keep-alive; tune timeouts; batch calls.",
   "DynamoDB: ProvisionedThroughputExceeded → backoff + retry, or use on-demand, or DAX for reads. BatchGetItem returns UnprocessedKeys → retry those (never resend all).",
   "SQS: use long polling; consumers must handle duplicate delivery (at-least-once) → idempotency.",
   "Lambda async: 2 retries (0 then 2 more over 6h window); use DLQ (SQS/SNS) or on-failure destination to capture errors.",
   "Lambda streams (DDB/Kinesis): whole batch retried until success → keep functions idempotent; errors block shard → set max retries + bisect batch + on-failure.",
   "Timeouts: set Lambda timeout & API Gateway integration timeout appropriately; DB connections → RDS Proxy / connection pool to avoid 'too many connections'.",
   "Cold starts: provisioned concurrency, reduce package size, avoid heavy imports at module load.",
   "Cost levers: reserved capacity (DDB), Spot for stateless EC2, storage classes for S3, cache to reduce DB reads.",
   "Performance levers: CloudFront for static, DAX for hot reads, read replicas, provisioned IOPS, EBS gp3 vs io2.",
   "Exam tip: 'batch API returning unprocessed keys' → retry only unprocessed. 'EC2 reaching S3 gets 503 SlowDown' → exponential backoff. 'lambda fails mid-batch of stream' → whole batch retried, block shard."
  ],
  "handsOn": [
   "Create a CloudWatch alarm on EC2 CPUUtilization > 80% → SNS email.",
   "Add structured logging to a Lambda (print/json) and explore the log group, stream, and a metric filter.",
   "Enable X-Ray on an API Gateway + Lambda and view the trace + service map in the console.",
   "Put a custom metric (PutMetricData) and view it on a dashboard.",
   "Check CloudTrail events for your own recent actions (create-bucket, etc.) and search by user/event.",
   "Write a script that calls DynamoDB with a tiny provisioned capacity to force throttling; observe 400s/ProvisionedThroughputExceeded.",
   "Implement manual exponential backoff (+jitter) around the call and confirm success.",
   "Use SDK BatchGetItem with an oversized batch; retry only the UnprocessedKeys and confirm all items returned.",
   "Trigger a Lambda async failure and confirm it retries twice then lands in the DLQ.",
   "Test a slow DB call with RDS Proxy vs direct and compare connection errors under load."
  ],
  "questionIds": [
   73,
   130,
   136,
   139,
   152,
   158,
   199,
   211,
   220,
   250,
   258,
   282,
   287,
   311,
   340,
   391,
   392,
   449,
   454,
   460,
   486,
   492,
   502,
   512,
   520,
   523,
   529,
   544
  ]
 },
 {
  "day": 30,
  "week": 5,
  "title": "Mock Exams + Exam-Day Cheat Sheet + Final Strategy",
  "module": "Final Review & Practice",
  "goal": "Two timed 65-question mocks, targeted weak-area review, and consolidation of the exam-day cheat sheet and test-taking strategy.",
  "minutes": 120,
  "session": {
   "study": 45,
   "questions": 30,
   "handsOn": 25,
   "review": 20
  },
  "studyLinks": [
   {
    "label": "Slides — Exam Prep & Whitepapers",
    "url": "slides/28-exam-prep.pdf",
    "note": "12 slides · p893-904 of full deck"
   },
   {
    "label": "Slides — Conclusion & Next Steps",
    "url": "slides/29-conclusion.pdf",
    "note": "3 slides · p905-907 of full deck"
   },
   {
    "label": "AWS IAM docs: Best Practices",
    "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
    "note": "15 IAM best practices"
   },
   {
    "label": "Use the Questions tab (all 50 available questions)",
    "url": "",
    "note": "Timed: 2 min/question max"
   },
   {
    "label": "Official exam guide (domains & weights)",
    "url": "https://d1.awsstatic.com/training-and-certification/docs-dev-associate/AWS-Certified-Developer-Associate_Exam-Guide.pdf",
    "note": "Review domain bullets"
   },
   {
    "label": "Re-skim cheat sheets of weak days",
    "url": "",
    "note": "Focus on flagged topics"
   },
   {
    "label": "Re-do the 50-question bank once more (timed)",
    "url": "",
    "note": "Aim 90%+ accuracy"
   },
   {
    "label": "AWS Certified Developer Associate exam page",
    "url": "https://aws.amazon.com/certification/certified-developer-associate/",
    "note": "Check current exam details/scheduling"
   },
   {
    "label": "Final skim: all 30 day cheat sheets",
    "url": "",
    "note": "Last pass the night before"
   }
  ],
  "cheatSheet": [
   "Restate the mnemonic: instance families and pricing models in one line each.",
   "Restate shared responsibility split for EC2 vs S3 vs Lambda.",
   "Restate: IAM is global; policies attach to groups/users/roles; explicit deny > allow.",
   "Restate: EBS=block/1 AZ, EFS=file/multi-AZ, Instance Store=ephemeral, S3=object.",
   "Restate credentials precedence and the 'no keys in code' rule.",
   "Write down any concept you keep forgetting as a sticky note for your final review.",
   "Strategy: answer every question; skip-tag hard ones and return; use elimination aggressively.",
   "Keyword triggers: 'LEAST management overhead' → managed/service (Lambda, RDS, Fargate); 'LEAST cost' → cheaper/spot/on-demand; 'SECURITY' → KMS/Secrets/IAM roles.",
   "Read the LAST sentence first — the constraint (e.g., 'without code changes', 'multi-account', 'zero downtime') is usually the deciding factor.",
   "Two answers often differ only by one word (e.g., 'Secrets Manager' vs 'Parameter Store') — recall the deciding feature (rotation).",
   "Domain 1 Development (32%): Lambda, API GW, DDB, S3, CLI/SDK, X-Ray. Domain 2 Security (26%): IAM, KMS, SSM, Secrets, Cognito, S3/CORS/encryption.",
   "Domain 3 Deployment (24%): Beanstalk, CloudFormation, CI/CD, containers, deployments. Domain 4 Troubleshooting (18%): retries, throttling, logs, CloudWatch/X-Ray/CloudTrail.",
   "Marks: 65 questions, no negative marking — never leave a question blank.",
   "The night before: sleep > revise. Morning of: light review of THIS cheat sheet only.",
   "IAM: never keys in code → roles; explicit deny wins; STS temp creds; PassRole.",
   "Storage: EBS block/1 AZ (snapshots to S3); EFS NFS multi-instance; instance store ephemeral; S3 object + classes + versioning + presigned URLs.",
   "Serverless: Lambda stateless, /tmp + 15min timeout + versions/aliases + provisioned concurrency; API GW proxy/auth/caching/throttling.",
   "Data: DynamoDB partition+sort key, RCU/WCU, GSI/LSI, streams/TTL/transactions/DAX; RDS multi-AZ vs replicas; Aurora storage + serverless + Proxy.",
   "Messaging: SQS pull + visibility timeout + DLQ + FIFO; SNS push fan-out; Kinesis shards; Step Functions orchestration.",
   "Deployment: CloudFormation change sets/drift/stack sets; Beanstalk deployment policies (immutable/blue-green); CodePipeline+CodeDeploy hook order.",
   "Security: KMS envelope encryption + 4KB limit; Secrets Manager rotation vs Parameter Store SecureString; Cognito user pool (auth) vs identity pool (AWS creds).",
   "Monitoring: CloudWatch logs/metrics/alarms; X-Ray traces; CloudTrail API audit; EventBridge reactions.",
   "Troubleshooting: exponential backoff + jitter; retry UnprocessedKeys; idempotency; Lambda async DLQ; RDS Proxy for connections.",
   "Time management: 130 min / 65 questions ≈ 2 min each; flag and return; answer every question.",
   "Get 8-10 hours of sleep, bring water + ID, and arrive early."
  ],
  "handsOn": [
   "Lab: launch an EC2 with an instance role (S3 read-only), user-data installs nginx, EFS mounted, EBS data volume.",
   "Verify: instance can aws s3 ls, nginx serves a page, file written on EBS survives stop/start, EFS shared with a second instance.",
   "Run the week's 20 practice questions in the Questions tab, flag every wrong one.",
   "Write 3 flashcards from each wrong answer's explanation.",
   "Delete all test resources at the end (avoid charges).",
   "Read each wrong answer's explanation and write ONE flashcard.",
   "Re-do the failed domain's day tabs (Study + Questions) tomorrow.",
   "Take a 10-min break mid-mock to mimic exam pacing.",
   "Book/schedule your exam session (online or test center).",
   "Test your computer/space for the online exam (camera, quiet room, ID).",
   "Print or save this day's cheat sheet as your single last-minute review page.",
   "Re-run the 50 questions once more at 90%+ accuracy as a confidence boost."
  ],
  "questionIds": [
   76,
   134,
   222,
   334,
   402,
   458,
   500
  ]
 }
];
