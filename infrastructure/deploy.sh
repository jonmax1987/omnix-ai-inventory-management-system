#!/bin/bash

# OMNIX AI Infrastructure Deployment Script
# This script deploys the complete AWS infrastructure for the OMNIX AI system

set -e

# Configuration
PROJECT_NAME="omnix-ai"
DEFAULT_ENVIRONMENT="dev"
DEFAULT_REGION="eu-central-1"

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
    echo "  -d, --domain DOMAIN      Custom domain name (optional)"
    echo "  --dry-run               Show what would be deployed without making changes"
    echo "  --delete                Delete the stack instead of deploying"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Deploy to dev environment"
    echo "  $0 -e prod -r us-west-2              # Deploy to production in us-west-2"
    echo "  $0 -e staging -d staging.omnix.ai    # Deploy staging with custom domain"
    echo "  $0 --delete -e dev                   # Delete dev environment"
}

validate_aws_cli() {
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed. Please install it first."
    fi

    # Check if AWS credentials are configured
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS credentials are not configured. Please run 'aws configure'."
    fi

    success "AWS CLI is configured"
}

validate_environment() {
    if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
        error "Invalid environment. Must be: dev, staging, or prod"
    fi
}

check_stack_exists() {
    local stack_name="$1"
    aws cloudformation describe-stacks --stack-name "$stack_name" --region "$REGION" &> /dev/null
}

deploy_stack() {
    local stack_name="${PROJECT_NAME}-infrastructure-${ENVIRONMENT}"
    local template_file="cloudformation-template.yml"
    
    log "Preparing to deploy CloudFormation stack: $stack_name"
    
    # Validate template
    log "Validating CloudFormation template..."
    aws cloudformation validate-template \
        --template-body file://"$template_file" \
        --region "$REGION" > /dev/null || error "Template validation failed"
    
    success "Template validation passed"
    
    # Prepare parameters
    local parameters=(
        "ParameterKey=Environment,ParameterValue=$ENVIRONMENT"
        "ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME"
    )
    
    if [[ -n "$DOMAIN_NAME" ]]; then
        parameters+=("ParameterKey=DomainName,ParameterValue=$DOMAIN_NAME")
    fi
    
    # Deploy or update stack
    local operation
    if check_stack_exists "$stack_name"; then
        operation="update-stack"
        log "Updating existing stack: $stack_name"
    else
        operation="create-stack"
        log "Creating new stack: $stack_name"
    fi
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log "DRY RUN - Would execute:"
        echo "aws cloudformation $operation \\"
        echo "  --stack-name $stack_name \\"
        echo "  --template-body file://$template_file \\"
        echo "  --parameters ${parameters[*]} \\"
        echo "  --capabilities CAPABILITY_NAMED_IAM \\"
        echo "  --region $REGION"
        return 0
    fi
    
    # Execute deployment
    aws cloudformation "$operation" \
        --stack-name "$stack_name" \
        --template-body file://"$template_file" \
        --parameters "${parameters[@]}" \
        --capabilities CAPABILITY_NAMED_IAM \
        --region "$REGION" \
        --tags Key=Environment,Value="$ENVIRONMENT" Key=Project,Value="$PROJECT_NAME" \
        || error "Stack $operation failed"
    
    log "Waiting for stack $operation to complete..."
    aws cloudformation wait "stack-${operation%-stack}-complete" \
        --stack-name "$stack_name" \
        --region "$REGION" \
        || error "Stack $operation did not complete successfully"
    
    success "Stack $operation completed successfully"
    
    # Display outputs
    log "Stack outputs:"
    aws cloudformation describe-stacks \
        --stack-name "$stack_name" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[*].{Key:OutputKey,Value:OutputValue,Description:Description}' \
        --output table
}

delete_stack() {
    local stack_name="${PROJECT_NAME}-infrastructure-${ENVIRONMENT}"
    
    if ! check_stack_exists "$stack_name"; then
        warning "Stack $stack_name does not exist"
        return 0
    fi
    
    log "Deleting CloudFormation stack: $stack_name"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log "DRY RUN - Would delete stack: $stack_name"
        return 0
    fi
    
    # Confirm deletion for production
    if [[ "$ENVIRONMENT" == "prod" ]]; then
        echo -e "${RED}WARNING: You are about to delete the PRODUCTION environment!${NC}"
        read -p "Type 'DELETE' to confirm: " confirmation
        if [[ "$confirmation" != "DELETE" ]]; then
            error "Deletion cancelled"
        fi
    fi
    
    aws cloudformation delete-stack \
        --stack-name "$stack_name" \
        --region "$REGION" \
        || error "Stack deletion failed"
    
    log "Waiting for stack deletion to complete..."
    aws cloudformation wait stack-delete-complete \
        --stack-name "$stack_name" \
        --region "$REGION" \
        || error "Stack deletion did not complete successfully"
    
    success "Stack deleted successfully"
}

post_deployment_tasks() {
    log "Running post-deployment tasks..."
    
    # Display important information
    success "Infrastructure deployment completed!"
    echo ""
    echo "Important information:"
    echo "  Environment: $ENVIRONMENT"
    echo "  Region: $REGION"
    echo "  Project: $PROJECT_NAME"
    if [[ -n "$DOMAIN_NAME" ]]; then
        echo "  Domain: $DOMAIN_NAME"
    fi
    echo ""
    
    # Get API Gateway URL
    local stack_name="${PROJECT_NAME}-infrastructure-${ENVIRONMENT}"
    local api_url=$(aws cloudformation describe-stacks \
        --stack-name "$stack_name" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
        --output text 2>/dev/null || echo "")
    
    if [[ -n "$api_url" ]]; then
        echo "API Gateway URL: $api_url"
    fi
    
    echo ""
    warning "Next steps:"
    echo "1. Deploy Lambda functions using the Serverless framework"
    echo "2. Configure your frontend environment variables"
    echo "3. Set up monitoring and alerting"
    echo "4. Configure custom domain (if needed)"
    echo ""
    echo "To deploy Lambda functions:"
    echo "  cd ../ai-lambda && npm run deploy:$ENVIRONMENT"
    echo "  cd ../backend && npm run deploy:$ENVIRONMENT"
}

# Parse command line arguments
ENVIRONMENT="$DEFAULT_ENVIRONMENT"
REGION="$DEFAULT_REGION"
DOMAIN_NAME=""
DRY_RUN="false"
DELETE_STACK="false"

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
        -d|--domain)
            DOMAIN_NAME="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN="true"
            shift
            ;;
        --delete)
            DELETE_STACK="true"
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

# Main execution
main() {
    log "Starting OMNIX AI Infrastructure Deployment"
    log "Environment: $ENVIRONMENT"
    log "Region: $REGION"
    
    validate_aws_cli
    validate_environment
    
    if [[ "$DELETE_STACK" == "true" ]]; then
        delete_stack
    else
        deploy_stack
        if [[ "$DRY_RUN" != "true" ]]; then
            post_deployment_tasks
        fi
    fi
    
    success "Operation completed successfully!"
}

# Change to script directory
cd "$(dirname "$0")"

# Run main function
main "$@"