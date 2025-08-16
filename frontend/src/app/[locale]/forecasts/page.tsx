'use client'
import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { FiTrendingUp, FiTarget, FiDollarSign, FiClock, FiFilter, FiRefreshCw } from 'react-icons/fi'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ForecastChart } from '@/components/forecasts/ForecastChart'
import { RecommendationCard } from '@/components/forecasts/RecommendationCard'
import {
  DemandForecast,
  Recommendation,
  ForecastMetrics,
  forecastsService,
  ForecastQueryParams,
  RecommendationQueryParams,
} from '@/services/forecasts'

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`

const PageActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const MetricCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
`

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const MetricIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const MetricLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[600]};
`

const MetricChange = styled.div<{ $positive: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $positive, theme }) => 
    $positive ? theme.colors.success[600] : theme.colors.error[600]};
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`

const ForecastsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`

const FilterControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[100]};
  }
`

const RecommendationsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const RecommendationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-height: 600px;
  overflow-y: auto;
`

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.gray[500]};
`

const ErrorState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.error[500]};
`

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
`

const Toast = styled.div<{ $show: boolean; $type: 'success' | 'error' }>`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ $type, theme }) => 
    $type === 'success' ? theme.colors.success[500] : theme.colors.error[500]};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 60;
  transform: translateX(${({ $show }) => $show ? '0' : '400px'});
  transition: transform 0.3s ease-in-out;
  max-width: 300px;
`

export default function ForecastsPage() {
  const [metrics, setMetrics] = useState<ForecastMetrics | null>(null);
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>(
    { show: false, message: '', type: 'success' }
  );

  // Filter states
  const [forecastFilters, setForecastFilters] = useState<ForecastQueryParams>({
    limit: 5,
    days: 30,
  });
  const [recommendationFilters, setRecommendationFilters] = useState<RecommendationQueryParams>({
    limit: 10,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsData, forecastsData, recommendationsData] = await Promise.all([
        forecastsService.getForecastMetrics(),
        forecastsService.getForecasts(forecastFilters),
        forecastsService.getRecommendations(recommendationFilters),
      ]);

      setMetrics(metricsData);
      setForecasts(forecastsData.data);
      setRecommendations(recommendationsData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load forecast data');
    } finally {
      setLoading(false);
    }
  }, [forecastFilters, recommendationFilters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAcceptRecommendation = async (recommendationId: string) => {
    try {
      await forecastsService.acceptRecommendation(recommendationId);
      showToast('Recommendation accepted successfully');
      
      // Remove from list
      setRecommendations(prev => prev.filter(r => r.id !== recommendationId));
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to accept recommendation',
        'error'
      );
    }
  };

  const handleDismissRecommendation = async (recommendationId: string) => {
    try {
      await forecastsService.dismissRecommendation(recommendationId);
      showToast('Recommendation dismissed');
      
      // Remove from list
      setRecommendations(prev => prev.filter(r => r.id !== recommendationId));
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to dismiss recommendation',
        'error'
      );
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (error && !metrics) {
    return (
      <Layout>
        <ErrorState>
          <p>Error loading forecast data: {error}</p>
          <Button onClick={loadData} variant="outline">
            Retry
          </Button>
        </ErrorState>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader>
        <PageTitle>Forecasts & Recommendations</PageTitle>
        <PageActions>
          <Button
            onClick={loadData}
            variant="outline"
            disabled={loading}
            aria-label="Refresh data"
          >
            <FiRefreshCw size={16} />
            Refresh
          </Button>
          <Button size="md">
            <FiFilter size={16} />
            Filters
          </Button>
        </PageActions>
      </PageHeader>

      {metrics && (
        <MetricsGrid>
          <MetricCard>
            <MetricHeader>
              <MetricIcon $color="#3b82f6">
                <FiTrendingUp size={20} />
              </MetricIcon>
              <MetricChange $positive={true}>+2.5%</MetricChange>
            </MetricHeader>
            <MetricValue>{metrics.totalForecasts}</MetricValue>
            <MetricLabel>Active Forecasts</MetricLabel>
          </MetricCard>

          <MetricCard>
            <MetricHeader>
              <MetricIcon $color="#10b981">
                <FiTarget size={20} />
              </MetricIcon>
              <MetricChange $positive={true}>+1.2%</MetricChange>
            </MetricHeader>
            <MetricValue>{metrics.averageAccuracy}%</MetricValue>
            <MetricLabel>Average Accuracy</MetricLabel>
          </MetricCard>

          <MetricCard>
            <MetricHeader>
              <MetricIcon $color="#f59e0b">
                <FiClock size={20} />
              </MetricIcon>
              <MetricChange $positive={false}>-3 items</MetricChange>
            </MetricHeader>
            <MetricValue>{metrics.upcomingReorders}</MetricValue>
            <MetricLabel>Upcoming Reorders</MetricLabel>
          </MetricCard>

          <MetricCard>
            <MetricHeader>
              <MetricIcon $color="#8b5cf6">
                <FiDollarSign size={20} />
              </MetricIcon>
              <MetricChange $positive={true}>+12.8%</MetricChange>
            </MetricHeader>
            <MetricValue>{formatCurrency(metrics.potentialSavings)}</MetricValue>
            <MetricLabel>Potential Savings</MetricLabel>
          </MetricCard>
        </MetricsGrid>
      )}

      <ContentGrid>
        <ForecastsSection>
          <SectionHeader>
            <SectionTitle>Demand Forecasts</SectionTitle>
            <FilterControls>
              <FilterSelect
                value={forecastFilters.days || 30}
                onChange={(e) => setForecastFilters(prev => ({
                  ...prev,
                  days: Number(e.target.value)
                }))}
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
              </FilterSelect>
              <FilterSelect
                value={forecastFilters.trend || ''}
                onChange={(e) => setForecastFilters(prev => ({
                  ...prev,
                  trend: e.target.value as any
                }))}
              >
                <option value="">All trends</option>
                <option value="increasing">Increasing</option>
                <option value="decreasing">Decreasing</option>
                <option value="stable">Stable</option>
              </FilterSelect>
            </FilterControls>
          </SectionHeader>

          {loading && forecasts.length === 0 ? (
            <LoadingState>Loading forecasts...</LoadingState>
          ) : forecasts.length === 0 ? (
            <EmptyState>No forecasts available</EmptyState>
          ) : (
            forecasts.map((forecast) => (
              <ForecastChart key={forecast.productId} forecast={forecast} />
            ))
          )}
        </ForecastsSection>

        <RecommendationsSection>
          <SectionHeader>
            <SectionTitle>AI Recommendations</SectionTitle>
            <FilterSelect
              value={recommendationFilters.priority || ''}
              onChange={(e) => setRecommendationFilters(prev => ({
                ...prev,
                priority: e.target.value as any
              }))}
            >
              <option value="">All priorities</option>
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </FilterSelect>
          </SectionHeader>

          {loading && recommendations.length === 0 ? (
            <LoadingState>Loading recommendations...</LoadingState>
          ) : recommendations.length === 0 ? (
            <EmptyState>No recommendations available</EmptyState>
          ) : (
            <RecommendationsList>
              {recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onAccept={handleAcceptRecommendation}
                  onDismiss={handleDismissRecommendation}
                />
              ))}
            </RecommendationsList>
          )}
        </RecommendationsSection>
      </ContentGrid>

      {/* Toast Notification */}
      <Toast $show={toast.show} $type={toast.type}>
        {toast.message}
      </Toast>
    </Layout>
  );
}