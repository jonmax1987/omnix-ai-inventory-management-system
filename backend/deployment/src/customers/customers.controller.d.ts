import { CustomersService } from './customers.service';
import { AIAnalysisService } from './ai-analysis.service';
import { CustomerProfileDto, CreateCustomerProfileDto, UpdateCustomerProfileDto, CustomerPreferencesDto, CreatePurchaseHistoryDto, CreateProductInteractionDto, ImportPurchaseHistoryDto } from '../common/dto/customer.dto';
export declare class CustomersController {
    private readonly customersService;
    private readonly aiAnalysisService;
    constructor(customersService: CustomersService, aiAnalysisService: AIAnalysisService);
    registerCustomer(createDto: CreateCustomerProfileDto, user: any): Promise<CustomerProfileDto>;
    getCustomerProfile(customerId: string): Promise<CustomerProfileDto>;
    updateCustomerProfile(customerId: string, updateDto: UpdateCustomerProfileDto): Promise<CustomerProfileDto>;
    updateCustomerPreferences(customerId: string, preferences: CustomerPreferencesDto): Promise<CustomerProfileDto>;
    getCustomerPurchases(customerId: string, limit?: string): Promise<import("../common/dto/customer.dto").PurchaseHistoryDto[]>;
    addPurchaseHistory(customerId: string, purchaseDto: CreatePurchaseHistoryDto): Promise<import("../common/dto/customer.dto").PurchaseHistoryDto>;
    importPurchaseHistory(customerId: string, importDto: ImportPurchaseHistoryDto): Promise<{
        imported: number;
        failed: number;
    }>;
    trackProductInteraction(customerId: string, interactionDto: CreateProductInteractionDto): Promise<import("../common/dto/customer.dto").ProductInteractionDto>;
    getCustomerInteractions(customerId: string, limit?: string): Promise<import("../common/dto/customer.dto").ProductInteractionDto[]>;
    getProductInteractions(productId: string, limit?: string): Promise<import("../common/dto/customer.dto").ProductInteractionDto[]>;
    getCustomersBySegment(segment: string): Promise<CustomerProfileDto[]>;
    getAllCustomers(limit?: string): Promise<CustomerProfileDto[]>;
    getCustomerAIAnalysis(customerId: string): Promise<import("../interfaces/ai-analysis.interface").AIAnalysisResult>;
    getConsumptionPredictions(customerId: string): Promise<import("../interfaces/ai-analysis.interface").AIAnalysisResult>;
    getCustomerProfileAnalysis(customerId: string): Promise<import("../interfaces/ai-analysis.interface").AIAnalysisResult>;
    getAIRecommendations(customerId: string, limit?: string): Promise<import("../interfaces/ai-analysis.interface").AIAnalysisResult>;
    getReplenishmentAlerts(customerId: string): Promise<{
        urgent: import("../interfaces/ai-analysis.interface").ConsumptionPattern[];
        upcoming: import("../interfaces/ai-analysis.interface").ConsumptionPattern[];
    }>;
    predictNextPurchase(customerId: string, productId: string): Promise<{
        predictedDate: string;
        confidence: number;
        averageDaysBetween: number;
    }>;
    triggerAIAnalysis(customerId: string): Promise<import("../interfaces/ai-analysis.interface").AIAnalysisResult>;
    getAnalysisHistory(customerId: string, limit?: string): Promise<import("../interfaces/ai-analysis.interface").AIAnalysisResult[]>;
}
