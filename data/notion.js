window.DVA_NOTION = {
 "ec2": {
  "title": "EC2",
  "days": [
   5
  ],
  "url": "https://arkalim.notion.site/EC2-0248f474aa154ae8b076725e1178d1b8",
  "mustKnow": [
   "EC2 is regional IaaS; stop/start may swap public IP but private IP never changes.",
   "User-data bootstrap script runs once at first launch as root; automates installs/updates an AMI can't.",
   "Security groups allow only, are per-region/VPC, block requests silently (client sees 504); can reference other SGs or IPs.",
   "ENI is a virtual NIC tied to subnet/AZ; primary ENI auto-deletes on termination, extras can move across instances.",
   "Never store credentials on the box; attach IAM role through an instance profile.",
   "On-Demand = highest cost, no commitment; Reserved (1/3yr) for steady state; Spot is interruptible with stop/hibernate/terminate (not reboot).",
   "Dedicated Host leases whole server (per-host, BYOL, 3yr); Dedicated Instance is single-tenant hardware billed per instance.",
   "EIPs are static public IPs, soft limit 5, free only while attached to one running instance.",
   "Placement groups: Cluster=same rack/HPC/10Gbps, Spread=max 7 per AZ, Partition=7 per AZ for big data.",
   "Stop keeps EBS root, terminate destroys it; hibernate dumps RAM to root volume (max 60 days, not Spot).",
   "Nitro improves networking and EBS IOPS (64,000 vs 32,000); AMIs are regional and copying creates a snapshot in the target region."
  ],
  "triggers": [
   "If request times out with 504 → think security group silently blocking the instance.",
   "If an IP must survive stop/start → attach an Elastic IP.",
   "If a long-booting app resumes fast → EC2 hibernate saves RAM to EBS root.",
   "If first-boot dynamic setup needed → user data script, not an AMI."
  ]
 },
 "lambda": {
  "title": "Lambda",
  "days": [
   17,
   18
  ],
  "url": "https://arkalim.notion.site/Lambda-40e27a3addee4460809ca09e4ace357a",
  "mustKnow": [
   "FaaS, serverless, auto-scaling; free tier 1M requests plus 400,000 GB-seconds of compute.",
   "RAM 128MB-10GB, /tmp 512MB-10GB; raise RAM to get more vCPU (1,792MB ≈ 1 vCPU); timeout default 3s, max 15 min; env vars max 4KB.",
   "Deploy limit 50MB compressed / 250MB uncompressed; larger packages via S3.",
   "Synchronous (RequestResponse) leaves retries/backoff to the caller; async (Event) returns 202 and Lambda retries 0-2 with backoff, then DLQ (SQS/SNS).",
   "Kinesis, DynamoDB streams, SQS are polled via event source mapping; per-shard ordering; SQS visibility timeout ~6x function timeout.",
   "Account concurrency soft limit 1,000; reserved concurrency throttles a function (0 disables); sync throttle gives 429, async retries up to 6h.",
   "$LATEST is mutable; published versions immutable; aliases give stable endpoints and enable weighted canary traffic.",
   "Lambda@Edge runs Node/Python at CloudFront edges for viewer/origin request-response hooks.",
   "Outside VPC by default; attaching to a VPC creates ENIs and needs a NAT gateway for internet access."
  ],
  "triggers": [
   "If a stream batch fails → whole batch reprocessed and that shard pauses.",
   "If you need a stable function endpoint → use an alias, not $LATEST.",
   "If async failures pile up → DLQ (SQS/SNS) or Lambda destinations.",
   "If cold starts hurt → provisioned concurrency warms instances."
  ]
 },
 "stepfunctions": {
  "title": "Step Functions",
  "days": [
   23
  ],
  "url": "https://arkalim.notion.site/Step-Functions-8c06b6b0b45c4f0394b893edb60c7e82",
  "mustKnow": [
   "Serverless workflow orchestration; one state machine per workflow written in JSON with per-step execution history.",
   "States: Choice, Fail/Succeed, Pass, Wait, Map (iterate), Parallel, and Task; errors handled in the machine, not the app.",
   "Predefined errors: States.ALL, States.Timeout, States.TaskFailed, States.Permissions; Retry block evaluated top-down, then Catch.",
   "waitForTaskToken is push-based: external app must call SendTaskSuccess/Failure with the token to resume.",
   "Activity Tasks are pull-based: workers poll GetActivityTask and heartbeat via SendTaskHeartBeat within HeartBeatSeconds.",
   "Standard: max 1 year, exactly-once, ~2,000 exec/s, 90-day console history, billed per state transition.",
   "Express: max 5 min, ~100,000 exec/s, history only in CloudWatch; async is at-least-once (make idempotent), sync is at-most-once.",
   "Use Standard for non-idempotent actions like payments; Express for IoT/streaming/backends."
  ],
  "triggers": [
   "If an external worker must finish before continuing → waitForTaskToken callback.",
   "If payment/order processing → Standard workflow (exactly-once).",
   "If high-volume IoT/streaming data → Express async workflow.",
   "If a step runs a year-long job → Standard workflow limit."
  ]
 },
 "apigateway": {
  "title": "API Gateway",
  "days": [
   20
  ],
  "url": "https://arkalim.notion.site/API-Gateway-f0050eade58e4f4daec267c6d5207497",
  "mustKnow": [
   "Serverless HTTPS-only REST/WebSocket APIs with versioning, throttling, auth, caching, WAF, and SDK generation.",
   "AWS_PROXY passes requests to Lambda as JSON with no mapping; AWS/HTTP types allow VTL mapping templates; MOCK returns hardcoded responses.",
   "Endpoints: Edge-optimized (default, via CloudFront), Regional, Private (VPC interface endpoint only).",
   "Must redeploy after changes; stages hold deployment history; stage variables via ${stageVariables.name} avoid redeploys.",
   "Cache 0.5-237GB, TTL up to 1h (default 300s); clients invalidate with Cache-Control: max-age=0.",
   "Usage plans + API keys (X-API-Key header) monetize and throttle per customer.",
   "Timeout max 29s; account throttling 10,000 req/s soft limit returning 429.",
   "CORS needs Access-Control-Allow-Origin pre-flight; proxy integrations must handle CORS in the backend.",
   "Auth options: IAM (SigV4), Cognito (auth only, external users), Lambda authorizer (custom token/request-based).",
   "HTTP APIs are cheaper, support OIDC/OAuth 2.0 but no usage plans/API keys/resource policies.",
   "Custom domain TLS from ACM; edge-optimized cert must live in us-east-1."
  ],
  "triggers": [
   "If real-time two-way chat → WebSocket API; POST /@connections/{id} sends server-to-client.",
   "If breaking API changes → deploy a new stage.",
   "If custom auth logic needed → Lambda authorizer (token or request).",
   "If per-customer limits → usage plan with API keys."
  ]
 },
 "vpc": {
  "title": "VPC",
  "days": [
   10
  ],
  "url": "https://arkalim.notion.site/VPC-d6f8309f594a42cbac1e5c346103210d",
  "mustKnow": [
   "Regional service; soft limit of 5 VPCs per region; only private IPv4 ranges allowed.",
   "Subnets bind to a single AZ; no overlapping CIDRs within a VPC; default VPC has public-only subnets.",
   "AWS reserves 5 IPs per subnet (first 4 + last 1); a /24 yields 251 usable addresses.",
   "A subnet is public only with auto-assign public IPv4 enabled plus an IGW route; otherwise it's private by default.",
   "IGW attaches to the VPC (not subnets) and NATs public instances; private subnets need a NAT gateway for outbound.",
   "NAT gateway is managed, ~45 Gbps, per-AZ, hourly cost, in a public subnet, can't be a bastion; NAT instance needs source/dest check off + EIP.",
   "NACL is stateless, IP-only, rules 1-32766, lowest number wins; SG is stateful, allow-only, all rules evaluated.",
   "VPC peering is non-transitive, requires non-overlapping CIDRs, and needs route-table updates on both sides.",
   "Gateway endpoints serve only S3 and DynamoDB; interface endpoints (PrivateLink) provide ENIs for most other services."
  ],
  "triggers": [
   "S3 or DynamoDB private access → Gateway endpoint (only supported services).",
   "Any other AWS service accessed privately → Interface endpoint (PrivateLink).",
   "Private subnet needs outbound internet → NAT gateway in a public subnet, one per AZ for HA.",
   "Subnet-level firewall that must DENY specific IPs → NACL (SGs cannot deny)."
  ]
 },
 "route53": {
  "title": "Route 53",
  "days": [
   10
  ],
  "url": "https://arkalim.notion.site/Route-53-811d22e8d4d843d4a1a21aef8f48041b",
  "mustKnow": [
   "Global AWS-managed authoritative DNS and domain registrar; only service with a 100% availability SLA.",
   "Public hosted zones answer internet queries; private hosted zones resolve only from within the VPC.",
   "CNAME maps hostname to hostname but never zone apex; Alias maps to AWS resources and supports apex.",
   "Alias targets: ELB, CloudFront, API Gateway, Beanstalk, S3 websites, Global Accelerator, interface endpoints — not EC2.",
   "Simple routing returns multiple values, client picks randomly, no health checks; weighted splits traffic fractionally for canary tests.",
   "Failover uses primary/secondary records with health check on primary (active-passive); multivalue returns up to 8 healthy records.",
   "Geolocation routes by client location, requires a Default record; geoproximity routes by proximity with bias -99..99 via Traffic Flow.",
   "Health checks: endpoint (HTTP/HTTPS/TCP, public only), calculated (AND/OR/NOT), or CloudWatch alarm to monitor private resources.",
   "Inbound resolver endpoint forwards on-prem DNS into the VPC; outbound endpoint plus resolver rules forward VPC queries to on-prem."
  ],
  "triggers": [
   "DNS record at zone apex → Alias record (CNAME not allowed at apex).",
   "Health check on private VPC/on-prem resource → CloudWatch alarm-based health check.",
   "Small % of traffic to a new version → weighted routing policy.",
   "Blue-green via DNS switch → risk of client DNS caching defeating the change."
  ]
 },
 "elb": {
  "title": "ELB",
  "days": [
   12
  ],
  "url": "https://arkalim.notion.site/ELB-46ff2948831b492c899c90fcdae0cad9",
  "mustKnow": [
   "Regional multi-AZ load spreading; 503 = no targets, 504 = targets unreachable; no weighted routing.",
   "ALB is layer 7 (HTTP/HTTPS/WebSocket), terminates the client connection, accepts SGs, suits containers/microservices.",
   "ALB adds X-Forwarded-For/Port/Proto headers; listener rules route by headers, path, or source IP to target groups.",
   "NLB is layer 4 (TCP/UDP), ~100ms latency, millions of rps, one static IP per AZ (EIP), no security groups.",
   "GWLB operates at layer 3 (GENEVE) as a transparent gateway distributing traffic to firewall/IDPS appliances.",
   "Target groups hold EC2 instances, ECS tasks, Lambda (HTTP→JSON), or private IPs; health checks run per target group.",
   "Sticky sessions only on CLB/ALB via cookies (AWSALB/AWSALBAPP/AWSALBTG reserved names); may unbalance load.",
   "Cross-zone balancing always on and free for ALB; NLB/CLB default off and NLB charges inter-AZ data.",
   "SNI hosts multiple SSL certs per listener on ALB/NLB/CloudFront; CLB limited to one cert.",
   "Deregistration delay 0-3600s (default 300); raise it for ASG-backed instances; access logs off by default."
  ],
  "triggers": [
   "Static IP needed for whitelisting → NLB with an Elastic IP.",
   "Multiple SSL certificates on one LB → SNI (ALB/NLB, not CLB).",
   "503 Service Unavailable → no targets registered; 504 Timeout → targets unreachable (SG/NACL).",
   "Microservices or ECS apps → ALB with path/host-based routing."
  ]
 },
 "asg": {
  "title": "ASG",
  "days": [
   12
  ],
  "url": "https://arkalim.notion.site/ASG-9c2e688b4b3446d99056f7c80f36a733",
  "mustKnow": [
   "Free regional multi-AZ service for horizontal scaling; only underlying EC2 instances are billed.",
   "IAM roles attached to the ASG propagate to launched instances; deleting the ASG terminates its instances.",
   "Launch template (recommended) is versioned, updatable, and supports Spot; legacy launch config is immutable, no Spot.",
   "Scaling types: scheduled, simple, step, target tracking (auto-creates alarms), predictive (ML); 300s default cooldown.",
   "Default health source is EC2 status checks, not ELB; enable ELB health checks (or suspend ReplaceUnhealthy) to control replacement.",
   "Termination priority: AZ with most instances → oldest launch config → closest to next billing hour.",
   "AZ rebalancing launches replacement instances before terminating old ones to protect availability.",
   "Lifecycle hooks run steps during pending/terminating states, e.g., installing software or exporting logs.",
   "StartInstanceRefresh rolls instances to the newest launch template with min-healthy and warm-up settings."
  ],
  "triggers": [
   "Predictable load pattern → scheduled scaling.",
   "Need Spot instances or updatable config → launch template, never launch configuration.",
   "ELB marks instance unhealthy but ASG keeps it → health check type is EC2 status checks; switch it.",
   "Roll out a new launch template → StartInstanceRefresh (update does not apply automatically)."
  ]
 },
 "ecs": {
  "title": "Amazon ECS",
  "days": [
   24
  ],
  "url": "https://arkalim.notion.site/Amazon-ECS-b0c9190594ac459e816f15ac485d206b",
  "mustKnow": [
   "Managed container orchestration; EC2 launch type is not serverless — containers run on EC2 instances you provision and maintain via ASG.",
   "Fargate is serverless — no instance provisioning; each task gets an ENI with a private IP, so plan enough free IPs.",
   "ECS agent runs as a container on each EC2 instance and registers it to a cluster; config lives at /etc/ecs/ecs.config.",
   "Two IAM roles: EC2 instance profile for the agent, task execution role (taskRoleArn in task definition) for task resource access.",
   "Dynamic host port mapping with ALB (not CLB): host port 0 maps container port to a random host port; allow ALB SG on any port.",
   "Secrets stored in Secrets Manager/SSM Parameter Store, KMS-encrypted, referenced as env vars; task execution role grants access.",
   "EFS gives shared multi-AZ storage for tasks on both launch types; Fargate bind mounts live only for task lifetime (20–200 GiB).",
   "Application Auto Scaling targets: service CPU, memory utilization, or ALB request count per target; Capacity Providers scale the EC2 cluster.",
   "Placement strategies: binpack (cost), random, spread (availability); distinctInstance and memberOf are constraint options."
  ],
  "triggers": [
   "ALB in front of many ECS tasks with random ports → dynamic host port mapping (host port 0); only works with ALB, not CLB.",
   "Task needs a database secret → task execution role + Secrets Manager/SSM Parameter Store + KMS, referenced in the task definition.",
   "Fargate task fails to start → possible private IP exhaustion, since each Fargate task consumes one ENI IP.",
   "Containers failing to launch on EC2 → check docker daemon, ECS container agent, and IAM instance profile permissions."
  ]
 },
 "ecr": {
  "title": "Elastic Container Registry (ECR)",
  "days": [
   24
  ],
  "url": "https://arkalim.notion.site/Elastic-Container-Registry-ECR-71d4d3c8f82f4744904d2ea3e05ec688",
  "mustKnow": [
   "AWS-managed private Docker registry; pay for stored image storage only — no provisioning, storage backed by S3.",
   "Integrates with ECS and IAM for authentication and fine-grained pull permissions.",
   "Authenticate the Docker client via `aws ecr get-login --no-include-email` before push/pull.",
   "Images can be uploaded manually or built and pushed automatically by CI/CD such as CodeBuild."
  ],
  "triggers": [
   "Authenticate Docker to AWS before push/pull → aws ecr get-login --no-include-email.",
   "Private container image registry needed → ECR, with storage backed by S3.",
   "CodeBuild pipeline builds Docker images → push them to ECR for ECS to pull."
  ]
 },
 "copilot": {
  "title": "AWS Copilot",
  "days": [
   24
  ],
  "url": "https://arkalim.notion.site/AWS-CoPilot-c800c8c6d282476783e369b0e7dd8b02",
  "mustKnow": [
   "CLI tool, not an AWS service, for building, releasing, and operating containerized apps without managing infrastructure.",
   "Automatically provisions well-architected infrastructure for your containers.",
   "Deploys containerized apps to ECS, Fargate, or AppRunner.",
   "One-command automated deployments via CodePipeline and supports multiple environments.",
   "Offers built-in troubleshooting, logs, and health status visibility."
  ],
  "triggers": [
   "Deploy a containerized app quickly from CLI without infrastructure setup → AWS Copilot.",
   "App must run on ECS, Fargate, or AppRunner with well-architected defaults → Copilot.",
   "One-command multi-environment deployments with CodePipeline → Copilot."
  ]
 },
 "cloudformation": {
  "title": "CloudFormation",
  "days": [
   26
  ],
  "url": "https://arkalim.notion.site/CloudFormation-04e6f48e0b2a409b96b23c525e855400",
  "mustKnow": [
   "Declarative IaC; templates uploaded to S3 and referenced; free service, only pay for provisioned resources.",
   "Resources declared as AWS::service::resource; Resources is the only mandatory section; templates are static.",
   "Update by re-uploading a new template — CloudFormation computes the diff to reach desired state.",
   "!Ref returns resource ID/param value; !GetAtt fetches attributes; !FindInMap reads mappings; !ImportValue pulls exported outputs.",
   "Exported output names must be unique per region; a stack can't be deleted while its output is imported elsewhere.",
   "Conditions gate resource creation using And/Or/Not/Equals/If; conditions can't appear in Parameters.",
   "Change Sets preview updates before execution; stack creation failure rolls back by deleting the whole stack.",
   "Cross-stack = export/import across stacks with different lifecycles; nested stacks = reusable components; update parent first.",
   "StackSets deploy stacks across multiple accounts/regions from one admin account; drift detection shows expected vs actual config.",
   "Stack Policy denies all updates by default; you must explicitly allow update actions on resources.",
   "CREATE/DELETE_FAILED: modify template to retain the stuck resource, then delete it manually after stack deploy."
  ],
  "triggers": [
   "Reuse a common pattern across stacks → nested stacks; share values across stacks with different lifecycles → export/import (cross-stack).",
   "Want to preview template changes before applying → generate a Change Set first.",
   "Protect production DB from accidental update → attach a Stack Policy (explicit allows required).",
   "Value varies by region/AZ/account → Mappings + !FindInMap; value changes per deployment → Parameters."
  ]
 },
 "elasticbeanstalk": {
  "title": "Elastic Beanstalk",
  "days": [
   25
  ],
  "url": "https://arkalim.notion.site/Elastic-Beanstalk-f34fc232eae04daf912a78f5bd962d55",
  "mustKnow": [
   "PaaS for non-serverless apps; auto-provisions EC2/ELB/ASG/SG via CloudFormation under the hood; free, pay for resources.",
   "Application holds environments; an environment runs exactly one application version; web tier routes via LB, worker tier pulls from SQS.",
   "Worker scaling driven by SQS queue depth; cron.yaml enables scheduled background tasks in worker bundles.",
   ".ebextensions/*.config (YAML/JSON) configures env; can add CloudFormation resources (e.g. RDS) not available via console; lifecycle tied to env.",
   "Lifecycle policy retires old versions by days or count; max 1000 versions at once; optionally keep source bundles in S3.",
   "Cloning copies only config, not DB data; changing immutable things (e.g. LB type) requires environment migration + CNAME swap.",
   "Single-container Docker needs Dockerfile or Dockerrun.aws.json v1; multi-container uses v2, builds ECS cluster, requires pre-built images.",
   "Custom platforms need Platform.yaml AMI definition built with Packer.",
   "Deployments: All at Once (fast, downtime), Rolling (batched, below capacity), Rolling with additional batch, Immutable (new ASG, zero downtime, quick rollback, double cost), Blue/Green (Route53 weighted, not native).",
   "Source bundle: single ZIP/WAR, ≤512 MB, no top-level parent folder.",
   "Decouple production RDS: snapshot, protect from deletion, point new env at existing DB via env var, CNAME swap, terminate old env."
  ],
  "triggers": [
   "Deploy a new version with zero downtime and instant rollback → immutable deployment (new temporary ASG).",
   "Shifting small traffic to a new version first → Blue/Green via Route53 weighted routing + URL swap.",
   "Can't change LB type in existing env → migrate: new env + CNAME swap.",
   "Background job processing app → worker tier with SQS; cron.yml for schedules."
  ]
 },
 "sam": {
  "title": "Serverless Application Model (SAM)",
  "days": [
   26
  ],
  "url": "https://arkalim.notion.site/Serverless-Application-Model-SAM-d7dfe4373a594ca8b688e9d5eaecc88c",
  "mustKnow": [
   "CloudFormation abstraction (YAML) for serverless; transform header 'AWS::Serverless-2016-10-31' required, plus Resources.",
   "Resource types: Function (Lambda), Api (API Gateway), SimpleTable (DynamoDB), Application (reference SAR apps).",
   "sam build fetches deps; sam package converts SAM→CFN and uploads to S3 (bucket must pre-exist); sam deploy creates/executes Change Set.",
   "sam publish ships to Serverless Application Repository; only CFN template needed, code referenced from S3.",
   "Policy templates grant Lambda permissions quickly: S3ReadPolicy, SQSPollerPolicy, DynamoDBCrudPolicy, DynamoDBReadPolicy.",
   "Updates use CodeDeploy under the hood: alias traffic shifting, optional pre/post traffic hooks, auto-rollback via CloudWatch alarms.",
   "sam local start-lambda / invoke / start-api run Lambda, API Gateway, DynamoDB locally; use --profile for AWS calls.",
   "sam local generate-event produces mock events (e.g. S3 put) piped to local invoke.",
   "SAR apps share publicly or with specific accounts; deployable directly, customizable via environment variables."
  ],
  "triggers": [
   "Deploy Lambda with gradual traffic shift + rollback → SAM deployment preferences (CodeDeploy + aliases + alarms).",
   "Quick Lambda IAM permissions without writing policies → SAM policy templates like DynamoDBCrudPolicy.",
   "Test a Lambda event locally → sam local generate-event s3 put | sam local invoke.",
   "YAML starts with AWS::Serverless transform → it's a SAM template, not plain CloudFormation."
  ]
 },
 "cdk": {
  "title": "Cloud Development Kit (CDK)",
  "days": [
   26
  ],
  "url": "https://arkalim.notion.site/Cloud-Development-Kit-CDK-28f1a76b0ae64822aee7ef1cc7ac4cb8",
  "mustKnow": [
   "Imperative IaC in JS/TS, Python, Java, .NET; CDK CLI compiles code to a CloudFormation template.",
   "Constructs encapsulate resources; L1 (Cfn*) mirror CFN resources exactly, L2 provide intent-based APIs with sensible defaults, L3 bundle patterns like LambdaRestApi or ALB+Fargate.",
   "Construct Hub hosts community/3rd-party constructs; AWS Construct Library covers every AWS resource.",
   "cdk bootstrap aws://<account>/<region> deploys CDKToolkit stack (S3 bucket + IAM roles) before first deploy in an environment.",
   "Missing bootstrap yields 'invalid principal' error on deploy.",
   "cdk synth generates the CFN template; deploy ships infra and app code together.",
   "Test synthesized templates with CDK Assertions + Jest/PyTest: fine-grained assertions or snapshot tests.",
   "Import templates for testing via Template.fromStack() (CDK-built) or Template.fromString() (external)."
  ],
  "triggers": [
   "First deploy fails with 'invalid principal' → run cdk bootstrap for that account/region.",
   "Want a single resource with full CFN control → L1 Cfn construct; want convenient defaults → L2.",
   "Reusable architecture pattern (API Gateway + Lambda) → L3 construct like LambdaRestApi.",
   "Review generated CloudFormation → cdk synth."
  ]
 },
 "amplify": {
  "title": "Amplify",
  "days": [
   27
  ],
  "url": "https://arkalim.notion.site/Amplify-e81e288b84794684868fe117d9a8c12c",
  "mustKnow": [
   "Builds web/mobile apps; amplify init starts a project; backend via CLI, visual dev in Amplify Studio.",
   "Auth out of the box (amplify add auth): MFA, social/federated sign-in, account recovery, pre-built UI components, fine-grained authorization.",
   "API via AppSync GraphQL with DynamoDB store (amplify add api); offline + real-time sync to cloud.",
   "Hosting (amplify add hosting) competes with Netlify/Vercel: CI/CD, PR reviews, custom domains, monitoring.",
   "Amplify Hosting serves web apps through AWS CloudFront CDN.",
   "amplify.yml build phase runs unit tests; separate test phase runs E2E tests on a testing environment before prod deploy.",
   "E2E integrated with Cypress, which can produce UI test reports."
  ],
  "triggers": [
   "Full-stack web/mobile app with auth + GraphQL → Amplify (AppSync + DynamoDB).",
   "Fast static web hosting with CI/CD and PR previews → Amplify Hosting.",
   "Add login/MFA/social sign-in to an app → amplify add auth.",
   "Run E2E before production deploy → Cypress test phase in amplify.yml."
  ]
 },
 "appconfig": {
  "title": "AppConfig",
  "days": [
   25
  ],
  "url": "https://arkalim.notion.site/AppConfig-beda4c40a50a4720984345087876be83",
  "mustKnow": [
   "Part of AWS Systems Manager; separates config from code so you can deploy changes without redeploying the app.",
   "Works for EC2, Lambda, ECS, and EKS applications; ideal for feature flags and dynamic IP blocklists.",
   "Rolls out config changes gradually and supports rollback if problems arise.",
   "Validates config before deploy: JSON Schema for syntactic checks, Lambda for semantic/custom validation."
  ],
  "triggers": [
   "Toggle a feature without redeploying → AppConfig feature flag.",
   "Validate config format → JSON Schema validator; validate business logic → Lambda validator.",
   "Gradual, rollback-able config rollout across EC2/ECS/Lambda → AppConfig."
  ]
 },
 "cloud9": {
  "title": "Cloud9",
  "days": [
   6
  ],
  "url": "https://arkalim.notion.site/Cloud9-a3a8e9935a8b4595b5631668d12a14f3",
  "mustKnow": [
   "Browser-based cloud IDE with debugger, terminal, and live pair programming.",
   "Pre-packaged with tools for popular programming languages.",
   "Integrated with SAM and Lambda for building serverless apps.",
   "Runs on an EC2 instance underneath; hibernates after idle periods to cut costs."
  ],
  "triggers": [
   "In-browser IDE needed for a team → Cloud9 with pair programming.",
   "Develop/test Lambda in a cloud IDE → Cloud9's SAM/Lambda integration.",
   "Unexpected EC2 charges from IDE → Cloud9 instance hibernation timing."
  ]
 },
 "cognito": {
  "title": "Cognito",
  "days": [
   28
  ],
  "url": "https://arkalim.notion.site/Cognito-1fc7771b245647b691302be769d1c370",
  "mustKnow": [
   "CUP = serverless OIDC identity provider handling app-user sign-in; returns a JWT used to verify identity.",
   "CUP supports MFA, federated identities (Facebook, Google, SAML), and native API Gateway/ALB auth integration.",
   "CUP can invoke Lambda triggers synchronously on lifecycle events (sign-up, sign-in, etc.).",
   "Adaptive Authentication scores each sign-in, may block or demand MFA when suspicious; logs to CloudWatch.",
   "Hosted UI is a ready-made login/signup page; a custom domain requires an ACM certificate in us-east-1.",
   "ALB integration needs an HTTPS listener; auth via CUP or any OIDC-compliant IdP.",
   "Identity Pools do authorization: after auth, STS issues temp credentials for AWS resource access.",
   "CIP supports unauthenticated guest access and two default IAM roles (authenticated/guest), selectable by rule.",
   "User-sync datasets hold key-value pairs, max 1 MB each, up to 20 per identity; sync via the synchronize method."
  ],
  "triggers": [
   "Question about verifying who a user is / issuing JWTs → Cognito User Pool.",
   "Granting temporary AWS access to already-authenticated app users → Cognito Identity Pool (STS credentials).",
   "Custom hosted-UI domain that fails to validate → certificate must live in us-east-1.",
   "Custom logic on sign-up/sign-in → think Lambda triggers invoked synchronously."
  ]
 },
 "iam": {
  "title": "IAM",
  "days": [
   3,
   4
  ],
  "url": "https://arkalim.notion.site/IAM-e1b1d6d4287644b8874dd7614f3c6d49",
  "mustKnow": [
   "IAM is a global service; users/roles work across regions without re-creation.",
   "By default IAM users can't open the Billing and Cost Management console.",
   "SCP and permission boundaries only restrict, never grant permissions.",
   "Groups are policy containers: not nestable, no group-to-group, groups aren't principals in policies.",
   "Root = full access; IAM user = limited access; users should log in as IAM admin, not root.",
   "Roles are assumable by users and services, but groups cannot assume roles.",
   "Deny always overrides allow across user-based and resource-based policies.",
   "Inline policies cap at 2 KB, are tied 1:1 to one principal, unversioned, and die with the principal.",
   "Service roles for EC2 live in an instance profile; service-linked roles are predefined by a service.",
   "Passing a role to a service needs iam:PassRole (plus iam:GetRole to view it); trust policy must allow it.",
   "Cross-account access can't cross partitions (e.g., aws vs aws-cn)."
  ],
  "triggers": [
   "Policy only limiting, not granting → SCP or permission boundary.",
   "Role delegation to a service failing → missing iam:PassRole permission.",
   "Never commit / hardcode → access keys; use roles or instance profiles instead.",
   "Restricting actions only when MFA present → condition key aws:MultiFactorAuthPresent."
  ]
 },
 "sts": {
  "title": "Security Token Service (STS)",
  "days": [
   4
  ],
  "url": "https://arkalim.notion.site/Security-Token-Service-STS-d5a645a92154473da186802e77656452",
  "mustKnow": [
   "STS issues short-lived credentials, typically valid 15 minutes to 1 hour.",
   "AssumeRole gives temp credentials for in-account or cross-account role use.",
   "AssumeRoleWithSAML / AssumeRoleWithWebIdentity serve SAML and web-IdP logins respectively.",
   "GetSessionToken returns a session token for MFA-authenticated sessions.",
   "GetFederationToken yields temp credentials for a federated user.",
   "GetCallerIdentity returns details about the current IAM user or role.",
   "DecodeAuthorizationMessage decodes the encoded message in denied API errors.",
   "Assuming a role = define role → set trust policy → call AssumeRole.",
   "Condition aws:MultiFactorAuthPresent=true can gate actions to MFA sessions."
  ],
  "triggers": [
   "API call denied with encoded message → DecodeAuthorizationMessage.",
   "Temporary, limited access vs permanent keys → think STS / AssumeRole.",
   "MFA-gated actions → GetSessionToken + aws:MultiFactorAuthPresent condition.",
   "Cross-account role use → AssumeRole."
  ]
 },
 "organizations": {
  "title": "Organizations",
  "days": [
   4
  ],
  "url": "https://arkalim.notion.site/Organizations-8b85c27d857043a79768697e58b4f068",
  "mustKnow": [
   "Global service; one master account managing multiple member accounts.",
   "An account can belong to only one organization at a time.",
   "Consolidated billing aggregates usage for volume pricing discounts.",
   "APIs enable automated, on-demand account creation.",
   "OU folders group accounts and can be nested.",
   "SCPs whitelist (deny-by-default) or blacklist actions at OU/account level.",
   "SCPs don't apply to the master account, to service-linked roles, or grant anything.",
   "SCPs hit all principals including member account root users.",
   "Explicit deny takes highest precedence.",
   "Migrating a member account: leave old org, then invite and accept in the new one."
  ],
  "triggers": [
   "Restrict member accounts but not master → SCP.",
   "Even root can't do it → SCP applied at account/OU level.",
   "Volume pricing / one bill across accounts → consolidated billing in Organizations.",
   "Account in two organizations at once → not allowed; single membership."
  ]
 },
 "kms": {
  "title": "KMS",
  "days": [
   9,
   28
  ],
  "url": "https://arkalim.notion.site/KMS-2dc6026a4bdf43f483d704afe9d2e8f6",
  "mustKnow": [
   "Regional service; keys are bound to one region and can't cross regions.",
   "Encrypt/decrypt up to 4KB per API call; larger data needs envelope encryption.",
   "AWS-managed keys are free, auto-rotate yearly, and you cannot view, rotate, or delete them.",
   "Customer-managed keys cost $1/month, optional auto-rotation; imported keys (256-bit symmetric only) require manual rotation.",
   "Key deletion enters a pending state of 7-30 days (default 30) during which it can be recovered.",
   "Access needs both an IAM policy and a Key Policy attached to the key.",
   "Asymmetric keys: public key downloadable, private key never exposed unencrypted, no KMS API call needed to encrypt.",
   "GenerateDataKey returns a plaintext and encrypted DEK for client-side envelope encryption.",
   "KMS API throttling (ThrottlingException, 400) is fixed via exponential backoff, DEK caching, or quota increase.",
   "SSE-KMS uploads sharing the same per-second request quota can suffer performance degradation."
  ],
  "triggers": [
   "Data over 4KB to encrypt → use GenerateDataKey envelope encryption, not Encrypt.",
   "Slow S3 uploads with SSE-KMS → KMS API throttling; enable Data Key Caching.",
   "Share encrypted snapshot across accounts/regions → key policy + re-encrypt with a target-region key.",
   "Key deletion question → pending deletion 7-30 days, recoverable window."
  ]
 },
 "cloudhsm": {
  "title": "CloudHSM",
  "days": [
   28
  ],
  "url": "https://arkalim.notion.site/CloudHSM-bd4309ffcee0453b9d0221f1f5eabccd",
  "mustKnow": [
   "AWS provisions dedicated, tamper-resistant hardware security modules (FIPS 140-2 Level 3).",
   "You manage keys entirely yourself; AWS cannot access keys inside the HSM.",
   "Keys and users are managed via CloudHSM client software, not IAM (unlike KMS).",
   "IAM is only needed for CRUD operations on the cluster itself.",
   "Supports both symmetric and asymmetric encryption.",
   "Good fit with SSE-C encryption and Redshift for database encryption/key management.",
   "Clusters span multiple AZs for high availability.",
   "Can integrate with KMS so KMS keys are backed by CloudHSM hardware."
  ],
  "triggers": [
   "Requirement: full key control + compliance (FIPS 140-2 Level 3) → CloudHSM.",
   "Key/users managed via software instead of IAM → CloudHSM not KMS.",
   "KMS keys stored on dedicated hardware you fully control → CloudHSM as custom key store.",
   "IAM managing keys → KMS; software-managed keys → CloudHSM."
  ]
 },
 "ssmparam": {
  "title": "SSM Parameter Store",
  "days": [
   28
  ],
  "url": "https://arkalim.notion.site/SSM-Parameter-Store-c9b319c033fc44aa8b303bc34c16d535",
  "mustKnow": [
   "Serverless store for parameters and secrets with built-in versioning.",
   "Optional KMS encryption handles encryption/decryption of stored values.",
   "Parameters use a hierarchical structure that simplifies granting IAM access by path.",
   "Standard tier: free, 10,000 parameters, max 4KB, no parameter policies.",
   "Advanced tier: 100,000 parameters, max 8KB, supports policies, paid.",
   "Advanced-tier policies enable TTL expiry, expiration notifications, and change notifications.",
   "Plain parameters or configs → Parameter Store; rotated secrets → prefer Secrets Manager."
  ],
  "triggers": [
   "Need parameter expiration/change notifications → Advanced tier policies.",
   "Hierarchical path like /app/dev/db → Parameter Store simplifies IAM via paths.",
   "Cheap/free config storage with versioning → Parameter Store.",
   "Require forced secret rotation → Secrets Manager, not Parameter Store."
  ]
 },
 "secretsmanager": {
  "title": "Secrets Manager",
  "days": [
   28
  ],
  "url": "https://arkalim.notion.site/Secrets-Manager-955d610a4bd9401f85d5bd7bb7842135",
  "mustKnow": [
   "Purpose-built for secrets; encryption via KMS is mandatory.",
   "Each secret can hold multiple key-value pairs.",
   "Can force secret rotation every N days using Lambda (requires IAM permissions).",
   "Deep integration with MySQL, PostgreSQL, RDS, and Aurora for DB credentials.",
   "Linking a secret to a database enables automatic rotation of login credentials.",
   "CloudFormation ManageMasterUserPassword: True auto-creates the admin secret; get ARN via !GetAtt.",
   "Deleted secrets are retained in a waiting period of 7-30 days (default 30).",
   "Preferred over Parameter Store whenever automatic secret rotation is needed."
  ],
  "triggers": [
   "Automatic rotation of DB passwords → Secrets Manager with Lambda.",
   "CloudFormation RDS master password → ManageMasterUserPassword: True + !GetAtt secret ARN.",
   "Secret vs config choice → rotation required means Secrets Manager.",
   "Retention after deletion for recovery → 7-30 day waiting period."
  ]
 },
 "nitro": {
  "title": "Nitro Enclaves",
  "days": [
   28
  ],
  "url": "https://arkalim.notion.site/Nitro-Enclaves-f0a0fabf559e4a6cb03a111bf1c90750",
  "mustKnow": [
   "Fully isolated VMs on EC2 built to process highly sensitive data like PII and healthcare records.",
   "No interactive access (no SSH) and no external networking, shrinking the attack surface.",
   "Cryptographic attestation guarantees only authorized code runs inside the enclave.",
   "Only the enclave can access sensitive data; integrates with KMS for key handling.",
   "Considered the highest level of security available on EC2."
  ],
  "triggers": [
   "Process PII/healthcare data inside EC2 with isolation → Nitro Enclaves.",
   "No SSH or network access wanted for the compute environment → Nitro Enclaves.",
   "Attestation / only authorized code runs → Nitro Enclaves.",
   "Highest EC2 security requirement → Nitro Enclaves."
  ]
 },
 "acm": {
  "title": "AWS Certificate Manager (ACM)",
  "days": [
   12
  ],
  "url": "https://arkalim.notion.site/AWS-Certificate-Manager-ACM-a2aafd7425b2492499b0d64042411c34",
  "mustKnow": [
   "Provisions, manages, and deploys TLS certificates; public certs are free.",
   "Certificates load on ELB, API Gateway, and CloudFront distributions.",
   "ACM-issued certificates are valid 13 months and renew automatically.",
   "Imported third-party certificates are not auto-renewed and need manual re-import.",
   "Auto-renewal requires the cert still in use by an AWS service 60 days before expiry with a valid DNS CNAME.",
   "If not in use or CNAME invalid, ACM skips validation and notifies starting 45 days before expiry.",
   "In regions without ACM, upload third-party SSL certs to the IAM certificate store instead."
  ],
  "triggers": [
   "TLS cert on ALB/CloudFront/API Gateway → ACM (free, auto-renewed).",
   "Third-party cert not renewing → it's imported; renew and re-import manually.",
   "Region lacks ACM → store SSL certs in IAM certificate store.",
   "Cert not attached to any service → ACM won't auto-renew it."
  ]
 },
 "privateca": {
  "title": "AWS Private Certificate Authority (CA)",
  "days": [
   28
  ],
  "url": "https://arkalim.notion.site/AWS-Private-Certificate-Authority-CA-56acd73124ee4dd8a17e40c54560f6e9",
  "mustKnow": [
   "Creates root or subordinate CAs that issue X.509 certificates for applications.",
   "Issued certificates can't be used to create other certificates.",
   "Private TLS certificates are trusted only inside your organization, not on the public internet.",
   "Integrates with ELB, API Gateway, CloudFront, and EKS to load private certs.",
   "Commonly used to build an enterprise Public Key Infrastructure (PKI)."
  ],
  "triggers": [
   "Internal PKI / certs trusted only within the org → AWS Private CA.",
   "Private certs for API Gateway, CloudFront, ELB, or EKS → Private CA.",
   "mTLS or on-premise-style internal certificate chain → Private CA.",
   "Public certs trusted everywhere → ACM public certificates, not Private CA."
  ]
 },
 "directory": {
  "title": "AWS Directory Services",
  "days": [
   28
  ],
  "url": "https://arkalim.notion.site/AWS-Directory-Services-3446cf681ef14bf6ad8bff1a46e85a90",
  "mustKnow": [
   "Active Directory is an object database (users, computers, printers, shares, security groups); trees form a forest.",
   "AWS Managed Microsoft AD shares login credentials between on-prem and AWS and supports MFA.",
   "Managed AD supports trust connections to on-prem AD and directory-aware AWS workloads.",
   "AD Connector only proxies requests to your on-prem AD; users stay managed there.",
   "AD Connector does not support directory-aware workloads on AWS.",
   "Simple AD is a standalone managed directory with no on-prem join; users managed only in AWS.",
   "Simple AD fits when you have no existing on-premise Active Directory."
  ],
  "triggers": [
   "Share AD credentials with on-prem plus MFA/trust → AWS Managed Microsoft AD.",
   "Just proxy to existing on-prem AD → AD Connector (no directory-aware workloads).",
   "No on-prem AD, need simple managed directory → Simple AD.",
   "Directory-aware workloads on AWS → Managed Microsoft AD, not AD Connector."
  ]
 }
};
