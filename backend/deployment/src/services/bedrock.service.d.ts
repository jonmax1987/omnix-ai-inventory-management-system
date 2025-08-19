import { BedrockAnalysisRequest, BedrockAnalysisResponse } from '../interfaces/ai-analysis.interface';
export declare class BedrockAnalysisService {
    private bedrock;
    private readonly modelId;
    private readonly region;
    constructor();
    analyzeCustomer(request: BedrockAnalysisRequest): Promise<BedrockAnalysisResponse>;
    private invokeBedrockModel;
    private parseBedrockResponse;
    private calculateOverallConfidence;
    private getDefaultCustomerProfile;
    private buildAnalysisPrompt;
    private isAIAnalysisEnabled;
    private invokeBedrockModelWithRetry;
    private isRetryableError;
    private sleep;
    private getFallbackResponse;
    private generateFallbackAnalysis;
    private generateBasicConsumptionPatterns;
    private generateBasicCustomerProfile;
    private inferShoppingFrequency;
    private generateBasicRecommendations;
    private sanitizeErrorMessage;
}
