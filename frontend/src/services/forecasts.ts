import { apiRequest } from './api';

export interface ForecastData {
  date: string;
  predicted: number;
  actual?: number;
  confidence: number;
}

export interface DemandForecast {
  productId: string;
  productName: string;
  productSku: string;
  forecastDays: number;
  data: ForecastData[];
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality: 'high' | 'medium' | 'low' | 'none';
  accuracy: number;
  nextOrderDate: string;
  recommendedQuantity: number;
}

export interface Recommendation {
  id: string;
  type: 'reorder' | 'optimize' | 'discontinue' | 'promotion';
  priority: 'high' | 'medium' | 'low';
  productId: string;
  productName: string;
  productSku: string;
  title: string;
  description: string;
  impact: string;
  action: string;
  estimatedSavings?: number;
  daysUntilAction?: number;
  confidence: number;
  createdAt: string;
}

export interface ForecastMetrics {
  totalForecasts: number;
  averageAccuracy: number;
  upcomingReorders: number;
  potentialSavings: number;
  criticalItems: number;
}

export interface ForecastsResponse {
  data: DemandForecast[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta: ForecastMetrics;
}

export interface RecommendationsResponse {
  data: Recommendation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta: {
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
    totalSavings: number;
  };
}

export interface ForecastQueryParams {
  page?: number;
  limit?: number;
  productId?: string;
  category?: string;
  days?: number;
  minAccuracy?: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
}

export interface RecommendationQueryParams {
  page?: number;
  limit?: number;
  type?: 'reorder' | 'optimize' | 'discontinue' | 'promotion';
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

export const forecastsService = {
  async getForecasts(params?: ForecastQueryParams): Promise<ForecastsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.productId) searchParams.append('productId', params.productId);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.days) searchParams.append('days', params.days.toString());
    if (params?.minAccuracy) searchParams.append('minAccuracy', params.minAccuracy.toString());
    if (params?.trend) searchParams.append('trend', params.trend);
    
    const queryString = searchParams.toString();
    return await apiRequest<ForecastsResponse>(`/forecasts${queryString ? `?${queryString}` : ''}`);
  },

  async getForecast(productId: string, days?: number): Promise<DemandForecast> {
    const params = days ? `?days=${days}` : '';
    const response = await apiRequest<{ data: DemandForecast }>(`/forecasts/${productId}${params}`);
    return response.data;
  },

  async getRecommendations(params?: RecommendationQueryParams): Promise<RecommendationsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type);
    if (params?.priority) searchParams.append('priority', params.priority);
    if (params?.category) searchParams.append('category', params.category);
    
    const queryString = searchParams.toString();
    return await apiRequest<RecommendationsResponse>(`/recommendations${queryString ? `?${queryString}` : ''}`);
  },

  async dismissRecommendation(recommendationId: string): Promise<void> {
    await apiRequest(`/recommendations/${recommendationId}/dismiss`, {
      method: 'POST',
    });
  },

  async acceptRecommendation(recommendationId: string): Promise<void> {
    await apiRequest(`/recommendations/${recommendationId}/accept`, {
      method: 'POST',
    });
  },

  async getForecastMetrics(): Promise<ForecastMetrics> {
    const response = await apiRequest<{ data: ForecastMetrics }>('/forecasts/metrics');
    return response.data;
  },
};