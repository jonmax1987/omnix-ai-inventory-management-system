#!/bin/bash

# OMNIX AI Frontend AWS Deployment Script
# This script deploys the frontend to AWS S3 + CloudFront

set -e

# Configuration
PROJECT_NAME="omnix-ai"
DEFAULT_ENVIRONMENT="dev"
DEFAULT_REGION="eu-central-1"
BUILD_DIR="out"

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
    echo "  -e, --environment ENV    Environment (dev, staging, prod) [default: $DEFAULT_ENVIRONMENT]"
    echo "  -r, --region REGION      AWS region [default: $DEFAULT_REGION]"
    echo "  --build-only            Only build, don't deploy"
    echo "  --no-build              Skip build step"
    echo "  --dry-run               Show what would be deployed"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                       # Deploy to dev environment"
    echo "  $0 -e prod               # Deploy to production"
    echo "  $0 --build-only          # Just build for production"
}

check_dependencies() {
    if [[ ! -f "package.json" ]]; then
        error "package.json not found. Please run from the frontend directory."
    fi
    
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed. Please install it first."
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS credentials not configured. Run: aws configure"
    fi
    
    if [[ ! -d "node_modules" ]]; then
        warning "node_modules not found. Installing dependencies..."
        npm install
    fi
    
    success "Dependencies checked"
}

get_s3_bucket_name() {
    local stack_name="${PROJECT_NAME}-infrastructure-${ENVIRONMENT}"
    local bucket_name
    
    log "Getting S3 bucket name from CloudFormation stack..."
    
    bucket_name=$(aws cloudformation describe-stacks \
        --stack-name "$stack_name" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`StaticAssetsBucketName`].OutputValue' \
        --output text 2>/dev/null || echo "")
    
    if [[ -z "$bucket_name" ]]; then
        error "Could not find StaticAssetsBucket from CloudFormation stack: $stack_name"
    fi
    
    echo "$bucket_name"
}

build_frontend() {
    log "Building frontend application..."
    
    # Clean previous build
    rm -rf "$BUILD_DIR"
    rm -rf ".next"
    
    # Build the application
    npm run build || error "Frontend build failed"
    
    success "Frontend build completed successfully"
    
    # Show build info
    local build_size=$(du -sh "$BUILD_DIR" 2>/dev/null | cut -f1 || echo "Unknown")
    log "Build size: $build_size"
    log "Files generated in: $BUILD_DIR/"
}

configure_s3_website() {
    local bucket_name="$1"
    
    log "Configuring S3 bucket for static website hosting..."
    
    # Configure website hosting
    aws s3 website "s3://$bucket_name" \
        --index-document index.html \
        --error-document 404.html \
        --region "$REGION" || error "Failed to configure S3 website hosting"
    
    # Update bucket policy for public read access
    local bucket_policy=$(cat <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${bucket_name}/*"
        }
    ]
}
EOF
)
    
    echo "$bucket_policy" | aws s3api put-bucket-policy \
        --bucket "$bucket_name" \
        --policy file:///dev/stdin \
        --region "$REGION" || warning "Failed to set bucket policy (may already be configured)"
    
    success "S3 bucket configured for website hosting"
}

deploy_to_s3() {
    local bucket_name="$1"
    
    if [[ ! -d "$BUILD_DIR" ]]; then
        error "Build directory not found: $BUILD_DIR"
    fi
    
    log "Deploying frontend files to S3 bucket: $bucket_name"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log "DRY RUN - Would sync files to s3://$bucket_name/"
        return 0
    fi
    
    # Configure S3 for website hosting
    configure_s3_website "$bucket_name"
    
    # Sync files to S3
    aws s3 sync "$BUILD_DIR/" "s3://$bucket_name/" \
        --region "$REGION" \
        --delete \
        --cache-control "public, max-age=31536000" \
        --exclude "*.html" \
        --exclude "*.txt" \
        || error "Failed to sync files to S3"
    
    # Upload HTML files with different cache control
    aws s3 sync "$BUILD_DIR/" "s3://$bucket_name/" \
        --region "$REGION" \
        --cache-control "public, max-age=0, must-revalidate" \
        --include "*.html" \
        --include "*.txt" \
        || error "Failed to upload HTML files to S3"
    
    success "Frontend deployed to S3 successfully"
}

get_website_url() {
    local bucket_name="$1"
    echo "http://${bucket_name}.s3-website.${REGION}.amazonaws.com"
}

show_deployment_summary() {
    local bucket_name="$1"
    local website_url="$2"
    
    echo ""
    success "🎉 OMNIX AI Frontend Deployment Complete!"
    echo ""
    echo "📋 Deployment Information:"
    echo "  Project: $PROJECT_NAME"
    echo "  Environment: $ENVIRONMENT"
    echo "  Region: $REGION"
    echo "  S3 Bucket: $bucket_name"
    echo "  Website URL: $website_url"
    echo ""
    echo "✨ Features Deployed:"
    echo "  ✅ Core Animation System with Framer Motion"
    echo "  ✅ Page Transitions (Fade, Slide, Scale)"
    echo "  ✅ Loading Bar Animations"
    echo "  ✅ Button Micro-interactions"
    echo "  ✅ Accessibility Support"
    echo "  ✅ Mobile-first Responsive Design"
    echo ""
    echo "🌐 Available Pages:"
    echo "  • $website_url/dashboard/ - Main dashboard"
    echo "  • $website_url/inventory/ - Inventory management"
    echo "  • $website_url/forecasts/ - AI forecasting"
    echo "  • $website_url/transition-test/ - Interactive demo"
    echo "  • $website_url/animation-test/ - Animation showcase"
    echo ""
    warning "Note: It may take a few minutes for the website to be fully accessible."
}

# Parse command line arguments
ENVIRONMENT="$DEFAULT_ENVIRONMENT"
REGION="$DEFAULT_REGION"
BUILD_ONLY="false"
NO_BUILD="false"
DRY_RUN="false"

while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -r|--region)
            REGION="$2"
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
        --dry-run)
            DRY_RUN="true"
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

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    error "Invalid environment. Must be: dev, staging, or prod"
fi

# Main execution
main() {
    log "Starting OMNIX AI Frontend Deployment to AWS"
    log "Environment: $ENVIRONMENT"
    log "Region: $REGION"
    
    check_dependencies
    
    if [[ "$NO_BUILD" != "true" ]]; then
        build_frontend
    fi
    
    if [[ "$BUILD_ONLY" == "true" ]]; then
        success "Build completed. Skipping deployment."
        return 0
    fi
    
    local bucket_name
    bucket_name=$(get_s3_bucket_name)
    
    deploy_to_s3 "$bucket_name"
    
    local website_url
    website_url=$(get_website_url "$bucket_name")
    
    show_deployment_summary "$bucket_name" "$website_url"
    
    success "Deployment completed successfully!"
}

# Change to script directory
cd "$(dirname "$0")"

# Run main function
main "$@"