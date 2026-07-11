# Deployment Guide

## Local Development (Docker)

### Prerequisites
- Docker & Docker Compose 20.10+
- Git

### Quick Start

```bash
# 1. Clone and navigate
cd resource-intelligence

# 2. Start all services (DB, backend, frontend)
docker-compose up -d

# 3. Wait for services to start (~30s for DB)
docker-compose ps

# 4. Load sample data
docker-compose exec backend python etl_ingest.py --dir data

# 5. Access dashboard
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs

# 6. Stop services
docker-compose down
```

### Troubleshooting

**"Connection refused" error:**
```bash
# Wait for database to fully initialize
docker-compose logs db | grep "listening"
```

**Frontend cannot connect to backend:**
- Ensure backend is running: `docker-compose logs backend`
- Check CORS settings in `backend/main.py`
- Verify proxy in `frontend/vite.config.js`

## AWS Deployment (ECR + ECS Fargate)

### 1. Build & Push Images

```bash
# Set AWS account details
export AWS_ACCOUNT=123456789012
export AWS_REGION=us-east-1

# Create ECR repositories
aws ecr create-repository --repository-name resource-intelligence-backend --region $AWS_REGION
aws ecr create-repository --repository-name resource-intelligence-frontend --region $AWS_REGION

# Build and push images
docker build -f Dockerfile.backend -t $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/resource-intelligence-backend:latest .
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com
docker push $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/resource-intelligence-backend:latest

# Repeat for frontend
```

### 2. RDS (Postgres + TimescaleDB)

```bash
# Create RDS instance with PostgreSQL 14
aws rds create-db-instance \
  --db-instance-identifier resource-intelligence-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 14.0 \
  --master-username app \
  --master-user-password <secure-password> \
  --allocated-storage 20 \
  --region $AWS_REGION

# After creation, install TimescaleDB extension
# (Connect via psql and run: CREATE EXTENSION timescaledb;)
```

### 3. ECS Cluster & Tasks

Use CloudFormation or AWS Copilot:
```bash
# Using AWS Copilot
copilot app init resource-intelligence
copilot svc init --name backend --svc-type "Load Balanced Web Service"
copilot env init --name prod
copilot svc deploy --name backend
```

## Kubernetes Deployment

See `k8s/` directory for Helm charts and manifests.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `DEBUG`: Set to "true" for verbose logging
- `ENV`: "development", "staging", or "production"

## Monitoring & Logging

- **Local**: Docker logs via `docker-compose logs`
- **AWS**: CloudWatch Logs (auto-configured for ECS)
- **Monitoring**: Use Datadog, New Relic, or CloudWatch alarms for production

## Security Checklist

- [ ] Change default DB password
- [ ] Enable RDS backup and replication
- [ ] Set up AWS IAM roles for Fargate tasks
- [ ] Use Secrets Manager for sensitive environment variables
- [ ] Enable HTTPS on load balancer
- [ ] Configure WAF rules
- [ ] Set up VPC security groups with minimal open ports
