# Aquantis Live Deployment Guide

## 🚀 Deployment Options

### Option 1: Docker Hub + Remote Server (AWS/DigitalOcean/Linode)

#### Step 1: Push images to Docker Hub
```bash
# Create Docker Hub account if you don't have one
# https://hub.docker.com

# Build images
docker-compose build

# Tag images
docker tag aquantis-one-main-backend:latest your-username/aquantis-backend:latest
docker tag aquantis-one-main-frontend:latest your-username/aquantis-frontend:latest

# Push to Docker Hub
docker push your-username/aquantis-backend:latest
docker push your-username/aquantis-frontend:latest
```

#### Step 2: Deploy to Remote Server
```bash
# SSH into your server (e.g., AWS EC2, DigitalOcean Droplet)
ssh ubuntu@your_server_ip

# Install Docker and Docker Compose (if not already installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/your-username/aquantis.git
cd aquantis

# Create .env.production file with your configuration
cp .env.production .env

# Edit .env with your settings
nano .env

# Update docker-compose.prod.yml image references
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose logs -f
```

---

### Option 2: Docker Build Cloud (Recommended)

#### Step 1: Set up Docker Build Cloud
```bash
# Create Docker account: https://hub.docker.com
# Enable Build Cloud in Docker Dashboard

# Push to repository
git push origin main  # Triggers auto-build

# Docker automatically builds and pushes images to Docker Hub
```

#### Step 2: Deploy via Docker Hub
```bash
# On your production server:
docker run -d \
  --name aquantis-backend \
  -p 5000:5000 \
  -e DB_PASSWORD=your_strong_password \
  your-username/aquantis-backend:latest

docker run -d \
  --name aquantis-frontend \
  -p 80:3000 \
  -e VITE_API_URL=https://yourdomain.com/api \
  your-username/aquantis-frontend:latest
```

---

### Option 3: Kubernetes (Scalable Production)

#### Deploy to Kubernetes
```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Create Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployment
kubectl get pods -n aquantis
kubectl logs -n aquantis -l app=backend -f
```

---

### Option 4: DigitalOcean App Platform (Easiest)

1. Push images to Docker Hub
2. Go to https://cloud.digitalocean.com/apps
3. Click "Create App"
4. Select "Docker Registry" and choose your Aquantis images
5. Configure environment variables
6. Deploy

---

### Option 5: AWS ECS (Elastic Container Service)

```bash
# Push to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your_account_id.dkr.ecr.us-east-1.amazonaws.com

docker tag aquantis-one-main-backend:latest your_account_id.dkr.ecr.us-east-1.amazonaws.com/aquantis-backend:latest
docker push your_account_id.dkr.ecr.us-east-1.amazonaws.com/aquantis-backend:latest

# Create ECS task definition and service via AWS Console or CLI
```

---

## 📋 Production Checklist

- [ ] Update `.env.production` with strong database password
- [ ] Use environment variables for all secrets
- [ ] Set `NODE_ENV=production`
- [ ] Configure SSL/TLS certificate (Let's Encrypt)
- [ ] Set up domain name (A record pointing to server IP)
- [ ] Configure firewall rules (allow ports 80, 443)
- [ ] Enable backups for PostgreSQL data
- [ ] Set up monitoring and logging
- [ ] Configure auto-restart for containers
- [ ] Enable health checks
- [ ] Set resource limits (CPU, memory)
- [ ] Create CI/CD pipeline

---

## 🔒 Security Best Practices

```bash
# 1. Use strong database password
DB_PASSWORD=use_a_very_strong_password_here_min_20_chars

# 2. Enable SSL/TLS with Nginx reverse proxy
# 3. Never commit .env files to git
# 4. Use secrets management (AWS Secrets Manager, Vault)
# 5. Enable PostgreSQL backups
# 6. Implement rate limiting
# 7. Use health checks
# 8. Monitor logs and errors
```

---

## 📊 Monitoring & Logging

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Monitor resource usage
docker stats

# Check container health
docker ps
```

---

## 🔄 Updating Production

```bash
# Pull latest code
git pull origin main

# Rebuild images
docker-compose build

# Push to Docker Hub
docker push your-username/aquantis-backend:latest
docker push your-username/aquantis-frontend:latest

# On production server, pull and restart
docker-compose pull
docker-compose up -d
```

---

## 💰 Estimated Costs (Monthly)

- **VPS (1GB RAM, 25GB SSD):** $5-10/month (Linode, DigitalOcean)
- **AWS EC2 (t2.micro):** ~$10/month
- **DigitalOcean App Platform:** ~$15/month
- **Managed PostgreSQL:** +$15-30/month
- **Domain name:** $10-15/year

**Total:** $20-50/month for a production-grade setup

