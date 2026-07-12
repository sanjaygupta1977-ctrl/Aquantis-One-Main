# Copy-Paste Commands for Docker Deployment

## Replace YOUR_USERNAME with your Docker Hub username

---

## Commands for Windows (PowerShell)

### 1. Navigate to Project
```powershell
cd ./Aquantis-One-main
```

### 2. Login to Docker Hub
```powershell
docker login
# Enter username and password when prompted
```

### 3. Tag Images (Replace YOUR_USERNAME)
```powershell
docker tag aquantis-one-main-backend:latest YOUR_USERNAME/aquantis-backend:latest
docker tag aquantis-one-main-frontend:latest YOUR_USERNAME/aquantis-frontend:latest
```

### 4. Verify Tags
```powershell
docker images | Select-String aquantis
```

### 5. Push Backend
```powershell
docker push YOUR_USERNAME/aquantis-backend:latest
```

### 6. Push Frontend
```powershell
docker push YOUR_USERNAME/aquantis-frontend:latest
```

### 7. Verify on Docker Hub
```powershell
# Open in browser
Start-Process "https://hub.docker.com/repositories"
```

---

## Commands for Mac/Linux (Bash)

### 1. Navigate to Project
```bash
cd ./Aquantis-One-main
```

### 2. Login to Docker Hub
```bash
docker login
# Enter username and password when prompted
```

### 3. Tag Images (Replace YOUR_USERNAME)
```bash
docker tag aquantis-one-main-backend:latest YOUR_USERNAME/aquantis-backend:latest
docker tag aquantis-one-main-frontend:latest YOUR_USERNAME/aquantis-frontend:latest
```

### 4. Verify Tags
```bash
docker images | grep aquantis
```

### 5. Push Backend
```bash
docker push YOUR_USERNAME/aquantis-backend:latest
```

### 6. Push Frontend
```bash
docker push YOUR_USERNAME/aquantis-frontend:latest
```

### 7. Verify on Docker Hub
```bash
# Open in browser
open "https://hub.docker.com/repositories"
```

---

## Automated Script (Easiest)

### Windows (PowerShell)
```powershell
# Run automated deployment
.\docker-deploy.ps1
# Follow prompts - it does everything for you!
```

### Mac/Linux (Bash)
```bash
# Make script executable
chmod +x docker-deploy.sh

# Run automated deployment
./docker-deploy.sh
# Follow prompts - it does everything for you!
```

---

## DigitalOcean Deployment Steps (Manual)

### Step-by-Step in Web Browser

**1. Create App**
```
Go to: https://cloud.digitalocean.com/apps
Click: "Create App"
Select: "Docker Repository"
```

**2. Add Backend Image**
```
Docker Registry: Docker Hub
Repository: YOUR_USERNAME/aquantis-backend
Tag: latest
Service Name: backend
HTTP Port: 5000
```

**3. Set Backend Environment Variables**
```
Click: "Add Environment Variable" multiple times

DB_USER = aquantis
DB_PASSWORD = YourStrongPassword123 (change this!)
DB_HOST = db
DB_PORT = 5432
DB_NAME = aquantis_db
PORT = 5000
NODE_ENV = production
```

**4. Add Frontend Image**
```
Click: "+Add Service"
Docker Registry: Docker Hub
Repository: YOUR_USERNAME/aquantis-frontend
Tag: latest
Service Name: frontend
HTTP Port: 3000
```

**5. Set Frontend Environment Variables**
```
VITE_API_URL = https://your-app-name.ondigitalocean.app/api
```

**6. Add Database**
```
Click: "+Add Resource"
Select: "PostgreSQL"
Name: db
Database Name: aquantis_db
```

**7. Deploy**
```
Click: "Create Resources"
Wait: 2-3 minutes
Check: Your app URL
```

---

## Test Your Deployment

### 1. Open Frontend
```
https://your-app-name.ondigitalocean.app
```
Should load the Aquantis dashboard

### 2. Test API
```
https://your-app-name.ondigitalocean.app/api/health
```
Response:
```json
{"status":"Backend API running","timestamp":"2024-01-15T10:30:00.000Z"}
```

### 3. Test Saving Data
```
Frontend → Water Intelligence page
Enter values → Click "Save to Database"
Should succeed
```

---

## Troubleshoot

### Check Docker Installed
```powershell
docker --version
```

### Check Images Built
```powershell
docker images
```

### Check Images Pushed
```powershell
# Visit https://hub.docker.com/repositories
# Should see your images
```

### View Build Logs
```powershell
docker-compose logs backend
```

### View Deployment Logs
```
DigitalOcean Dashboard
→ Your App
→ Runtime Logs
→ Look for errors
```

---

## Update Your App Later

```bash
# Make changes to code...

# 1. Rebuild
docker-compose build

# 2. Tag new version
docker tag aquantis-one-main-backend:latest YOUR_USERNAME/aquantis-backend:v2
docker tag aquantis-one-main-frontend:latest YOUR_USERNAME/aquantis-frontend:v2

# 3. Push
docker push YOUR_USERNAME/aquantis-backend:v2
docker push YOUR_USERNAME/aquantis-frontend:v2

# 4. Update in DigitalOcean
# Edit backend → Image tag: v2
# Edit frontend → Image tag: v2
```

---

## 🎉 Done!

Your app is live on the internet!
Share: `https://your-app-name.ondigitalocean.app`

