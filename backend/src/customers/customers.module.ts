import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { AIAnalysisService } from './ai-analysis.service';
import { DynamoDBService } from '../services/dynamodb.service';
import { BedrockAnalysisService } from '../services/bedrock.service';

@Module({
  imports: [],
  controllers: [CustomersController],
  providers: [
    CustomersService, 
    AIAnalysisService, 
    BedrockAnalysisService, 
    DynamoDBService
  ],
  exports: [CustomersService, AIAnalysisService],
})
export class CustomersModule {}