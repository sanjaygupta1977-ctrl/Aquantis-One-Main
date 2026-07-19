#!/bin/bash

#================================
# AQUANTIS DigitalOcean Deployment Script
# Usage: ./deploy-digitalocean.sh <environment>
#================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check requirements
check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed"
        exit 1
    fi
    
    log_success "All requirements met"
}

# Load environment
load_environment() {
    local env=$1
    local env_file=".env.${env}"
    
    if [ ! -f "$env_file" ]; then
        log_error "Environment file $env_file not found"
        log_info "Creating from template..."
        cp .env.production.template "$env_file"
        log_warning "Please fill in $env_file with your values"
        exit 1
    fi
    
    export $(cat "$env_file" | grep -v '^#' | xargs)
    log_success "Environment loaded from $env_file"
}

# Build Docker images
build_images() {
    log_info "Building Docker images..."
    
    docker-compose -f docker-compose.prod.yml build \
        --build-arg VITE_API_URL=$VITE_API_URL \
        --build-arg VITE_APP_NAME="AQUANTIS Global"
    
    log_success "Docker images built successfully"
}

# Push to registry
push_images() {
    log_info "Pushing images to Docker Registry ($DOCKER_REGISTRY)..."
    
    docker tag aquantis-one-main-frontend:latest $DOCKER_REGISTRY/aquantis-frontend:latest
    docker tag aquantis-one-main-backend:latest $DOCKER_REGISTRY/aquantis-backend:latest
    
    docker push $DOCKER_REGISTRY/aquantis-frontend:latest
    docker push $DOCKER_REGISTRY/aquantis-backend:latest
    
    log_success "Images pushed to registry"
}

# Deploy to DigitalOcean
deploy_to_do() {
    local droplet_ip=$1
    
    log_info "Deploying to DigitalOcean droplet at $droplet_ip..."
    
    # SSH into droplet and deploy
    ssh -o StrictHostKeyChecking=no root@$droplet_ip << 'EOF'
        set -e
        cd /opt/Aquantis-One-main
        
        log_info "Pulling latest changes..."
        git pull origin main
        
        log_info "Pulling latest images..."
        docker-compose -f docker-compose.prod.yml pull
        
        log_info "Stopping old containers..."
        docker-compose -f docker-compose.prod.yml down
        
        log_info "Starting new containers..."
        docker-compose -f docker-compose.prod.yml up -d
        
        log_info "Running database migrations..."
        docker-compose -f docker-compose.prod.yml exec -T backend npm run migrate
        
        log_info "Waiting for services to be healthy..."
        sleep 10
        
        log_info "Checking container status..."
        docker-compose -f docker-compose.prod.yml ps
EOF
    
    log_success "Deployment to DigitalOcean complete"
}

# Verify deployment
verify_deployment() {
    local api_url=$1
    
    log_info "Verifying deployment..."
    
    # Check frontend
    log_info "Checking frontend..."
    if curl -f -s "$api_url" > /dev/null; then
        log_success "Frontend is accessible"
    else
        log_error "Frontend is not accessible"
        return 1
    fi
    
    # Check backend health
    log_info "Checking backend health..."
    if curl -f -s "$api_url/api/health" > /dev/null; then
        log_success "Backend is healthy"
    else
        log_error "Backend health check failed"
        return 1
    fi
    
    log_success "Deployment verification passed"
}

# Rollback deployment
rollback_deployment() {
    local droplet_ip=$1
    
    log_warning "Rolling back deployment..."
    
    ssh root@$droplet_ip << 'EOF'
        cd /opt/Aquantis-One-main
        git checkout HEAD~1
        docker-compose -f docker-compose.prod.yml down
        docker-compose -f docker-compose.prod.yml up -d
EOF
    
    log_success "Rollback complete"
}

# Main script
main() {
    local env=${1:-production}
    
    log_info "AQUANTIS DigitalOcean Deployment Script"
    log_info "Environment: $env"
    
    # Steps
    check_requirements
    load_environment "$env"
    
    # Get deployment target
    if [ -z "$DO_DROPLET_IP" ]; then
        read -p "Enter DigitalOcean droplet IP: " droplet_ip
    else
        droplet_ip=$DO_DROPLET_IP
    fi
    
    # Confirm deployment
    read -p "Deploy to $droplet_ip? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warning "Deployment cancelled"
        exit 1
    fi
    
    # Deploy
    build_images
    push_images
    deploy_to_do "$droplet_ip"
    
    # Verify
    if verify_deployment "$CORS_ORIGIN"; then
        log_success "🎉 AQUANTIS deployed successfully to DigitalOcean!"
        log_info "Access your app at: $CORS_ORIGIN"
    else
        log_error "Deployment verification failed"
        read -p "Rollback? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rollback_deployment "$droplet_ip"
        fi
        exit 1
    fi
}

# Run main
main "$@"
