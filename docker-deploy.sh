#!/usr/bin/env bash
# Automated Docker deployment script for Aquantis

set -e

echo "🐳 Aquantis Docker Deployment"
echo "=============================="
echo ""

# Check Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   macOS: brew install docker"
    echo "   Windows: Download Docker Desktop from https://www.docker.com/products/docker-desktop"
    echo "   Linux: sudo apt-get install docker.io"
    exit 1
fi

echo "✅ Docker is installed"

# Ask for Docker Hub username
read -p "📝 Enter your Docker Hub username: " DOCKER_USERNAME

# Ask for Docker Hub password
read -sp "🔐 Enter your Docker Hub password: " DOCKER_PASSWORD
echo ""

# Login to Docker Hub
echo "🔐 Logging in to Docker Hub..."
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

if [ $? -ne 0 ]; then
    echo "❌ Docker Hub login failed. Check your credentials."
    exit 1
fi

echo "✅ Successfully logged in to Docker Hub"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Build images
echo "🏗️  Building Docker images..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Images built successfully"
echo ""

# Tag images
echo "🏷️  Tagging images..."
docker tag aquantis-one-main-backend:latest $DOCKER_USERNAME/aquantis-backend:latest
docker tag aquantis-one-main-frontend:latest $DOCKER_USERNAME/aquantis-frontend:latest

echo "✅ Images tagged: $DOCKER_USERNAME/aquantis-backend:latest"
echo "✅ Images tagged: $DOCKER_USERNAME/aquantis-frontend:latest"
echo ""

# Push backend
echo "📤 Pushing backend image to Docker Hub..."
docker push $DOCKER_USERNAME/aquantis-backend:latest

if [ $? -ne 0 ]; then
    echo "❌ Backend push failed"
    exit 1
fi

echo "✅ Backend pushed successfully"
echo ""

# Push frontend
echo "📤 Pushing frontend image to Docker Hub..."
docker push $DOCKER_USERNAME/aquantis-frontend:latest

if [ $? -ne 0 ]; then
    echo "❌ Frontend push failed"
    exit 1
fi

echo "✅ Frontend pushed successfully"
echo ""

# Display next steps
echo "🎉 Deployment Complete!"
echo ""
echo "📋 Your Docker Images:"
echo "   Backend:  https://hub.docker.com/r/$DOCKER_USERNAME/aquantis-backend"
echo "   Frontend: https://hub.docker.com/r/$DOCKER_USERNAME/aquantis-frontend"
echo ""
echo "🚀 Next Steps:"
echo "   1. Go to https://cloud.digitalocean.com/apps"
echo "   2. Click 'Create App'"
echo "   3. Select 'Docker Repository'"
echo "   4. Choose your images from Docker Hub"
echo "   5. Configure environment variables"
echo "   6. Deploy!"
echo ""
echo "📖 For detailed instructions, see DOCKER_DEPLOY.md"
echo ""
