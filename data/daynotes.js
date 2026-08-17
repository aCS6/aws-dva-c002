/* Original, condensed, exam-focused study notes for the 30-day DVA-C02 plan.
   Authored from scratch — plain-language summaries with memory triggers,
   not copied from any external material. */
window.DVA_DAYNOTES = {
  "1": {
    "title": "AWS Fundamentals & Getting Started",
    "intro": "AWS is just a lot of regional data centers with APIs on top. Get the vocabulary right and most questions become about which service fits a scenario.",
    "mustKnow": [
      "Region = a physical location with 3+ AZs; an AZ = 1+ data centers; data stays in the region you pick.",
      "Always pick the region nearest users or where compliance demands it — 'latency vs regulations' is the classic trade-off.",
      "Global services (no region): IAM, Route 53, CloudFront, WAF. Everything else is regional.",
      "Edge locations run CloudFront and Route 53 — cache content closer to users, not for running apps.",
      "Shared Responsibility: AWS secures the cloud (hardware, hypervisor, physical), you secure what's in it (IAM, data, OS config).",
      "Support plans: Basic (free, forums only), Developer, Business (trusted advisor, faster SLAs), Enterprise (TAM, design reviews).",
      "Cost controls: Budgets + billing alarms on a root-account email to avoid surprise bills."
    ],
    "triggers": [
      "Question asks 'who is responsible for X' → if it's hardware/AZ/regions, it's AWS; if it's your data/IAM/keys, it's you.",
      "Two services with the same feature → pick the one matching 'latency for global users' (CloudFront) vs 'authoritative DNS' (Route 53).",
      "Scenario mentions 'compliance requires data in Germany' → pick eu-central-1 (Frankfurt)."
    ],
    "table": [
      ["Concept", "Meaning"],
      ["Region", "A cluster of AZs in one geography"],
      ["AZ", "One isolated data-center group (3+ per region)"],
      ["Edge location", "CDN/DNS cache point, not compute"],
      ["Global services", "IAM, Route 53, CloudFront, WAF"]
    ]
  },
  "2": {
    "title": "IAM — Users, Groups, Policies",
    "intro": "IAM answers one question: who can do what, and prove it. Nine out of ten IAM questions are about roles vs keys or explicit deny.",
    "mustKnow": [
      "Users = one human or app; Groups = a named set of users; Policies = the JSON permission rules; Roles = temporary power to assume.",
      "A policy statement has Effect (Allow/Deny), Action, Resource, and optionally Condition.",
      "Explicit Deny always wins over Allow — even an Admin's allow loses to a deny.",
      "IAM is global and free; everything is managed with JSON policies, never hand-edited inline if avoidable.",
      "Access keys (access key ID + secret) are only for CLI/SDK access. Never bake them into code — use roles or secrets.",
      "MFA for everyone, especially the root account; password policy + MFA on the CLI via STS tokens.",
      "Least privilege: grant only what a user needs, not admin-by-default."
    ],
    "triggers": [
      "'User can do everything except delete buckets' → explicit Deny on s3:DeleteBucket beats the Allow all.",
      "App on EC2 needs S3 → don't put keys in the image; attach an IAM role (instance profile).",
      "Question mentions temporary, revocable, scoped-down access → think role + STS, not a long-lived user/keys.",
      "'Which policy design is cleanest' → attach policies to groups, not individual users."
    ],
    "table": [
      ["Entity", "When you want"],
      ["User", "A fixed identity for one person or app"],
      ["Group", "Same permissions for a team of users"],
      ["Role", "Temporary, assumed access (services, cross-account)"],
      ["Policy", "The rule that says Allow/Deny"]
    ]
  },
  "3": {
    "title": "IAM Advanced — Roles, STS, PassRole, Policy Evaluation",
    "intro": "The trick is remembering roles are assumed, not assigned — and that permissions are decided by policy evaluation logic, not by intuition.",
    "mustKnow": [
      "Roles: an identity you assume via STS AssumeRole to get temporary credentials (15 min to 12 h).",
      "Two role types matter: service roles (EC2 instance profile, Lambda execution role) and cross-account roles.",
      "Trust policy = who may assume the role; permissions policy = what they may do after assuming.",
      "PassRole: lets a service use a role you created (e.g., EC2 passing a role to an instance). Without PassRole permission, launch fails.",
      "Policy evaluation: explicit Deny → end (deny); else explicit Allow → allow; else default deny. Boundaries & SCPs add extra layers.",
      "Policy boundaries cap a user/role's max permissions but don't grant anything by themselves.",
      "Condition keys (aws:SourceIp, aws:PrincipalArn, time) make policies context-aware."
    ],
    "triggers": [
      "EC2 instance needs to call S3 → instance profile attached to the instance at launch.",
      "Cross-account access without keys → a role in the target account + trust policy from the source.",
      "'Which IAM role can be assumed by EC2' → the one with the matching trust policy for ec2.amazonaws.com.",
      "Lambda needs to write logs → execution role with cloudwatch:PutLogEvents + logs:CreateLogStream.",
      "'Role assumed, then something still denied' → check the permissions policy AND the boundary, then any SCP."
    ],
    "table": [
      ["Concept", "One-line meaning"],
      ["Trust policy", "Who is allowed to assume the role"],
      ["Permissions policy", "What the role can do once assumed"],
      ["PassRole", "Permission to hand a role to a service"],
      ["Policy boundary", "Ceiling on permissions, grants nothing"]
    ]
  },
  "4": {
    "title": "EC2 Basics",
    "intro": "EC2 is a VM on demand. Exams reward knowing the instance-type alphabet, the buying models, and that security groups are stateful firewalls.",
    "mustKnow": [
      "Instance type mnemonic: a(rm/m) = general, c = compute, r = RAM, m = memory-balanced, g = GPU, t = burstable (t2/t3/t4g).",
      "Purchase options: On-Demand (flexible, most expensive), Reserved (1-3 yr commitment, big discount), Spot (up to 90% off, can be reclaimed in 2 min), Savings Plans, Dedicated Host.",
      "Security groups are stateful — return traffic is auto-allowed; they only contain Allow rules; they attach at the instance (or ENI) level.",
      "User data runs once at first launch (bootstrap). Useful for installing packages or pulling config.",
      "Placement groups: spread (small, HA), partition (map-reduce style isolation), cluster (low latency, same rack).",
      "Elastic IPs are static public IPs; better design: ALB + no public IPs at all.",
      "Hibernation keeps RAM state but is limited; stop vs terminate: stopped keeps EBS, terminated deletes it."
    ],
    "triggers": [
      "Inbound works but outbound to your app is blocked → it's a NACL or SG issue; SGs are stateful so outbound usually auto-OK on the response.",
      "'Cheapest way to run a batch job that can be interrupted' → Spot.",
      "'Predictable 3-year production load' → Reserved or Savings Plan.",
      "Instance boots, user-data script didn't run on restart → user data runs only on first launch; use a systemd service or cloud-init for repeats."
    ],
    "table": [
      ["Option", "Trade-off"],
      ["On-Demand", "No commitment, highest cost"],
      ["Reserved", "Commit 1-3y for 30-60% off"],
      ["Spot", "Biggest discount, interruptible"],
      ["Savings Plan", "Commit $/hr across compute"],
      ["Dedicated Host", "Bring-your-own-license, isolation"]
    ]
  },
  "5": {
    "title": "EC2 Instance Storage — EBS, Snapshots, AMI, Instance Store",
    "intro": "Pick-the-disk is a favorite topic. The whole game is knowing which volume type fits the workload and whether data survives a stop.",
    "mustKnow": [
      "EBS = network-attached block storage that survives instance stop/terminate (unless DeleteOnTermination=true).",
      "gp2/gp3 = general SSD (gp3 = fixed 3k IOPS baseline, cheaper); io1/io2 = high-IOPS SSD (DBs); st1/sc1 = HDD throughput/cold, only for big sequential.",
      "Volumes live in one AZ — you can't attach an EBS from AZ-A to an instance in AZ-B.",
      "Snapshots are AZ-independent, stored in S3, incremental; restore by creating a volume from the snapshot.",
      "AMI = registered snapshot + block-device mapping; shared across accounts to clone setups.",
      "Instance Store = ephemeral, physically attached, fast, but wiped on stop/terminate — never for durable data.",
      "Multi-Attach (io1/io2 only) lets several Nitro instances share one volume for clustered apps.",
      "EBS encryption: can encrypt at rest via AWS-managed KMS key or your own; snapshots inherit encryption."
    ],
    "triggers": [
      "'Must survive instance reboot AND termination' → EBS.",
      "'Database needs 50k IOPS, low latency' → io1/io2.",
      "'Cheap bulk log storage, sequential' → st1/sc1 HDD.",
      "'Fast but data lost if instance stops' → instance store (becomes a trap question on purpose).",
      "Move a volume to another AZ → snapshot first, then create the new volume in the target AZ."
    ],
    "table": [
      ["Type", "Use for"],
      ["gp2/gp3", "General-purpose boot + apps"],
      ["io1/io2", "High IOPS DBs, latency-sensitive"],
      ["st1/sc1", "Big sequential data, cost-driven"],
      ["Instance Store", "Cache/scratch, never durable"],
      ["Snapshots", "Backup + AMI source, in S3"]
    ]
  },
  "6": {
    "title": "EFS & Shared Storage + AWS CLI/SDK Setup",
    "intro": "Two unrelated things that pair well: a POSIX file system that scales, and the credentials chain that makes the CLI 'just work'.",
    "mustKnow": [
      "EFS is a managed NFS file system for Linux, scales automatically, and can be mounted on many EC2 instances across AZs.",
      "EFS vs EBS: EBS is one block disk in one AZ; EFS is shared POSIX storage for many instances (Linux only).",
      "EFS lifecycle: move cold files to EFS-IA after N days to cut cost.",
      "EFS throughput/provisioned modes matter for bursty vs steady IO.",
      "CLI credentials precedence: CLI flags > env vars > shared credentials file > IAM role (instance profile) — the role is last, which is usually what you want on EC2.",
      "SSO/SAML can swap temporary creds in too; never rely on a static key in code.",
      "AWS SDK: default region + retries built-in; set max attempts and timeouts explicitly for production."
    ],
    "triggers": [
      "'Many Linux instances need a shared file system' → EFS, not EBS (EBS can't be shared across instances except special Multi-Attach).",
      "'Windows needs shared storage' → not EFS; think FSx for Windows or S3.",
      "CLI uses the wrong account unexpectedly → check the credentials chain; env vars beat the shared file.",
      "EFS slow for an app that reads once and caches → use provisioned throughput, or a cache layer."
    ],
    "table": [
      ["Storage", "Shares?", "OS"],
      ["EBS", "No (1 instance, 1 AZ)", "Any"],
      ["EFS", "Yes, many instances/AZs", "Linux (NFS)"],
      ["Instance Store", "No", "Any"],
      ["S3", "Yes, via API", "Any (object)"]
    ]
  },
  "7": {
    "title": "Week 1 Review + Consolidation",
    "intro": "No new content — the exam rewards connecting the first six days into one mental map.",
    "mustKnow": [
      "Global vs regional services: IAM/Route53/CloudFront global; everything else regional.",
      "Security model: deny beats allow; roles for services; never keys in code.",
      "Compute ladder: EC2 (VMs) → containers → serverless. Pick by how much server you want to manage.",
      "Storage ladder: instance store (fast, ephemeral) → EBS (block, durable) → EFS (shared POSIX) → S3 (object, unlimited).",
      "Cost levers: Spot for interruptible, Reserved/Savings for steady, storage classes for cold data.",
      "Re-run the flashcards and the daily 2-3 questions; anything you miss goes on a 'redo list'."
    ],
    "triggers": [
      "Two services look similar → name the DIFFERENCE (what each is FOR), not the overlap.",
      "A question you answered wrong → fix it today, not at the mock.",
      "Any 'which service' answer must survive 'and why' — say the why out loud."
    ],
    "table": [
      ["You need", "Reach for"],
      ["Durable block disk", "EBS"],
      ["Shared Linux file system", "EFS"],
      ["Unlimited object storage", "S3"],
      ["Ephemeral speed", "Instance Store"]
    ]
  },
  "8": {
    "title": "S3 Basics — Buckets, Objects, Storage Classes, Versioning",
    "intro": "S3 is object storage with 11 nines of durability. Most questions test storage-class selection and the fact that bucket names are globally unique.",
    "mustKnow": [
      "Bucket name must be globally unique across all AWS accounts; objects have a key (the full path).",
      "S3 gives strong read-after-write consistency (2017+): you always see the latest object, no eventual-consistency traps anymore.",
      "Storage classes: S3 Standard (hot), Standard-IA (access less, pay per GB), One-Zone IA (cheap, single AZ), Glacier Instant/Flexible/Deep Archive (archival).",
      "Versioning keeps every version of an object; can't be disabled once enabled (only suspended); protects against deletes.",
      "Delete markers + versioning: deleting an object puts a delete marker instead of erasing it.",
      "Multipart upload for large files (5 GB+); it's faster and lets uploads resume.",
      "S3 is a bucket of objects + metadata, not a file system — no folders really exist, keys just look like paths."
    ],
    "triggers": [
      "'Bucket name already taken' → it's global; add a unique suffix.",
      "Old file appears after upload → you didn't enable versioning, or you're reading a cached object — consistency is strong now.",
      "Archival with retrieval in minutes → Glacier Flexible; in hours → Glacier Deep Archive.",
      "Cheap storage where losing one AZ is fine → One-Zone IA.",
      "'Upload very large file reliably' → multipart upload."
    ],
    "table": [
      ["Class", "Pick when"],
      ["Standard", "Hot, frequent access"],
      ["Standard-IA", "Occasional access, cheap storage"],
      ["One-Zone IA", "Cheapest single-AZ, regenerable data"],
      ["Glacier Flexible", "Archive, minutes to retrieve"],
      ["Glacier Deep Archive", "Years, hours to retrieve"]
    ]
  },
  "9": {
    "title": "S3 Advanced — Lifecycle, ACL, Bucket Policies, Replication, Static Hosting",
    "intro": "Lifecycle moves objects through classes; policies decide who can touch a bucket; replication copies it somewhere else. These three cover most S3 scenario questions.",
    "mustKnow": [
      "Lifecycle rules automate transitions: e.g., Standard → IA after 30 days → Glacier after 90 → delete after 365.",
      "Bucket policies are resource-based JSON that can allow/deny by principal, source IP, prefix, or even require encryption.",
      "ACLs are legacy object-level permissions — AWS recommends bucket policies + IAM instead.",
      "Replication: SRR (same region, e.g. logs aggregation) and CRR (cross region, e.g. DR). Requires versioning enabled on both buckets.",
      "Replication copies new objects by default; enable 'replicate existing objects' or S3 Batch Replication for the rest. Deletes only replicate if configured.",
      "Static website hosting: enable it, set index.html + error document, bucket policy granting s3:GetObject to '*'. The URL is http (no HTTPS by default — pair with CloudFront).",
      "Presigned URLs delegate temporary access to a specific object without changing bucket policy."
    ],
    "triggers": [
      "'Move old logs to Glacier after 90 days' → lifecycle rule with transitions.",
      "'Replicate objects to another region for DR' → CRR + versioning on.",
      "Hosting a website that should be https → S3 static hosting + CloudFront.",
      "Replication didn't copy existing files → turn on existing-object replication.",
      "Public read for a static site → bucket policy with Principal '*' and s3:GetObject."
    ],
    "table": [
      ["Feature", "Answer when"],
      ["Lifecycle", "Automatic class transitions/expiry"],
      ["Bucket policy", "Cross-account / public / conditional access"],
      ["Replication", "Copy objects to another bucket/region"],
      ["Static hosting", "Serve a plain HTML site from S3"],
      ["Presigned URL", "Time-limited access to one object"]
    ]
  },
  "10": {
    "title": "S3 Security — Encryption, Presigned URLs, CORS",
    "intro": "Encryption is 'which key am I trusting'. CORS and presigned URLs are the two recurring scenario traps.",
    "mustKnow": [
      "SSE-S3: AES-256, keys managed by AWS — default, cheapest, fine for most data.",
      "SSE-KMS: you control the KMS key (rotation, audit, per-key permissions); costs per API call.",
      "SSE-C: you supply your own keys; AWS never stores them.",
      "Client-side encryption: you encrypt before upload; nothing in AWS ever sees plaintext.",
      "Default encryption: set a bucket default so every PUT is encrypted even if the caller forgot.",
      "Bucket policies can REQUIRE encryption: deny PUTs without x-amz-server-side-encryption:aws:kms.",
      "Presigned URLs: a signed link valid for up to 7 days; great for uploads from a browser or temp downloads.",
      "CORS: a browser security rule — if a web app in origin A reads S3 in origin B, bucket needs the matching CORS rule."
    ],
    "triggers": [
      "'Must meet audit/compliance, want key rotation and control' → SSE-KMS.",
      "'We hold the keys, AWS must not see plaintext' → client-side encryption.",
      "Upload failing with no encryption header while default is off → either set default encryption or add the header.",
      "Browser JS can't read a bucket → CORS misconfiguration (or public access blocked).",
      "Give a user 5 minutes to upload → presigned PUT URL."
    ],
    "table": [
      ["Method", "Who holds keys"],
      ["SSE-S3", "AWS manages keys"],
      ["SSE-KMS", "You manage via KMS"],
      ["SSE-C", "You hold and supply keys"],
      ["Client-side", "You encrypt before upload"]
    ]
  },
  "11": {
    "title": "High Availability — ELB + Auto Scaling Groups",
    "intro": "Load balancers spread traffic; auto scaling keeps the right number of instances. Together they make a 'web tier' that survives anything.",
    "mustKnow": [
      "ALB (HTTP/HTTPS/WebSocket, path+host routing, target groups), NLB (TCP/UDP, extreme performance, static IP), GWLB (transparent proxies).",
      "Target groups can hold EC2 instances, IPs, or Lambda; ALB health checks mark instances healthy/unhealthy.",
      "Sticky sessions (session affinity) pin a client to one instance; off by default.",
      "Cross-zone load balancing spreads traffic across all AZs — turn it on.",
      "ASG: min / desired / max instances; launch template defines the AMI, size, SG, key, user data.",
      "Scaling policies: target-tracking (e.g. keep CPU ~50%), step, simple, scheduled; also scale on a custom metric via SQS queue length.",
      "ASG health checks: EC2 status checks + ELB health checks; unhealthy instances get replaced.",
      "Lifecycle hooks pause instances during launch/terminate for custom setup or drain."
    ],
    "triggers": [
      "Layer-4 TCP/UDP or static IPs → NLB. Layer-7 routing by path → ALB.",
      "'Workers stuck on one instance after login' → enable sticky sessions on the target group.",
      "'Instances only in one AZ and it failed' → ASG must span multiple AZs.",
      "'Scale by number of queued jobs' → custom metric from SQS ApproximateNumberOfMessages → target-tracking.",
      "NLB static IPs for whitelisting → NLB with Elastic IPs."
    ],
    "table": [
      ["LB", "Layer", "Use for"],
      ["ALB", "7 (HTTP)", "Routing, sticky, WebSocket"],
      ["NLB", "4 (TCP/UDP)", "High perf, static IP"],
      ["GWLB", "3/4", "Security appliances inline"]
    ]
  },
  "12": {
    "title": "Databases — RDS, Aurora, ElastiCache",
    "intro": "The database day. Exams love 'which database for this workload' and the RDS failure-isolation questions.",
    "mustKnow": [
      "RDS = managed relational DB (MySQL, Postgres, MariaDB, Oracle, SQL Server). You manage data, AWS manages the server.",
      "Multi-AZ = synchronous replica in another AZ for FAILOVER (disaster recovery), not for read scaling.",
      "Read replicas = async copies for READ scaling (max 15); can be promoted; can be cross-region.",
      "Backups: automated (retention 1-35 days, snapshots) + manual snapshots (kept forever).",
      "RDS Proxy: connection pooling — fixes 'too many connections' and makes failover seamless for Lambda.",
      "Aurora: MySQL/Postgres-compatible, storage auto-scales to 128 TB, up to 15 read replicas, Aurora Serverless, Global Database.",
      "ElastiCache: managed Redis (rich features: pub/sub, sorted sets, replication) or Memcached (pure cache, simple).",
      "Caching patterns: lazy loading (cache-aside) vs write-through; TTL to avoid stale data."
    ],
    "triggers": [
      "'Read-heavy app, DB can't keep up' → read replicas or Aurora + replicas.",
      "'DB must survive an AZ loss with zero data loss' → Multi-AZ (synchronous).",
      "'Too many connections from serverless' → RDS Proxy.",
      "'Need a fast in-memory cache for session data' → ElastiCache Redis.",
      "'Storage grows unpredictably, serverless billing' → Aurora Serverless.",
      "Stale cached data → short TTL or write-through; cache invalidation on writes."
    ],
    "table": [
      ["Choice", "Pick for"],
      ["RDS", "Managed relational, familiar SQL"],
      ["Aurora", "MySQL/Postgres + scale + serverless"],
      ["ElastiCache", "Sub-millisecond in-memory"],
      ["RDS Proxy", "Pooling + graceful failover"]
    ]
  },
  "13": {
    "title": "Route 53 + VPC Basics",
    "intro": "DNS + networking. The recurring traps are routing policies (Route 53) and the security-group-vs-NACL difference (VPC).",
    "mustKnow": [
      "Record types: A (IPv4), AAAA (IPv6), CNAME (alias a name), MX, TXT; Alias records point to AWS resources and are free+automatic.",
      "Routing policies: simple (one target), weighted (split %), latency (nearest), geolocation, failover (primary/backup + health check), multi-value.",
      "Health checks drive failover and can monitor HTTP endpoints, not just DNS.",
      "VPC = your private network; subnets = ranges within it (public with IGW route, private without).",
      "Route tables decide how traffic flows; Internet Gateway enables public; NAT Gateway lets private instances reach the internet outbound only.",
      "Security Groups = stateful, instance-level, allow-only. NACLs = stateless, subnet-level, allow+deny, evaluated in order.",
      "VPC endpoints: connect privately to S3/DynamoDB without going over the internet."
    ],
    "triggers": [
      "'Distribute traffic by region latency' → latency routing.",
      "'Route traffic away from a down site' → failover + health checks.",
      "'Weights like 70/30 across two deployments' → weighted routing.",
      "Inbound traffic to a public subnet isn't working → check SG inbound rules AND that the subnet has a route to the IGW.",
      "'Stateful firewall' = SG; 'stateless, order-based, explicit deny' = NACL.",
      "'Keep S3 traffic private' → VPC endpoint (Gateway type)."
    ],
    "table": [
      ["Thing", "Key property"],
      ["Security Group", "Stateful, allow only"],
      ["NACL", "Stateless, allow + deny, ordered"],
      ["IGW", "Public internet in/out"],
      ["NAT Gateway", "Outbound only for private subnets"],
      ["VPC Endpoint", "Private access to AWS services"]
    ]
  },
  "14": {
    "title": "DynamoDB Basics — Tables, Items, Keys",
    "intro": "DynamoDB is serverless NoSQL: infinite scale, predictable cost, but you design around the keys — there's no joins and no arbitrary queries.",
    "mustKnow": [
      "Tables hold items (rows); items hold attributes; items are located by a partition key (and optional sort key).",
      "Partition key alone → one item per key; partition + sort key → many items grouped by key, ordered by sort key.",
      "Capacity modes: provisioned (set RCU/WCU) vs on-demand (auto-scale, pay per request — choose when traffic is unpredictable).",
      "RCU = one strongly consistent read/sec of 4 KB; WCU = one write/sec of 1 KB. Doubles for transactional ops.",
      "Queries read by key (fast); Scans read everything (expensive — avoid).",
      "GSI = alternate index for a different query pattern (has its own RCU/WCU); LSI = alternate sort key on same partition (shares capacity).",
      "Items capped at 400 KB — big files go to S3, metadata to DynamoDB."
    ],
    "triggers": [
      "Unpredictable traffic → on-demand mode; predictable → provisioned.",
      "Need to query by a non-key attribute → create a GSI.",
      "'Scan is too expensive' → redesign with a GSI so it becomes a query.",
      "Item too big → split into S3 (object) + DynamoDB (metadata).",
      "Race conditions on a counter → conditional updates or atomic increment."
    ],
    "table": [
      ["Operation", "Cost scale"],
      ["Query", "Only keys it touches"],
      ["Scan", "Every item — avoid"],
      ["GSI", "New query patterns"],
      ["LSI", "Extra sort key, same partition"]
    ]
  },
  "15": {
    "title": "CloudFront + CDN + Lambda@Edge",
    "intro": "CloudFront caches at the edge. The recurring topics are invalidation, signed URLs, and OAC for locking down the origin.",
    "mustKnow": [
      "CloudFront = global CDN: caches static assets (HTML/JS/images) at edge locations for lower latency.",
      "Origins: S3 buckets, ALBs, HTTP servers. Viewer → edge → origin; TTL controlled via Cache-Control headers.",
      "Invalidation removes cached content (you pay per path); or use versioned file names (cache-busting) to avoid it.",
      "OAC/OAI: restricts the S3 origin so only CloudFront can read it — no public bucket needed.",
      "Signed URLs / signed cookies give time-limited access to private content.",
      "Lambda@Edge: run small functions at edge locations to rewrite requests/responses (A/B, header injection, auth checks).",
      "Global Accelerator vs CloudFront: GA = TCP/UDP + static IPs + fast path; CloudFront = HTTP/HTTPS caching."
    ],
    "triggers": [
      "'Users worldwide get slow downloads' → CloudFront.",
      "'Updated JS won't show for users' → invalidate or rename the file (versioned names are the clean answer).",
      "'S3 bucket must stay private but CloudFront reads it' → OAC.",
      "'Paywall videos, time-limited access' → signed URLs.",
      "'Need static IPs for whitelisting + fast global TCP' → Global Accelerator."
    ],
    "table": [
      ["Feature", "Use for"],
      ["CloudFront", "HTTP caching at the edge"],
      ["OAC", "Lock S3 origin to CloudFront"],
      ["Signed URLs", "Private, time-limited content"],
      ["Lambda@Edge", "Edge logic on requests/responses"],
      ["Global Accelerator", "Fast global TCP/UDP + static IPs"]
    ]
  },
  "16": {
    "title": "Lambda Basics — Versions, Aliases, Environment, Limits",
    "intro": "Lambda is code without servers. Questions hit the invocation model, versions/aliases, and the hard limits that never change.",
    "mustKnow": [
      "Lambda = run code on events, pay per invocation + duration; scales automatically.",
      "Runtimes: Node, Python, Java, Go, .NET, Ruby, and custom (container) runtimes.",
      "Invocation models: synchronous (API Gateway, SDK), async (S3, EventBridge, SNS) with DLQ support, event source mappings (polling, e.g. DynamoDB streams, SQS).",
      "Limits you must memorize: 10 GB memory, 15 min timeout, 6 GB / 10 GB ephemeral disk, 50 MB zip (250 MB unzipped) package, 128 MB floor on memory.",
      "Versions = immutable snapshots of code+config; $LATEST is mutable. Aliases = named pointers (e.g. 'prod') you can flip instantly; traffic can be split across two versions.",
      "Environment variables are encrypted by default with a KMS key; can reference secrets.",
      "Handler signature (event, context) — context gives remaining time, function name, etc."
    ],
    "triggers": [
      "Invoke synchronously and need the result → API Gateway direct integration.",
      "Async event → return immediately; errors go to the destination/DLQ.",
      "'Deploy a new version, roll back in one click' → aliases (point alias at old version).",
      "'Canary deploy 10% traffic' → alias weighted routing.",
      "'Function times out at 15 min' → that's the ceiling; split work or use another service.",
      "'Cannot unzip >250 MB' → use container images or store code in S3 + layers."
    ],
    "table": [
      ["Limit", "Value"],
      ["Memory", "128 MB – 10 GB"],
      ["Timeout", "Up to 15 minutes"],
      ["Package", "50 MB zip / 250 MB unzipped"],
      ["Ephemeral disk", "Up to 10 GB"]
    ]
  },
  "17": {
    "title": "Lambda Advanced — Concurrency, VPC, Layers, Best Practices",
    "intro": "Beyond the basics: who throttles you, how Lambda behaves inside a VPC, and how to shrink cold starts.",
    "mustKnow": [
      "Concurrency: region-wide account limit; reserved concurrency = a guaranteed slice (can cause throttling for others), provisioned concurrency = pre-warmed instances.",
      "Throttle = 429. Async invocations retry automatically (2 retries) then go to DLQ/destination.",
      "In a VPC, Lambda needs a VPC configuration with subnets + a security group + a NAT gateway (or endpoint) to reach the internet — there's no default internet path.",
      "Layers package shared code/deps so the deployed zip stays small; maximum 5 layers per function.",
      "Cold starts: initializes execution environment on first call — mitigations: provisioned concurrency, lighter runtime, smaller layers, snapstart (Java).",
      "Execution role is required (logs, whatever the code needs); separate roles per function is cleaner.",
      "Best practices: fail fast, use idempotent logic, enable X-Ray tracing, set timeouts/memory to match work, handle DLQs."
    ],
    "triggers": [
      "'Function gets 429s under load' → reserved or provisioned concurrency; or it hit the account limit.",
      "'Lambda in private subnet has no internet' → add a NAT gateway or VPC endpoint.",
      "Cold start is the complaint → provisioned concurrency (or lighter runtime).",
      "'Reuse code across functions without bloating packages' → layers.",
      "Async Lambda failed, retries exhausted → check the DLQ/destination for the payload."
    ],
    "table": [
      ["Setting", "Purpose"],
      ["Reserved concurrency", "Guarantee, avoid throttling"],
      ["Provisioned concurrency", "Pre-warm, kill cold starts"],
      ["Layers", "Share deps, shrink packages"],
      ["VPC config", "Subnets + SG for private access"],
      ["DLQ/destination", "Catch async failures"]
    ]
  },
  "18": {
    "title": "API Gateway — REST, HTTP, Auth, Caching, Throttling",
    "intro": "API Gateway puts an API in front of your backends and pays the bills on throttling, caching, and auth — the exam's favorite three.",
    "mustKnow": [
      "Three types: REST API (full features), HTTP API (cheaper, simpler, most modern use), WebSocket API (real-time).",
      "Endpoints: edge-optimized (default), regional, private (VPC only).",
      "Integrations: Lambda proxy (pass through to a function), HTTP, Mock, and service integrations (e.g. directly to DynamoDB/SNS).",
      "Auth options: IAM (SigV4), Cognito user pools, or a custom Lambda authorizer; API keys only throttle, they don't authenticate.",
      "Throttling: account/API/route limits; you can set usage plans + API keys; bursts are allowed briefly.",
      "Caching: API Gateway can cache responses at configurable TTL to slash backend load.",
      "Stages (dev/prod) each have a URL; canary releases route % of traffic to a new deployment; CloudWatch logs + X-Ray tracing per stage."
    ],
    "triggers": [
      "Real-time bi-directional chat → WebSocket API.",
      "'Cheapest REST gateway' → HTTP API.",
      "Auth via Cognito/SAML without custom code → Cognito authorizer.",
      "'3rd-party token in a header, custom logic' → Lambda authorizer.",
      "Reduce backend calls → enable caching.",
      "Different cost/limits per customer → usage plans + API keys."
    ],
    "table": [
      ["Concern", "Answer"],
      ["Type", "REST / HTTP / WebSocket"],
      ["Auth", "IAM / Cognito / Lambda authorizer"],
      ["Throttle", "Usage plans + API keys"],
      ["Speed", "Caching per stage"],
      ["Deploy", "Stages + canary"]
    ]
  },
  "19": {
    "title": "Integration & Messaging — SQS, SNS",
    "intro": "Decoupling the app: SQS is a queue you pull from, SNS is a topic things get pushed to. The exam compares them constantly.",
    "mustKnow": [
      "SQS: standard queue — pull (poll) model, at-least-once, possible duplicates, best-effort ordering.",
      "Visibility timeout: after a consumer receives a message, it's hidden for N seconds so no one else grabs it; if processing fails it becomes visible again (retry).",
      "Dead Letter Queue: messages that fail repeatedly (after maxReceiveCount) move to a DLQ for later inspection.",
      "Long polling (up to 20 s) reduces empty responses and cost vs short polling.",
      "FIFO queues: exactly-once, strict ordering, 300 msg/s (3000 with batching) — use for order-sensitive pipelines.",
      "Delay queues delay messages up to 15 min; large messages need the SQS Extended Client (S3 backing).",
      "SNS: pub/sub — producers publish to a topic, subscribers (SQS, Lambda, email, SMS, HTTP) get pushed copies.",
      "Fan-out pattern: SNS → multiple SQS queues so each consumer gets its own copy."
    ],
    "triggers": [
      "'App too slow because everything is synchronous' → decouple with SQS.",
      "'Order must be preserved exactly once' → SQS FIFO.",
      "'Same event to many consumers' → SNS fan-out to multiple SQS queues.",
      "'Consume at your own pace' → SQS (pull); 'push as fast as they come' → SNS (push).",
      "Message keeps reappearing → it keeps failing before the visibility timeout / after retries → DLQ.",
      "Lambda + SQS: batch up to 10 messages, delete on success, DLQ on poison messages."
    ],
    "table": [
      ["", "SQS", "SNS"],
      ["Model", "Pull (poll)", "Push (pub/sub)"],
      ["Delivery", "At-least-once", "To every subscriber"],
      ["Ordering", "FIFO option", "None guaranteed"],
      ["Dedup", "FIFO only", "Not by default"]
    ]
  },
  "20": {
    "title": "Kinesis + Step Functions",
    "intro": "Kinesis streams big data in real time; Step Functions orchestrates multi-step workflows with retries. Two different problem families.",
    "mustKnow": [
      "Kinesis Data Streams: ordered records in shards; 1 MB/s per shard (or 1000 records/s) write, 2 MB/s read; retention 24 h (default) to 365 days.",
      "Consumers read by shard; a partition key routes records to the same shard — that's how ordering per key is preserved.",
      "Kinesis Data Firehose: streams to S3/Redshift/Elasticsearch with near-real-time buffering — managed, no shards to manage, delivered on schedule.",
      "Kinesis Data Analytics: run SQL on streaming data in real time.",
      "Kinesis vs SQS: Kinesis = ordered big streams with replay; SQS = message queue for decoupling.",
      "Step Functions: state machines with states (Task, Choice, Wait, Parallel, Map, Fail, Succeed); JSON passes between steps.",
      "Step Functions do retries, timeouts, and catch errors per-state; good for long-running, multi-service workflows.",
      "Step Functions vs SWF: Step Functions is the modern replacement (SWF is legacy)."
    ],
    "triggers": [
      "'Ordered stream of events, replay allowed' → Kinesis Data Streams.",
      "'Just deliver data to S3 on a schedule' → Kinesis Firehose.",
      "'SQL over live data' → Kinesis Data Analytics.",
      "'Order records per user' → partition key = user id.",
      "'Coordinate a multi-step workflow with retries' → Step Functions.",
      "Simple async decoupling → SQS, not Kinesis."
    ],
    "table": [
      ["Service", "One-line role"],
      ["Kinesis Streams", "Ordered, replayable data streams"],
      ["Firehose", "Buffered delivery to destinations"],
      ["Data Analytics", "Real-time SQL on streams"],
      ["Step Functions", "Workflow orchestration"]
    ]
  },
  "21": {
    "title": "DynamoDB Advanced — Streams, TTL, Transactions, DAX",
    "intro": "Same database, deeper mechanics. These are the 'why did my table throttle' and 'how do I react to changes' questions.",
    "mustKnow": [
      "Streams: ordered log of item changes, 24 h retention; Lambda reads them to trigger reactions (denormalization, notifications).",
      "TTL: auto-delete items after a timestamp — free, great for sessions; deleted items appear in streams.",
      "Transactions: TransactWriteItems/GetItems — all-or-nothing, up to 100 items, 2x RCU/WCU cost.",
      "DAX: in-memory cache with a drop-in API (microsecond reads), fixes hot keys and read latency; default TTL 5 min.",
      "GSI gotcha: throttled writes to a GSI throttle the MAIN table too (write-sharding helps).",
      "Global tables: multi-region active-active via streams; strong consistency only within a region.",
      "Conditional writes are atomic — perfect for optimistic locking with a version attribute."
    ],
    "triggers": [
      "'React to changes in a table' → DynamoDB Streams + Lambda.",
      "Session data that should expire for free → TTL.",
      "'Microsecond reads, hot keys' → DAX.",
      "'Update many items atomically' → TransactWriteItems.",
      "Main table throttled by a GSI → check GSI write capacity / use write sharding.",
      "'Two writers must not clobber each other' → conditional write on a version attr."
    ],
    "table": [
      ["Feature", "Use for"],
      ["Streams", "Reactive pipelines, change log"],
      ["TTL", "Auto-expiry, no cost"],
      ["Transactions", "All-or-nothing multi-item"],
      ["DAX", "Caching, hot-key relief"],
      ["Global tables", "Multi-region active-active"]
    ]
  },
  "22": {
    "title": "Containers on AWS — ECS, ECR, EKS",
    "intro": "Containers: same image, no OS to manage. Know the ECS vocabulary and when Fargate beats EC2.",
    "mustKnow": [
      "ECS stack: Cluster → Service (keeps desired task count) → Tasks (from a Task Definition) → Containers.",
      "Launch types: EC2 (you manage the capacity, cheapest at scale) vs Fargate (serverless, AWS runs the containers — no instance management).",
      "Task definition fields: image (from ECR), cpu/memory, port mappings, env vars + secrets, IAM role (task role), log driver.",
      "ECR = managed container registry; images pushed/pulled; private by default.",
      "Service scaling: target tracking on CPU/memory, or custom metrics (e.g. SQS queue length).",
      "EKS = managed Kubernetes; you manage the control plane upgrades and nodes; Fargate profiles for serverless pods.",
      "ECS vs EKS: ECS is the simpler AWS-native path; EKS if your team already runs Kubernetes / needs ecosystem portability.",
      "Roles: task role for what the container needs (S3, etc.); each task gets temporary credentials."
    ],
    "triggers": [
      "'No servers to manage at all' → Fargate.",
      "'Predictable load, want to optimize cost' → EC2 launch type.",
      "'Existing Kubernetes workloads' → EKS.",
      "'Where does the container image live' → ECR (private registry).",
      "Container needs S3 access → give the task an IAM task role.",
      "'Scale the service when queue grows' → custom metric scaling on SQS depth."
    ],
    "table": [
      ["Service", "Role"],
      ["ECS", "Run containers on AWS"],
      ["Fargate", "Serverless container compute"],
      ["ECR", "Container image registry"],
      ["EKS", "Managed Kubernetes"]
    ]
  },
  "23": {
    "title": "Elastic Beanstalk + Deployment Strategies",
    "intro": "Beanstalk = PaaS: upload code, AWS wires up EC2 + LB + ASG for you. The exam mostly tests deployment modes.",
    "mustKnow": [
      "Beanstalk components: environment (one deployed app version + config), application (collection of environments), platform (language runtime).",
      "It manages: EC2, ASG, ELB, RDS (optional), monitoring, health — you only write code and config.",
      "Deployment modes: All-at-once (fastest, downtime), Rolling (batch by batch), Rolling with additional batch (no capacity loss), Immutable (new ASG, swap — safest), Blue/Green (swap URLs).",
      "Health-based rolling: deploy only when the previous batch is healthy.",
      "Swap URLs = instant blue/green switch between two environments with zero DNS changes.",
      "RDS inside Beanstalk is risky (tied to environment lifecycle); decouple RDS to a separate account/VPC for production.",
      "Environment variables / configuration files (.ebextensions) drive custom setup."
    ],
    "triggers": [
      "Downtime must be zero on deploy → immutable or blue/green.",
      "Fastest deploy, downtime acceptable → all-at-once.",
      "Cheapest but keeps capacity → rolling with additional batch (extra cost) vs plain rolling.",
      "Swap between two full environments → swap URLs.",
      "'Which deployment keeps rolling back on failure' → health-based rolling."
    ],
    "table": [
      ["Mode", "Downtime", "Safety"],
      ["All-at-once", "Yes", "Low"],
      ["Rolling", "Partial", "Medium"],
      ["Immutable", "None", "High"],
      ["Blue/Green", "None", "Highest"]
    ]
  },
  "24": {
    "title": "CloudFormation — Templates, Stack, Drift, Nested Stacks",
    "intro": "CloudFormation is infrastructure as code: the template declares resources, a stack applies them, updates diff through change sets.",
    "mustKnow": [
      "Template sections: Parameters (inputs), Resources (the actual stuff — required), Outputs (values for other stacks), Mappings (static lookups), Conditions, Metadata.",
      "Stack = the live result of applying a template; update = modify template, preview with a change set, then apply.",
      "Change sets show what will change before you commit — no more 'why did it recreate my DB?'",
      "Drift detection compares the live stack to the template (someone changed something by hand).",
      "Nested stacks: a parent stack launches child stacks (reusable templates).",
      "StackSets deploy the same stack across accounts/regions.",
      "DeletionPolicy (Retain/Snapshot/Delete) controls what happens to a resource when the stack is removed.",
      "cfn-init + cfn-signal bootstrap instances; AWS::CloudFormation::Init installs software idempotently."
    ],
    "triggers": [
      "'Preview what an update will do' → create a change set first.",
      "Resource deleted by hand → stack drift; fix or update the template.",
      "'Reuse the same template in many environments' → parameters + outputs.",
      "'Rolling out a stack to many accounts' → StackSets.",
      "'Don't delete the DB when the stack dies' → DeletionPolicy: Retain."
    ],
    "table": [
      ["Tool", "Answer when"],
      ["Change set", "Preview an update"],
      ["Drift detection", "Live state vs template"],
      ["Nested stacks", "Compose reusable templates"],
      ["StackSets", "Same stack, many accounts"],
      ["DeletionPolicy", "What survives stack delete"]
    ]
  },
  "25": {
    "title": "CI/CD — CodeCommit, CodeBuild, CodeDeploy, CodePipeline",
    "intro": "The delivery chain: store code, build it, deploy it. CodeDeploy's hook order and deployment strategies are the memorization targets.",
    "mustKnow": [
      "CodeCommit = managed Git; CodeBuild = build/compile/test in a managed container (no servers); CodePipeline = orchestration (source → build → deploy).",
      "CodeDeploy deploys to EC2 (on-prem too) or Lambda and ECS; works with any S3 source.",
      "CodeDeploy hook order for EC2: BeforeInstall → AfterInstall → ApplicationStart → ValidateService (deployment health check).",
      "Deployment strategies: in-place (rolling, possible downtime) vs blue/green (new instances, swap — safer, preferred).",
      "AppSpec files: for EC2 (hooks + files) and for Lambda/ECS (spec of what to deploy).",
      "Rollback: automatic on failed health checks or manual; redeploy previous version.",
      "CodePipeline artifacts pass between stages via S3; manual approval steps gate prod.",
      "Trigger automation: webhooks from CodeCommit/CodeStar; or scheduled pipelines."
    ],
    "triggers": [
      "Hook running before app files install → BeforeInstall; after start → ApplicationStart.",
      "'Deploy to a fleet with zero downtime' → blue/green CodeDeploy.",
      "'Validate the new deploy before switching' → ValidateService hook / health check gate.",
      "'Automate build then deploy' → CodePipeline: source → CodeBuild → CodeDeploy.",
      "Deploy failed and rolled back → check hook scripts and health check thresholds."
    ],
    "table": [
      ["Service", "Job"],
      ["CodeCommit", "Git hosting"],
      ["CodeBuild", "Build/test"],
      ["CodeDeploy", "Ship to EC2/Lambda/ECS"],
      ["CodePipeline", "Orchestrate the whole chain"]
    ]
  },
  "26": {
    "title": "Security Deep Dive — KMS, SSM Parameter Store, Secrets Manager, Cognito",
    "intro": "Keys, secrets, and identity. The recurring decision: KMS for encryption, SSM for config, Secrets Manager for rotating secrets, Cognito for users.",
    "mustKnow": [
      "KMS: symmetric keys for encryption (AWS service keys, CMKs you own, or customer keys); also asymmetric for signing. Grants + policies control use.",
      "KMS key rotation: automatic every year for CMKs (new backing key, same ID) — audit with CloudTrail.",
      "SSM Parameter Store: free-ish key-value store; Standard (4 KB) and Advanced (8 KB) tiers; optional KMS encryption; versioned; used for config.",
      "Secrets Manager: secrets WITH automatic rotation (Lambda), cross-account access, integration with RDS/Redshift — costs more than SSM.",
      "Choosing: plain config → SSM; a secret that must rotate → Secrets Manager.",
      "Cognito user pools: sign-up/sign-in for YOUR app users (JWT tokens, hosted UI, MFA, federated login via Google/FB/SAML).",
      "Cognito identity pools: swap a user-pool token (or public provider) for AWS credentials to access AWS services.",
      "Cognito vs IAM: IAM = internal AWS users/roles; Cognito = external app users."
    ],
    "triggers": [
      "'Encrypt data, audit key use' → KMS (CloudTrail logs key usage).",
      "'Store a simple config value' → SSM Parameter Store.",
      "'Database password that must rotate monthly' → Secrets Manager.",
      "'Build an app with sign-up, MFA, federated login' → Cognito user pools.",
      "Give app users AWS access via their login → identity pools.",
      "'Which key encrypts Lambda env vars by default' → an AWS-managed KMS key (CMK if you specify one)."
    ],
    "table": [
      ["Service", "Best for"],
      ["KMS", "Encryption keys + audit"],
      ["SSM Parameter Store", "Config values, cheap"],
      ["Secrets Manager", "Secrets with rotation"],
      ["Cognito", "App users + identity"]
    ]
  },
  "27": {
    "title": "Monitoring, Troubleshooting & Audit — CloudWatch, X-Ray, CloudTrail",
    "intro": "Three different lenses: CloudWatch sees metrics/logs/alarms, X-Ray sees one request's path through services, CloudTrail sees who called the API.",
    "mustKnow": [
      "CloudWatch Metrics: default metrics for AWS services; custom metrics via the agent or API; alarms fire on thresholds with SNS notifications.",
      "CloudWatch Logs: collect, store, search app/S3/EC2 logs; Log Insights for querying; metric filters turn log patterns into metrics.",
      "CloudWatch Agent (unified): collects OS-level metrics + logs from EC2/on-prem; X-Ray tracing from the SDK too.",
      "X-Ray: traces requests across services — segments, subsegments, annotations (indexable), sampling rules; works via SDK instrumentation or the X-Ray agent.",
      "X-Ray troubleshooting: look for high latency segments, errors, throttles per service; use trace IDs from logs to find the full trace.",
      "CloudTrail: API activity audit — who called which API, from where, when; management events (free) + data events (e.g. S3 object reads, paid).",
      "Difference: CloudWatch = performance; X-Ray = request flow; CloudTrail = security/audit of API calls."
    ],
    "triggers": [
      "'CPU too high' → CloudWatch alarm + SNS.",
      "'Find the slowest service in one request' → X-Ray trace.",
      "'Who deleted that bucket' → CloudTrail lookup events.",
      "'Alert when error count in logs spikes' → CloudWatch metric filter + alarm.",
      "Lambda not in VPC... latency weirdness → X-Ray traces to see cold starts and downstream calls."
    ],
    "table": [
      ["Tool", "Answers"],
      ["CloudWatch", "Metrics, logs, alarms, dashboards"],
      ["X-Ray", "Per-request trace across services"],
      ["CloudTrail", "API call audit trail"]
    ]
  },
  "28": {
    "title": "Troubleshooting & Optimization — Retries, Throttling, SDK Patterns",
    "intro": "Production behavior: how SDKs retry, how throttling feels, and the patterns that make serverless robust. These are the 'why is it failing' questions.",
    "mustKnow": [
      "Exponential backoff with jitter: retry with growing waits + randomness to avoid thundering-herd retries.",
      "SDK retries: most AWS SDKs retry automatically on throttling/transient errors; configure maxRetries + timeouts.",
      "Throttling = 429/ThrottlingException → back off; idempotency tokens avoid duplicate side effects on retry.",
      "For Lambda: idempotent logic + DLQ for poison messages; check reserved concurrency before blaming throttles.",
      "DynamoDB throttling: provisioned exceeded → exponential backoff; or move to on-demand.",
      "SQS + Lambda: batch size up to 10; failed items return to the queue (visibility); long polling reduces empty invocations.",
      "Timeout vs retry: set SDK timeouts below Lambda timeout so Lambda can fail fast and let a retry happen, not hang.",
      "Cost optimization: match provisioned capacity to reality, cache hot data, and use storage classes deliberately."
    ],
    "triggers": [
      "'Spike of 429s at launch' → exponential backoff + jitter, spread the start times.",
      "'Retry made it worse' → no jitter; all clients retry at once.",
      "'Function times out but downstream also slow' → shorten SDK timeouts and handle failures explicitly.",
      "Poison message keeps failing → send to DLQ after maxReceiveCount.",
      "'Which is best practice for a flaky API' → retry with backoff, idempotency, and a circuit breaker."
    ],
    "table": [
      ["Pattern", "Fixes"],
      ["Backoff + jitter", "Throttling storms"],
      ["Idempotency", "Duplicate side effects"],
      ["DLQ", "Poison messages"],
      ["Short timeouts", "Hung calls in Lambda"]
    ]
  },
  "29": {
    "title": "Mock Exam 1 + Weak-Area Review",
    "intro": "A practice day, not a content day. The goal is finding where the knowledge gaps are, then closing them with the daily cheat sheets and hands-on notes.",
    "mustKnow": [
      "Simulate the real thing: 65 questions, 130 minutes, no books, one sitting.",
      "Pacing: ~2 minutes per question — flag anything slow and move on; come back at the end.",
      "Score mapping: aim 75%+; anything below that on a domain means a targeted review day.",
      "Domains to weight: Development 32%, Security 26%, Deployment 24%, Troubleshooting 18%.",
      "Review process: every wrong answer → write the ONE fact that would've fixed it, then find it in the relevant day's cheat sheet.",
      "Read stems twice: most traps are 'what is the MOST cost-effective', 'LOWEST latency', or 'NO downtime' — the qualifier changes the answer.",
      "Eliminate two answers first: most questions have two clearly-wrong distractors."
    ],
    "triggers": [
      "You guessed → treat it as wrong for review purposes.",
      "Two answers felt right → that's a concept gap; go re-read that day's memory hooks.",
      "Missed a whole domain → schedule a re-review of those days before mock 2."
    ],
    "table": [
      ["Domain", "Weight"],
      ["Development", "32%"],
      ["Security", "26%"],
      ["Deployment", "24%"],
      ["Troubleshooting", "18%"]
    ]
  },
  "30": {
    "title": "Mock Exam 2 + Exam-Day Cheat Sheet + Final Strategy",
    "intro": "The last day. Run the final mock, then walk in with a plan: time budget, a brain-dump list, and a steady rhythm.",
    "mustKnow": [
      "Final mock under real conditions; pass bar is 720/1000, exam is 65 questions in 130 minutes.",
      "Time plan: ~2 min/question, take a 1-minute mental break at question ~32 (halfway).",
      "Brain-dump at the start (on the scratch pad): EBS types, storage classes, Lambda limits, SQS vs SNS, CodeDeploy hooks, domain weights.",
      "Question technique: read the LAST sentence first (that's the real ask), then the stem; watch for qualifiers (MOST, LEAST, NO downtime, COST-effective).",
      "Answer from the scenario, not from vibes — map each option to 'would this actually solve the stated constraint'.",
      "Never leave an answer blank; you can flag and return, but budget a few spare minutes at the end.",
      "Before the exam: book in advance, test the Pearson VUE environment, keep ID and confirmation handy, sleep."
    ],
    "triggers": [
      "Seeing 'MOST cost-effective' → cost wins over comfort unless downtime is stated.",
      "'LOWEST latency' → caching (DAX, ElastiCache, CloudFront) or regional choice.",
      "'Exactly once' → FIFO SQS / idempotent handlers / transactions.",
      "Two services plausible → ask which one the SCENARIO constraints actually need."
    ],
    "table": [
      ["Exam fact", "Value"],
      ["Questions", "65"],
      ["Time", "130 minutes"],
      ["Pass score", "720 / 1000"],
      ["Review questions", "Flagged + unanswered at the end"]
    ]
  }
};