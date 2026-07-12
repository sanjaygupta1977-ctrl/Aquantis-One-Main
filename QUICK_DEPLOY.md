# 🚀 Aquantis Live Deployment - Quick Start

## The Fastest Way to Go Live (5 minutes)

### Step 1: Push to Docker Hub
```bash
# Create Docker Hub account (free): https://hub.docker.com

# In your project directory:
docker login

docker build -f Dockerfile.frontend -t your-username/aquantis-frontend:latest .
docker build -f backend/Dockerfile -t your-username/aquantis-backend:latest ./backend

docker push your-username/aquantis-frontend:latest
docker push your-username/aquantis-backend:latest
```

### Step 2: Deploy to DigitalOcean (Easiest)
1. Go to https://www.digitalocean.com/products/app-platform
2. Click "Create App"
3. Select "Docker Registry"
4. Choose `your-username/aquantis-frontend` and `your-username/aquantis-backend`
5. Add environment variables:
   - `DB_PASSWORD`: Your strong password
   - `VITE_API_URL`: Your DigitalOcean app domain
6. Click "Deploy"
7. Done! Your app is live in 2-3 minutes

**Cost:** ~$12/month (includes PostgreSQL)

---

## Alternative: Deploy to $5 VPS

### On Your VPS (DigitalOcean Droplet / Linode / AWS)

```bash
# 1. SSH into your server
ssh root@your_server_ip

# 2. Run setup script (installs Docker, Compose, Nginx)
curl -fsSL https://raw.githubusercontent.com/your-username/aquantis/main/setup-production.sh | bash

# 3. Configure domain
# Point your domain's A record to your server IP

# 4. Set up SSL certificate (free with Let's Encrypt)
sudo certbot certonly --nginx -d yourdomain.com

# 5. Edit nginx config to use SSL
sudo nano /etc/nginx/sites-available/aquantis

# 6. Restart Nginx
sudo systemctl restart nginx
```

**Cost:** $5/month VPS + $10/year domain

---

## Access Your Live App

- **Frontend:** https://yourdomain.com
- **API:** https://yourdomain.com/api/health
- **API Tester:** https://yourdomain.com/api-tester.html

---

## Monitor Your Application

```bash
# SSH into server and check logs
ssh root@your_server_ip
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

---

## Update Production

```bash
# Make changes locally, push to Docker Hub
git push origin main
docker-compose build
docker push your-username/aquantis-backend:latest
docker push your-username/aquantis-frontend:latest

# On server, pull and restart
ssh root@your_server_ip
cd /opt/aquantis
docker-compose pull
docker-compose up -d
```

---

## Troubleshooting

**App won't start:**
```bash
docker-compose logs backend
docker-compose logs postgres
```

**Database connection error:**
- Check `.env` file has correct `DB_PASSWORD`
- Verify PostgreSQL container is running: `docker ps`

**Port already in use:**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

**Nginx not working:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🎉 Your App is Live!

Share your domain with others. Your water intelligence platform is now accessible 24/7!

