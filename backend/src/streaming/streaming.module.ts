import { Module } from '@nestjs/common';
import { StreamingAnalyticsController } from '../controllers/streaming-analytics.controller';
import { KinesisStreamingService } from '../services/kinesis-streaming.service';
import { RealtimeAnalyticsService } from '../services/realtime-analytics.service';
import { CustomerSegmentationService } from '../services/customer-segmentation.service';
import { EnhancedBedrockService } from '../services/enhanced-bedrock.service';
import { CacheService } from '../services/cache.service';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebSocketModule],
  controllers: [StreamingAnalyticsController],
  providers: [
    KinesisStreamingService,
    RealtimeAnalyticsService,
    CustomerSegmentationService,
    EnhancedBedrockService,
    CacheService
  ],
  exports: [
    KinesisStreamingService,
    RealtimeAnalyticsService
  ]
})
export class StreamingModule {}