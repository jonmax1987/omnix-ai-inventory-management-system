import { apiRequest } from './api';

export interface Alert {
  id: string;
  type: 'low-stock' | 'out-of-stock' | 'expired' | 'forecast-warning' | 'system';
  productId?: string;
  productName?: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  details?: string;
  actionRequired: boolean;
  createdAt: string;
  expiresAt?: string;
  dismissedAt?: string;
  dismissedBy?: string;
}

export interface AlertsResponse {
  data: Alert[];
  count: number;
}

export const alertsService = {
  async getAlerts(
    type?: Alert['type'],
    severity?: Alert['severity'],
    limit?: number
  ): Promise<{ alerts: Alert[]; count: number }> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (severity) params.append('severity', severity);
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const response = await apiRequest<AlertsResponse>(
      `/alerts${queryString ? `?${queryString}` : ''}`
    );
    
    return { alerts: response.data, count: response.count };
  },

  async dismissAlert(alertId: string): Promise<void> {
    await apiRequest(`/alerts/${alertId}/dismiss`, {
      method: 'POST',
    });
  },
};