import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get AI-powered recommendations with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: ['reorder', 'optimize', 'discontinue', 'promotion'] })
  @ApiQuery({ name: 'priority', required: false, enum: ['high', 'medium', 'low'] })
  @ApiResponse({ status: 200, description: 'Returns paginated list of recommendations' })
  async getRecommendations(@Query() query: any) {
    return await this.recommendationsService.getRecommendations(query);
  }

  @Post(':recommendationId/accept')
  @ApiOperation({ summary: 'Accept a recommendation' })
  @ApiResponse({ status: 200, description: 'Recommendation accepted successfully' })
  async acceptRecommendation(@Param('recommendationId') recommendationId: string) {
    return await this.recommendationsService.acceptRecommendation(recommendationId);
  }

  @Post(':recommendationId/dismiss')
  @ApiOperation({ summary: 'Dismiss a recommendation' })
  @ApiResponse({ status: 200, description: 'Recommendation dismissed successfully' })
  async dismissRecommendation(@Param('recommendationId') recommendationId: string) {
    return await this.recommendationsService.dismissRecommendation(recommendationId);
  }
}