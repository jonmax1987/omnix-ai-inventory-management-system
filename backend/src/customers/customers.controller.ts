import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { AIAnalysisService } from './ai-analysis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import {
  CustomerProfileDto,
  CreateCustomerProfileDto,
  UpdateCustomerProfileDto,
  CustomerPreferencesDto,
  CreatePurchaseHistoryDto,
  CreateProductInteractionDto,
  ImportPurchaseHistoryDto,
} from '../common/dto/customer.dto';

@Controller('v1/customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly aiAnalysisService: AIAnalysisService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerCustomer(
    @Body() createDto: CreateCustomerProfileDto,
    @CurrentUser() user: any,
  ): Promise<CustomerProfileDto> {
    const customerId = createDto.customerId || user.id;
    return this.customersService.createCustomerProfile({
      ...createDto,
      customerId,
    });
  }

  @Get(':id/profile')
  async getCustomerProfile(
    @Param('id') customerId: string,
  ): Promise<CustomerProfileDto> {
    return this.customersService.getCustomerProfile(customerId);
  }

  @Put(':id/profile')
  async updateCustomerProfile(
    @Param('id') customerId: string,
    @Body() updateDto: UpdateCustomerProfileDto,
  ): Promise<CustomerProfileDto> {
    return this.customersService.updateCustomerProfile(customerId, updateDto);
  }

  @Patch(':id/preferences')
  async updateCustomerPreferences(
    @Param('id') customerId: string,
    @Body() preferences: CustomerPreferencesDto,
  ): Promise<CustomerProfileDto> {
    return this.customersService.updateCustomerPreferences(customerId, preferences);
  }

  @Get(':id/purchases')
  async getCustomerPurchases(
    @Param('id') customerId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.customersService.getCustomerPurchases(customerId, limitNum);
  }

  @Post(':id/purchases')
  @HttpCode(HttpStatus.CREATED)
  async addPurchaseHistory(
    @Param('id') customerId: string,
    @Body() purchaseDto: CreatePurchaseHistoryDto,
  ) {
    return this.customersService.addPurchaseHistory(customerId, purchaseDto);
  }

  @Post(':id/purchases/import')
  async importPurchaseHistory(
    @Param('id') customerId: string,
    @Body() importDto: ImportPurchaseHistoryDto,
  ) {
    return this.customersService.importPurchaseHistory(
      customerId,
      importDto.purchases,
    );
  }

  @Post(':id/interactions')
  @HttpCode(HttpStatus.CREATED)
  async trackProductInteraction(
    @Param('id') customerId: string,
    @Body() interactionDto: CreateProductInteractionDto,
  ) {
    return this.customersService.trackProductInteraction(customerId, interactionDto);
  }

  @Get(':id/interactions')
  async getCustomerInteractions(
    @Param('id') customerId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.customersService.getCustomerInteractions(customerId, limitNum);
  }

  @Get('products/:productId/interactions')
  async getProductInteractions(
    @Param('productId') productId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.customersService.getProductInteractions(productId, limitNum);
  }

  @Get('segment/:segment')
  async getCustomersBySegment(@Param('segment') segment: string) {
    return this.customersService.getCustomersBySegment(segment);
  }

  @Get()
  async getAllCustomers(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.customersService.getAllCustomers(limitNum);
  }

  // AI Analysis Endpoints
  @Get(':id/ai-analysis')
  async getCustomerAIAnalysis(@Param('id') customerId: string) {
    return this.aiAnalysisService.analyzeCustomerConsumption(customerId);
  }

  @Get(':id/consumption-predictions')
  async getConsumptionPredictions(@Param('id') customerId: string) {
    return this.aiAnalysisService.analyzeCustomerConsumption(customerId);
  }

  @Get(':id/customer-profile-analysis')
  async getCustomerProfileAnalysis(@Param('id') customerId: string) {
    return this.aiAnalysisService.analyzeCustomerProfile(customerId);
  }

  @Get(':id/ai-recommendations')
  async getAIRecommendations(
    @Param('id') customerId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.aiAnalysisService.generateRecommendations(customerId, limitNum);
  }

  @Get(':id/replenishment-alerts')
  async getReplenishmentAlerts(@Param('id') customerId: string) {
    return this.aiAnalysisService.getReplenishmentAlerts(customerId);
  }

  @Get(':id/purchase-prediction/:productId')
  async predictNextPurchase(
    @Param('id') customerId: string,
    @Param('productId') productId: string,
  ) {
    return this.aiAnalysisService.predictNextPurchaseDate(customerId, productId);
  }

  @Post(':id/analyze')
  @HttpCode(HttpStatus.OK)
  async triggerAIAnalysis(@Param('id') customerId: string) {
    return this.aiAnalysisService.analyzeCustomerConsumption(customerId);
  }

  @Get(':id/analysis-history')
  async getAnalysisHistory(
    @Param('id') customerId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.aiAnalysisService.getCustomerAnalysisHistory(customerId, limitNum);
  }
}