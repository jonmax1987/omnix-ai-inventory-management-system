#!/bin/bash

echo "🧪 Setting up A/B Testing Infrastructure for OMNIX AI"
echo "=================================================="

# Set variables
REGION=${AWS_REGION:-"eu-central-1"}
STAGE=${STAGE:-"dev"}
PROJECT_NAME="omnix-ai"

echo "📍 Region: $REGION"
echo "🏷️  Stage: $STAGE"
echo ""

# Create DynamoDB tables for A/B testing
echo "🗄️  Creating DynamoDB tables..."

# A/B Tests Configuration Table
aws dynamodb create-table \
    --table-name "${PROJECT_NAME}-ab-tests-${STAGE}" \
    --attribute-definitions \
        AttributeName=testId,AttributeType=S \
    --key-schema \
        AttributeName=testId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Stage,Value=$STAGE Key=Purpose,Value=ABTesting \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

echo "✅ A/B Tests table created: ${PROJECT_NAME}-ab-tests-${STAGE}"

# A/B Test Metrics Table
aws dynamodb create-table \
    --table-name "${PROJECT_NAME}-ab-test-metrics-${STAGE}" \
    --attribute-definitions \
        AttributeName=testId,AttributeType=S \
        AttributeName=modelId,AttributeType=S \
    --key-schema \
        AttributeName=testId,KeyType=HASH \
        AttributeName=modelId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Stage,Value=$STAGE Key=Purpose,Value=ABTestingMetrics \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

echo "✅ A/B Test Metrics table created: ${PROJECT_NAME}-ab-test-metrics-${STAGE}"

# Wait for tables to become active
echo "⏳ Waiting for tables to become active..."
aws dynamodb wait table-exists --table-name "${PROJECT_NAME}-ab-tests-${STAGE}" --region $REGION
aws dynamodb wait table-exists --table-name "${PROJECT_NAME}-ab-test-metrics-${STAGE}" --region $REGION

# Enable additional Bedrock models for A/B testing
echo "🤖 Requesting access to additional Bedrock models..."

# Claude 3 Sonnet access request
aws bedrock put-model-invocation-logging-configuration \
    --logging-config '{"cloudWatchConfig":{"logGroupName":"'"/aws/bedrock/${PROJECT_NAME}-${STAGE}"'","roleArn":"'"arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/service-role/AmazonBedrockExecutionRole"'"}}' \
    --region $REGION 2>/dev/null || echo "ℹ️  Bedrock logging configuration already exists"

echo "📋 Requested access to Claude 3 models:"
echo "   • anthropic.claude-3-haiku-20240307-v1:0 (already available)"
echo "   • anthropic.claude-3-sonnet-20240229-v1:0"
echo "   • anthropic.claude-3-5-sonnet-20241022-v2:0"
echo ""

# Create CloudWatch dashboard for A/B testing
echo "📊 Creating CloudWatch dashboard for A/B testing..."

