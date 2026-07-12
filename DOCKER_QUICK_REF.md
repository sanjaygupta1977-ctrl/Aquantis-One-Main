# Docker Deployment - Quick Reference Card

## 🚀 Deploy in 5 Steps

### Step 1: Create Docker Hub Account (2 min)
```
Visit: https://hub.docker.com
Sign Up → Verify Email → Login
Remember your username!
```

### Step 2: Tag Images (1 min)
```bash
docker login
docker tag aquantis-one-main-backend:latest YOUR_USERNAME/aquantis-backend:latest
docker tag aquantis-one-main-frontend:latest YOUR_USERNAME/aquantis-frontend:latest
```

### Step 3: Push to Docker Hub (5 min)
```bash
docker push YOUR_USERNAME/aquantis-backend:latest
docker push YOUR_USERNAME/aquantis-frontend:latest
```

### Step 4: Deploy to DigitalOcean (5 min)
```
1. https://cloud.digitalocean.com/apps
2. Create App → Docker Repository
3. Add Backend Service (port 5000)
4. Add Frontend Service (port 3000)
5. Add PostgreSQL Database
6. Deploy!
```

### Step 5: Access Your App
```
Frontend: https://your-app-name.ondigitalocean.app
API: https://your-app-name.ondigitalocean.app/api/health
```

---

## 📋 Docker Hub vs DigitalOcean

| Task | What is it? | Why? |
|------|-----------|------|
| Docker Hub | Image storage | Stores your app as a package |
| DigitalOcean | Cloud server | Runs your app 24/7 |

---

## 🔧 Environment Variables for DigitalOcean

**Backend:**
```
DB_USER=aquantis
DB_PASSWORD=strong_password_here
DB_HOST=db
DB_PORT=5432
DB_NAME=aquantis_db
PORT=5000
NODE_ENV=production
```

**Frontend:**
```
VITE_API_URL=https://your-app-name.ondigitalocean.app/api
```

---

## ✅ Verification Checklist

- [ ] Docker Hub account created
- [ ] Images tagged with YOUR_USERNAME
- [ ] Images pushed to Docker Hub
- [ ] DigitalOcean account created
- [ ] Backend service deployed
- [ ] Frontend service deployed
- [ ] PostgreSQL created
- [ ] Frontend accessible at https://your-app-name.ondigitalocean.app
- [ ] API responding at /api/health
- [ ] Can save data via web interface

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Image not found" | Make Docker Hub repo public |
| "Connection refused" | Check backend health in logs |
| "Database error" | Verify DB_PASSWORD in env vars |
| "App won't start" | View Runtime Logs in DigitalOcean |

---

## 💰 Costs

- DigitalOcean App Platform: ~$12/month after $200 trial
- Custom domain: ~$10/year (optional)
- **Total: $10-15/month**

---

## 📚 Detailed Guides

- **Full Guide:** DOCKER_DEPLOY_GUIDE.md
- **Technical Details:** DOCKER_DEPLOY.md
- **Production Setup:** DEPLOYMENT.md

