# AQUANTIS Global - DigitalOcean Deployment Guide

## 🚀 Quick Start Deployment (5-10 minutes)

### Prerequisites
- DigitalOcean account (free $200 credit available)
- Docker Hub account (for pushing images)
- Git & SSH keys set up

---

## Step 1: Create DigitalOcean Droplet

### Option A: Using CLI (Fastest)
```bash
# Install doctl CLI
brew install doctl

# Authenticate
doctl auth init

# Create Docker-enabled droplet
doctl compute droplet create aquantis-prod \
  --image docker-20-04 \
  --size s-2vcpu-4gb \
  --region sfo3 \
  --enable-monitoring \
  --enable-backups \
  --ssh-keys <your-ssh-key-id>
```

### Option B: Using Web Console
1. Go to https://cloud.digitalocean.com/droplets/new
2. **Image:** Docker 20.04 on Ubuntu 22.04
3. **Size:** $24/month (2vCPU, 4GB RAM, 80GB SSD) ← *Recommended*
   - Alternative: $12/month (1vCPU, 2GB) for MVP testing
4. **Region:** SFO3 (or closest to users)
5. **Backups:** Enable ($1.20/month)
6. **Monitoring:** Enable (free)
7. Click **Create Droplet**

**Note:** Droplet takes 1-2 minutes to boot

---

## Step 2: Configure Droplet

### SSH into your droplet
```bash
ssh root@<your-droplet-ip>
```

### Update system
```bash
apt update && apt upgrade -y
apt install -y git curl wget nano
```

### Install Docker Compose
```bash
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### Verify Docker
```bash
docker --version
docker-compose --version
```

---

## Step 3: Deploy AQUANTIS

### Clone repository
```bash
cd /opt
git clone https://github.com/your-repo/Aquantis-One-main.git
cd Aquantis-One-main
```

### Create environment files
```bash
# Frontend .env
cat > .env << EOF
VITE_API_URL=https://api.aquantis-prod.io
VITE_APP_NAME=AQUANTIS Global
NODE_ENV=production
EOF

# Backend .env
cat > backend/.env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://aquantis:${RANDOM_PASSWORD}@postgres:5432/aquantis
JWT_SECRET=$(openssl rand -hex 32)
CORS_ORIGIN=https://aquantis-prod.io
LOG_LEVEL=info
EOF
```

### Start services with Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Verify services
```bash
docker-compose ps
docker-compose logs -f frontend
```

Should see:
```
aquantis-frontend   ✓ Running on :3000
aquantis-backend    ✓ Running on :5000
aquantis-postgres   ✓ Running on :5432
```

---

## Step 4: Set Up Reverse Proxy (Nginx)

### Install Nginx
```bash
apt install -y nginx
```

### Create Nginx config
```bash
cat > /etc/nginx/sites-available/aquantis << 'EOF'
upstream frontend {
    server 127.0.0.1:3000;
}

upstream backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name aquantis-prod.io www.aquantis-prod.io;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aquantis-prod.io www.aquantis-prod.io;

    ssl_certificate /etc/letsencrypt/live/aquantis-prod.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aquantis-prod.io/privkey.pem;

    client_max_body_size 100M;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health checks
    location /health {
        access_log off;
        return 200 "healthy\n";
    }
}
EOF
```

### Enable site
```bash
ln -s /etc/nginx/sites-available/aquantis /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

---

## Step 5: SSL Certificates (Let's Encrypt)

### Install Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### Get SSL certificate
```bash
certbot certonly --nginx \
  -d aquantis-prod.io \
  -d www.aquantis-prod.io \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive
```

### Auto-renewal
```bash
systemctl enable certbot.timer
systemctl start certbot.timer
```

---

## Step 6: Set Up Domain (DNS)

### Point your domain to DigitalOcean
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Update Name Servers to DigitalOcean:
   ```
   ns1.digitalocean.com
   ns2.digitalocean.com
   ns3.digitalocean.com
   ```
   OR
3. Create A records:
   ```
   aquantis-prod.io      A    <your-droplet-ip>
   www.aquantis-prod.io  A    <your-droplet-ip>
   ```

Wait 15-30 minutes for DNS propagation.

---

## Step 7: Database Backups

### Enable automated backups
```bash
docker exec aquantis-postgres pg_dump -U aquantis aquantis > backup.sql
```

