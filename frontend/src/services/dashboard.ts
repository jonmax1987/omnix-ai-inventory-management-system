import { apiRequest } from './api';

export interface DashboardSummary {
  totalInventoryValue: number;
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiredItems: number;
  activeAlerts: number;
  categoryBreakdown: Array<{
    category: string;
    itemCount: number;
    value: number;
  }>;
  topCategories: Array<{
    category: string;
    percentage: number;
  }>;
}

export interface InventoryGraphDataPoint {
  timestamp: string;
  inventoryValue: number;
  itemCount: number;
  categories: Array<{
    category: string;
    value: number;
    count: number;
  }>;
}

export interface InventoryGraphData {
  timeRange: string;
  granularity: string;
  dataPoints: InventoryGraphDataPoint[];
}

export interface DashboardSummaryResponse {
  data: DashboardSummary;
}

export interface InventoryGraphResponse {
  data: InventoryGraphData;
}

export const dashboardService = {
  async getSummary(timeRange?: string): Promise<DashboardSummary> {
    const params = timeRange ? `?timeRange=${timeRange}` : '';
    const response = await apiRequest<DashboardSummaryResponse>(`/dashboard/summary${params}`);
    return response.data;
  },

  async getInventoryGraphData(
    timeRange?: string,
    category?: string,
    granularity?: string
  ): Promise<InventoryGraphData> {
    const params = new URLSearchParams();
    if (timeRange) params.append('timeRange', timeRange);
    if (category) params.append('category', category);
    if (granularity) params.append('granularity', granularity);
    
    const queryString = params.toString();
    const response = await apiRequest<InventoryGraphResponse>(
      `/dashboard/inventory-graph${queryString ? `?${queryString}` : ''}`
    );
    return response.data;
  },
};