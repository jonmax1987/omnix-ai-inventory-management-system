#!/bin/bash

set -e

echo "🚀 Setting up AWS Kinesis Streaming Analytics for OMNIX AI"

# Configuration
STREAM_NAME="omnix-ai-customer-events"
REGION="eu-central-1"
SHARD_COUNT=2
RETENTION_HOURS=24

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

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure'"
    exit 1
fi

print_status "Creating Kinesis Data Stream: $STREAM_NAME"

# Create Kinesis stream
if aws kinesis describe-stream --stream-name "$STREAM_NAME" --region "$REGION" &> /dev/null; then
    print_warning "Kinesis stream $STREAM_NAME already exists"
else
    aws kinesis create-stream \
        --stream-name "$STREAM_NAME" \
        --shard-count "$SHARD_COUNT" \
        --region "$REGION"
    
    print_status "Waiting for stream to become active..."
    
    # Wait for stream to become active (timeout after 5 minutes)
    timeout=300
    counter=0
    while [ $counter -lt $timeout ]; do
        status=$(aws kinesis describe-stream --stream-name "$STREAM_NAME" --region "$REGION" --query 'StreamDescription.StreamStatus' --output text)
        if [ "$status" = "ACTIVE" ]; then
            print_status "Stream $STREAM_NAME is now active"
            break
        fi
        echo "Stream status: $status (waiting...)"
        sleep 10
        counter=$((counter + 10))
    done
    
    if [ $counter -ge $timeout ]; then
        print_error "Timeout waiting for stream to become active"
        exit 1
    fi
fi

print_status "Setting retention period to $RETENTION_HOURS hours"
aws kinesis increase-stream-retention-period \
    --stream-name "$STREAM_NAME" \
    --retention-period-hours "$RETENTION_HOURS" \
    --region "$REGION" || print_warning "Retention period might already be set"

# Create IAM role for Lambda to access Kinesis
ROLE_NAME="omnix-ai-kinesis-lambda-role"
print_status "Creating IAM role: $ROLE_NAME"

# Trust policy for Lambda
cat > /tmp/lambda-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role if it doesn't exist
if ! aws iam get-role --role-name "$ROLE_NAME" &> /dev/null; then
    aws iam create-role \
        --role-name "$ROLE_NAME" \
        --assume-role-policy-document file:///tmp/lambda-trust-policy.json
    
    print_status "Role $ROLE_NAME created"
else
    print_warning "Role $ROLE_NAME already exists"
fi

# Kinesis permissions policy
cat > /tmp/kinesis-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "kinesis:PutRecord",
                "kinesis:PutRecords",
                "kinesis:GetRecords",
                "kinesis:GetShardIterator",
                "kinesis:DescribeStream",
                "kinesis:ListStreams",
                "kinesis:ListShards"
            ],
            "Resource": "arn:aws:kinesis:${REGION}:*:stream/${STREAM_NAME}"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:${REGION}:*:*"
        }
    ]
}
EOF

# Attach policies
aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" || true

aws iam put-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-name "KinesisStreamingPolicy" \
    --policy-document file:///tmp/kinesis-policy.json

print_status "IAM policies attached to role $ROLE_NAME"

# Create CloudWatch dashboard for Kinesis monitoring
print_status "Creating CloudWatch dashboard for Kinesis monitoring"

cat > /tmp/kinesis-dashboard.json << EOF
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/Kinesis", "IncomingRecords", "StreamName", "$STREAM_NAME"],
          [".", "OutgoingRecords", ".", "."]
        ],
        "period": 300,
        "stat": "Sum",
        "region": "$REGION",
        "title": "Kinesis Records"
      }
    },
    {
      "type": "metric", 
      "properties": {
        "metrics": [
          ["AWS/Kinesis", "WriteProvisionedThroughputExceeded", "StreamName", "$STREAM_NAME"],
          [".", "ReadProvisionedThroughputExceeded", ".", "."]
        ],
        "period": 300,
        "stat": "Sum",
        "region": "$REGION",
        "title": "Throttling Events"
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/Kinesis", "IteratorAgeMilliseconds", "StreamName", "$STREAM_NAME"]
        ],
        "period": 300,
        "stat": "Maximum",
        "region": "$REGION",
        "title": "Iterator Age (Processing Lag)"
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/Kinesis", "IncomingBytes", "StreamName", "$STREAM_NAME"],
          [".", "OutgoingBytes", ".", "."]
        ],
        "period": 300,
        "stat": "Sum",
        "region": "$REGION", 
        "title": "Data Throughput (Bytes)"
      }
    }
  ]
}
EOF

aws cloudwatch put-dashboard \
    --dashboard-name "OMNIX-AI-Kinesis-Streaming" \
    --dashboard-body file:///tmp/kinesis-dashboard.json \
    --region "$REGION"

print_status "CloudWatch dashboard created: OMNIX-AI-Kinesis-Streaming"

# Set up environment variables for the application
print_status "Environment variables for your application:"
echo "KINESIS_STREAM_NAME=$STREAM_NAME"
echo "AWS_REGION=$REGION"
echo "KINESIS_SHARD_COUNT=$SHARD_COUNT"
echo "KINESIS_RETENTION_HOURS=$RETENTION_HOURS"

# Test the stream
print_status "Testing Kinesis stream with sample event..."

# Create a test record
aws kinesis put-record \
    --stream-name "$STREAM_NAME" \
    --partition-key "test-customer-001" \
    --data "$(echo '{"eventType":"test","customerId":"test-customer-001","timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","message":"Kinesis streaming setup test"}' | base64)" \
    --region "$REGION"

print_status "Test record sent successfully"

# Clean up temporary files
rm -f /tmp/lambda-trust-policy.json /tmp/kinesis-policy.json /tmp/kinesis-dashboard.json

print_status "✅ AWS Kinesis Streaming Analytics setup completed!"
print_status ""
print_status "📊 Dashboard: https://console.aws.amazon.com/cloudwatch/home?region=$REGION#dashboards:name=OMNIX-AI-Kinesis-Streaming"
print_status "🌊 Stream: https://console.aws.amazon.com/kinesis/home?region=$REGION#/streams/details/$STREAM_NAME"
print_status ""
print_status "Next steps:"
print_status "1. Update your Lambda environment variables with the values above"
print_status "2. Deploy your updated application with the streaming analytics features"
print_status "3. Monitor the CloudWatch dashboard for real-time metrics"

echo ""
echo "Happy streaming! 🚀"