### Set up weekly backups
```bash
cat > /etc/cron.weekly/backup-aquantis << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/aquantis"
mkdir -p $BACKUP_DIR
docker exec aquantis-postgres pg_dump -U aquantis aquantis | gzip > $BACKUP_DIR/backup-$(date +%Y%m%d).sql.gz
find $BACKUP_DIR -mtime +30 -delete
EOF

chmod +x /etc/cron.weekly/backup-aquantis
```

---

## Step 8: Monitoring & Alerts

### Enable DigitalOcean Monitoring
```bash
# Already enabled in droplet creation
# Check: https://cloud.digitalocean.com/monitoring/droplets
```

### Set up alerts in DigitalOcean console:
- CPU > 80%
- Memory > 90%
- Disk > 85%

### Optional: Send alerts to Slack
```bash
# Create alert webhook in DigitalOcean
# Connect to Slack workspace for notifications
```

---

## Step 9: Scaling (When Needed)

### Horizontal Scaling (Multiple Droplets)
```bash
# Create load balancer
doctl compute load-balancer create \
  --name aquantis-lb \
  --region sfo3 \
  --forward-rules entry_protocol:https,entry_tls_port:443,target_protocol:http,target_port:80

# Add multiple droplets to load balancer
```

### Vertical Scaling (Larger Droplet)
```bash
# Resize existing droplet (requires downtime: ~5 min)
doctl compute droplet-action resize aquantis-prod \
  --size s-4vcpu-8gb
```

---

## Step 10: CI/CD Pipeline (GitHub Actions)

### Create workflow file
```yaml
# .github/workflows/deploy.yml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: docker-compose build
      
      - name: Push to Docker Hub
        run: |
          echo ${{ secrets.DOCKERHUB_TOKEN }} | docker login -u ${{ secrets.DOCKERHUB_USERNAME }} --password-stdin
          docker-compose push
      
      - name: Deploy to DigitalOcean
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.DO_PRIVATE_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh -i ~/.ssh/id_rsa root@${{ secrets.DO_DROPLET_IP }} << 'SCRIPT'
            cd /opt/Aquantis-One-main
            docker-compose pull
            docker-compose up -d
            docker-compose exec -T backend npm run migrate
          SCRIPT
```

---

## Deployment Checklist

- [ ] DigitalOcean account created
- [ ] Droplet (2vCPU, 4GB, $24/mo) deployed
- [ ] Docker & Docker Compose installed
- [ ] AQUANTIS cloned & running
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate (Let's Encrypt) installed
- [ ] Domain DNS configured
- [ ] Database backups set up
- [ ] Monitoring alerts configured
- [ ] Load balancer (optional) created
- [ ] CI/CD pipeline (GitHub Actions) set up

---

## Cost Breakdown (Monthly)

| Item | Cost |
|------|------|
| Droplet (2vCPU, 4GB, 80GB SSD) | $24.00 |
| Backups (20% of droplet) | $4.80 |
| Load Balancer (if used) | $10.00 |
| Monitoring | Free |
| SSL Certificate | Free |
| Domain (.io) | ~$30-50 (yearly) |
| **TOTAL** | ~$38.80/mo |

---

## Verification

### Check frontend
```bash
curl https://aquantis-prod.io
# Should return HTML
```

### Check backend
```bash
curl https://aquantis-prod.io/api/health
# Should return: {"status":"ok"}
```

### Check database
```bash
docker exec aquantis-postgres psql -U aquantis -d aquantis -c "SELECT version();"
```

---

## Troubleshooting

### Services won't start
```bash
docker-compose logs -f
docker-compose ps
```

### SSL issues
```bash
certbot certificates
certbot renew --dry-run
```

### Performance issues
```bash
# Check resource usage
docker stats
htop

# View nginx logs
tail -f /var/log/nginx/error.log
```

### Database connection errors
```bash
docker exec aquantis-postgres psql -U aquantis -d aquantis
```

---

## Next Steps

1. **Monitor first 24 hours** - Check logs, verify all services running
2. **Load testing** - Ensure 100+ concurrent users supported
3. **Backup verification** - Restore from backup to verify integrity
4. **Add team members** - Manage DigitalOcean access via API tokens
5. **Set up CI/CD** - Automate deployments on Git push

---

## Support & Resources

- 📧 Email: support@aquantis.io
- 📞 Slack: #deployment channel
- 📚 Docs: https://docs.aquantis-prod.io
- 🐛 Issues: https://github.com/your-repo/issues

---

**Deployment Status: READY** ✅
**Estimated Setup Time: 10-15 minutes**
**Estimated Monthly Cost: ~$39/mo**
