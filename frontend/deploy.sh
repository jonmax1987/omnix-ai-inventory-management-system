#!/bin/bash

# OMNIX AI Frontend Deployment Script
# This script builds and deploys the frontend application

set -e

# Configuration
PROJECT_NAME="omnix-ai-frontend"
BUILD_DIR="out"
DEFAULT_TARGET="local"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -t, --target TARGET      Deployment target (local, vercel, netlify, aws-s3) [default: $DEFAULT_TARGET]"
    echo "  -p, --port PORT          Local server port [default: 8080]"
    echo "  --build-only            Only build, don't deploy"
    echo "  --no-build              Skip build step"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                       # Deploy locally on port 8080"
    echo "  $0 -t vercel             # Deploy to Vercel"
    echo "  $0 -t local -p 3000      # Deploy locally on port 3000"
    echo "  $0 --build-only          # Just build for production"
}

check_dependencies() {
    if [[ ! -f "package.json" ]]; then
        error "package.json not found. Please run from the frontend directory."
    fi
    
    if [[ ! -d "node_modules" ]]; then
        warning "node_modules not found. Installing dependencies..."
        npm install
    fi
    
    success "Dependencies checked"
}

build_app() {
    log "Building production application..."
    
    # Clean previous build
    rm -rf "$BUILD_DIR"
    rm -rf ".next"
    
    # Build the application
    npm run build || error "Build failed"
    
    success "Build completed successfully"
    success "Static files generated in: $BUILD_DIR/"
}

deploy_local() {
    local port=${1:-8080}
    log "Starting local production server on port $port..."
    
    if [[ ! -d "$BUILD_DIR" ]]; then
        error "Build directory not found. Run with --build-only first or remove --no-build flag."
    fi
    
    # Check if port is available
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        error "Port $port is already in use. Choose a different port with -p option."
    fi
    
    cd "$BUILD_DIR"
    
    success "Production server starting..."
    success "🚀 OMNIX AI Frontend is now running at: http://localhost:$port"
    success "📱 With full animations and transitions!"
    echo ""
    log "Press Ctrl+C to stop the server"
    
    # Start server
    python3 -m http.server $port --bind 0.0.0.0
}

deploy_vercel() {
    log "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        error "Vercel CLI not found. Install with: npm i -g vercel"
    fi
    
    # Deploy to Vercel
    vercel --prod || error "Vercel deployment failed"
    
    success "Deployed to Vercel successfully!"
}

deploy_netlify() {
    log "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        error "Netlify CLI not found. Install with: npm i -g netlify-cli"
    fi
    
    # Deploy to Netlify
    netlify deploy --prod --dir="$BUILD_DIR" || error "Netlify deployment failed"
    
    success "Deployed to Netlify successfully!"
}

deploy_aws_s3() {
    log "Deploying to AWS S3..."
    
    if ! command -v aws &> /dev/null; then
        error "AWS CLI not found. Please install and configure it first."
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS credentials not configured. Run: aws configure"
    fi
    
    local bucket_name="${PROJECT_NAME}-$(date +%s)"
    warning "This would create a new S3 bucket: $bucket_name"
    warning "S3 deployment not fully implemented. Use Vercel or Netlify instead."
    
    error "S3 deployment requires additional configuration"
}

show_deployment_info() {
    echo ""
    success "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Deployment Information:"
    echo "  Project: $PROJECT_NAME"
    echo "  Target: $TARGET"
    echo "  Build Directory: $BUILD_DIR"
    echo "  Build Size: $(du -sh $BUILD_DIR 2>/dev/null | cut -f1 || echo "Unknown")"
    echo ""
    echo "✨ Features Deployed:"
    echo "  ✅ Core Animation System"
    echo "  ✅ Page Transitions (Fade, Slide, Scale)"
    echo "  ✅ Loading Bar Animations"
    echo "  ✅ Button Micro-interactions"
    echo "  ✅ Accessibility Support"
    echo "  ✅ Mobile-first Design"
    echo "  ✅ Responsive Layout"
    echo ""
    echo "🎬 Animation Pages Available:"
    echo "  • /dashboard/ - Fade transitions"
    echo "  • /inventory/ - Slide left transitions"
    echo "  • /forecasts/ - Slide up transitions"
    echo "  • /transition-test/ - Interactive demo"
    echo "  • /animation-test/ - Full animation showcase"
    echo ""
}

# Parse command line arguments
TARGET="$DEFAULT_TARGET"
PORT="8080"
BUILD_ONLY="false"
NO_BUILD="false"

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--target)
            TARGET="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        --build-only)
            BUILD_ONLY="true"
            shift
            ;;
        --no-build)
            NO_BUILD="true"
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Validate target
if [[ ! "$TARGET" =~ ^(local|vercel|netlify|aws-s3)$ ]]; then
    error "Invalid target. Must be: local, vercel, netlify, or aws-s3"
fi

# Main execution
main() {
    log "Starting OMNIX AI Frontend Deployment"
    log "Target: $TARGET"
    
    check_dependencies
    
    if [[ "$NO_BUILD" != "true" ]]; then
        build_app
    fi
    
    if [[ "$BUILD_ONLY" == "true" ]]; then
        success "Build completed. Skipping deployment."
        show_deployment_info
        return 0
    fi
    
    case $TARGET in
        local)
            deploy_local "$PORT"
            ;;
        vercel)
            deploy_vercel
            ;;
        netlify)
            deploy_netlify
            ;;
        aws-s3)
            deploy_aws_s3
            ;;
    esac
    
    show_deployment_info
}

# Change to script directory
cd "$(dirname "$0")"

# Run main function
main "$@"