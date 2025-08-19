import { CustomersService } from './customers.service';
import { CustomerProfileDto, CreateCustomerProfileDto, UpdateCustomerProfileDto, CustomerPreferencesDto, CreatePurchaseHistoryDto, CreateProductInteractionDto, ImportPurchaseHistoryDto } from '../common/dto/customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
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
}