DASHBOARD_BODY=$(cat << 'EOF'
{
    "widgets": [
        {
            "type": "metric",
            "x": 0,
            "y": 0,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/Bedrock", "Invocations", "ModelId", "anthropic.claude-3-haiku-20240307-v1:0" ],
                    [ "...", "anthropic.claude-3-sonnet-20240229-v1:0" ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "REGION_PLACEHOLDER",
                "title": "Model Invocations by Type",
                "period": 300,
                "stat": "Sum"
            }
        },
        {
            "type": "metric",
            "x": 12,
            "y": 0,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/Bedrock", "InvocationLatency", "ModelId", "anthropic.claude-3-haiku-20240307-v1:0" ],
                    [ "...", "anthropic.claude-3-sonnet-20240229-v1:0" ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "REGION_PLACEHOLDER",
                "title": "Response Latency Comparison",
                "period": 300,
                "stat": "Average"
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 6,
            "width": 8,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "PROJECT_NAME-ab-tests-STAGE" ],
                    [ ".", "ConsumedWriteCapacityUnits", ".", "." ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "REGION_PLACEHOLDER",
                "title": "A/B Tests Table Activity",
                "period": 300
            }
        },
        {
            "type": "metric",
            "x": 8,
            "y": 6,
            "width": 8,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", "PROJECT_NAME-ab-test-metrics-STAGE" ],
                    [ ".", "ConsumedWriteCapacityUnits", ".", "." ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "REGION_PLACEHOLDER",
                "title": "A/B Test Metrics Table Activity",
                "period": 300
            }
        },
        {
            "type": "log",
            "x": 16,
            "y": 6,
            "width": 8,
            "height": 6,
            "properties": {
                "query": "SOURCE '/aws/lambda/PROJECT_NAME-backend-STAGE'\n| fields @timestamp, @message\n| filter @message like /A\/B test/\n| sort @timestamp desc\n| limit 100",
                "region": "REGION_PLACEHOLDER",
                "title": "A/B Testing Logs"
            }
        }
    ]
}
EOF
)

# Replace placeholders
DASHBOARD_BODY=$(echo "$DASHBOARD_BODY" | sed "s/REGION_PLACEHOLDER/$REGION/g")
DASHBOARD_BODY=$(echo "$DASHBOARD_BODY" | sed "s/PROJECT_NAME/$PROJECT_NAME/g")
DASHBOARD_BODY=$(echo "$DASHBOARD_BODY" | sed "s/STAGE/$STAGE/g")

aws cloudwatch put-dashboard \
    --dashboard-name "${PROJECT_NAME}-ab-testing-${STAGE}" \
    --dashboard-body "$DASHBOARD_BODY" \
    --region $REGION

echo "✅ CloudWatch dashboard created: ${PROJECT_NAME}-ab-testing-${STAGE}"

# Set environment variables for Lambda
echo "🔧 Setting environment variables for A/B testing..."

# Check if Lambda function exists
FUNCTION_NAME="${PROJECT_NAME}-backend-${STAGE}"
if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION > /dev/null 2>&1; then
    # Update Lambda environment variables
    CURRENT_ENV=$(aws lambda get-function-configuration --function-name $FUNCTION_NAME --region $REGION --query 'Environment.Variables' --output json)
    
    # Add A/B testing variables
    UPDATED_ENV=$(echo $CURRENT_ENV | jq '. + {
        "AB_TESTING_ENABLED": "true",
        "AB_TESTS_TABLE": "'"${PROJECT_NAME}-ab-tests-${STAGE}"'",
        "AB_TEST_METRICS_TABLE": "'"${PROJECT_NAME}-ab-test-metrics-${STAGE}"'",
        "BEDROCK_MODEL_HAIKU": "anthropic.claude-3-haiku-20240307-v1:0",
        "BEDROCK_MODEL_SONNET": "anthropic.claude-3-sonnet-20240229-v1:0"
    }')
    
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --environment "Variables=$UPDATED_ENV" \
        --region $REGION
    
    echo "✅ Lambda environment variables updated"
else
    echo "ℹ️  Lambda function not found. Environment variables will be set during deployment."
fi

# Create IAM policy for A/B testing
echo "🔐 Creating IAM policy for A/B testing..."

IAM_POLICY=$(cat << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:${REGION}:*:table/${PROJECT_NAME}-ab-tests-${STAGE}",
                "arn:aws:dynamodb:${REGION}:*:table/${PROJECT_NAME}-ab-test-metrics-${STAGE}"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": [
                "arn:aws:bedrock:${REGION}::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
                "arn:aws:bedrock:${REGION}::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
                "arn:aws:bedrock:${REGION}::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0"
            ]
        }
    ]
}
EOF
)

echo "$IAM_POLICY" > /tmp/ab-testing-policy.json

