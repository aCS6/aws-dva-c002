/* Exam-focused visual infographics for the 30-day DVA-C02 plan.
   Diagram types:
   - flow:      linear A → B → C
   - compare:   2-4 side-by-side columns (with optional tag)
   - fanout:    one source → many targets (SNS fan-out, replicas)
   - stack:     vertical layers / decision pickers
   - decision:  diamond + yes/no branches
   "topics" holds diagrams for the Deeper-dive (Notion) topic digests. */
window.DVA_DIAGRAMS = {
  "1": [
    { "title": "AWS global footprint", "type": "stack", "rows": [
      ["Edge locations", "CloudFront + Route 53 cache near users"],
      ["AZ", "1+ data centers — isolated, low-latency fiber"],
      ["Region", "3+ AZs in one geography"],
      ["Your account", "resources run in a region you pick"] ] },
    { "title": "Regional vs global services", "type": "compare", "cols": [
      { "head": "🌐 Global", "tag": "no region", "items": ["IAM", "Route 53", "CloudFront", "WAF"] },
      { "head": "📍 Regional", "tag": "pick a region", "items": ["EC2", "S3", "RDS", "Lambda", "DynamoDB"] } ] },
    { "title": "Which region?", "type": "decision", "label": "Compliance says data must stay in country?",
      "yes": "Pick that region", "no": "Nearest users?",
      "no2": "Yes → lowest latency region · No → cost/features" }
  ],
  "2": [
    { "title": "IAM policy evaluation — who wins", "type": "decision",
      "label": "Is there an explicit DENY?", "yes": "Deny — final answer",
      "no": "Is there an explicit ALLOW?", "no2": "Yes → Allow · No → default Deny" },
    { "title": "IAM building blocks", "type": "compare", "cols": [
      { "head": "Users", "items": ["One human / one app", "Access keys for CLI/SDK"] },
      { "head": "Groups", "items": ["Named set of users", "Policies attach here"] },
      { "head": "Roles", "items": ["Temporary, assumed", "Services & cross-account"] } ] },
    { "title": "Policy anatomy", "type": "stack", "rows": [
      ["Effect", "Allow or Deny"],
      ["Action", "the API calls, e.g. s3:GetObject"],
      ["Resource", "the ARN(s) it applies to"],
      ["Condition", "optional — MFA, source IP, time"] ] }
  ],
  "3": [
    { "title": "How a role gets assumed (STS)", "type": "flow",
      "steps": ["You / service", "AssumeRole → STS", "Temporary credentials", "Access with role's policy"] },
    { "title": "Trust vs permissions policy", "type": "compare", "cols": [
      { "head": "Trust policy", "items": ["WHO may assume", "e.g. ec2.amazonaws.com"] },
      { "head": "Permissions policy", "items": ["WHAT it may do after", "e.g. s3:GetObject"] } ] },
    { "title": "Cross-account access", "type": "flow",
      "steps": ["User in Account A", "AssumeRole (trust allows A)", "STS credentials", "Resources in Account B"] }
  ],
  "4": [
    { "title": "EC2 purchase options", "type": "compare", "cols": [
      { "head": "On-Demand", "tag": "flexible", "items": ["Pay per second", "No commitment", "$$$"] },
      { "head": "Reserved", "tag": "steady", "items": ["1-3 yr", "Up to ~60% off", "$$"] },
      { "head": "Spot", "tag": "cheapest", "items": ["Up to ~90% off", "Interruptible", "$"] } ] },
    { "title": "Instance type mnemonic", "type": "compare", "cols": [
      { "head": "t", "items": ["burstable (bursting)"] },
      { "head": "a/c", "items": ["general / compute"] },
      { "head": "r/m", "items": ["memory / RAM-heavy"] },
      { "head": "g", "items": ["GPU, graphics"] } ] },
    { "title": "SG vs NACL", "type": "compare", "cols": [
      { "head": "SG — instance", "items": ["Allow only", "Stateful", "On the ENI"] },
      { "head": "NACL — subnet", "items": ["Allow + deny", "Stateless", "Numbered rules"] } ] },
    { "title": "Stop vs terminate vs hibernate", "type": "compare", "cols": [
      { "head": "Stop", "items": ["EBS kept", "public IP may change"] },
      { "head": "Terminate", "items": ["Root EBS deleted", "frees the instance"] },
      { "head": "Hibernate", "items": ["RAM → EBS root", "fast boot, max 60d"] } ] }
  ],
  "5": [
    { "title": "Pick the right storage", "type": "decision",
      "label": "Durable data that must survive reboot?",
      "yes": "EBS (block disk)", "no": "Need shared files across instances?",
      "no2": "Yes → EFS · No → Instance Store (ephemeral)" },
    { "title": "EBS volume types", "type": "compare", "cols": [
      { "head": "gp2/gp3", "items": ["General SSD", "boot + apps"] },
      { "head": "io1/io2", "items": ["High-IOPS SSD", "databases"] },
      { "head": "st1/sc1", "items": ["HDD throughput", "big sequential"] } ] },
    { "title": "Snapshot → AMI", "type": "flow",
      "steps": ["EBS volume", "Take snapshot (S3, incremental)", "Register AMI", "Launch clones / share cross-account"] }
  ],
  "6": [
    { "title": "EFS — one file system, many instances", "type": "fanout",
      "from": "EFS (shared NFS)", "to": ["EC2 in AZ-A", "EC2 in AZ-B", "EC2 in AZ-C"] },
    { "title": "CLI credentials — resolution order", "type": "stack", "rows": [
      ["1. CLI flags", "--region, --profile win"],
      ["2. Environment vars", "AWS_ACCESS_KEY_ID..."],
      ["3. Shared credentials file", "~/.aws/credentials"],
      ["4. IAM role (instance profile)", "last resort — usually right"] ] },
    { "title": "EFS lifecycle", "type": "flow",
      "steps": ["Hot files (EFS Standard)", "Not accessed for N days", "EFS-IA (cheaper)", "Retrieve on demand"] }
  ],
  "7": [
    { "title": "The storage ladder", "type": "stack", "rows": [
      ["S3 — object", "unlimited, durable, HTTP API"],
      ["EFS — shared POSIX", "many Linux instances"],
      ["EBS — block", "one instance, durable"],
      ["Instance Store — ephemeral", "fast, lost on stop"] ] },
    { "title": "Compute ladder", "type": "flow",
      "steps": ["EC2 (VMs)", "Containers (ECS/Fargate)", "Lambda (serverless)", "less servers to manage →"] },
    { "title": "'You need X' → which service", "type": "stack", "rows": [
      ["Serverless function", "Lambda"],
      ["Shared Linux files", "EFS"],
      ["Durable block disk", "EBS"],
      ["Unlimited objects", "S3"],
      ["Message between apps", "SQS"] ] }
  ],
  "8": [
    { "title": "S3 storage classes — hot to cold", "type": "flow",
      "steps": ["Standard", "Standard-IA", "Glacier Flexible", "Glacier Deep Archive"] },
    { "title": "S3 + versioning", "type": "flow",
      "steps": ["Object uploaded", "New version added", "Delete → delete marker", "Old version recoverable"] },
    { "title": "Multipart upload (big files)", "type": "flow",
      "steps": ["CreateUpload", "Parts in parallel", "CompleteUpload", "Faster + resumable >5 GB"] }
  ],
  "9": [
    { "title": "Lifecycle: class transitions", "type": "stack", "rows": [
      ["Day 0", "S3 Standard — hot"],
      ["Day 30", "Standard-IA — cooled"],
      ["Day 90", "Glacier — archived"],
      ["Day 365", "Delete"] ] },
    { "title": "Replication", "type": "compare", "cols": [
      { "head": "SRR — same region", "items": ["Logs aggregation", "test → prod sync"] },
      { "head": "CRR — cross region", "items": ["Disaster recovery", "lower latency users"] } ] },
    { "title": "S3 event notifications", "type": "fanout",
      "from": "S3 object created (Put)", "to": ["Lambda (async)", "SQS queue", "SNS topic"] }
  ],
  "10": [
    { "title": "S3 encryption — who holds the keys", "type": "compare", "cols": [
      { "head": "SSE-S3", "items": ["AWS-managed AES-256", "default, free"] },
      { "head": "SSE-KMS", "items": ["You manage KMS keys", "rotation + audit"] },
      { "head": "Client-side", "items": ["You encrypt first", "AWS never sees plaintext"] } ] },
    { "title": "Enforce encryption", "type": "flow",
      "steps": ["Upload", "No encryption header?", "Bucket policy DENY (aws:SecureTransport / SSE)", "Only encrypted objects land"] },
    { "title": "Presigned URL flow", "type": "flow",
      "steps": ["App signs URL", "URL handed to client", "Client PUT/GET to S3 directly", "Valid up to 7 days"] }
  ],
  "11": [
    { "title": "Web tier: ALB + ASG", "type": "flow",
      "steps": ["Users", "ALB (path/host routing)", "ASG of EC2 instances", "Target group health checks"] },
    { "title": "Load balancer choice", "type": "decision",
      "label": "Need HTTP/HTTPS path routing?", "yes": "ALB — layer 7",
      "no": "TCP/UDP + static IP?", "no2": "Yes → NLB · No → GWLB (proxy)" },
    { "title": "ASG scaling policies", "type": "compare", "cols": [
      { "head": "Target tracking", "items": ["keep CPU ~50%", "auto-creates alarms"] },
      { "head": "Step", "items": ["scale by size of breach"] },
      { "head": "Scheduled", "items": ["predictable load times"] } ] },
    { "title": "Connection draining", "type": "flow",
      "steps": ["Instance unhealthy", "Stops new connections", "In-flight requests finish", "Deregistered after delay (0-3600s)"] }
  ],
  "12": [
    { "title": "Multi-AZ vs read replicas", "type": "compare", "cols": [
      { "head": "Multi-AZ", "items": ["Synchronous", "for failover (HA)", "no read scaling"] },
      { "head": "Read Replicas", "items": ["Async copies", "for read scaling", "up to 15"] } ] },
    { "title": "Fix 'too many connections'", "type": "flow",
      "steps": ["Lambda / many clients", "RDS Proxy (pools connections)", "RDS database", "graceful failover"] },
    { "title": "ElastiCache: Redis vs Memcached", "type": "compare", "cols": [
      { "head": "Redis", "items": ["replication, sorting (sets)", "pub/sub, persistence"] },
      { "head": "Memcached", "items": ["pure cache, simple", "multi-threaded"] } ] },
    { "title": "Caching patterns", "type": "flow",
      "steps": ["Read → cache hit?", "Yes → return cached", "No → read DB, store with TTL", "Write → invalidate/update cache"] }
  ],
  "13": [
    { "title": "VPC layout", "type": "stack", "rows": [
      ["Internet Gateway", "entry/exit for public traffic"],
      ["Public subnet", "route to IGW · NAT Gateway lives here"],
      ["Private subnet", "no direct internet"],
      ["NAT Gateway", "outbound-only for private instances"],
      ["VPC endpoints", "private path to S3/DynamoDB"] ] },
    { "title": "Route 53 routing policies", "type": "compare", "cols": [
      { "head": "Weighted", "items": ["split % across targets", "canary testing"] },
      { "head": "Latency", "items": ["route to lowest latency"] },
      { "head": "Failover", "items": ["primary + backup", "health-check driven"] } ] },
    { "title": "VPC endpoint types", "type": "compare", "cols": [
      { "head": "Gateway", "items": ["S3 and DynamoDB only", "free, uses route table"] },
      { "head": "Interface (PrivateLink)", "items": ["most other services", "ENI in your subnet, costs $"] } ] },
    { "title": "Public subnet recipe", "type": "flow",
      "steps": ["Subnet in AZ", "auto-assign public IP", "route table → IGW", "now it's public"] }
  ],
  "14": [
    { "title": "Keys: partition + sort", "type": "compare", "cols": [
      { "head": "Partition key only", "items": ["one item per key", "PK = user_id"] },
      { "head": "Partition + sort", "items": ["many per partition", "PK=user, SK=timestamp"] } ] },
    { "title": "Query vs scan", "type": "decision",
      "label": "Can I locate items by a key?",
      "yes": "Query — only keys it touches", "no": "Scan — reads everything",
      "no2": "Better: add a GSI to turn scan into query" },
    { "title": "DynamoDB access picker", "type": "stack", "rows": [
      ["Know the primary key", "GetItem (fastest)"],
      ["Need a key range", "Query"],
      ["Different partition key", "GSI (eventual)"],
      ["Microsecond reads", "DAX (cache)"],
      ["Expire records", "TTL"],
      ["React to writes", "Streams + Lambda"] ] },
    { "title": "Capacity math", "type": "stack", "rows": [
      ["1 RCU", "1 strong read/s of 4 KB"],
      ["1 WCU", "1 write/s of 1 KB"],
      ["Round up", "7 KB item → 2 units (8 KB)"],
      ["Reads", "eventually-consistent = half cost"] ] }
  ],
  "15": [
    { "title": "CloudFront — caching at the edge", "type": "flow",
      "steps": ["User (edge location)", "CloudFront cache", "Cache miss → origin", "S3 / ALB origin"] },
    { "title": "Lock down the origin", "type": "flow",
      "steps": ["CloudFront", "OAC/OAI (only CloudFront allowed)", "Private S3 bucket"] },
    { "title": "Lambda@Edge events", "type": "flow",
      "steps": ["Viewer request", "Origin request", "Origin response", "Viewer response"] },
    { "title": "Cache invalidation", "type": "decision",
      "label": "Deployed a new build?",
      "yes": "Rename files (versioned names)", "no": "Invalidate cached paths",
      "no2": "Versioned names avoid invalidation cost" }
  ],
  "16": [
    { "title": "Lambda invocation models", "type": "compare", "cols": [
      { "head": "Synchronous", "items": ["caller waits", "API Gateway, SDK", "retries to caller"] },
      { "head": "Asynchronous", "items": ["202 immediately", "S3, EventBridge, SNS", "retry 0-2 then DLQ"] },
      { "head": "Event source mapping", "items": ["polling", "DynamoDB streams, SQS", "per-shard order"] } ] },
    { "title": "Versions → aliases", "type": "flow",
      "steps": ["$LATEST (mutable)", "Publish v1 (immutable)", "Alias 'prod' → v1", "Flip / canary %"] },
    { "title": "Anatomy of a function", "type": "stack", "rows": [
      ["Handler", "entry point (event, context)"],
      ["Environment variables", "config, ≤4 KB, KMS-encrypted"],
      ["Layers", "shared deps, ≤5 layers"],
      ["/tmp", "ephemeral storage 512MB–10GB"] ] },
    { "title": "Key limits", "type": "stack", "rows": [
      ["Memory", "128 MB – 10 GB"],
      ["Timeout", "up to 15 minutes"],
      ["Package", "50 MB zip / 250 MB unzipped"],
      ["Ephemeral disk", "up to 10 GB"] ] }
  ],
  "17": [
    { "title": "Concurrency controls", "type": "compare", "cols": [
      { "head": "Reserved", "items": ["guaranteed slice", "caps max, no warm"] },
      { "head": "Provisioned", "items": ["pre-warmed", "kills cold starts", "billed while ready"] } ] },
    { "title": "Cold start anatomy", "type": "flow",
      "steps": ["Cold call", "Load runtime + deps", "Init handler", "Run → slower first call"] },
    { "title": "Async failure path", "type": "flow",
      "steps": ["Async invoke", "Function fails", "Retry (0-2, backoff)", "DLQ / destination"] },
    { "title": "Fix cold starts", "type": "stack", "rows": [
      ["Provisioned concurrency", "pre-warm instances"],
      ["Smaller layers", "less to load"],
      ["Lighter runtime", "faster init"],
      ["SnapStart (Java)", "snapshot restore"] ] }
  ],
  "18": [
    { "title": "API Gateway anatomy", "type": "flow",
      "steps": ["Client (HTTPS)", "API Gateway (auth · throttle · cache)", "Lambda / HTTP / service", "Stage: dev / prod"] },
    { "title": "Which API type?", "type": "decision",
      "label": "Real-time two-way chat?", "yes": "WebSocket API",
      "no": "Need usage plans + API keys?", "no2": "Yes → REST API · No → HTTP API" },
    { "title": "Auth options", "type": "compare", "cols": [
      { "head": "IAM (SigV4)", "items": ["AWS identities", "roles/creds"] },
      { "head": "Cognito", "items": ["app users, JWT"] },
      { "head": "Lambda authorizer", "items": ["custom token / 3rd-party", "full control"] } ] },
    { "title": "CORS preflight", "type": "flow",
      "steps": ["Browser sends OPTIONS", "API Gateway returns Access-Control-Allow-Origin", "Real request proceeds", "Else: 'No CORS header' error"] }
  ],
  "19": [
    { "title": "SQS vs SNS", "type": "compare", "cols": [
      { "head": "SQS — pull", "items": ["consumers poll", "at-least-once", "FIFO = exactly-once"] },
      { "head": "SNS — push", "items": ["pub/sub to many", "no ordering", "fan-out"] } ] },
    { "title": "Fan-out pattern", "type": "fanout",
      "from": "SNS Topic", "to": ["SQS queue A", "SQS queue B", "Lambda / email / SMS"] },
    { "title": "Event picker", "type": "stack", "rows": [
      ["One consumer buffer", "SQS"],
      ["Every subscriber reacts", "SNS fan-out"],
      ["Rule-based routing", "EventBridge"],
      ["Ordered workflow steps", "Step Functions"],
      ["DB change event", "DynamoDB Streams"],
      ["File upload event", "S3 notification"] ] },
    { "title": "SQS lifecycle", "type": "flow",
      "steps": ["Producer sends", "Message visible", "Consumer polls (visibility timeout)", "Delete → processed · or retries → DLQ"] }
  ],
  "20": [
    { "title": "Kinesis vs SQS", "type": "compare", "cols": [
      { "head": "Kinesis", "items": ["ordered streams", "replayable", "partition key → shard"] },
      { "head": "SQS", "items": ["message queue", "decouple", "no replay"] } ] },
    { "title": "Kinesis anatomy", "type": "flow",
      "steps": ["Producers", "Shards (partition key routes)", "Consumers (poll per shard)", "Replay up to 365 days"] },
    { "title": "Step Functions states", "type": "flow",
      "steps": ["Start", "Choice", "Wait / Parallel / Map", "Task (call service)", "Fail or Succeed"] },
    { "title": "Standard vs Express", "type": "compare", "cols": [
      { "head": "Standard", "items": ["up to 1 year", "exactly-once", "billed per transition"] },
      { "head": "Express", "items": ["up to 5 min", "100k exec/s", "history in CloudWatch only"] } ] }
  ],
  "21": [
    { "title": "React to changes: streams → Lambda", "type": "flow",
      "steps": ["DynamoDB item change", "DynamoDB Streams (24h log)", "Lambda trigger", "Notify / denormalize / sync"] },
    { "title": "Speed up reads", "type": "compare", "cols": [
      { "head": "DAX", "items": ["in-memory cache", "microsecond reads"] },
      { "head": "GSI", "items": ["alternate query pattern"] },
      { "head": "TTL", "items": ["auto-expire, free"] } ] },
    { "title": "GSI vs LSI", "type": "compare", "cols": [
      { "head": "GSI", "items": ["different partition key", "eventual reads", "add after table"] },
      { "head": "LSI", "items": ["same partition key", "strong reads possible", "create with table"] } ] },
    { "title": "Hot partition fix", "type": "flow",
      "steps": ["One key gets all the writes", "Add random suffix to partition key", "Writes spread across partitions", "Reads aggregate via GSI/scan"] }
  ],
  "22": [
    { "title": "ECS stack", "type": "stack", "rows": [
      ["Cluster", "pool of capacity"],
      ["Service", "keeps desired task count"],
      ["Task", "runs from a task definition"],
      ["Container(s)", "the image from ECR"] ] },
    { "title": "Launch types", "type": "compare", "cols": [
      { "head": "EC2", "items": ["you manage instances", "cheapest at scale"] },
      { "head": "Fargate", "items": ["serverless, no instances", "each task = one ENI/IP"] } ] },
    { "title": "Two IAM roles", "type": "compare", "cols": [
      { "head": "Instance profile", "items": ["for the ECS agent on EC2"] },
      { "head": "Task execution role", "items": ["what containers need (S3, secrets)"] } ] },
    { "title": "Dynamic host port", "type": "flow",
      "steps": ["ALB", "Host port 0 → random host port", "Container on any instance", "Works with ALB, not CLB"] }
  ],
  "23": [
    { "title": "Deployment modes", "type": "compare", "cols": [
      { "head": "All-at-once", "items": ["fastest", "downtime"] },
      { "head": "Rolling", "items": ["batch by batch"] },
      { "head": "Immutable", "items": ["new ASG, swap", "zero downtime"] },
      { "head": "Blue/Green", "items": ["two envs + URL swap"] } ] },
    { "title": "Deploy flow", "type": "flow",
      "steps": ["Upload source bundle", "Beanstalk builds env (CFN)", "Health checks pass", "Traffic to new version"] },
    { "title": "Worker tier", "type": "flow",
      "steps": ["App posts job", "SQS queue", "Worker instances pull", "Scheduled via cron.yaml"] }
  ],
  "24": [
    { "title": "CloudFormation — template to stack", "type": "flow",
      "steps": ["Template (YAML/JSON)", "Upload to S3", "Create stack", "AWS provisions resources"] },
    { "title": "Update safely", "type": "flow",
      "steps": ["Edit template", "Generate Change Set (preview)", "Review the diff", "Execute → update"] },
    { "title": "Reuse across stacks", "type": "compare", "cols": [
      { "head": "Cross-stack", "items": ["export / import values"] },
      { "head": "Nested stacks", "items": ["parent → children"] },
      { "head": "StackSets", "items": ["many accounts/regions"] } ] },
    { "title": "CDK synth & deploy", "type": "flow",
      "steps": ["cdk code (TS/Python/...)", "cdk bootstrap (CDKToolkit)", "cdk synth → CFN template", "cdk deploy → CloudFormation"] },
    { "title": "SAM transform", "type": "flow",
      "steps": ["SAM template (AWS::Serverless)", "sam build", "sam package → S3", "sam deploy → CFN + CodeDeploy"] }
  ],
  "25": [
    { "title": "CI/CD pipeline", "type": "flow",
      "steps": ["CodeCommit (push)", "CodeBuild (build + test)", "Artifacts in S3", "CodeDeploy (ship)", "Approval → prod"] },
    { "title": "CodeDeploy hook order", "type": "stack", "rows": [
      ["1. BeforeInstall", "stop old app, prep"],
      ["2. AfterInstall", "install files"],
      ["3. ApplicationStart", "start the app"],
      ["4. ValidateService", "health check — fail = rollback"] ] },
    { "title": "Blue/green via CodeDeploy", "type": "flow",
      "steps": ["Old 'blue' fleet", "Deploy to 'green'", "Health checks on green", "Shift traffic → green", "Terminate blue"] }
  ],
  "26": [
    { "title": "Pick the key store", "type": "decision",
      "label": "Secret that must auto-rotate?",
      "yes": "Secrets Manager", "no": "Just config, cheap storage?",
      "no2": "Yes → SSM Parameter Store · Keys → KMS" },
    { "title": "Cognito pools", "type": "compare", "cols": [
      { "head": "User Pools", "items": ["sign-up / sign-in", "issues JWTs", "MFA + federated"] },
      { "head": "Identity Pools", "items": ["swap login for AWS creds", "STS temporary access", "guest access"] } ] },
    { "title": "Auth picker", "type": "stack", "rows": [
      ["Lambda calls AWS", "execution role"],
      ["App user sign-in", "Cognito User Pool (JWT)"],
      ["App needs AWS creds", "Cognito Identity Pool (STS)"],
      ["Third-party account", "AssumeRole + external ID"],
      ["API custom auth", "Lambda authorizer"] ] },
    { "title": "Envelope encryption", "type": "flow",
      "steps": ["GenerateDataKey", "Encrypt data with data key", "Store encrypted DEK + data", "Decrypt DEK via KMS"] }
  ],
  "27": [
    { "title": "Three lenses", "type": "compare", "cols": [
      { "head": "CloudWatch", "items": ["metrics, logs, alarms", "performance"] },
      { "head": "X-Ray", "items": ["trace one request", "find slow service"] },
      { "head": "CloudTrail", "items": ["who called which API", "security audit"] } ] },
    { "title": "X-Ray trace flow", "type": "flow",
      "steps": ["Request", "API Gateway", "Lambda (segment)", "DynamoDB (subsegment)", "Trace map"] },
    { "title": "Annotations vs metadata", "type": "compare", "cols": [
      { "head": "Annotations", "items": ["indexed key-values", "searchable/filterable"] },
      { "head": "Metadata", "items": ["unindexed detail", "context only"] } ] },
    { "title": "Debug picker", "type": "stack", "rows": [
      ["AccessDeniedException", "IAM policy (permissions)"],
      ["Lambda timeouts", "duration logs (runtime)"],
      ["Lambda throttles", "concurrency metrics"],
      ["DynamoDB throttles", "backoff + jitter"],
      ["Trace one request", "X-Ray"],
      ["Search many logs", "Logs Insights"],
      ["Threshold breach", "CloudWatch alarm"] ] }
  ],
  "28": [
    { "title": "Retry with backoff + jitter", "type": "stack", "rows": [
      ["Attempt 1", "wait ~100ms"],
      ["Attempt 2", "wait ~200ms"],
      ["Attempt 3", "wait ~400ms + jitter"],
      ["Still failing", "stop → DLQ / circuit breaker"] ] },
    { "title": "Poison message path", "type": "flow",
      "steps": ["Message fails", "Visibility timeout → retry", "maxReceiveCount reached", "Moves to DLQ"] },
    { "title": "Idempotency", "type": "decision",
      "label": "Will a retry run the same action twice?",
      "yes": "Make it idempotent (unique request ID)", "no": "Safe to retry directly",
      "no2": "Payments/orders MUST be idempotent" }
  ],
  "29": [
    { "title": "Mock exam strategy", "type": "flow",
      "steps": ["65 Q / 130 min", "~2 min per question", "Flag + move on", "Review wrong → fix one fact", "Re-read that day's hooks"] },
    { "title": "Domain weighting", "type": "compare", "cols": [
      { "head": "Development", "items": ["32%"] },
      { "head": "Security", "items": ["26%"] },
      { "head": "Deployment", "items": ["24%"] },
      { "head": "Troubleshooting", "items": ["18%"] } ] },
    { "title": "Weak-area loop", "type": "flow",
      "steps": ["Wrong answer", "Write the one fixing fact", "Find it in that day's cheat sheet", "Re-test tomorrow (spaced repetition)"] }
  ],
  "30": [
    { "title": "Exam-day timebox", "type": "flow",
      "steps": ["0-60 min: Q1-30", "61-120 min: Q31-60", "120-128: hard ones", "128-130: review flags"] },
    { "title": "Brain-dump before starting", "type": "stack", "rows": [
      ["Storage classes", "Standard → IA → Glacier"],
      ["EBS types", "gp3 / io2 / st1"],
      ["SQS vs SNS", "pull vs push"],
      ["CodeDeploy hooks", "BeforeInstall → ValidateService"],
      ["Lambda limits", "128MB-10GB · 15 min"] ] },
    { "title": "Read the qualifier", "type": "decision",
      "label": "Does the stem say 'MOST cost-effective'?",
      "yes": "Cost wins over comfort", "no": "Does it say 'LOWEST latency'?",
      "no2": "Yes → caching / regional choice" }
  ],

  "topics": {
    "ec2": [
      { "title": "Instance type families", "type": "compare", "cols": [
        { "head": "a/c", "items": ["general / compute"] },
        { "head": "r/m", "items": ["memory"] },
        { "head": "g", "items": ["GPU"] },
        { "head": "t", "items": ["burstable"] } ] },
      { "title": "Instance metadata", "type": "flow",
        "steps": ["Instance queries", "http://169.254.169.254/latest/meta-data", "Gets role creds", "Never stores keys locally"] }
    ],
    "lambda": [
      { "title": "Invocation models", "type": "compare", "cols": [
        { "head": "Sync", "items": ["caller waits"] },
        { "head": "Async", "items": ["queued, retries + DLQ"] },
        { "head": "Polled", "items": ["SQS / DynamoDB streams"] } ] }
    ],
    "iam": [
      { "title": "Evaluation order", "type": "flow",
        "steps": ["Default deny", "Explicit allow?", "Explicit deny?", "Deny always wins"] }
    ],
    "stepfunctions": [
      { "title": "Standard vs Express", "type": "compare", "cols": [
        { "head": "Standard", "items": ["1 year, exactly-once", "payments"] },
        { "head": "Express", "items": ["5 min, high volume", "IoT/streaming"] } ] }
    ],
    "apigateway": [
      { "title": "API types", "type": "compare", "cols": [
        { "head": "REST", "items": ["full features, usage plans"] },
        { "head": "HTTP", "items": ["cheaper, OIDC"] },
        { "head": "WebSocket", "items": ["real-time 2-way"] } ] }
    ],
    "vpc": [
      { "title": "Endpoint types", "type": "compare", "cols": [
        { "head": "Gateway", "items": ["S3 + DynamoDB"] },
        { "head": "Interface", "items": ["everything else (ENI)"] } ] }
    ],
    "elb": [
      { "title": "Listener → target group", "type": "flow",
        "steps": ["Client", "Listener (port/proto)", "Rule → target group", "Health checks"] }
    ],
    "cognito": [
      { "title": "Pools flow", "type": "flow",
        "steps": ["User signs in (User Pool)", "Gets JWT", "Identity Pool swaps for STS creds", "AWS resources"] }
    ],
    "kms": [
      { "title": "Envelope encryption", "type": "flow",
        "steps": ["GenerateDataKey", "Encrypt with data key", "Store encrypted", "Decrypt via KMS"] }
    ],
    "ssmparam": [
      { "title": "Tiers", "type": "compare", "cols": [
        { "head": "Standard", "items": ["free, 10k params, 4 KB"] },
        { "head": "Advanced", "items": ["paid, 100k params, 8 KB, policies"] } ] }
    ],
    "secretsmanager": [
      { "title": "Rotation", "type": "flow",
        "steps": ["Secret created (KMS-encrypted)", "Lambda rotates every N days", "RDS/Aurora credential updated", "App gets new value"] }
    ],
    "ecs": [
      { "title": "Service auto scaling", "type": "flow",
        "steps": ["ALB request count / CPU / mem", "Application Auto Scaling", "Service desired count ±", "Task capacity providers scale cluster"] }
    ],
    "cloudformation": [
      { "title": "Update with a change set", "type": "flow",
        "steps": ["Edit template", "Change Set preview", "Approve diff", "Execute"] }
    ],
    "sam": [
      { "title": "Deploy chain", "type": "flow",
        "steps": ["sam build", "sam package → S3", "sam deploy → CFN", "CodeDeploy traffic shift"] }
    ],
    "cdk": [
      { "title": "Lifecycle", "type": "flow",
        "steps": ["cdk bootstrap", "cdk synth → template", "cdk deploy", "cdk destroy"] }
    ],
    "dynamodb": [
      { "title": "Access picker", "type": "stack", "rows": [
        ["Know the key", "GetItem"],
        ["Need range", "Query"],
        ["Alt partition", "GSI"],
        ["Microseconds", "DAX"],
        ["Expire", "TTL"],
        ["React", "Streams"] ] }
    ],
    "kinesis": [
      { "title": "Shards", "type": "flow",
        "steps": ["Partition key", "Hash → shard", "Ordered records", "Replay window"] }
    ]
  }
};