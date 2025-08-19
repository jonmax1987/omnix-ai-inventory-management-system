# A/B Testing System for OMNIX AI - Phase 5

## Overview

The A/B Testing system enables data-driven comparison of different AWS Bedrock models (Claude 3 Haiku vs Sonnet) for AI-powered customer analytics. This advanced Phase 5 feature allows you to optimize model selection based on real performance metrics including accuracy, cost, and response time.

## 🎯 Key Benefits

- **Cost Optimization**: Compare cost-effectiveness between models
- **Performance Monitoring**: Track response times and accuracy
- **Data-Driven Decisions**: Make model choices based on actual performance
- **Gradual Rollouts**: Test new models with controlled traffic splits
- **Statistical Significance**: Built-in confidence measurements

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │     Lambda      │    │   A/B Testing   │
│                 │───▶│   Function      │───▶│    Service      │
│ /v1/ab-tests/*  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │   DynamoDB      │◀────────────┘
                       │                 │
                       │ • ab-tests      │
                       │ • ab-metrics    │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │  AWS Bedrock    │
                       │                 │
                       │ • Claude Haiku  │
                       │ • Claude Sonnet │
                       └─────────────────┘
```

## 📊 Database Schema

### A/B Tests Table (`omnix-ai-ab-tests-dev`)
```typescript
{
  testId: string;           // Partition Key
  testName: string;
  modelA: {
    id: string;
    name: string;
    weight: number;         // Traffic percentage (0-100)
  };
  modelB: {
    id: string;
    name: string;
    weight: number;
  };
  startDate: string;        // YYYY-MM-DD
  endDate: string;
  active: boolean;
  metrics: string[];        // Analysis types to test
  createdAt: string;        // ISO timestamp
}
```

### A/B Test Metrics Table (`omnix-ai-ab-test-metrics-dev`)
```typescript
{
  testId: string;               // Partition Key
  modelId: string;              // Sort Key
  totalRequests: number;
  successfulRequests: number;
  totalProcessingTime: number;  // Milliseconds
  totalConfidence: number;      // Sum of confidence scores
  totalInputTokens: number;
  totalOutputTokens: number;
  lastUpdated: string;
}
```

## 🔧 Setup & Deployment

### 1. Infrastructure Setup
```bash
# Run the setup script
./setup-ab-testing.sh
```

### 2. Deploy A/B Testing Code
```bash
# Deploy the enhanced services
./deploy-ab-testing.sh
```

### 3. Verify Deployment
```bash
# Test the API endpoints
curl -X GET "https://your-api.amazonaws.com/v1/ab-tests/models/available"
```

## 🚀 API Endpoints

### 1. Create A/B Test
```bash
POST /v1/ab-tests
Content-Type: application/json

{
  "testId": "haiku-vs-sonnet-2025",
  "testName": "Haiku vs Sonnet - Customer Profiling",
  "modelA": {
    "id": "claude-3-haiku",
    "name": "Claude 3 Haiku",
    "weight": 60
  },
  "modelB": {
    "id": "claude-3-sonnet",
    "name": "Claude 3 Sonnet",
    "weight": 40
  },
  "startDate": "2025-01-20",
  "endDate": "2025-01-27",
  "metrics": ["customer_profiling", "consumption_prediction"]
}
```

### 2. Create Quick Test (Recommended)
```bash
POST /v1/ab-tests/quick-test
Content-Type: application/json

{
  "testName": "Quick Haiku vs Sonnet Test",
  "analysisType": "customer_profiling",
  "durationDays": 7,
  "trafficSplit": 50
}
```

### 3. List All Tests
```bash
GET /v1/ab-tests

# Response:
{
  "success": true,
  "data": [...],
  "totalTests": 5,
  "activeTests": 2
}
```

### 4. Get Test Results
```bash
GET /v1/ab-tests/{testId}/results

# Response:
{
  "success": true,
  "data": {
    "testId": "test-123",
    "testName": "Haiku vs Sonnet Test",
    "status": "running",
    "modelA": {
      "name": "Claude 3 Haiku",
      "metrics": {
        "totalRequests": 1000,
        "successRate": 0.95,
        "averageProcessingTime": 800,
        "averageConfidence": 0.82,
        "averageTokenCost": 0.001
      }
    },
    "modelB": {
      "name": "Claude 3 Sonnet",
      "metrics": {
        "totalRequests": 800,
        "successRate": 0.97,
        "averageProcessingTime": 1200,
        "averageConfidence": 0.89,
        "averageTokenCost": 0.012
      }
    },
    "winner": "B",
    "significance": 0.85,
    "recommendations": [
      "Model B shows superior performance. Consider gradual rollout.",
      "Winner shows significantly higher confidence in predictions."
    ]
  }
}
```

### 5. Get Available Models
```bash
GET /v1/ab-tests/models/available

# Response:
{
  "success": true,
  "data": [
    {
      "id": "claude-3-haiku",
      "name": "Claude 3 Haiku",
      "description": "Fast and cost-effective model for high-volume applications",
      "costPer1kTokens": { "input": 0.00025, "output": 0.00125 },
      "avgResponseTime": "800ms",
      "recommended": true
    },
    {
      "id": "claude-3-sonnet",
      "name": "Claude 3 Sonnet",
      "description": "Balanced model with higher accuracy for complex analysis",
      "costPer1kTokens": { "input": 0.003, "output": 0.015 },
      "avgResponseTime": "1200ms",
      "recommended": false
    }
  ]
}
```

### 6. Deactivate Test
```bash
PUT /v1/ab-tests/{testId}/deactivate
```

## 📈 Monitoring & Analytics

### CloudWatch Dashboard
Access the dashboard: `omnix-ai-ab-testing-dev`

**Key Metrics:**
- Model invocation counts
- Response latency comparison
- DynamoDB table activity
- Error rates by model

### Performance Metrics Tracked
1. **Success Rate**: Percentage of successful AI analyses
2. **Processing Time**: Average response time in milliseconds
3. **Confidence Score**: AI model confidence in predictions
4. **Token Cost**: Average cost per analysis request
5. **Error Rate**: Failed requests by model

## 🧪 Testing Guide

### Running Automated Tests
```bash
cd backend
export API_BASE_URL="https://your-api.amazonaws.com"
export AWS_REGION="eu-central-1"
export STAGE="dev"

npm test test/ab-testing.test.js
```

### Manual Testing Workflow

1. **Create Test**
   ```bash
   curl -X POST "https://your-api.amazonaws.com/v1/ab-tests/quick-test" \
     -H 'Content-Type: application/json' \
     -d '{"testName":"Manual Test","analysisType":"customer_profiling"}'
   ```

2. **Generate Traffic** (Run customer analysis requests)
   ```bash
   curl -X GET "https://your-api.amazonaws.com/v1/customers/123/ai-analysis"
   ```

3. **Check Results** (After collecting data)
   ```bash
   curl -X GET "https://your-api.amazonaws.com/v1/ab-tests/{testId}/results"
   ```

## 🎯 Best Practices

### Test Design
- **Minimum Duration**: Run tests for at least 3-7 days
- **Sample Size**: Collect at least 100 requests per model
- **Traffic Split**: Start with 50/50 split for balanced comparison
- **Single Variable**: Test one thing at a time

### Model Selection Criteria
1. **Primary**: Success rate and confidence score
2. **Secondary**: Processing time for user experience
3. **Tertiary**: Cost efficiency for operational sustainability

### Rollout Strategy
1. **Pilot**: 10% traffic to new model
2. **Gradual**: Increase to 25%, then 50%
3. **Full**: 90% traffic after proven success
4. **Monitoring**: Continuous monitoring even post-rollout

## 🔍 Troubleshooting

### Common Issues

**Test Not Starting**
- Check that models have proper Bedrock access
- Verify DynamoDB table permissions
- Ensure test dates are valid

**No Traffic Assignment**
- Confirm `AB_TESTING_ENABLED=true` in Lambda env
- Check test is active and within date range
- Verify model weights sum to 100

**Inconsistent Results**
- Ensure sufficient sample size (>100 requests)
- Check for external factors (time of day, user segments)
- Verify statistical significance (>0.8)

### Debug Commands
```bash
# Check test configuration
aws dynamodb get-item \
  --table-name omnix-ai-ab-tests-dev \
  --key '{"testId":{"S":"your-test-id"}}'

# Check metrics
aws dynamodb get-item \
  --table-name omnix-ai-ab-test-metrics-dev \
  --key '{"testId":{"S":"your-test-id"},"modelId":{"S":"claude-3-haiku"}}'

# Check Lambda logs
aws logs tail /aws/lambda/omnix-ai-backend-dev --follow
```

## 📊 Results Interpretation

### Statistical Significance
- **0.0 - 0.5**: Insufficient data or no significant difference
- **0.5 - 0.8**: Moderate confidence in results
- **0.8 - 0.95**: High confidence, suitable for decision making
- **0.95+**: Very high confidence, strong evidence

### Winner Determination
The system uses a weighted scoring approach:
- **Success Rate**: 40% weight
- **Confidence Score**: 30% weight
- **Processing Time**: 20% weight (lower is better)
- **Cost Efficiency**: 10% weight (lower is better)

### Action Thresholds
- **Clear Winner** (score difference >10): Implement changes
- **Marginal Difference** (score difference 5-10): Continue testing
- **Tie** (score difference <5): No change needed

## 🚀 Future Enhancements

### Phase 6 Roadmap
- **Multi-armed Bandits**: Dynamic traffic allocation
- **Contextual Testing**: Segment-based A/B tests
- **Automated Rollouts**: Self-optimizing model selection
- **Advanced Analytics**: Cohort analysis and retention metrics

## 🔗 Related Documentation
- [AWS Bedrock Integration Guide](../BEDROCK_INTEGRATION.md)
- [Customer Segmentation System](../CUSTOMER_SEGMENTATION.md)
- [Performance Monitoring](../MONITORING_GUIDE.md)
- [Cost Analytics](../COST_ANALYTICS.md)

---

*This A/B Testing system is part of OMNIX AI Phase 5 implementation, enabling data-driven optimization of AI model selection for customer analytics.*