#!/bin/bash
# Quick production setup script for DigitalOcean, AWS, or any Linux VPS

set -e

echo "🚀 Aquantis Production Setup"
echo "=============================="

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
fi

# Step 1: Update system
echo "📦 Updating system packages..."
apt-get update
apt-get upgrade -y

# Step 2: Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Step 3: Install Docker Compose
echo "📝 Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Step 4: Add current user to docker group
echo "👤 Configuring Docker permissions..."
usermod -aG docker $SUDO_USER

# Step 5: Install essential tools
echo "🛠 Installing tools..."
apt-get install -y git curl wget nginx

# Step 6: Clone repository
echo "📥 Cloning Aquantis repository..."
cd /opt
git clone https://github.com/your-username/aquantis.git aquantis
cd aquantis

# Step 7: Create production environment file
echo "⚙️  Creating environment configuration..."
cp .env.production .env
echo ""
echo "⚠️  IMPORTANT: Edit .env with your production settings:"
echo "   - Strong database password"
echo "   - Your domain name"
echo "   - Docker Hub credentials"
echo ""
read -p "Press Enter after editing .env..."
nano .env

# Step 8: Pull images from Docker Hub
echo "📥 Pulling Docker images..."
docker-compose -f docker-compose.prod.yml pull

# Step 9: Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Step 10: Configure Nginx reverse proxy
echo "🌐 Configuring Nginx reverse proxy..."
cat > /etc/nginx/sites-available/aquantis << 'EOF'
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name _;
    
    # Redirect HTTP to HTTPS (after SSL is configured)
    # return 301 https://$server_name$request_uri;
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

ln -sf /etc/nginx/sites-available/aquantis /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
nginx -t

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Step 11: Verify deployment
echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://$(hostname -I | awk '{print $1}')"
echo "   API: http://$(hostname -I | awk '{print $1}')/api/health"
echo ""
echo "📝 Next steps:"
echo "   1. Point your domain to this server's IP"
echo "   2. Set up SSL/TLS with Let's Encrypt:"
echo "      sudo apt-get install certbot python3-certbot-nginx"
echo "      sudo certbot certonly --nginx -d yourdomain.com"
echo "   3. Monitor logs: docker-compose logs -f"
echo ""
