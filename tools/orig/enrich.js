window.DVA_ENRICH = {
  "1": {
        "hooks": [
      "Question types on the real exam: single answer (multiple choice) + multiple answer (select 2-3). Read 'choose TWO' carefully.",
      "Domains & weight — Development 32%, Security 26%, Deployment 24%, Troubleshooting & Optimization 18%. Spend your last days on your weakest domain.",
      "Aurora, S3, Lambda, API Gateway, Cognito, DynamoDB, SQS/SNS/Kinesis, Step Functions are all 'serverless' (no servers to manage).",
      "🚩 'Least management overhead' → managed service wins (RDS over EC2 MySQL, Fargate over EC2, Secrets Manager over custom)."
    ]
  },
  "2": {
        "hooks": [
      "6 policy types to know: Identity-based, Resource-based, Permissions Boundaries (cap only, grant nothing), Organizations SCPs (OU cap), ACLs (cross-account, no JSON), Session policies (assume-role cap).",
      "Test policies with the IAM Policy Simulator, or use CLI --dry-run: 'Request would have succeeded, but DryRun flag is set' = you have the permission.",
      "Best practices to re-state in answers: 1 user per person, 1 role per app, never share credentials, never hardcode keys, no root usage, least privilege.",
      "IAM Federation (SAML) lets your company IdP sign users in — don't recreate users in IAM for enterprises.",
      "🚩 'permission denied when SSH' → check key chmod 400. 'network timeout on SSH' → security group is misconfigured (not the key)."
    ]
  },
  "3": {
        "hooks": [
      "Decode AccessDenied error messages: aws sts decode-authorization-message --encoded-message <code> (needs sts permission). Classic exam trick.",
      "CLI on EC2: attach an IAM role (instance profile) — the instance uses it automatically, zero config, keys never stored.",
      "Metadata gives IAM ROLES (credentials) but NOT IAM policies — a trick line to remember.",
      "🚩 'developer needs EC2 to read S3 without keys in code' → IAM instance role, every time.",
      "One IAM Role per Application; roles give temp creds via STS; roles can be assumed cross-account with a trust policy."
    ]
  },
  "4": {
        "hooks": [
      "Instance families mnemonic: M=mainstream, T=burstable, C=compute, R=RAM, G/GR=GPU, I=instance-storage, X=memory extreme.",
      "Pricing ladder: On-Demand (flex, priciest) → Reserved 1-3y (up to 75% off, steady DBs) → Convertible (type flexible, 54%) → Scheduled (time-window) → Spot (up to 90%, can be reclaimed in 2 min) → Dedicated Host (BYOL/licensing).",
      "Billed by the SECOND (min 60s); you stop paying on stop but still pay for EBS.",
      "Burstable T2/T3: burst credits; if credits run out → bad CPU → move to non-burstable. T2 Unlimited lets you overdraw for extra $$.",
      "User Data: runs once at first boot as ROOT, automates installs/updates.",
      "Metadata at http://169.254.169.254/latest/meta-data — instance 'learns about itself'.",
      "Golden/custom AMI = faster boot, pre-installed app → speeds up ASG scale-out (a very common answer)."
    ]
  },
  "5": {
        "hooks": [
      "EBS types mnemonic: gp2/gp3=General Purpose SSD (boot OK), io1/io2=Provisioned IOPS (DBs), st1=Throughput HDD (big data/logs), sc1=Cold HDD. Only gp2/gp3 + io1/io2 boot; st1/sc1 cannot.",
      "EBS = network drive, LOCKED to one AZ. Move AZ → snapshot first, then recreate in the other AZ.",
      "Snapshots store only USED blocks (5GB used on 100GB → 5GB snapshot) → cheap backup + migration + encryption.",
      "Encrypted EBS → all snapshots encrypted → all volumes from snapshots encrypted (cascade). Uses KMS AES-256.",
      "Instance Store = physically attached, blazing I/O, but data GONE on stop/terminate/reboot — never for persistent data.",
      "Root EBS is deleted on terminate by default (DeleteOnTermination); change it via CLI on a running instance.",
      "Resizing EBS → must repartition the filesystem after.",
      "🚩 'persist data' → EBS/EFS/S3. 'fast scratch space' → Instance Store."
    ]
  },
  "6": {
        "hooks": [
      "aws configure sets default profile; --profile X switches accounts; commands run on 'default' otherwise.",
      "CLI is built on the Python SDK (boto3) — SDK = code against AWS (DynamoDB etc.), CLI = shell.",
      "SDK credential order: env vars → ~/.aws/credentials → instance profile (IAM role). NEVER credentials in code.",
      "No region configured → us-east-1 is the default.",
      "SDKs retry throttled calls automatically with exponential backoff (429s).",
      "EFS = shared NFS for many Linux EC2 across AZs; EBS = 1 instance/1 AZ; S3 = object, many apps."
    ]
  },
  "7": {
        "hooks": [
      "Week 1 memory anchors: IAM global • SGs stateful allow-only • EBS/1 AZ vs EFS/multi-AZ vs S3/object vs Instance Store/ephemeral • Golden AMI fixes slow boots.",
      "EC2 issues decoder: SSH timeout → security group; connection refused → app not running; permission denied → key perms.",
      "Re-state: one IAM role per app, instance roles for EC2, no hardcoded keys, Policy Simulator + --dry-run to validate."
    ]
  },
  "8": {
        "hooks": [
      "Bucket name rules: globally unique, lowercase, no underscore, 3-63 chars, not an IP.",
      "Objects = key (full path), no real folders; max 5TB; >100MB use multipart upload (parallel + retry parts).",
      "3500 PUT / 5500 GET per prefix per second → design keys with high-cardinality prefixes (not user-123, user-456).",
      "Versioning at bucket level: same key → versions 1,2,3; pre-versioning files get version 'null'; delete creates a delete marker (recoverable).",
      "Consistency: new PUT → read-after-write consistent; overwrites/deletes → eventually consistent.",
      "Storage classes hot→cold: S3 Standard → Intelligent-Tiering → IA → OneZone-IA → Glacier Instant → Glacier Flexible → Glacier Deep Archive. Lifecycle rules transition automatically.",
      "S3 is the storage of objects + metadata + tags (up to 10) + version ID."
    ]
  },
  "9": {
        "hooks": [
      "Bucket policy (resource-based JSON, cross-account OK) vs ACL (legacy, per-object, fine-grained). IAM policy = identity-based.",
      "Bucket policies are the tool for: public access, force-encryption (check x-amz-server-side-encryption header), cross-account grants.",
      "Static website endpoint: http://<bucket>.s3-website-<region>.amazonaws.com — 403 means bucket policy denies public reads. NO HTTPS without CloudFront.",
      "S3 Events → SQS / SNS / Lambda; with versioning enabled, concurrent writes to a non-versioned object can lose an event.",
      "Replication needs versioning; CRR (disaster/latency) vs SRR (logs/aggregation).",
      "Object Lock (WORM): Compliance (nothing can delete, even root) vs Governance (retention/legal hold)."
    ]
  },
  "10": {
        "hooks": [
      "SSE-S3 (header x-amz-server-side-encryption: AES256) vs SSE-KMS (aws:kms, audit via CloudTrail, KMS rate limits) vs SSE-C (you send the key each request, HTTPS mandatory, S3 discards it) vs Client-side (encrypt before upload).",
      "Force encryption in transit: bucket policy with aws:SecureTransport=false → Deny.",
      "Presigned URLs: temp access (up to 7 days) with your creds — secure upload/download without sharing keys.",
      "CORS = browser-level; a static site on bucket A loading files from bucket B needs a CORS config on B.",
      "S3 Transfer Acceleration: edge-location uploads, endpoint <bucket>.s3-accelerate.amazonaws.com (name must be DNS-compliant, no dots).",
      "S3 Object Lambda: transform data ON THE FLY as it's returned (e.g., redact PII) — no code in the app.",
      "Access logs → another bucket; audit API calls → CloudTrail."
    ]
  },
  "11": {
        "hooks": [
      "ALB = Layer 7: path + host routing, target groups, WebSocket, sticky sessions, ideal for microservices/containers. NLB = Layer 4: TCP/UDP, static IPs, millions rps, ~100ms. GLB = virtual appliances.",
      "ALB: client IP is in X-Forwarded-For (plus X-Forwarded-Port, X-Forwarded-Proto). NLB sees the real client IP directly.",
      "Stickiness set at TARGET GROUP level, cookie-based, generated by the ALB (not the app).",
      "Errors: 4xx = client, 5xx = app, 503 = at capacity or no targets. Health checks = port + path (e.g., /health).",
      "ASG = min/desired/max from a launch template (AMI, user data, role, SG); scale on CPU/SQS-depth/custom CloudWatch metric; terminates unhealthy targets.",
      "ASG is FREE (you pay for instances); instances under an ASG auto-restart if terminated.",
      "🚩 'scale-out too slow because UserData is long' → pre-bake a Golden AMI."
    ]
  },
  "12": {
        "hooks": [
      "RDS = managed SQL, can't SSH. Multi-AZ = SYNC standby for DR (failover ~60-120s, 1 DNS name). Read replicas = ASYNC for reads (up to 15 MySQL/Maria/Postgres, 5 Oracle/SQLServer; need backups on).",
      "Read replicas: SELECT only, can be promoted, cross-region possible; apps must point at the replica endpoint.",
      "Backups: automated daily snapshot + transaction logs (7-35 days, point-in-time restore) + manual snapshots (forever).",
      "Encrypt an unencrypted RDS: snapshot → copy with encryption → restore → migrate. (You cannot just flip it on.)",
      "Aurora: MySQL/Postgres-compatible, 5x MySQL / 3x Postgres performance, storage auto-grows 10GB→128TB, 15 replicas <10ms lag, instant failover. Writer + Reader endpoints.",
      "Aurora Global DB: 1 primary + up to 5 secondary read regions, <1s lag, RTO <1min. Aurora Serverless: auto-scales, pay per second.",
      "'1040 Too Many Connections' → enable connection pooling (RDS Proxy).",
      "ElastiCache Redis (persistence, replicas, pub/sub, sessions, leaderboards) vs Memcached (multi-threaded, NO persistence/HA).",
      "Cache patterns: Lazy loading (cold but simple) + Write-through (fresh but churn) + TTL (delete/expire/LRU eviction)."
    ]
  },
  "13": {
        "hooks": [
      "Records: A = name→IPv4, AAAA = name→IPv6, CNAME = name→name (NOT for root/apex), ALIAS = name→AWS resource (apex OK, free).",
      "Routing policies: Simple, Weighted, Latency, Failover (health checks), Geolocation, Geoproximity (bias), Multi-value.",
      "SG = stateful, ALLOW-only, instance-level, reference IP/CIDR/other SG (NOT DNS names), default deny inbound / allow outbound.",
      "NACL = stateless, subnet-level, allow AND deny, ordered — must allow return traffic explicitly.",
      "VPC/subnet: public subnet (IGW) vs private subnet (NAT for outbound only). VPC Peering: no transitive, no overlapping CIDRs. VPC endpoints (Gateway: S3/DDB; Interface: others).",
      "VPC Flow Logs monitor traffic in/out of the VPC (audit, security).",
      "Troubleshoot: app not reachable (timeout) → security group. Connection refused → app isn't running."
    ]
  },
  "14": {
        "hooks": [
      "DynamoDB = NoSQL, distributed (horizontal scaling), 3-AZ replication, items ≤ 400KB.",
      "Keys: partition key (HASH, must be diverse) or partition + sort key (RANGE) — pair must be unique.",
      "RCU math: 1 RCU = 1 strongly-consistent read of 4KB OR 2 eventually-consistent reads of 4KB per second. WCU math: 1 WCU = 1 write of 1KB per second. Round up sizes!",
      "Default read = EVENTUALLY consistent; use ConsistentRead=true on GetItem/Query/Scan for strong.",
      "Query (on partition key, sort-key conditions, efficient) vs Scan (whole table, expensive, filter AFTER). Never Scan by default.",
      "Provisioned vs On-Demand capacity; exceed capacity → ProvisionedThroughputExceededException → exponential backoff.",
      "Burst credits let you briefly exceed capacity."
    ]
  },
  "15": {
        "hooks": [
      "CloudFront = CDN at 400+ edge locations; S3 origin must be locked down with OAC (Origin Access Control).",
      "Force HTTPS: Viewer Protocol Policy = 'Redirect HTTP to HTTPS' or 'HTTPS only'.",
      "Geo-aware headers exist automatically: e.g., CloudFront-Viewer-Country — use for geo-restriction/analytics.",
      "Signed URLs (single file) vs Signed Cookies (multiple files / member sites).",
      "Lambda@Edge runs at 4 hooks: viewer-request → origin-request → origin-response → viewer-response (A/B, auth, headers, image resize).",
      "CloudFront + S3 static site = the ONLY easy way to get HTTPS on an S3 website endpoint + global caching.",
      "Cache invalidation vs versioned filenames (prefer unique names over invalidation)."
    ]
  },
  "16": {
        "hooks": [
      "3 invocation types: RequestResponse (sync — API GW, ALB, Cognito), Event (async — S3, SNS, EventBridge; 2 retries over 6h), DryRun (test perms only).",
      "Async failures: retried ~3x then → DLQ or on-failure Destination (prefer destinations). Make functions IDEMPOTENT.",
      "Versions = immutable (never change $LATEST after publish); aliases = mutable pointers, enable weighted canary + blue/green.",
      "Env vars ≤ 4KB, KMS-encrypted for secrets.",
      "Limits: memory 128MB–10GB (more RAM = more vCPU; 1 vCPU at 1792MB), timeout ≤15min, /tmp 512MB–10GB, package 50MB zipped / 250MB unzipped.",
      "Execution role grants the function its permissions (logs, S3, DDB...).",
      "Stateless + reuse execution context: open DB connections OUTSIDE the handler.",
      "🚩 'share one Python library across 2 functions' → Lambda layer (into /opt)."
    ]
  },
  "17": {
        "hooks": [
      "Event source mapping (streams + queues): DDB/Kinesis = 1 iterator per shard, in order, whole batch retried on error (errors BLOCK the shard). SQS = long polling, batch 1-10, DLQ on the QUEUE not Lambda.",
      "SQS visibility timeout should be ≥ 6x the Lambda timeout.",
      "Concurrency: account limit ~1000; RESERVED concurrency = guaranteed pool (throttles the function), PROVISIONED = pre-warmed, no cold starts.",
      "Throttle → sync: 429 to caller; async: auto-retry then DLQ/destination.",
      "Lambda in a VPC gets an ENI; WITHOUT a NAT it has NO internet egress (classic trap) — add NAT or VPC endpoints.",
      "Cold start: first call slower. Mitigate: provisioned concurrency, smaller packages, no heavy module-load work.",
      "Layers (up to 5) into /opt for shared code; /tmp for files <10GB (not for permanent persistence → use S3).",
      "Always avoid recursive Lambda (it can bill you into the void)."
    ]
  },
  "18": {
        "hooks": [
      "Integration types: AWS_PROXY/LAMBDA (raw pass-through, you shape the response), HTTP/MOCK/AWS (custom mapping templates in VTL for request/response transformation, e.g., JSON↔SOAP).",
      "Changes only apply after a DEPLOYMENT to a STAGE; stage variables → Lambda aliases (${stageVariables.lambdaAlias}) for env-specific routing.",
      "Endpoint types: Edge-optimized (via CloudFront), Regional, Private (VPC endpoint).",
      "Auth: IAM (SigV4), Cognito User Pools (API GW validates the token), Lambda authorizer (custom), native JWT/OIDC (HTTP APIs).",
      "Caching per stage, default TTL 300s; flush or Cache-Control: max-age=0 to invalidate.",
      "Throttling → 429; account-wide 10k rps default. Usage plans + API keys (client sends x-api-key header) for monetized APIs.",
      "Errors: 502 = bad backend output, 504 = integration timeout, 4xx = client. Latency max 29s.",
      "CORS: OPTIONS preflight must return Access-Control-Allow-Methods/-Headers/-Origin.",
      "REST (usage plans, mapping templates) vs HTTP (cheaper, lower latency, OIDC/OAuth2/CORS, no API keys) vs WebSocket (chat/games — 2-way push)."
    ]
  },
  "19": {
        "hooks": [
      "SQS = PULL (poll), delete after processing, retention 1-14 days (default 4), message ≤256KB.",
      "Visibility timeout: message hidden while processed; default 30s, up to 12h; if not deleted in time → redelivered (consumer must be IDEMPOTENT).",
      "DLQ: after maxReceiveCount a message moves to a DLQ (set DLQ retention to 14 days; FIFO DLQ must pair with FIFO).",
      "Long polling (WaitTimeSeconds 1-20) = cheaper + fewer empty responses — always prefer over short polling.",
      "FIFO: ordering + exactly-once + 300 msg/s (3000 batched), name ends in '.fifo', MessageGroupId for per-group ordering + parallel consumers.",
      "Delay queues: DelaySeconds up to 15 min.",
      "Extended Client: payload >256KB → store in S3, queue holds a pointer.",
      "SNS = PUSH pub/sub: SQS, Lambda, HTTP/S, email, SMS, mobile push. Fan-out = SNS → multiple SQS so each service gets its own copy.",
      "🚩 'send one event to many downstream systems reliably' → SNS fan-out. 'duplicates unacceptable + order' → SQS FIFO."
    ]
  },
  "20": {
        "hooks": [
      "Kinesis Data Streams = real-time, pull, ordered per shard, replayable, immutable records, retention 24h-365d.",
      "Shard capacity: 1MB/s or 1000 msgs/s write, 2MB/s read. Add shards to scale. Partition key hash decides the shard.",
      "PutRecord with a poorly distributed partition key → hot shard → ProvisionedThroughputExceeded → backoff / more shards / better keys.",
      "Kinesis Firehose = near-real-time (buffered ~60s) push to S3/Redshift/Elasticsearch — no shards to manage, pay per GB.",
      "Kinesis Analytics = SQL on live streams.",
      "SQS vs SNS vs Kinesis: SQS=pull+delete, SNS=push fan-out, Kinesis=pull+replay+ordering (big-data/ETL).",
      "Step Functions = visual JSON state machine orchestrating Lambda; states: Task, Choice, Wait, Parallel, Map, Pass. Up to 1 year.",
      "Retries: exponential backoff (IntervalSeconds, MaxAttempts, BackoffRate); Catch → move to another state. Include error data in messages.",
      "Standard SF (exactly-once, 1yr, pricier) vs Express SF (at-least-once, ≤5min, 100k/s, cheap)."
    ]
  },
  "21": {
        "hooks": [
      "GSI = different PK/SK, own capacity, eventual ONLY, can be added later. LSI = same PK, different SK, table creation ONLY, strong or eventual. Both ≤5 per table.",
      "GSI trap: throttled GSI writes throttle the MAIN table even if its WCU is fine.",
      "Conditional writes = atomic 'insert if attribute_not_exists' / optimistic locking with a version attr — data is never silently overwritten.",
      "Transactions (TransactWriteItems/GetItems) = all-or-nothing, up to 100 items, 2x RCU/WCU.",
      "Streams: ordered change log, 24h retention, view options KEYS_ONLY / NEW_IMAGE / OLD_IMAGE / NEW_AND_OLD_IMAGES; records NOT retroactive; triggers Lambda.",
      "TTL: epoch-second attribute, auto-delete within ~48h, NO extra cost, great for sessions/expiry; recoverable via streams.",
      "DAX: in-memory cache (microsecond reads), drop-in API, default 5-min TTL, fixes HOT KEYS, up to 10 nodes.",
      "Write sharding: add a random suffix to a low-cardinality partition key to distribute hot writes.",
      "Large objects: file → S3, metadata → DynamoDB (400KB limit) — classic pattern.",
      "Session state: DynamoDB (serverless) or ElastiCache (in-memory) both work; NOT EBS/Instance Store (not shared), S3 (too slow)."
    ]
  },
  "22": {
        "hooks": [
      "ECS stack: Cluster → Service (keeps desired task count) → Tasks (from a Task Definition) → Containers.",
      "Task definition fields to remember: image, cpu/memory, port mappings, env vars + secrets, IAM roles, log driver.",
      "Launch types: Fargate (serverless, no EC2 — default answer) vs EC2 (you manage capacity).",
      "Fargate requires awsvpc network mode (each task = its own ENI + private IP + security group).",
      "Two IAM roles: TASK role (what the container can access) vs EXECUTION role (pull image from ECR, fetch secrets, write logs).",
      "Secrets in ECS → reference Secrets Manager / SSM in the task definition, never plaintext env vars.",
      "ECR = private Docker registry, does NOT build images; auth via aws ecr get-login-password | docker login; lifecycle policies prune old images.",
      "EKS = Kubernetes → answer EKS whenever the exam says Kubernetes API.",
      "Services auto-recover failed tasks; standalone RunTask tasks do not."
    ]
  },
  "23": {
        "hooks": [
      "EB = PaaS over EC2+ASG+ELB+RDS; 3 components: Application → Application Version → Environment (dev/staging/prod).",
      "Tiers: Web server (ALB + ASG) vs Worker (SQS + cron).",
      "Deployment policies ranked by speed/cost: All-at-once (fastest, downtime) → Rolling (bucket by bucket, below capacity) → Rolling w/ additional batch (keeps capacity, small cost) → Immutable (new ASG, zero downtime, double cost, quick rollback) → Blue/Green (separate env + swap CNAME/URL).",
      "Immutable = new ASG + health check then swap; rollback = terminate the new ASG. Best for prod 'zero downtime'.",
      "Config in code: .ebextensions/*.config (YAML) — option_settings, extra resources (RDS/DDB/ElastiCache), X-Ray daemon; resources deleted with the environment.",
      "Deploy slowness fix: package dependencies WITH the source (don't resolve on each EC2 at boot).",
      "EB CLI: eb create / deploy / status / health / logs / terminate.",
      "RDS inside EB dies with the environment — launch RDS separately and reference via env vars (exam-favourite)."
    ]
  },
  "24": {
        "hooks": [
      "Template sections: Parameters (user input), Mappings (static vars, Fn::FindInMap), Conditions (Fn::If/Equals/And/Or/Not), Resources (REQUIRED), Outputs (exports), Metadata.",
      "Key functions: !Ref (param value or resource physical ID), !GetAtt (attributes), !Sub (${var} substitution), !Join, !FindInMap, !ImportValue (cross-stack).",
      "Params vs Mappings: use Parameters for real user-specific values; Mappings when values are known ahead (region/env/AMI).",
      "Change sets = PREVIEW what an update changes without applying (safe). Drift detection finds manual changes.",
      "Update behaviors: UPDATE_WITHOUT_INTERRUPTION vs UPDATE_WITH_INTERRUPTION vs REPLACE.",
      "Rollbacks: creation failure → everything rolls back (can disable to debug); update failure → rollback to last good state.",
      "Cross-stack: Outputs + Export, import with Fn::ImportValue. You CANNOT delete a stack whose outputs are imported.",
      "Stack Sets deploy the same stack across many accounts/regions. Nested stacks compose other templates.",
      "DeletionPolicy: Retain / Delete / Snapshot decides what happens when a stack is deleted.",
      "You read CloudFormation on the exam — you rarely write it. Remember the syntax, not the full API."
    ]
  },
  "25": {
        "hooks": [
      "CodeCommit = private git (IAM auth, HTTPS/SSH); NOTE: no longer available for NEW accounts (only existing repos) — don't pick it as 'create a new repo'.",
      "CodeBuild = build/test; buildspec.yml at repo ROOT; phases Install → Pre-build → Build → Post-build; artifacts → S3 (KMS-encrypted); secrets via SSM.",
      "CodeDeploy = deploy to EC2/on-prem (needs the CodeDeploy agent) or Lambda; config via appspec.yml + application revision.",
      "CodeDeploy hook order (IN-PLACE — memorise): ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService.",
      "Deployment configs: One-at-a-time (slow, stops on fail), Half-at-a-time, All-at-once (fast, downtime), Custom (min healthy %).",
      "CodeDeploy Blue/Green = new ASG + health checks then swap (EC2 only; not on-prem).",
      "CodePipeline = orchestration: Source (CodeCommit/S3/GitHub) → Build (CodeBuild) → Deploy (CodeDeploy/Beanstalk/ECS/CFN), with manual approval stages.",
      "Pipeline artifacts are stored in an S3 bucket (enable versioning). Pipeline state changes → CloudWatch Events → SNS.",
      "Failing stage → pipeline stops; check the pipeline's IAM service role permissions first."
    ]
  },
  "26": {
        "hooks": [
      "Secrets Manager = auto-rotating DB credentials (integration with RDS), ~$0.40/secret/mo. SSM Parameter Store = free config, SecureString for secrets, no rotation (build your own Lambda).",
      "KMS: envelope encryption, 4KB limit per encrypt/decrypt call (use AWS Encryption SDK for bigger data).",
      "KMS auto-rotation works ONLY for symmetric keys (not asymmetric, not imported/customer keys).",
      "KMS key types: AWS-managed vs Customer-managed (you control rotation, policy, alias) vs AWS-owned. Grants + key policies control access.",
      "Cognito User Pool = user DIRECTORY (sign-up, MFA, JWT, federated social/SAML) — 'who is the user'. Identity Pool = temporary AWS CREDENTIALS (STS) to hit S3/DDB directly — 'what can they access'. Cognito Sync deprecated → AppSync.",
      "Identity Pools: default IAM roles for authenticated + guest (unauthenticated) users; fine-grained via policy variables (user_id).",
      "User Pool triggers: Lambda hooks at sign-up/auth (pre-sign-up, post-confirmation, pre-token-generation, custom-message, migrate-user).",
      "Cognito vs IAM: Cognito = external/customer users, IAM = internal/company users.",
      "🚩 'must rotate the DB password automatically' → Secrets Manager. 'free config + some encrypted values' → Parameter Store SecureString."
    ]
  },
  "27": {
        "hooks": [
      "CloudWatch = performance/monitoring. CloudTrail = WHO made which API call (audit). Config = COMPLIANCE + state-change notifications.",
      "EC2 metrics default every 5 min; DETAILED monitoring = every 1 min (and better ASG scaling).",
      "Memory/Swap are NOT default EC2 metrics — push them as custom metrics (PutMetricData) from the instance.",
      "Alarm states: OK / INSUFFICIENT_DATA / ALARM → actions: SNS, EC2 stop/reboot, ASG scale.",
      "Logs architecture: log GROUPS (per app) → log STREAMS (per instance/container); KMS encryption at the group level; export to S3/Elasticsearch.",
      "CloudWatch Events/EventBridge = react to state changes (EC2 state, pipeline failures) + cron → Lambda/SNS/SQS.",
      "X-Ray = distributed tracing; segments + subsegments; ANNOTATIONS are indexed (filterable), METADATA is not.",
      "X-Ray needs: X-Ray SDK in code + daemon on EC2 (or auto-integration on Lambda/API GW) + IAM write permission (AWSX-RayWriteOnlyAccess).",
      "Trace header: X-Amzn-Trace-Id. Environment vars: AWS_XRAY_CONTEXT_MISSING, AWS_XRAY_DAEMON_ADDRESS.",
      "CloudTrail is ENABLED BY DEFAULT (management events, 90 days); create a trail → S3/CloudWatch for long-term audit.",
      "🚩 'find which user deleted a bucket' → CloudTrail. 'why is my API slow end-to-end' → X-Ray. 'react when EC2 stops' → EventBridge."
    ]
  },
  "28": {
        "hooks": [
      "429 / ThrottlingException / ProvisionedThroughputExceeded → exponential backoff + jitter; SDKs do this automatically.",
      "BatchGetItem returns UnprocessedKeys → retry ONLY those keys, not the whole batch.",
      "DynamoDB hot-key fixes: spread partition keys, exponential backoff, DAX for reads.",
      "SQS consumers: at-least-once delivery → make handlers idempotent (dedupe by message ID / business key).",
      "Lambda async: retries for ~6h with growing intervals → use DLQ or on-failure destinations; keep functions idempotent.",
      "Streams (DDB/Kinesis): the whole failed batch is retried and can block the shard → configure retry limits, bisect-on-error, and a destination.",
      "Set SQS visibility timeout ≥ 6x Lambda timeout so in-flight messages aren't double-processed.",
      "'Too many connections' to RDS from Lambda → RDS Proxy / connection pooling.",
      "Cold starts → provisioned concurrency + lighter packages. Logging → CloudWatch (structured logs + metric filters)."
    ]
  },
  "29": {
        "hooks": [
      "Mock-exam mode: read the LAST sentence first (that's where the constraint lives).",
      "Eliminate 2 answers by their service family, then pick by the qualifier word (LEAST cost / LEAST management / SECURITY / ZERO downtime).",
      "Two answers that differ by one service name → recall the DECIDING feature (Secrets Manager=rotation, Parameter Store=free config, DAX=cache, RDS Proxy=pooling)."
    ]
  },
  "30": {
        "hooks": [
      "Last-night pass: IAM roles not keys • EBS/EFS/S3/Instance-Store split • Lambda stateless + /tmp • DDB key design + GSI/LSI • SQS pull vs SNS push • Kinesis shards • CodeDeploy hook order • Secrets Manager rotation • X-Ray vs CloudTrail vs CloudWatch.",
      "Answer strategy: ~2 min/question, flag hard ones, answer EVERYTHING (no negative marking), sleep 8h, bring water + ID."
    ]
  }
};