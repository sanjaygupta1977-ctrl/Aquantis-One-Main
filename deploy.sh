#!/bin/bash
# Deploy Aquantis to a remote server via SSH

# Configuration
REMOTE_HOST="your_server_ip"
REMOTE_USER="ubuntu"
REMOTE_PATH="/home/ubuntu/aquantis"
DOCKER_REGISTRY="docker.io"
IMAGE_NAME="your-username/aquantis"

echo "🚀 Deploying Aquantis to Production..."

# Step 1: Build and push images to Docker Hub
echo "📦 Building Docker images..."
docker-compose build

echo "📤 Pushing images to Docker Hub..."
docker tag aquantis-one-main-backend:latest $DOCKER_REGISTRY/$IMAGE_NAME-backend:latest
docker tag aquantis-one-main-frontend:latest $DOCKER_REGISTRY/$IMAGE_NAME-frontend:latest

docker push $DOCKER_REGISTRY/$IMAGE_NAME-backend:latest
docker push $DOCKER_REGISTRY/$IMAGE_NAME-frontend:latest

# Step 2: SSH into remote server and deploy
echo "🔗 Connecting to remote server..."
ssh $REMOTE_USER@$REMOTE_HOST << 'EOF'
  # Create deployment directory
  mkdir -p /home/ubuntu/aquantis
  cd /home/ubuntu/aquantis
  
  # Pull latest code (if using git)
  git pull origin main
  
  # Pull latest images
  docker pull $DOCKER_REGISTRY/$IMAGE_NAME-backend:latest
  docker pull $DOCKER_REGISTRY/$IMAGE_NAME-frontend:latest
  
  # Update docker-compose.yml to use registry images
  sed -i 's|build:|# build:|g' docker-compose.yml
  sed -i 's|context:|# context:|g' docker-compose.yml
  sed -i 's|dockerfile:|# dockerfile:|g' docker-compose.yml
  
  # Start services
  docker-compose up -d
  
  echo "✅ Deployment complete!"
EOF

echo "✅ Aquantis is now live!"
