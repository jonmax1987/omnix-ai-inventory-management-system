# Technical Implementation Notes

## AWS Bedrock Integration

### Setup Requirements
```bash
# Install required packages
npm install @aws-sdk/client-bedrock-runtime
npm install @aws-sdk/client-bedrock
```

### IAM Permissions Required
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:*:*:model/anthropic.claude-3-*"
    }
  ]
}
```

### Model Configuration
```typescript
// Recommended model configurations
const MODELS = {
  development: 'anthropic.claude-3-haiku-20240307-v1:0',  // Fast, cheap
  production: 'anthropic.claude-3-sonnet-20240229-v1:0',   // Balanced
  advanced: 'anthropic.claude-3-opus-20240229-v1:0'        // Most capable
};
```

## DynamoDB Optimization

### Index Design Rationale
```typescript
// Customer profiles table
GSI: 'customerId-updatedAt-index'
- Query: Get latest customer profile
- Use case: Real-time recommendations

// Purchase history table  
GSI1: 'customerId-purchaseDate-index'
- Query: Get customer's recent purchases
- Use case: Consumption pattern analysis

GSI2: 'productId-purchaseDate-index'
- Query: Get all customers who bought product
- Use case: Collaborative filtering
```

### Query Patterns
```typescript
// Efficient query for last N purchases
const params = {
  TableName: 'omnix-ai-purchase-history-dev',
  IndexName: 'customerId-purchaseDate-index',
  KeyConditionExpression: 'customerId = :customerId',
  ExpressionAttributeValues: {
    ':customerId': customerId
  },
  ScanIndexForward: false, // Descending order
  Limit: 20
};
```

## AI Prompt Engineering

### Effective Prompt Structure
```typescript
const analysisPrompt = `
Role: You are an expert retail analyst specializing in customer behavior.

Context: Analyzing supermarket purchase history to predict consumption patterns.

Data: [Structured purchase history]

Task: 
1. Identify purchase frequencies for each product category
2. Detect consumption patterns and cycles
3. Predict next purchase dates with confidence scores
4. Infer customer characteristics

Output: Structured JSON with predictions and reasoning
`;
```

### Prompt Optimization Tips
1. **Be specific**: Clear instructions yield better results
2. **Provide examples**: Show desired output format
3. **Use structured data**: JSON/CSV easier to analyze than prose
4. **Set constraints**: Specify confidence thresholds
5. **Request reasoning**: Improves accuracy and debugging

## Performance Optimization

### Caching Strategy
```typescript
// Multi-tier caching
class CacheManager {
  // L1: In-memory cache (Lambda container)
  private memoryCache = new Map();
  
  // L2: ElastiCache/Redis
  private redisCache: Redis;
  
  // L3: DynamoDB cache table
  private dynamoCache: DynamoDB;
  
  async get(key: string) {
    // Check L1 first (fastest)
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // Check L2 (fast)
    const redisResult = await this.redisCache.get(key);
    if (redisResult) {
      this.memoryCache.set(key, redisResult);
      return redisResult;
    }
    
    // Check L3 (slower but persistent)
    const dynamoResult = await this.dynamoCache.get(key);
    if (dynamoResult) {
      await this.redisCache.set(key, dynamoResult);
      this.memoryCache.set(key, dynamoResult);
      return dynamoResult;
    }
    
    return null;
  }
}
```

### Lambda Optimization
```typescript
// Connection reuse
const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  maxAttempts: 3
});

// Keep outside handler for connection reuse
export const handler = async (event) => {
  // Reuses bedrock client across invocations
};
```

## Error Handling

### Bedrock Error Recovery
```typescript
async function invokeBedrockWithRetry(params: any, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await bedrock.invokeModel(params);
    } catch (error) {
      if (error.name === 'ThrottlingException' && attempt < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        continue;
      }
      
      if (error.name === 'ModelTimeoutException') {
        // Fallback to simpler analysis
        return await fallbackAnalysis(params);
      }
      
      throw error;
    }
  }
}
```

## Testing Strategies

### Test Data Generation
```typescript
// Generate realistic purchase history
function generateTestPurchaseHistory(customerId: string, days: number = 90) {
  const categories = ['dairy', 'produce', 'meat', 'bakery', 'household'];
  const purchases = [];
  
  for (let d = 0; d < days; d += Math.random() * 7 + 1) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    
    purchases.push({
      customerId,
      purchaseDate: date.toISOString(),
      items: categories
        .filter(() => Math.random() > 0.5)
        .map(category => ({
          category,
          productName: `${category} product`,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: Math.random() * 20 + 5
        }))
    });
  }
  
  return purchases;
}
```

### Integration Testing
```typescript
// Test AI analysis end-to-end
describe('AI Customer Analysis', () => {
  it('should predict consumption patterns accurately', async () => {
    // Arrange
    const testCustomer = await createTestCustomer();
    const purchases = generateTestPurchaseHistory(testCustomer.id);
    
    // Act
    const analysis = await aiService.analyzeCustomer(testCustomer.id);
    
    // Assert
    expect(analysis.predictions).toBeDefined();
    expect(analysis.confidence).toBeGreaterThan(0.7);
    expect(analysis.patterns.milk.frequency).toBe('weekly');
  });
});
```

## Monitoring & Observability

### Key Metrics to Track
```typescript
const metrics = {
  // Performance metrics
  'ai.analysis.latency': histogram(),
  'ai.prediction.accuracy': gauge(),
  'cache.hit.rate': counter(),
  
  // Business metrics
  'recommendation.click.rate': counter(),
  'purchase.from.recommendation': counter(),
  'customer.satisfaction.score': gauge(),
  
  // Cost metrics
  'bedrock.api.calls': counter(),
  'bedrock.tokens.used': counter(),
  'lambda.execution.duration': histogram()
};
```

### CloudWatch Alarms
```yaml
Alarms:
  - Name: HighAILatency
    MetricName: ai.analysis.latency
    Threshold: 5000  # 5 seconds
    
  - Name: LowPredictionAccuracy
    MetricName: ai.prediction.accuracy
    Threshold: 0.7  # 70% accuracy
    
  - Name: HighBedrockCost
    MetricName: bedrock.api.calls
    Threshold: 10000  # Daily limit
```

## Security Considerations

### Data Privacy
```typescript
// Anonymize data before sending to AI
function anonymizeCustomerData(data: any) {
  return {
    ...data,
    customerId: hash(data.customerId),
    email: undefined,
    phone: undefined,
    address: {
      postalCode: data.address?.postalCode,  // Keep only postal code
      city: data.address?.city
    }
  };
}
```

### API Security
```typescript
// Rate limiting for AI endpoints
const rateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 10,  // 10 requests per minute per customer
  message: 'Too many AI analysis requests'
});

app.use('/api/v1/ai/*', rateLimiter);
```

## Deployment Checklist

### Pre-deployment
- [ ] Bedrock access enabled and tested
- [ ] IAM roles configured correctly
- [ ] Environment variables set
- [ ] Test data prepared
- [ ] Monitoring dashboards created
- [ ] Cost alerts configured

### Deployment
- [ ] Deploy Lambda functions
- [ ] Update API Gateway
- [ ] Run integration tests
- [ ] Verify CloudWatch logs
- [ ] Check error rates

### Post-deployment
- [ ] Monitor performance metrics
- [ ] Verify prediction accuracy
- [ ] Check cost metrics
- [ ] Gather user feedback
- [ ] Plan optimizations

---

**Last Updated**: 2025-01-19
**Next Update**: After first implementation iteration