import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AlertsModule } from './alerts/alerts.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ForecastsModule } from './forecasts/forecasts.module';

@Module({
  imports: [
    ProductsModule,
    DashboardModule,
    AlertsModule,
    RecommendationsModule,
    ForecastsModule,
  ],
})
export class AppModule {}