# Docker Deployment Guide for Aquantis

## Step 1: Create Docker Hub Account

1. Go to https://hub.docker.com
2. Click "Sign Up"
3. Create free account with email and password
4. Verify your email
5. Login and note your **username**

---

## Step 2: Tag Your Docker Images

Open terminal/PowerShell and run:

```bash
# Navigate to project directory
cd ./Aquantis-One-main

# Login to Docker Hub
docker login

# When prompted:
# Username: your_docker_hub_username
# Password: your_docker_hub_password

# Tag backend image
docker tag aquantis-one-main-backend:latest your_docker_hub_username/aquantis-backend:latest

# Tag frontend image
docker tag aquantis-one-main-frontend:latest your_docker_hub_username/aquantis-frontend:latest

# Verify tags
docker images | grep aquantis
```

---

## Step 3: Push Images to Docker Hub

```bash
# Push backend
docker push your_docker_hub_username/aquantis-backend:latest

# Push frontend
docker push your_docker_hub_username/aquantis-frontend:latest

# Check on Docker Hub: https://hub.docker.com/repositories
```

**Expected output:**
```
The push refers to repository [docker.io/your_username/aquantis-backend]
latest: digest: sha256:abc123... size: 5000
```

---

## Step 4: Deploy to Cloud (Choose One)

### Option A: DigitalOcean App Platform (Easiest - 10 minutes)

**Step 1: Create DigitalOcean Account**
- Go to https://www.digitalocean.com
- Sign up (get $200 free credit for 60 days)
- Create account

**Step 2: Create App**
- Go to https://cloud.digitalocean.com/apps
- Click "Create App"
- Select "Docker Repository"

**Step 3: Configure Backend**
- Source: Docker Hub
- Image: `your_docker_hub_username/aquantis-backend:latest`
- Environment Variables:
  ```
  DB_USER=aquantis
  DB_PASSWORD=your_strong_password_123456
  DB_HOST=db
  DB_PORT=5432
  DB_NAME=aquantis_db
  PORT=5000
  NODE_ENV=production
  ```
- HTTP Port: 5000
- Click "Add Service"

**Step 4: Configure Frontend**
- Click "Add Service"
- Select "Docker Repository"
- Image: `your_docker_hub_username/aquantis-frontend:latest`
- Environment Variables:
  ```
  VITE_API_URL=https://your-app-name.ondigitalocean.app/api
  ```
- HTTP Port: 3000
- Click "Add Service"

**Step 5: Configure Database**
- Click "Add Resource"
- Select "PostgreSQL"
- Name: `db`
- Click "Create"

**Step 6: Update Backend Environment**
- Backend Service → Edit
- Add environment variable:
  ```
  DB_HOST=db
  ```
- Click "Save"

**Step 7: Deploy**
- Review configuration
- Click "Create Resources"
- Wait 2-3 minutes for deployment

**Access Your App:**
```
Frontend: https://your-app-name.ondigitalocean.app
API: https://your-app-name.ondigitalocean.app/api/health
```

---

### Option B: AWS ECR + ECS (15 minutes)

**Step 1: Create AWS Account**
- Go to https://aws.amazon.com
- Click "Create Account"
- Sign up

**Step 2: Create ECR Repository**
```bash
# Install AWS CLI
# macOS: brew install awscli
# Windows: Download from https://aws.amazon.com/cli/
# Linux: sudo apt-get install awscli

# Configure AWS credentials
aws configure
# Enter: Access Key ID
# Enter: Secret Access Key
# Enter: Default region (us-east-1)

# Create ECR repository
aws ecr create-repository --repository-name aquantis-backend --region us-east-1
aws ecr create-repository --repository-name aquantis-frontend --region us-east-1
```

**Step 3: Push to ECR**
```bash
# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your_account_id.dkr.ecr.us-east-1.amazonaws.com

# Tag images
docker tag aquantis-one-main-backend:latest your_account_id.dkr.ecr.us-east-1.amazonaws.com/aquantis-backend:latest
docker tag aquantis-one-main-frontend:latest your_account_id.dkr.ecr.us-east-1.amazonaws.com/aquantis-frontend:latest

# Push
docker push your_account_id.dkr.ecr.us-east-1.amazonaws.com/aquantis-backend:latest
docker push your_account_id.dkr.ecr.us-east-1.amazonaws.com/aquantis-frontend:latest
```

**Step 4: Deploy via ECS**
- Go to AWS Console → ECS
- Create Cluster → Create Service
- Select Docker images from ECR
- Configure environment variables
- Set RDS PostgreSQL as database
- Deploy

**Access Your App:**
```
Frontend: https://your-app-load-balancer.us-east-1.elb.amazonaws.com
API: https://your-app-load-balancer.us-east-1.elb.amazonaws.com/api/health
```

---

### Option C: Docker Hub + Render (5 minutes)

**Step 1: Create Render Account**
- Go to https://render.com
- Sign up with GitHub

**Step 2: Deploy Frontend**
- Click "New +"
- Select "Web Service"
- Connect your Docker Hub image: `your_docker_hub_username/aquantis-frontend`
- Environment Variables:
  ```
  VITE_API_URL=https://your-backend-url/api
  ```
- Deploy

**Step 3: Deploy Backend**
- Click "New +"
- Select "Web Service"
- Connect your Docker Hub image: `your_docker_hub_username/aquantis-backend`
- Environment Variables:
  ```
  DB_USER=aquantis
  DB_PASSWORD=your_strong_password
  DB_HOST=your_postgres_host
  DB_PORT=5432
  DB_NAME=aquantis_db
  ```
- Deploy

**Step 4: Add PostgreSQL**
- Click "New +"
- Select "PostgreSQL"
- Create database

---

## Step 5: Verify Deployment

```bash
# Test backend API
curl https://your-app-url/api/health

# Test frontend
curl https://your-app-url

# Expected: HTML response (frontend loads successfully)
```

---

## Step 6: Set Up Custom Domain (Optional)

**Option 1: DigitalOcean App**
- App Settings → Domains
- Add your domain (e.g., aquantis.com)
- Update DNS A record to DigitalOcean nameservers

**Option 2: Render**
- Service Settings → Custom Domain
- Add your domain
- Update DNS CNAME record

---

## Troubleshooting

### Images not building?
```bash
# Check Docker Hub account is logged in
docker logout
docker login

# Rebuild and push again
docker-compose build --no-cache
docker push your_username/aquantis-backend:latest
```

### App shows "Application Error"?
```bash
# Check logs in cloud platform dashboard
# Verify environment variables are correct
# Ensure database connection string is correct
```

### Port already in use?
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Images not pulling?
```bash
# Make sure your Docker Hub repository is public
# Docker Hub → Repository → Settings → Make Public

# Rebuild and push with tag
docker tag aquantis-one-main-backend:latest your_username/aquantis-backend:v1.0
docker push your_username/aquantis-backend:v1.0
```

---

## Summary

| Platform | Ease | Cost | Time |
|----------|------|------|------|
| DigitalOcean App | ⭐⭐⭐⭐⭐ | $12/mo | 5 min |
| Render | ⭐⭐⭐⭐ | Free-$7/mo | 5 min |
| AWS ECS | ⭐⭐⭐ | $10-30/mo | 15 min |
| Heroku | ⭐⭐⭐⭐⭐ | $7-50/mo | 10 min |

**Recommendation: Start with DigitalOcean App Platform** — Easiest setup, best value, free trial credits.

