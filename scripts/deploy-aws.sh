#!/bin/bash

# AWS Deployment Script for SaaS Starter
# This script automates the deployment process to AWS using Terraform

set -e  # Exit on any error

echo "🚀 Starting AWS Deployment for SaaS Starter"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install Terraform first."
        exit 1
    fi
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_status "All prerequisites met!"
}

# Deploy infrastructure step by step
deploy_infrastructure() {
    cd aws-template
    
    print_status "Initializing Terraform..."
    terraform init
    
    # Step 1: Deploy VPC
    print_status "Step 1: Deploying VPC..."
    sed -i.bak 's/enable_vpc.*=.*false/enable_vpc = true/' terraform.tfvars
    terraform plan -target=module.vpc -out=vpc.tfplan
    terraform apply vpc.tfplan
    
    # Step 2: Deploy ECR
    print_status "Step 2: Deploying ECR Repository..."
    sed -i.bak 's/enable_ecr.*=.*false/enable_ecr = true/' terraform.tfvars
    terraform plan -target=module.ecr -out=ecr.tfplan
    terraform apply ecr.tfplan
    
    # Get ECR details
    ECR_REPO_URL=$(terraform output -raw ecr_repository_url 2>/dev/null || echo "")
    if [ -z "$ECR_REPO_URL" ]; then
        print_error "Could not get ECR repository URL. Please check Terraform outputs."
        exit 1
    fi
    
    print_status "ECR Repository created: $ECR_REPO_URL"
    
    cd ..
}

# Build and push Docker image
build_and_push_image() {
    print_status "Building and pushing Docker image..."
    
    # Get AWS account ID and region
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    AWS_REGION=$(aws configure get region || echo "us-east-1")
    
    ECR_REPO_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/saas-starter-nextjs"
    
    # Login to ECR
    print_status "Logging into ECR..."
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO_URL
    
    # Build the image
    print_status "Building Docker image..."
    docker build -t saas-starter-nextjs .
    
    # Tag the image
    print_status "Tagging image for ECR..."
    docker tag saas-starter-nextjs:latest $ECR_REPO_URL:latest
    
    # Push the image
    print_status "Pushing image to ECR..."
    docker push $ECR_REPO_URL:latest
    
    print_status "Docker image pushed successfully!"
}

# Deploy remaining infrastructure
deploy_remaining_services() {
    cd aws-template
    
    # Step 3: Deploy S3 Storage
    print_status "Step 3: Deploying S3 Storage..."
    sed -i.bak 's/enable_s3_storage.*=.*false/enable_s3_storage = true/' terraform.tfvars
    terraform plan -target=module.storage -out=storage.tfplan
    terraform apply storage.tfplan
    
    # Step 4: Deploy RDS Database
    print_status "Step 4: Deploying PostgreSQL Database..."
    sed -i.bak 's/enable_rds.*=.*false/enable_rds = true/' terraform.tfvars
    terraform plan -target=module.database -out=database.tfplan
    terraform apply database.tfplan
    
    # Get database connection details
    DB_ENDPOINT=$(terraform output -raw db_endpoint 2>/dev/null || echo "")
    DB_NAME=$(terraform output -raw db_name 2>/dev/null || echo "")
    
    print_status "Database created: $DB_ENDPOINT"
    
    # Update environment variables with real values
    print_status "Updating environment variables..."
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    AWS_REGION=$(aws configure get region || echo "us-east-1")
    
    # Update terraform.tfvars with actual values
    sed -i.bak "s|ACCOUNT_ID|${AWS_ACCOUNT_ID}|g" terraform.tfvars
    sed -i.bak "s|REGION|${AWS_REGION}|g" terraform.tfvars
    sed -i.bak "s|DB_HOST|${DB_ENDPOINT}|g" terraform.tfvars
    sed -i.bak "s|DB_USER|postgres|g" terraform.tfvars
    sed -i.bak "s|DB_PASSWORD|ChangeThisSecurePassword123!|g" terraform.tfvars
    sed -i.bak "s|DB_NAME|saas_starter|g" terraform.tfvars
    
    # Step 5: Deploy ECS Service
    print_status "Step 5: Deploying ECS Service with Next.js app..."
    sed -i.bak 's/enable_ecs.*=.*false/enable_ecs = true/' terraform.tfvars
    terraform plan -target=module.ecs -out=ecs.tfplan
    terraform apply ecs.tfplan
    
    # Get ALB URL
    ALB_URL=$(terraform output -raw alb_dns_name 2>/dev/null || echo "")
    
    cd ..
    
    print_status "🎉 Deployment completed successfully!"
    print_status "Your application is available at: http://$ALB_URL"
    print_warning "Note: It may take a few minutes for the service to be fully available."
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    # Check if terraform.tfvars exists
    if [ ! -f "aws-template/terraform.tfvars" ]; then
        print_status "Creating terraform.tfvars from example..."
        cp aws-template/terraform.tfvars.example aws-template/terraform.tfvars
        print_warning "Please edit aws-template/terraform.tfvars with your specific values before continuing."
        print_warning "Press any key to continue when ready..."
        read -n 1 -s
    fi
    
    check_prerequisites
    deploy_infrastructure
    build_and_push_image
    deploy_remaining_services
    
    print_status "🚀 SaaS Starter deployed successfully to AWS!"
    print_status "Next steps:"
    print_status "1. Set up your domain name and SSL certificate"
    print_status "2. Configure your environment variables"
    print_status "3. Run database migrations"
    print_status "4. Test your application"
}

# Run main function
main "$@" 