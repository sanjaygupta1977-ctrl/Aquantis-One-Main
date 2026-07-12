# Automated Docker deployment script for Aquantis (Windows PowerShell)

Write-Host "🐳 Aquantis Docker Deployment" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check Docker is installed
$dockerCheck = docker --version 2>$null
if ($null -eq $dockerCheck) {
    Write-Host "❌ Docker is not installed." -ForegroundColor Red
    Write-Host "   Download Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
}

Write-Host "✅ Docker is installed: $dockerCheck" -ForegroundColor Green
Write-Host ""

# Ask for Docker Hub username
$dockerUsername = Read-Host "📝 Enter your Docker Hub username"

# Ask for Docker Hub password
$dockerPassword = Read-Host -AsSecureString "🔐 Enter your Docker Hub password"
$dockerPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($dockerPassword))

# Login to Docker Hub
Write-Host "🔐 Logging in to Docker Hub..." -ForegroundColor Yellow
$dockerPasswordPlain | docker login -u $dockerUsername --password-stdin

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Hub login failed. Check your credentials." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Successfully logged in to Docker Hub" -ForegroundColor Green
Write-Host ""

# Navigate to project directory
Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Definition)

# Build images
Write-Host "🏗️  Building Docker images..." -ForegroundColor Yellow
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Images built successfully" -ForegroundColor Green
Write-Host ""

# Tag images
Write-Host "🏷️  Tagging images..." -ForegroundColor Yellow
docker tag aquantis-one-main-backend:latest "$dockerUsername/aquantis-backend:latest"
docker tag aquantis-one-main-frontend:latest "$dockerUsername/aquantis-frontend:latest"

Write-Host "✅ Images tagged: $dockerUsername/aquantis-backend:latest" -ForegroundColor Green
Write-Host "✅ Images tagged: $dockerUsername/aquantis-frontend:latest" -ForegroundColor Green
Write-Host ""

# Push backend
Write-Host "📤 Pushing backend image to Docker Hub..." -ForegroundColor Yellow
docker push "$dockerUsername/aquantis-backend:latest"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend push failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend pushed successfully" -ForegroundColor Green
Write-Host ""

# Push frontend
Write-Host "📤 Pushing frontend image to Docker Hub..." -ForegroundColor Yellow
docker push "$dockerUsername/aquantis-frontend:latest"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend push failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend pushed successfully" -ForegroundColor Green
Write-Host ""

# Display next steps
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Your Docker Images:" -ForegroundColor Cyan
Write-Host "   Backend:  https://hub.docker.com/r/$dockerUsername/aquantis-backend" -ForegroundColor White
Write-Host "   Frontend: https://hub.docker.com/r/$dockerUsername/aquantis-frontend" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Go to https://cloud.digitalocean.com/apps" -ForegroundColor White
Write-Host "   2. Click 'Create App'" -ForegroundColor White
Write-Host "   3. Select 'Docker Repository'" -ForegroundColor White
Write-Host "   4. Choose your images from Docker Hub" -ForegroundColor White
Write-Host "   5. Configure environment variables" -ForegroundColor White
Write-Host "   6. Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see DOCKER_DEPLOY.md" -ForegroundColor Cyan
Write-Host ""
