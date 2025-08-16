'use client'
import { OriginalLayout } from '@/components/layout/OriginalLayout'
import { ForecastChart } from '@/components/forecasts/ForecastChart'
import { RecommendationCard } from '@/components/forecasts/RecommendationCard'
import { DemandForecast, Recommendation } from '@/services/forecasts'

// Mock forecast data
const mockForecast: DemandForecast = {
  productId: "1",
  productName: "Sample Product",
  productSku: "SKU-001",
  forecastDays: 30,
  data: [
    { date: "2025-08-01", predicted: 100, actual: 95, confidence: 0.8 },
    { date: "2025-08-02", predicted: 110, actual: 108, confidence: 0.85 },
    { date: "2025-08-03", predicted: 105, actual: 102, confidence: 0.82 },
    { date: "2025-08-04", predicted: 120, actual: undefined, confidence: 0.78 },
    { date: "2025-08-05", predicted: 125, actual: undefined, confidence: 0.75 }
  ],
  trend: 'increasing',
  seasonality: 'medium',
  accuracy: 0.85,
  nextOrderDate: "2025-08-10",
  recommendedQuantity: 500
}

// Mock recommendation data
const mockRecommendation: Recommendation = {
  id: "1",
  type: 'reorder',
  priority: 'high',
  productId: "1",
  productName: "Sample Product",
  productSku: "SKU-001",
  title: "Reorder Recommendation",
  description: "Stock levels are running low for this product",
  impact: "Prevent stockout within 5 days",
  action: "Place order for 500 units",
  estimatedSavings: 1500,
  daysUntilAction: 3,
  confidence: 0.9,
  createdAt: "2025-08-12T07:00:00Z"
}

export default function ForecastsPage() {
  return (
    <OriginalLayout>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px', color: '#111827' }}>
          Forecasts & Recommendations
        </h1>
        
        <ForecastChart forecast={mockForecast} />
        <div style={{ marginTop: '32px' }}>
          <RecommendationCard recommendation={mockRecommendation} />
        </div>
      </div>
    </OriginalLayout>
  )
}