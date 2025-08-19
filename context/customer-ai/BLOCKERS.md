# Blockers & Questions - Customer AI Analytics

## Current Blockers 🚨

### 1. AWS Bedrock Access
**Status**: ❓ Pending
**Impact**: High - Cannot proceed with AI integration
**Details**: 
- Need AWS Bedrock access enabled in AWS account
- Requires IAM permissions for Lambda to call Bedrock
- Model access needs to be requested (Claude 3 Sonnet)

**Action Required**:
```bash
# Enable Bedrock in AWS Console
# Grant model access for Claude 3 Sonnet
# Update Lambda execution role with Bedrock permissions
```

### 2. Environment Variables
**Status**: ❓ Missing
**Impact**: Medium - Required for Bedrock configuration
**Details**:
- `AWS_BEDROCK_REGION` - Bedrock service region
- `BEDROCK_MODEL_ID` - Specific Claude model to use
- `AI_ANALYSIS_ENABLED` - Feature flag

**Action Required**:
Add to `.env` file or Lambda environment configuration

## Questions Needing Answers 🤔

### Technical Decisions

1. **Model Selection**
   - Claude 3 Sonnet vs Claude 3 Haiku?
   - Sonnet: More capable but higher cost
   - Haiku: Faster and cheaper but less capable
   - **Recommendation**: Start with Haiku for development, Sonnet for production

2. **Cost Management**
   - Budget per month for AI API calls?
   - Caching strategy to reduce API calls?
   - Batch processing schedule?

3. **Data Volume**
   - Expected number of customers to analyze daily?
   - How many purchases to include in analysis (10, 20, 50)?
   - Retention period for AI predictions?

### Implementation Questions

1. **Trigger Strategy**
   - When to trigger AI analysis?
     - Option A: After every purchase
     - Option B: Daily batch for all active customers
     - Option C: On-demand when customer logs in
   - **Recommendation**: Combination of B + C

2. **Caching Strategy**
   - Cache duration for AI predictions?
   - Redis or DynamoDB for caching?
   - Cache invalidation rules?

3. **Fallback Behavior**
   - What if Bedrock is unavailable?
   - Fallback to basic recommendations?
   - Error handling and retry logic?

### Business Questions

1. **Privacy & Consent**
   - Explicit consent required for AI analysis?
   - Opt-in vs opt-out model?
   - Data anonymization requirements?

2. **Success Metrics**
   - Primary KPI to optimize for?
   - How to measure prediction accuracy?
   - A/B testing approach?

## Resolved Blockers ✅

### Phase 1 Blockers (All Resolved)
- ✅ Database table creation - Completed
- ✅ API endpoint design - Implemented
- ✅ Basic ML algorithm selection - Content-based filtering chosen
- ✅ Module structure - Clean architecture implemented

## Dependencies

### External Dependencies
- AWS Bedrock service availability
- AWS SDK for JavaScript v3
- DynamoDB capacity for new tables

### Internal Dependencies
- Existing orders service for purchase data
- Products service for product details
- Authentication service for customer identity

## Risk Factors

1. **Bedrock Quotas**: Default quotas might be too low
2. **Cost Overrun**: AI API calls could exceed budget
3. **Latency**: Real-time AI analysis might be slow
4. **Data Quality**: Poor purchase history = poor predictions

## Escalation Path

1. **Technical Issues**: Development team lead
2. **AWS/Infrastructure**: DevOps team
3. **Budget/Cost**: Product manager
4. **Privacy/Legal**: Compliance team

---

**Last Updated**: 2025-01-19
**Next Review**: Before starting Bedrock implementation