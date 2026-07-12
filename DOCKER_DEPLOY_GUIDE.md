# Docker Deployment - Step by Step Guide

## 📋 Table of Contents
1. [Create Docker Hub Account](#step-1-create-docker-hub-account)
2. [Tag and Push Images](#step-2-tag-and-push-images)
3. [Deploy to DigitalOcean (Recommended)](#step-3-deploy-to-digitalocean)
4. [Verify Deployment](#step-4-verify-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Step 1: Create Docker Hub Account

### What is Docker Hub?
Docker Hub is a cloud service where you store your Docker images. Think of it like GitHub for Docker containers.

### How to Create Account

**1. Go to Docker Hub**
- Open browser: https://hub.docker.com
- Click "Sign Up"

**2. Fill Registration Form**
```
Email: your-email@example.com
Username: your-docker-username (used for image names)
Password: strong-password-here
```

**3. Verify Email**
- Check your email
- Click verification link
- Login to Docker Hub

**4. Remember Your Username**
- You'll use this in all commands below
- Example: `sanjaygupta` → images become `sanjaygupta/aquantis-backend`

---

## Step 2: Tag and Push Images

### On Your Computer (Windows/Mac/Linux)

**Open PowerShell or Terminal:**

```bash
# 1. Navigate to your project
cd ./Aquantis-One-main

# 2. Login to Docker Hub
docker login

# When prompted:
# Username: your-docker-username (from Step 1)
# Password: your-password-here

# 3. Tag backend image
docker tag aquantis-one-main-backend:latest your-docker-username/aquantis-backend:latest

# 4. Tag frontend image
docker tag aquantis-one-main-frontend:latest your-docker-username/aquantis-frontend:latest

# 5. Verify tags
docker images | grep aquantis
```

**Example Output:**
```
REPOSITORY                                 TAG       IMAGE ID
your-docker-username/aquantis-backend      latest    abc123def456
your-docker-username/aquantis-frontend     latest    xyz789uvw012
```

### Push Images to Docker Hub

```bash
# Push backend (first push takes 2-5 minutes)
docker push your-docker-username/aquantis-backend:latest

# Push frontend
docker push your-docker-username/aquantis-frontend:latest
```

**Expected Output:**
```
The push refers to repository [docker.io/your-docker-username/aquantis-backend]
latest: digest: sha256:abc123... size: 50MB
Pushed successfully!
```

### Verify on Docker Hub

1. Go to https://hub.docker.com
2. Click your profile icon → "Repositories"
3. You should see:
   - `aquantis-backend`
   - `aquantis-frontend`

---

## Step 3: Deploy to DigitalOcean

### Why DigitalOcean?
- **Easiest:** No complex configuration
- **Free Credits:** $200 for 60 days
- **Cost:** ~$12/month after trial
- **Time:** 5 minutes to deploy

### A. Create DigitalOcean Account

**1. Sign Up**
- Go to https://www.digitalocean.com
- Click "Create Account"
- Use email or GitHub login
- Get $200 free credits for 60 days

**2. Verify Email**
- Check email for verification link
- Click link to activate account

**3. Add Payment Method**
- Dashboard → Settings → Billing
- Add credit card (for after free trial)

### B. Create App

**1. Go to App Platform**
- https://cloud.digitalocean.com/apps
- Click "Create App"

**2. Select Source**
- Choose "Docker Repository"
- Click "Next"

**3. Add Backend Service**

Select Your Backend Image:
- Docker Registry: Docker Hub
- Repository: `your-docker-username/aquantis-backend`
- Tag: `latest`
- Click "Add Service"

Configure Backend:
```
Service Name: backend
HTTP Port: 5000
Environment Variables:
  DB_USER = aquantis
  DB_PASSWORD = MyStrongPassword123456 (change this!)
  DB_HOST = db
  DB_PORT = 5432
  DB_NAME = aquantis_db
  PORT = 5000
  NODE_ENV = production
```

**4. Add Frontend Service**

Click "+ Add Service":
- Docker Registry: Docker Hub
- Repository: `your-docker-username/aquantis-frontend`
- Tag: `latest`

Configure Frontend:
```
Service Name: frontend
HTTP Port: 3000
Environment Variables:
  VITE_API_URL = https://your-app-name.ondigitalocean.app/api
```

**5. Add PostgreSQL Database**

Click "+ Add Resource":
- Select "PostgreSQL"
- Name: `db`
- Database Name: `aquantis_db`
- Click "Create"

**6. Update Backend Database Connection**

Go back to backend service:
- Click "Edit"
- Change environment variable:
  ```
  DB_HOST = db
  ```
- Click "Save"

**7. Review & Deploy**

- Check all services are configured
- Click "Create Resources"
- **Wait 2-3 minutes** for deployment

**8. Get Your URL**

After deployment completes:
- You'll see your app URL: `https://your-app-name.ondigitalocean.app`
- Share this URL to access your app!

---

## Step 4: Verify Deployment

### Test Your App

**1. Open Frontend**
```
https://your-app-name.ondigitalocean.app
```
You should see the Aquantis login/dashboard page.

**2. Test Backend API**
```
https://your-app-name.ondigitalocean.app/api/health
```
Response should be:
```json
{"status": "Backend API running", "timestamp": "2024-01-15T10:30:00.000Z"}
```

**3. Test API Tester**
```
https://your-app-name.ondigitalocean.app/api-tester.html
```
Should load interactive API testing interface.

### View Logs

If something isn't working:

1. Go to DigitalOcean Dashboard
2. Click your app
3. Click "Runtime Logs"
4. Look for error messages

---

## Troubleshooting

### Problem: "Failed to pull image"

**Solution:**
```bash
# Make sure Docker Hub repo is public
# 1. Go to https://hub.docker.com
# 2. Click your repository
# 3. Settings → Make Public
# 4. Redeploy in DigitalOcean
```

### Problem: "Connection refused" on API

**Solution:**
```bash
# Check backend logs in DigitalOcean
# 1. Dashboard → App → Runtime Logs
# 2. Look for errors
# 3. Verify environment variables are correct
```

### Problem: "Database connection error"

**Solution:**
```bash
# Check PostgreSQL is running
# 1. Dashboard → Components → Database
# 2. Should show "Running"
# 3. Verify DB_PASSWORD matches in backend service
```

### Problem: "Images still building after 10 minutes"

**Solution:**
```bash
# Restart deployment
# 1. Dashboard → Deployments
# 2. Click "Retry"
# OR
# 3. Delete app and create new one
```

---

## Update Your App

When you make changes locally:

```bash
# 1. Rebuild images
docker-compose build

# 2. Tag new version
docker tag aquantis-one-main-backend:latest your-docker-username/aquantis-backend:v2
docker tag aquantis-one-main-frontend:latest your-docker-username/aquantis-frontend:v2

# 3. Push to Docker Hub
docker push your-docker-username/aquantis-backend:v2
docker push your-docker-username/aquantis-frontend:v2

# 4. Update DigitalOcean
#    Go to app → Edit Component → Update image tag from "latest" to "v2"
```

---

## 🎉 Your App is Live!

Your Aquantis water intelligence platform is now accessible to anyone on the internet!

### Share Your App
```
Frontend: https://your-app-name.ondigitalocean.app
API Docs: https://your-app-name.ondigitalocean.app/api-tester.html
```

### Next Steps
1. Add a custom domain (optional)
2. Set up SSL certificate (automatic on DigitalOcean)
3. Configure monitoring and alerts
4. Add more features and redeploy