aws iam put-role-policy \
    --role-name "${PROJECT_NAME}-lambda-execution-role-${STAGE}" \
    --policy-name "${PROJECT_NAME}-ab-testing-policy-${STAGE}" \
    --policy-document file:///tmp/ab-testing-policy.json \
    --region $REGION 2>/dev/null || echo "ℹ️  IAM policy already exists or role not found"

echo "✅ IAM policy created/updated"

# Create sample A/B test for immediate validation
echo "🧪 Creating sample A/B test..."

SAMPLE_TEST=$(cat << EOF
{
    "testId": "sample-haiku-vs-sonnet-$(date +%s)",
    "testName": "Haiku vs Sonnet - Customer Profiling",
    "modelA": {
        "id": "claude-3-haiku",
        "name": "Claude 3 Haiku",
        "weight": 50
    },
    "modelB": {
        "id": "claude-3-sonnet", 
        "name": "Claude 3 Sonnet",
        "weight": 50
    },
    "startDate": "$(date +%Y-%m-%d)",
    "endDate": "$(date -d '+7 days' +%Y-%m-%d)",
    "active": true,
    "metrics": ["customer_profiling"],
    "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)"
}
EOF
)

aws dynamodb put-item \
    --table-name "${PROJECT_NAME}-ab-tests-${STAGE}" \
    --item "$(echo "$SAMPLE_TEST" | jq 'to_entries | map({(.key): {S: (.value | tostring)}}) | from_entries')" \
    --region $REGION

echo "✅ Sample A/B test created"

# Create CloudWatch alarms for A/B testing
echo "⚠️  Creating CloudWatch alarms..."

# High error rate alarm
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-ABTesting-High-Error-Rate-${STAGE}" \
    --alarm-description "Alert when A/B testing error rate is high" \
    --metric-name "Errors" \
    --namespace "AWS/Bedrock" \
    --statistic "Sum" \
    --period 300 \
    --threshold 10 \
    --comparison-operator "GreaterThanThreshold" \
    --evaluation-periods 2 \
    --region $REGION

# Model availability alarm
aws cloudwatch put-metric-alarm \
    --alarm-name "${PROJECT_NAME}-ABTesting-Model-Availability-${STAGE}" \
    --alarm-description "Alert when Bedrock models are unavailable" \
    --metric-name "Invocations" \
    --namespace "AWS/Bedrock" \
    --statistic "Sum" \
    --period 900 \
    --threshold 1 \
    --comparison-operator "LessThanThreshold" \
    --evaluation-periods 2 \
    --region $REGION \
    --treat-missing-data "breaching"

echo "✅ CloudWatch alarms created"

echo ""
echo "🎉 A/B Testing Infrastructure Setup Complete!"
echo "=============================================="
echo ""
echo "📋 Summary:"
echo "   • DynamoDB tables created for A/B tests and metrics"
echo "   • CloudWatch dashboard: ${PROJECT_NAME}-ab-testing-${STAGE}"
echo "   • IAM policies configured for Bedrock model access"
echo "   • Sample A/B test created for validation"
echo "   • CloudWatch alarms configured for monitoring"
echo ""
echo "🚀 Next Steps:"
echo "   1. Deploy your Lambda function with the new A/B testing service"
echo "   2. Test the /v1/ab-tests endpoints"
echo "   3. Monitor the CloudWatch dashboard for A/B test metrics"
echo "   4. Request access to Claude 3 Sonnet model if needed:"
echo "      https://console.aws.amazon.com/bedrock/home?region=${REGION}#/modelaccess"
echo ""
echo "🧪 Test your setup with:"
echo "   curl -X POST https://your-api-gateway/v1/ab-tests/quick-test \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"testName\":\"Test Setup\",\"analysisType\":\"customer_profiling\"}'"
echo ""

# Clean up temp files
rm -f /tmp/ab-testing-policy.json

echo "✅ Setup script completed successfully!"