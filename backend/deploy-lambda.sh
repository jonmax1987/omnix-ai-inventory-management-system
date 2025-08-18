#!/bin/bash

echo "🚀 Starting AWS Lambda Deployment Process..."

# Step 1: Build the application
echo "📦 Building NestJS application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Step 2: Create deployment package
echo "📁 Creating deployment package..."
mkdir -p deployment
cp -r dist/* deployment/
cp package.json deployment/
cp -r node_modules deployment/

# Copy Lambda handler to deployment directory
cp lambda.ts deployment/ 2>/dev/null || echo "⚠️  Lambda handler not found, using alternative approach"

# Step 3: Install production dependencies only
echo "📦 Installing production dependencies..."
cd deployment
npm install --production --omit=dev
cd ..

# Step 4: Create ZIP file for Lambda
echo "🗜️  Creating Lambda deployment package..."
cd deployment
zip -r ../omnix-ai-backend-lambda.zip . -x "*.map" "*.ts" "test/*" "*.test.js"
cd ..

echo "✅ Lambda package created: omnix-ai-backend-lambda.zip"
echo "📊 Package size: $(du -h omnix-ai-backend-lambda.zip | cut -f1)"

# Step 5: Check if AWS CLI is available
if command -v aws &> /dev/null; then
    echo "🔧 AWS CLI found. Ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Upload omnix-ai-backend-lambda.zip to AWS Lambda"
    echo "2. Configure API Gateway to point to Lambda function"
    echo "3. Set up DynamoDB tables"
    echo "4. Configure environment variables"
else
    echo "⚠️  AWS CLI not found. Manual deployment required."
    echo ""
    echo "Manual deployment steps:"
    echo "1. Upload omnix-ai-backend-lambda.zip to AWS Lambda Console"
    echo "2. Set runtime to Node.js 18.x"
    echo "3. Set handler to 'dist/lambda.handler' or 'lambda.handler'"
    echo "4. Configure environment variables (see BACKEND_DEPLOYMENT_REPORT.md)"
fi

echo ""
echo "🎉 Deployment package ready!"