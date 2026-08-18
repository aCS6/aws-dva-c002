#!/usr/bin/env python3
# tools/split_slides.py — cut the monolithic 907-page slide deck into per-section
# PDFs so the app loads ~1 MB per topic instead of 36 MB. Idempotent: overwrites slides/.
# Boundaries validated against actual slide headings (see build notes). end = next start - 1.
import fitz, os, sys, re

SRC = "AWS Certified Developer Slides v45.pdf"
OUT = "slides"

# (order-prefix, key, label, start-page 1-based). Contiguous; each ends where the next begins.
SECTIONS = [
 ("01","intro",           "Getting Started & Course Intro",                     1),
 ("02","iam",             "IAM — Users, Groups, Policies",                     22),
 ("03","ec2",             "Amazon EC2",                                        40),
 ("04","ec2-storage",     "EC2 Instance Storage — EBS, EFS, AMI",              72),
 ("05","elb-asg",         "ELB & Auto Scaling",                                95),
 ("06","databases",       "RDS, Aurora & ElastiCache",                        138),
 ("07","networking",      "Route 53 & VPC Networking",                        165),
 ("08","s3",              "Amazon S3 — Basics",                               213),
 ("09","cli-sdk",         "AWS CLI & SDK",                                     238),
 ("10","s3-advanced",     "Amazon S3 — Advanced",                             248),
 ("11","s3-security",     "Amazon S3 — Security & Encryption",                261),
 ("12","cloudfront",      "Amazon CloudFront",                                281),
 ("13","containers",      "Containers — ECS, ECR, EKS, Fargate",              312),
 ("14","beanstalk",       "Elastic Beanstalk",                                354),
 ("15","cloudformation",  "AWS CloudFormation",                               379),
 ("16","messaging",       "Integration & Messaging — SQS, SNS, Kinesis, Step Functions", 427),
 ("17","monitoring",      "Monitoring — CloudWatch, X-Ray, CloudTrail",       469),
 ("18","lambda",          "AWS Lambda",                                       527),
 ("19","dynamodb",        "Amazon DynamoDB",                                  602),
 ("20","apigateway",      "Amazon API Gateway",                               656),
 ("21","cicd",            "CI/CD — CodeCommit, CodeBuild, CodeDeploy, CodePipeline", 700),
 ("22","sam",             "AWS SAM (Serverless Application Model)",           733),
 ("23","cdk",             "AWS CDK (Cloud Development Kit)",                   745),
 ("24","cognito",         "Amazon Cognito",                                   757),
 ("25","iam-advanced",    "Advanced IAM & STS",                               805),
 ("26","security",        "Security & Encryption — KMS, CloudHSM, SSM, Secrets Manager", 826),
 ("27","advanced-misc",   "Advanced & Misc — Nitro, MSK, Macie",              870),
 ("28","exam-prep",       "Exam Prep & Whitepapers",                          893),
 ("29","conclusion",      "Conclusion & Next Steps",                          905),
]

def main():
    if not os.path.exists(SRC):
        sys.exit("missing source PDF: " + SRC)
    doc = fitz.open(SRC)
    N = doc.page_count
    os.makedirs(OUT, exist_ok=True)
    manifest = []
    for i, (num, key, label, start) in enumerate(SECTIONS):
        end = (SECTIONS[i+1][3] - 1) if i+1 < len(SECTIONS) else N
        out = fitz.open()
        out.insert_pdf(doc, from_page=start-1, to_page=end-1)  # 0-based, inclusive
        fname = f"{num}-{key}.pdf"
        path = os.path.join(OUT, fname)
        out.save(path, deflate=True, garbage=4)
        out.close()
        size = os.path.getsize(path)
        pages = end - start + 1
        manifest.append((fname, key, label, start, end, pages, size))
        print(f"{fname:<24} p{start}-{end:<4} {pages:>3}pg {size/1024:>7.0f} KB  {label}")
    total = sum(m[6] for m in manifest)
    covered = sum(m[5] for m in manifest)
    print(f"\n{len(manifest)} slices, {covered}/{N} pages covered, total {total/1024/1024:.1f} MB (orig {os.path.getsize(SRC)/1024/1024:.1f} MB)")
    assert covered == N, f"coverage gap: {covered} != {N}"
    print("OK — full coverage, no gaps")

if __name__ == "__main__":
    main()
