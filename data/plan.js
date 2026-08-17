window.DVA_PLAN = [
  {
    "day": 1, "week": 1, "title": "AWS Fundamentals & Getting Started",
    "module": "Course Introduction + AWS Global Infrastructure",
    "goal": "Understand AWS global infrastructure, regions/AZs/edge, the shared responsibility model, and how the DVA-C02 exam is structured (4 domains).",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: Course Introduction", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Introduction/Course-Introduction/page.md", "note": "Read the whole page" },
      { "label": "KodeKloud: Certification Details", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Introduction/Certification-Details/page.md", "note": "Know 4 domains and pass score (720/1000)" },
      { "label": "Slides: Getting Started with AWS (p.11-21)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Regions, AZs, POPS, shared responsibility" }
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
    "questionIds": [2, 4, 8, 13, 27, 39, 73, 76, 79, 102, 103, 104, 105, 107, 113, 134, 190, 246, 468]
  },
  {
    "day": 2, "week": 1, "title": "IAM — Users, Groups, Policies",
    "module": "AWS Identity & Access Management (IAM)",
    "goal": "Master IAM identities, policies, MFA, access keys, and least privilege — IAM underpins ~1 in 4 DVA exam questions.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: IAM Overview", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/IAM-Overview/page.md", "note": "Users, Groups, Roles, Policies" },
      { "label": "KodeKloud: IAM Demo", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/IAM-Demo/page.md", "note": "Follow along in console" },
      { "label": "KodeKloud: IAM Exam Tips", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/Exam-Tips/page.md", "note": "Must-read" },
      { "label": "Slides: IAM (p.22-38)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Users, groups, policies, MFA, password policy, access keys, credential report" }
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
    "questionIds": [114, 116, 126, 149, 150, 162, 174, 176, 184, 187, 194, 197, 202, 219, 221, 229, 235, 236, 243]
  },
  {
    "day": 3, "week": 1, "title": "IAM Advanced — Roles, STS, PassRole, Policy Evaluation",
    "module": "AWS CLI, SDK, IAM Roles & Policies",
    "goal": "Deep-dive IAM roles for services, STS AssumeRole, PassRole, dynamic policies, and how requests are evaluated — the hardest IAM exam topics.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: Dynamic Policies", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/Dynamic-Policies/page.md", "note": "${aws:username} variables" },
      { "label": "KodeKloud: Roles for AWS Services", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/Roles-for-AWS-Services/page.md", "note": "e.g. EC2 instance role, Lambda role" },
      { "label": "KodeKloud: IAM PassRole", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/IAM-PassRole-for-AWS-Services/page.md", "note": "Exam favourite" },
      { "label": "KodeKloud: STS (Security Token Service)", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/STSSecurity-Token-Service/page.md", "note": "AssumeRole, temporary creds" },
      { "label": "KodeKloud: EC2 Instance Roles Demo", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Identity-and-Access-Management-IAM/EC2-Instance-Roles-Demo/page.md", "note": "Follow along" },
      { "label": "Slides: AWS CLI/SDK/IAM Roles (p.238-247)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "CLI credentials, SDK, instance metadata, credentials precedence" }
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
    "questionIds": [121, 128, 151, 179, 180, 189, 198, 204, 206, 217, 228, 239, 242, 254, 256, 260, 262, 265, 270]
  },
  {
    "day": 4, "week": 1, "title": "EC2 Basics",
    "module": "Amazon EC2 — Basics",
    "goal": "Understand EC2 instance types, pricing models, security groups, user data, and placement groups.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: EC2 Pricing", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/EC2-Pricing/page.md", "note": "On-demand, reserved, spot, dedicated" },
      { "label": "KodeKloud: EC2 Placement", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/EC2-Placement/page.md", "note": "Cluster/Spread/Partition" },
      { "label": "KodeKloud: EC2 Userdata", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/EC2-Userdata/page.md", "note": "Bootstrap scripts" },
      { "label": "KodeKloud: EC2 Exam Tips", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/Exam-Tips/page.md", "note": "Must-read" },
      { "label": "Slides: EC2 Basics (p.40-71)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Types, SG, SSH, instance roles, AMI" }
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
    "questionIds": [1, 22, 65, 89, 112, 129, 146, 165, 172, 181, 216, 271, 280, 284, 291, 295, 297, 299, 300]
  },
  {
    "day": 5, "week": 1, "title": "EC2 Instance Storage — EBS, Snapshots, AMI, Instance Store",
    "module": "Amazon EC2 — Instance Storage",
    "goal": "Master EBS volumes, snapshots, AMIs, and the difference vs instance store. Data persistence is a core exam theme.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: EBS", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/EBS/page.md", "note": "Types, IOPS, durability" },
      { "label": "KodeKloud: EBS Demo 1 & 2", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/EBS-Demo-1/page.md", "note": "Attach/mount volumes" },
      { "label": "KodeKloud: Instance Store", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/Instance-Store/page.md", "note": "Ephemeral storage" },
      { "label": "Slides: EC2 Instance Storage (p.72-94)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "EBS, snapshots, AMI, RAID, EFS preview" }
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
      "RAID 0 = striping (performance, no redundancy); RAID 1 = mirroring (redundancy, EBS multi-AZ not supported so use EFS/S3)."
    ],
    "handsOn": [
      "Launch an instance with a 10GB gp3 root volume; SSH in and check df -h.",
      "Create a new EBS volume, attach it to the instance, partition, format (mkfs.xfs), mount to /data, write a file.",
      "Take a snapshot of the volume, modify instance type, and confirm the file persists.",
      "Create an AMI from the instance; launch a second instance from that AMI and verify identical config.",
      "Compare: stop the instance, attach the EBS to a different instance to prove EBS portability."
    ],
    "questionIds": [17, 186, 237, 305, 306, 307, 310, 312, 314, 315, 316, 318, 320, 330, 333, 339, 341, 345, 350]
  },
  {
    "day": 6, "week": 1, "title": "EFS & Shared Storage + AWS CLI/SDK Setup",
    "module": "EFS + AWS CLI, SDK",
    "goal": "Understand EFS (shared NFS), EBS vs EFS choices, and get the AWS CLI/SDK toolchain installed and configured for the rest of the plan.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: EFS", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/EFS/page.md", "note": "NFS, mount targets, security groups" },
      { "label": "KodeKloud: EFS Demo", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/EFS-Demo/page.md", "note": "Mount on 2 instances" },
      { "label": "KodeKloud: EC2 Storage overview", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Elastic-Compute-CloudEC2/EC2-Storage/page.md", "note": "EBS vs EFS vs Instance Store" },
      { "label": "Slides: EC2 Storage + CLI/SDK (p.72-94, 238-247)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "EFS, AWS CLI, SDK, credentials" }
    ],
    "cheatSheet": [
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
      "Install AWS CLI (or use CloudShell) and run: aws configure (paste your dev-user keys).",
      "Verify with aws sts get-caller-identity and aws s3 ls.",
      "Create an EFS filesystem, add a mount target in your default subnets.",
      "Launch two instances, mount the same EFS on both (install nfs-utils), create a file on one and read it on the other.",
      "Use the SDK in CloudShell: python3 -c \"import boto3; print(boto3.client('s3').list_buckets())\""
    ],
    "questionIds": [346, 351, 353, 356, 359, 362, 365, 368, 369, 374, 375, 383, 386, 387, 389, 390, 391, 393, 395]
  },
  {
    "day": 7, "week": 1, "title": "Week 1 Review + Consolidation",
    "module": "Review: AWS Fundamentals, IAM, EC2, Storage, CLI/SDK",
    "goal": "Consolidate week 1: revise cheat sheets, re-do missed questions, and build a small end-to-end lab combining IAM + EC2 + EBS + EFS.",
    "minutes": 120,
    "session": { "study": 30, "questions": 40, "handsOn": 40, "review": 10 },
    "studyLinks": [
      { "label": "Re-read all Week 1 Exam Tips pages", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Introduction/Course-Introduction/page.md", "note": "IAM, EC2, Storage Exam Tips" },
      { "label": "AWS IAM docs: Best Practices", "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html", "note": "15 IAM best practices" },
      { "label": "Slides review: p.11-247 (skim)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Skim for gaps" }
    ],
    "cheatSheet": [
      "Restate the mnemonic: instance families and pricing models in one line each.",
      "Restate shared responsibility split for EC2 vs S3 vs Lambda.",
      "Restate: IAM is global; policies attach to groups/users/roles; explicit deny > allow.",
      "Restate: EBS=block/1 AZ, EFS=file/multi-AZ, Instance Store=ephemeral, S3=object.",
      "Restate credentials precedence and the 'no keys in code' rule.",
      "Write down any concept you keep forgetting as a sticky note for Day 14 review."
    ],
    "handsOn": [
      "Lab: launch an EC2 with an instance role (S3 read-only), user-data installs nginx, EFS mounted, EBS data volume.",
      "Verify: instance can aws s3 ls, nginx serves a page, file written on EBS survives stop/start, EFS shared with a second instance.",
      "Run the week's 20 practice questions in the Questions tab, flag every wrong one.",
      "Write 3 flashcards from each wrong answer's explanation.",
      "Delete all test resources at the end (avoid charges)."
    ],
    "questionIds": [274, 363, 367, 397, 399, 400, 401, 403, 405, 406, 408, 410, 413, 414, 416, 418, 419, 421, 422]
  },
  {
    "day": 8, "week": 1, "title": "S3 Basics — Buckets, Objects, Storage Classes, Versioning",
    "module": "Amazon S3 — Basics",
    "goal": "Master S3 buckets/objects, storage classes, versioning, and core concepts — S3 is the most-tested service on DVA-C02.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: S3 Review + Storage Classes", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Review-Storage-Classes/page.md", "note": "Classes + transition rules" },
      { "label": "KodeKloud: S3 Storage Classes Demo", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Storage-Classes-Demo/page.md", "note": "Follow along" },
      { "label": "KodeKloud: S3 Versioning", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Versioning/page.md", "note": "Versioning + delete markers" },
      { "label": "Slides: S3 (p.213-237)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Buckets, objects, classes, versioning, replication preview" }
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
    "questionIds": [200, 264, 279, 286, 319, 337, 344, 360, 371, 372, 420, 439, 441, 455, 469, 474, 488, 534, 548]
  },
  {
    "day": 9, "week": 1, "title": "S3 Advanced — Lifecycle, ACL, Bucket Policies, Replication, Static Hosting",
    "module": "Amazon S3 — Advanced",
    "goal": "Go deeper: bucket policies vs ACLs, replication, access points, static website hosting, events, and object lock.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: S3 ACL and Resource Policies", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-ACL-and-Resource-Policies/page.md", "note": "Bucket policies vs ACLs" },
      { "label": "KodeKloud: S3 Static Website Hosting", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Static-Website-Hosting/page.md", "note": "Website endpoints" },
      { "label": "KodeKloud: S3 Access Points & Events", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Access-Points/page.md", "note": "Access Points + S3 Events" },
      { "label": "KodeKloud: S3 Access Logs", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Access-Logs/page.md", "note": "Server access logging" },
      { "label": "Slides: S3 Advanced (p.248-260)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Lifecycle, ACL, bucket policy, replication, events" }
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
    "questionIds": [7, 14, 16, 29, 45, 51, 58, 60, 99, 117, 144, 153, 154, 155, 170, 178, 192, 205, 550]
  },
  {
    "day": 10, "week": 1, "title": "S3 Security — Encryption, Presigned URLs, CORS",
    "module": "Amazon S3 — Security",
    "goal": "Master S3 encryption options, presigned URLs, CORS, and access logging — heavy security focus on the DVA exam.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: S3 Encryption", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Encryption/page.md", "note": "SSE-S3, SSE-KMS, SSE-C, client-side" },
      { "label": "KodeKloud: S3 Presigned URLs", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Pres-Signed-URLs/page.md", "note": "Grant temporary access" },
      { "label": "KodeKloud: S3 Access Points", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Storage/S3-Access-Points/page.md", "note": "Granular policy endpoints" },
      { "label": "Slides: S3 Security (p.261-280)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Encryption, presigned URLs, CORS, access logs, Glacier vault lock" }
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
    "questionIds": [78, 91, 110, 115, 135, 148, 168, 183, 218, 277, 304, 335, 342, 343, 381, 402, 417, 423, 424]
  },
  {
    "day": 11, "week": 2, "title": "High Availability — ELB + Auto Scaling Groups",
    "module": "High Availability & Scalability",
    "goal": "Understand load balancing (ALB/NLB/GLB), target groups, sticky sessions, and Auto Scaling Groups — core for the Deployment domain.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: ELB Overview", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Elastic-LoadBalancer-Overview/page.md", "note": "3 LB types" },
      { "label": "KodeKloud: Application Load Balancer", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Application-Load-Balancer/page.md", "note": "Path & host routing" },
      { "label": "KodeKloud: Network Load Balancer", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Network-Load-Balancer/page.md", "note": "TCP/UDP, extreme performance" },
      { "label": "KodeKloud: Sticky Sessions", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Sticky-sessions/page.md", "note": "Cookie-based affinity" },
      { "label": "KodeKloud: Auto Scaling Groups", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Load-Balancing-AutoScaling/Autoscaling-Groups-Overview/page.md", "note": "Launch templates, scaling policies" },
      { "label": "Slides: High Availability (p.95-137)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "ELB types, target groups, ASG" }
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
    "questionIds": [21, 31, 36, 55, 72, 82, 85, 88, 100, 132, 133, 143, 167, 293, 309, 398, 447, 498, 514]
  },
  {
    "day": 12, "week": 2, "title": "Databases — RDS, Aurora, ElastiCache",
    "module": "RDS, Aurora & ElastiCache",
    "goal": "Understand managed relational databases: RDS (multi-AZ, read replicas, backups), Aurora (storage, serverless), ElastiCache (Redis/Memcached) and RDS Proxy.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: AWS RDS Overview", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/AWS-RDS-Overview/page.md", "note": "Multi-AZ, replicas, backups" },
      { "label": "KodeKloud: Aurora", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/Aurora/page.md", "note": "Aurora architecture" },
      { "label": "KodeKloud: RDS Proxy", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/RDS-Proxy/page.md", "note": "Connection pooling for Lambda" },
      { "label": "Slides: RDS/Aurora/ElastiCache (p.138-164)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "RDS, read replicas, Aurora, ElastiCache" }
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
    "questionIds": [196, 210, 241, 244, 248, 252, 267, 273, 288, 292, 294, 302, 308, 322, 329, 332, 376, 382]
  },
  {
    "day": 13, "week": 2, "title": "Route 53 + VPC Basics",
    "module": "Amazon Route 53 + Amazon VPC — Basics",
    "goal": "Understand Route 53 routing policies and core VPC networking (subnets, IGW, NAT, SG/NACL) — fundamentals for architecture questions.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: VPC Recap", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/VPC-Recap/page.md", "note": "VPC, CIDR, subnets" },
      { "label": "KodeKloud: Internet Gateway & NAT Gateway", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Internet-Gateway/page.md", "note": "Public vs private egress" },
      { "label": "KodeKloud: Security Groups & NACLs", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Security-Groups-NACLs/page.md", "note": "Stateful vs stateless" },
      { "label": "KodeKloud: Networking Exam Tips", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Networking-Fundamentals/Exam-Tips/page.md", "note": "Must-read" },
      { "label": "Slides: Route 53 + VPC (p.165-212)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "DNS, routing policies, VPC core" }
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
    "questionIds": [185, 188, 193, 213, 215, 231, 259, 296, 352, 412, 425, 426, 428, 429, 430, 431, 432, 434]
  },
  {
    "day": 14, "week": 2, "title": "DynamoDB Basics + Week 2 Review",
    "module": "Amazon DynamoDB — Basics",
    "goal": "Learn DynamoDB core: tables, partition/sort keys, capacity modes, GSIs/LSIs, and basic API operations — then review week 2.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: DynamoDB Overview", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Overview/page.md", "note": "NoSQL, keys, capacity" },
      { "label": "KodeKloud: DynamoDB Pricing & Throughput", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Pricing-Throughput/page.md", "note": "RCU/WCU, on-demand vs provisioned" },
      { "label": "KodeKloud: DynamoDB Indexes (GSI/LSI)", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Indexes-GSI-LSI/page.md", "note": "Secondary indexes" },
      { "label": "KodeKloud: DynamoDB API + CLI", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-API/page.md", "note": "PutItem, GetItem, Query, Scan" },
      { "label": "Slides: DynamoDB (p.602-655)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Keys, capacity, indexes, API" }
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
    "questionIds": [140, 212, 366, 394, 436, 438, 440, 443, 444, 445, 446, 448, 449, 450, 451, 452, 453, 456]
  },
  {
    "day": 15, "week": 3, "title": "CloudFront + CDN + Lambda@Edge",
    "module": "Amazon CloudFront",
    "goal": "Master CloudFront distributions, cache behaviors, signed URLs/cookies, and Lambda@Edge — a top DVA-C02 topic.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: CloudFront developer guide (key concepts)", "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html", "note": "Distributions, origins, cache behaviors" },
      { "label": "AWS Docs: Lambda@Edge events", "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-edge-trigger-events.html", "note": "viewer-request/response, origin-request/response" },
      { "label": "AWS Docs: Signed URLs and Cookies", "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html", "note": "Restrict access to content" },
      { "label": "Slides: CloudFront (p.281-311)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Origins, S3 origin, caching, geo restriction, signed URLs, Lambda@Edge" }
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
    "questionIds": [6, 9, 11, 20, 32, 34, 38, 41, 57, 61, 63, 67, 68, 69, 71, 77, 81, 90]
  },
  {
    "day": 16, "week": 3, "title": "Lambda Basics — Versions, Aliases, Environment, Limits",
    "module": "AWS Lambda",
    "goal": "Master Lambda functions: triggers, versions/aliases, environment variables, limits, and execution roles — the heart of the Serverless domain.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: Lambda basics (execution environment, limits)", "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-concepts.html", "note": "Invocation model, limits" },
      { "label": "AWS Docs: Lambda versions & aliases", "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html", "note": "Versioning, canary deployments" },
      { "label": "AWS Docs: Lambda execution role", "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html", "note": "IAM role for permissions" },
      { "label": "Slides: Lambda (p.514-601)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Sync/async invoke, versions, aliases, env vars, limits" }
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
    "questionIds": [23, 24, 35, 37, 40, 43, 48, 49, 53, 92, 93, 101, 111, 124, 125, 138, 145, 159]
  },
  {
    "day": 17, "week": 3, "title": "Lambda Advanced — Concurrency, VPC, Layers, Best Practices",
    "module": "AWS Lambda (Advanced)",
    "goal": "Go deep on Lambda concurrency, reserved/provisioned concurrency, VPC access, layers, and common pitfalls tested on the exam.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: Lambda concurrency", "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html", "note": "Reserved vs provisioned" },
      { "label": "AWS Docs: Configuring VPC access", "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html", "note": "ENIs, security groups, NAT for egress" },
      { "label": "AWS Docs: Lambda layers", "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html", "note": "Share libs across functions" },
      { "label": "AWS Docs: Lambda best practices", "url": "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html", "note": "Stateless, cold starts, SDK clients" }
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
    "questionIds": [10, 12, 19, 33, 54, 64, 70, 75, 95, 98, 108, 120, 123, 142, 166, 169, 182, 232]
  },
  {
    "day": 18, "week": 3, "title": "API Gateway — REST, HTTP, Auth, Caching, Throttling",
    "module": "Amazon API Gateway",
    "goal": "Master API Gateway: REST vs HTTP APIs, integration types, authorization, caching, throttling, and WebSocket — core serverless front door.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: API Gateway concepts", "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-basic-concept.html", "note": "REST vs HTTP vs WebSocket" },
      { "label": "AWS Docs: API Gateway auth (Lambda authorizer, Cognito)", "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html", "note": "Cognito pools, IAM, custom authorizers" },
      { "label": "AWS Docs: API Gateway caching & throttling", "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html", "note": "Cache, quotas, throttles" },
      { "label": "Slides: API Gateway (p.656-699)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "REST/HTTP/WebSocket, mappings, auth, caching, throttling" }
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
    "questionIds": [42, 47, 59, 84, 86, 122, 157, 160, 163, 225, 263, 272, 325, 331, 348, 349, 357, 385]
  },
  {
    "day": 19, "week": 3, "title": "Integration & Messaging — SQS, SNS",
    "module": "AWS Integration & Messaging (SQS, SNS)",
    "goal": "Master SQS queues (visibility timeout, DLQ, FIFO), SNS pub/sub, and fan-out patterns — extremely common in DVA scenario questions.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: SQS standard vs FIFO", "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-basic-architecture.html", "note": "Ordering, exactly-once, DLQ" },
      { "label": "AWS Docs: SQS visibility timeout", "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html", "note": "Message locking mechanics" },
      { "label": "AWS Docs: SNS + fanout", "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-types-of-event-notifications.html", "note": "SNS→SQS, Lambda, email" },
      { "label": "Slides: Integration & Messaging (p.427-468)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "SQS, SNS, Kinesis, Step Functions" }
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
    "questionIds": [62, 171, 223, 224, 227, 275, 289, 301, 303, 336, 370, 388, 404, 411, 415, 437, 457, 501]
  },
  {
    "day": 20, "week": 3, "title": "Kinesis + Step Functions",
    "module": "AWS Kinesis + AWS Step Functions",
    "goal": "Understand Kinesis data streams (shards, consumers, retention) and Step Functions state machines for orchestrating serverless workflows.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: Kinesis Data Streams basics", "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html", "note": "Shards, records, retention" },
      { "label": "AWS Docs: Step Functions concepts", "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-overview.html", "note": "State machines, states" },
      { "label": "AWS Docs: Step Functions patterns (sync/async/fan-out)", "url": "https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-sync-service.html", "note": "Express vs Standard, orchestration" },
      { "label": "Slides: Integration & Messaging (p.455-468)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Kinesis, EDA, Step Functions" }
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
    "questionIds": [136, 139, 152, 158, 199, 211, 250, 258, 287, 311, 340, 392, 454, 458, 459, 460, 461, 512]
  },
  {
    "day": 21, "week": 3, "title": "DynamoDB Advanced — Streams, TTL, Transactions, DAX, PartiQL",
    "module": "Amazon DynamoDB (Advanced)",
    "goal": "Go deep on DynamoDB: streams, TTL, transactions, conditional writes, optimistic locking, DAX, and integration with Lambda — heavy exam weight.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "KodeKloud: DynamoDB Conditional writes", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Conditional-writes/page.md", "note": "ConditionExpression" },
      { "label": "KodeKloud: DynamoDB Optimistic Locking", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Optimistic-Locking/page.md", "note": "version attribute" },
      { "label": "KodeKloud: DynamoDB Transactions", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-Transactions/page.md", "note": "TransactWriteItems" },
      { "label": "KodeKloud: DynamoDB TTL", "url": "https://notes.kodekloud.com/docs/AWS-Certified-Developer-Associate/Databases/DynamoDB-TTL/page.md", "note": "Auto-delete items" },
      { "label": "Slides: DynamoDB (p.602-655)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Streams, TTL, DAX, transactions, conditional" }
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
    "questionIds": [5, 30, 56, 87, 201, 203, 245, 257, 324, 328, 347, 380, 462, 463, 464, 465, 466, 470]
  },
  {
    "day": 22, "week": 4, "title": "Containers on AWS — ECS, ECR, EKS",
    "module": "Containers on AWS",
    "goal": "Understand container orchestration on AWS: ECS (Fargate vs EC2), ECR, task definitions, secrets, and EKS basics.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: ECS concepts", "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html", "note": "Clusters, tasks, services, Fargate" },
      { "label": "AWS Docs: Task definitions & secrets", "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html", "note": "secrets, env vars, log config" },
      { "label": "AWS Docs: ECR basics", "url": "https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html", "note": "Private/public registries" },
      { "label": "Slides: Containers on AWS (p.312-353)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "ECS, ECR, task defs, Fargate, EKS" }
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
    "questionIds": [15, 66, 137, 147, 156, 238, 276, 285, 379, 467, 472, 473, 475, 476, 477, 479, 480, 485]
  },
  {
    "day": 23, "week": 4, "title": "Elastic Beanstalk + Deployment Strategies",
    "module": "AWS Elastic Beanstalk",
    "goal": "Understand Elastic Beanstalk (PaaS) environment tiers and the classic deployment strategies tested on DVA.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: Elastic Beanstalk concepts", "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html", "note": "Environment tiers, components" },
      { "label": "AWS Docs: Deployment policies", "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html", "note": "All-at-once, rolling, blue/green, immutable" },
      { "label": "AWS Docs: Beanstalk environments & configuration", "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html", "note": "EB CLI, .ebextensions" },
      { "label": "Slides: Elastic Beanstalk (p.354-378)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Architecture, deployment modes" }
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
    "questionIds": [80, 173, 208, 226, 261, 427, 435, 481, 482, 483, 486, 487, 489, 490, 492, 493, 494, 495]
  },
  {
    "day": 24, "week": 4, "title": "CloudFormation — Templates, Stack, Drift, Nested Stacks",
    "module": "AWS CloudFormation",
    "goal": "Master CloudFormation: template anatomy, parameters/conditions/outputs, functions, stack operations, and infrastructure as code.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: CloudFormation template reference", "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html", "note": "Sections + functions" },
      { "label": "AWS Docs: CloudFormation intrinsic functions", "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html", "note": "Ref, Fn::GetAtt, Fn::Sub, Fn::If..." },
      { "label": "AWS Docs: stack updates & drift", "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html", "note": "Change sets, drift detection" },
      { "label": "Slides: CloudFormation (p.379-426)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Template, stacks, functions, nested, change sets, SAM intro" }
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
    "questionIds": [44, 97, 177, 247, 327, 471, 478, 496, 497, 499, 500, 502, 503, 504, 505, 506, 508, 509]
  },
  {
    "day": 25, "week": 4, "title": "CI/CD — CodeCommit, CodeBuild, CodeDeploy, CodePipeline",
    "module": "AWS CICD",
    "goal": "Understand the AWS CI/CD suite and CodeDeploy lifecycle hooks — a guaranteed area on the exam.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: CodePipeline overview", "url": "https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html", "note": "Stages, actions, transitions" },
      { "label": "AWS Docs: CodeBuild concepts", "url": "https://docs.aws.amazon.com/codebuild/latest/userguide/concepts.html", "note": "buildspec.yml" },
      { "label": "AWS Docs: CodeDeploy AppSpec + hooks", "url": "https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html", "note": "Hook order — exam favourite" },
      { "label": "AWS Docs: CodeCommit basics", "url": "https://docs.aws.amazon.com/codecommit/latest/userguide/welcome.html", "note": "Managed git repos" },
      { "label": "Slides: CICD (p.700-732)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "CodeCommit/Build/Deploy/Pipeline + hook order" }
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
    "questionIds": [364, 510, 511, 513, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528]
  },
  {
    "day": 26, "week": 4, "title": "Security Deep Dive — KMS, SSM Parameter Store, Secrets Manager, Cognito",
    "module": "AWS Security: KMS, SSM, Secrets Manager, Cognito",
    "goal": "Master KMS keys/encryption SDK, SSM Parameter Store vs Secrets Manager, and Cognito user/identity pools — the Security domain backbone.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: KMS concepts", "url": "https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html", "note": "CMKs, envelope encryption, key rotation" },
      { "label": "AWS Docs: SSM Parameter Store", "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html", "note": "Standard vs SecureString" },
      { "label": "AWS Docs: Secrets Manager", "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html", "note": "Rotation, RDS creds" },
      { "label": "AWS Docs: Cognito pools", "url": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html", "note": "User pools + identity pools" },
      { "label": "Slides: Security sections (p.261-280, 151-164)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "S3 security, KMS, SSM, Secrets Manager, Cognito" }
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
    "questionIds": [94, 106, 118, 161, 355, 384, 491, 507, 529, 530, 531, 532, 533, 535, 536, 537, 538, 539]
  },
  {
    "day": 27, "week": 4, "title": "Monitoring, Troubleshooting & Audit — CloudWatch, X-Ray, CloudTrail",
    "module": "AWS Monitoring, Troubleshooting & Audit",
    "goal": "Understand CloudWatch (metrics, logs, alarms, dashboards), X-Ray (distributed tracing), and CloudTrail (API audit) for the Troubleshooting domain.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: CloudWatch Logs", "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html", "note": "Log groups, streams, filters" },
      { "label": "AWS Docs: X-Ray overview", "url": "https://docs.aws.amazon.com/xray/latest/devguide/xray-services.html", "note": "Trace segments, service maps" },
      { "label": "AWS Docs: CloudTrail basics", "url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html", "note": "API activity audit" },
      { "label": "Slides: Monitoring/Troubleshooting (p.469-513)", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "CloudWatch, X-Ray, CloudTrail, health dashboards" }
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
      "Exam tip: 'find which IAM user made a delete call' → CloudTrail. 'find why Lambda is slow across services' → X-Ray. 'react to an EC2 state change' → EventBridge."
    ],
    "handsOn": [
      "Create a CloudWatch alarm on EC2 CPUUtilization > 80% → SNS email.",
      "Add structured logging to a Lambda (print/json) and explore the log group, stream, and a metric filter.",
      "Enable X-Ray on an API Gateway + Lambda and view the trace + service map in the console.",
      "Put a custom metric (PutMetricData) and view it on a dashboard.",
      "Check CloudTrail events for your own recent actions (create-bucket, etc.) and search by user/event."
    ],
    "questionIds": [25, 50, 109, 253, 321, 373, 407, 409, 484, 540, 541, 542, 543, 544, 545, 546, 547, 551]
  },
  {
    "day": 28, "week": 5, "title": "Troubleshooting & Optimization — Retries, Throttling, SDK Patterns",
    "module": "Troubleshooting & Optimization (SDK, retries, integration)",
    "goal": "Systematize the Troubleshooting & Optimization domain: SDK retries/backoff, throttling handling, timeouts, connection pooling, and cost/performance levers.",
    "minutes": 120,
    "session": { "study": 45, "questions": 30, "handsOn": 25, "review": 20 },
    "studyLinks": [
      { "label": "AWS Docs: Error retries & exponential backoff", "url": "https://docs.aws.amazon.com/general/latest/gr/api-retries.html", "note": "SDK default retries" },
      { "label": "AWS Docs: AWS SDK best practices", "url": "https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-sdk-best-practices.html", "note": "Reuse clients, keep-alive, exponential backoff" },
      { "label": "AWS Docs: Lambda errors & throttling", "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html", "note": "Async retries, DLQ, on-failure destinations" },
      { "label": "Slides: Troubleshooting sections", "url": "AWS%20Certified%20Developer%20Slides%20v45.pdf", "note": "Retries, throttling, SDK patterns (p.427-468)" }
    ],
    "cheatSheet": [
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
      "Write a script that calls DynamoDB with a tiny provisioned capacity to force throttling; observe 400s/ProvisionedThroughputExceeded.",
      "Implement manual exponential backoff (+jitter) around the call and confirm success.",
      "Use SDK BatchGetItem with an oversized batch; retry only the UnprocessedKeys and confirm all items returned.",
      "Trigger a Lambda async failure and confirm it retries twice then lands in the DLQ.",
      "Test a slow DB call with RDS Proxy vs direct and compare connection errors under load."
    ],
    "questionIds": [3, 18, 26, 46, 52, 74, 83, 96, 119, 127, 131, 164, 207, 377, 378, 433, 442, 549]
  },
  {
    "day": 29, "week": 5, "title": "Mock Exam 1 + Weak-Area Review",
    "module": "Full Practice: 65-question mock + review",
    "goal": "Simulate the real exam (65 Q, 130 min, 720/1000) using the full question bank; then target the domains you failed.",
    "minutes": 120,
    "session": { "study": 30, "questions": 75, "handsOn": 0, "review": 15 },
    "studyLinks": [
      { "label": "Use the Questions tab (all 50 available questions)", "url": "", "note": "Timed: 2 min/question max" },
      { "label": "Official exam guide (domains & weights)", "url": "https://d1.awsstatic.com/training-and-certification/docs-dev-associate/AWS-Certified-Developer-Associate_Exam-Guide.pdf", "note": "Review domain bullets" },
      { "label": "Re-skim cheat sheets of weak days", "url": "", "note": "Focus on flagged topics" }
    ],
    "cheatSheet": [
      "Strategy: answer every question; skip-tag hard ones and return; use elimination aggressively.",
      "Keyword triggers: 'LEAST management overhead' → managed/service (Lambda, RDS, Fargate); 'LEAST cost' → cheaper/spot/on-demand; 'SECURITY' → KMS/Secrets/IAM roles.",
      "Read the LAST sentence first — the constraint (e.g., 'without code changes', 'multi-account', 'zero downtime') is usually the deciding factor.",
      "Two answers often differ only by one word (e.g., 'Secrets Manager' vs 'Parameter Store') — recall the deciding feature (rotation).",
      "Domain 1 Development (32%): Lambda, API GW, DDB, S3, CLI/SDK, X-Ray. Domain 2 Security (26%): IAM, KMS, SSM, Secrets, Cognito, S3/CORS/encryption.",
      "Domain 3 Deployment (24%): Beanstalk, CloudFormation, CI/CD, containers, deployments. Domain 4 Troubleshooting (18%): retries, throttling, logs, CloudWatch/X-Ray/CloudTrail.",
      "Marks: 65 questions, no negative marking — never leave a question blank."
    ],
    "handsOn": [
      "Read each wrong answer's explanation and write ONE flashcard.",
      "Re-do the failed domain's day tabs (Study + Questions) tomorrow.",
      "Take a 10-min break mid-mock to mimic exam pacing."
    ],
    "questionIds": [28, 209, 230, 233, 234, 240, 249, 266, 268, 283, 290, 298, 313, 317, 323, 326, 338, 396]
  },
  {
    "day": 30, "week": 5, "title": "Mock Exam 2 + Exam-Day Cheat Sheet + Final Strategy",
    "module": "Final mock + exam-day preparation",
    "goal": "Second timed mock, review remaining gaps, and consolidate the exam-day cheat sheet for last-minute review.",
    "minutes": 120,
    "session": { "study": 20, "questions": 75, "handsOn": 0, "review": 25 },
    "studyLinks": [
      { "label": "Re-do the 50-question bank once more (timed)", "url": "", "note": "Aim 90%+ accuracy" },
      { "label": "AWS Certified Developer Associate exam page", "url": "https://aws.amazon.com/certification/certified-developer-associate/", "note": "Check current exam details/scheduling" },
      { "label": "Final skim: all 30 day cheat sheets", "url": "", "note": "Last pass the night before" }
    ],
    "cheatSheet": [
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
      "Book/schedule your exam session (online or test center).",
      "Test your computer/space for the online exam (camera, quiet room, ID).",
      "Print or save this day's cheat sheet as your single last-minute review page.",
      "Re-run the 50 questions once more at 90%+ accuracy as a confidence boost."
    ],
    "questionIds": [130, 141, 175, 191, 195, 214, 220, 222, 251, 255, 269, 278, 281, 282, 334, 354, 358, 361]
  }
];