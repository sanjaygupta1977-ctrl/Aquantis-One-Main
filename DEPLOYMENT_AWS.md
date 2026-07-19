# AQUANTIS Global - AWS/ECS Deployment Guide

## 🚀 Quick AWS Deployment (Using ECS)

### Prerequisites
- AWS Account
- AWS CLI installed (`aws --version`)
- Docker Hub account
- ECR (Elastic Container Registry) access

---

## Option 1: ECS with Fargate (Serverless - Recommended for Startups)

### Cost: $50-150/month
- 2 vCPU, 4GB RAM Fargate task
- RDS PostgreSQL (db.t3.micro)
- ALB (Application Load Balancer)
- CloudWatch Logs

### Step 1: Create ECR Repository

```bash
# Create repositories
aws ecr create-repository --repository-name aquantis-frontend --region us-east-1
aws ecr create-repository --repository-name aquantis-backend --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Push images
docker tag aquantis-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/aquantis-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/aquantis-frontend:latest

docker tag aquantis-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/aquantis-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/aquantis-backend:latest
```

### Step 2: Create RDS Database

```bash
aws rds create-db-instance \
  --db-instance-identifier aquantis-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username aquantis \
  --master-user-password <secure-password> \
  --allocated-storage 20 \
  --publicly-accessible false \
  --storage-type gp3 \
  --region us-east-1
```

Wait 5-10 minutes for RDS to be available.

### Step 3: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name aquantis-prod --region us-east-1

# Create task execution IAM role
aws iam create-role --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### Step 4: Create Task Definition

```json
{
  "family": "aquantis-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "2048",
  "memory": "4096",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/aquantis-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "5000"},
        {"name": "DATABASE_URL", "value": "postgresql://aquantis:<pwd>@aquantis-db.xxx.us-east-1.rds.amazonaws.com:5432/aquantis"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/aquantis",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    },
    {
      "name": "frontend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/aquantis-frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "VITE_API_URL", "value": "https://api.aquantis-prod.io"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/aquantis",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "frontend"
        }
      }
    }
  ]
}
```

### Step 5: Create ECS Service

```bash
aws ecs create-service \
  --cluster aquantis-prod \
  --service-name aquantis-app \
  --task-definition aquantis-app \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:xxx:targetgroup/aquantis/xxx,containerName=frontend,containerPort=3000
```

---

## Option 2: EC2 (More Control - For Production)

### Cost: $20-100/month
- EC2 t3.medium instance
- RDS PostgreSQL (separate)
- ALB (Application Load Balancer)

### Deploy using EC2 User Data Script

```bash
#!/bin/bash
set -e

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
usermod -aG docker ubuntu

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone repo
cd /opt
git clone https://github.com/your-repo/Aquantis-One-main.git
cd Aquantis-One-main

# Pull and run containers
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

---

## Option 3: Lambda + API Gateway (Serverless Backend Only)

### Cost: $5-20/month
- Perfect for Phase 1 MVP
- Scale automatically
- Pay per request

### Deploy to Lambda

```bash
# Package backend
cd backend
zip -r lambda-function.zip .

# Create Lambda function
aws lambda create-function \
  --function-name aquantis-api \
  --runtime nodejs18.x \
  --role arn:aws:iam::<account-id>:role/lambda-role \
  --handler index.handler \
  --zip-file fileb://lambda-function.zip
```

---

## AWS Cost Comparison

| Option | Compute | Database | ALB | Total/Month |
|--------|---------|----------|-----|-------------|
| **ECS Fargate** | $50-80 | $20-30 | $16 | $86-126 |
| **EC2** | $15-40 | $20-30 | $16 | $51-86 |
| **Lambda** | $0-10 | $5-10 | Free | $5-20 |
| **DigitalOcean** | $24 | Included | Included | $24-39 |

### 💡 Recommendation
- **MVP/Startup:** DigitalOcean ($24/mo) or AWS Lambda ($5-20/mo)
- **Production:** AWS ECS ($86-126/mo) or DigitalOcean with CDN ($50-100/mo)
- **Enterprise:** AWS ECS + RDS + Aurora ($200+/mo)

---

## Useful AWS CLI Commands

### List ECS services
```bash
aws ecs list-services --cluster aquantis-prod
```

### View task logs
```bash
aws logs tail /ecs/aquantis --follow
```

### Update service
```bash
aws ecs update-service \
  --cluster aquantis-prod \
  --service aquantis-app \
  --force-new-deployment
```

### Scale service
```bash
aws ecs update-service \
  --cluster aquantis-prod \
  --service aquantis-app \
  --desired-count 3
```

---

## Monitoring & Alerts

### CloudWatch Dashboard
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name aquantis-cpu-high \
  --alarm-description "Alert if CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

---

## Next Steps

1. Choose deployment option (DigitalOcean recommended for MVP)
2. Set up domain & SSL
3. Configure backups
4. Set up CI/CD pipeline
5. Monitor logs and metrics
