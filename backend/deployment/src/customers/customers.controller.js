"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const ai_analysis_service_1 = require("./ai-analysis.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_decorator_1 = require("../auth/decorators/user.decorator");
const customer_dto_1 = require("../common/dto/customer.dto");
let CustomersController = class CustomersController {
    constructor(customersService, aiAnalysisService) {
        this.customersService = customersService;
        this.aiAnalysisService = aiAnalysisService;
    }
    async registerCustomer(createDto, user) {
        const customerId = createDto.customerId || user.id;
        return this.customersService.createCustomerProfile({
            ...createDto,
            customerId,
        });
    }
    async getCustomerProfile(customerId) {
        return this.customersService.getCustomerProfile(customerId);
    }
    async updateCustomerProfile(customerId, updateDto) {
        return this.customersService.updateCustomerProfile(customerId, updateDto);
    }
    async updateCustomerPreferences(customerId, preferences) {
        return this.customersService.updateCustomerPreferences(customerId, preferences);
    }
    async getCustomerPurchases(customerId, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 50;
        return this.customersService.getCustomerPurchases(customerId, limitNum);
    }
    async addPurchaseHistory(customerId, purchaseDto) {
        return this.customersService.addPurchaseHistory(customerId, purchaseDto);
    }
    async importPurchaseHistory(customerId, importDto) {
        return this.customersService.importPurchaseHistory(customerId, importDto.purchases);
    }
    async trackProductInteraction(customerId, interactionDto) {
        return this.customersService.trackProductInteraction(customerId, interactionDto);
    }
    async getCustomerInteractions(customerId, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 100;
        return this.customersService.getCustomerInteractions(customerId, limitNum);
    }
    async getProductInteractions(productId, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 100;
        return this.customersService.getProductInteractions(productId, limitNum);
    }
    async getCustomersBySegment(segment) {
        return this.customersService.getCustomersBySegment(segment);
    }
    async getAllCustomers(limit) {
        const limitNum = limit ? parseInt(limit, 10) : 100;
        return this.customersService.getAllCustomers(limitNum);
    }
    async getCustomerAIAnalysis(customerId) {
        return this.aiAnalysisService.analyzeCustomerConsumption(customerId);
    }
    async getConsumptionPredictions(customerId) {
        return this.aiAnalysisService.analyzeCustomerConsumption(customerId);
    }
    async getCustomerProfileAnalysis(customerId) {
        return this.aiAnalysisService.analyzeCustomerProfile(customerId);
    }
    async getAIRecommendations(customerId, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 5;
        return this.aiAnalysisService.generateRecommendations(customerId, limitNum);
    }
    async getReplenishmentAlerts(customerId) {
        return this.aiAnalysisService.getReplenishmentAlerts(customerId);
    }
    async predictNextPurchase(customerId, productId) {
        return this.aiAnalysisService.predictNextPurchaseDate(customerId, productId);
    }
    async triggerAIAnalysis(customerId) {
        return this.aiAnalysisService.analyzeCustomerConsumption(customerId);
    }
    async getAnalysisHistory(customerId, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.aiAnalysisService.getCustomerAnalysisHistory(customerId, limitNum);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.CreateCustomerProfileDto, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "registerCustomer", null);
__decorate([
    (0, common_1.Get)(':id/profile'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomerProfile", null);
__decorate([
    (0, common_1.Put)(':id/profile'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_dto_1.UpdateCustomerProfileDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateCustomerProfile", null);
__decorate([
    (0, common_1.Patch)(':id/preferences'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_dto_1.CustomerPreferencesDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateCustomerPreferences", null);
__decorate([
    (0, common_1.Get)(':id/purchases'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomerPurchases", null);
__decorate([
    (0, common_1.Post)(':id/purchases'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_dto_1.CreatePurchaseHistoryDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "addPurchaseHistory", null);
__decorate([
    (0, common_1.Post)(':id/purchases/import'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_dto_1.ImportPurchaseHistoryDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "importPurchaseHistory", null);
__decorate([
    (0, common_1.Post)(':id/interactions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_dto_1.CreateProductInteractionDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "trackProductInteraction", null);
__decorate([
    (0, common_1.Get)(':id/interactions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomerInteractions", null);
__decorate([
    (0, common_1.Get)('products/:productId/interactions'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getProductInteractions", null);
__decorate([
    (0, common_1.Get)('segment/:segment'),
    __param(0, (0, common_1.Param)('segment')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomersBySegment", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getAllCustomers", null);
__decorate([
    (0, common_1.Get)(':id/ai-analysis'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomerAIAnalysis", null);
__decorate([
    (0, common_1.Get)(':id/consumption-predictions'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getConsumptionPredictions", null);
__decorate([
    (0, common_1.Get)(':id/customer-profile-analysis'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomerProfileAnalysis", null);
__decorate([
    (0, common_1.Get)(':id/ai-recommendations'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getAIRecommendations", null);
__decorate([
    (0, common_1.Get)(':id/replenishment-alerts'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getReplenishmentAlerts", null);
__decorate([
    (0, common_1.Get)(':id/purchase-prediction/:productId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "predictNextPurchase", null);
__decorate([
    (0, common_1.Post)(':id/analyze'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "triggerAIAnalysis", null);
__decorate([
    (0, common_1.Get)(':id/analysis-history'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getAnalysisHistory", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.Controller)('v1/customers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [customers_service_1.CustomersService,
        ai_analysis_service_1.AIAnalysisService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map