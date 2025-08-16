'use client'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { FiTrendingUp, FiPackage, FiAlertTriangle, FiDollarSign } from 'react-icons/fi'
import { Card } from '@/components/ui/Card'
import { DashboardSummary, dashboardService } from '@/services/dashboard'

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

const MetricCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`

const IconContainer = styled.div<{ $color: string; $bgColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`

const MetricContent = styled.div`
  flex: 1;
`

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 4px;
`

const MetricLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: 500;
`

const MetricSubtext = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: 2px;
`

const LoadingCard = styled(MetricCard)`
  justify-content: center;
  min-height: 100px;
`

const LoadingText = styled.div`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 14px;
`

const ErrorCard = styled(MetricCard)`
  border-left: 4px solid ${({ theme }) => theme.colors.error[500]};
`

interface InventoryOverviewProps {
  className?: string;
}

export const InventoryOverview: React.FC<InventoryOverviewProps> = ({ className }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
    // Refresh data every 60 seconds
    const interval = setInterval(loadSummary, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  if (error) {
    return (
      <OverviewGrid className={className}>
        <ErrorCard>
          <IconContainer $color="#ef4444" $bgColor="#fef2f2">
            <FiAlertTriangle size={24} />
          </IconContainer>
          <MetricContent>
            <MetricValue>Error</MetricValue>
            <MetricLabel>Failed to load data</MetricLabel>
            <MetricSubtext>{error}</MetricSubtext>
          </MetricContent>
        </ErrorCard>
      </OverviewGrid>
    );
  }

  if (loading || !summary) {
    return (
      <OverviewGrid className={className}>
        {[...Array(4)].map((_, index) => (
          <LoadingCard key={index}>
            <LoadingText>Loading...</LoadingText>
          </LoadingCard>
        ))}
      </OverviewGrid>
    );
  }

  const alertsColor = summary.activeAlerts > 5 ? '#ef4444' : summary.activeAlerts > 0 ? '#f59e0b' : '#22c55e';
  const alertsBgColor = summary.activeAlerts > 5 ? '#fef2f2' : summary.activeAlerts > 0 ? '#fffbeb' : '#f0fdf4';

  return (
    <OverviewGrid className={className}>
      <MetricCard>
        <IconContainer $color="#2563eb" $bgColor="#eff6ff">
          <FiDollarSign size={24} />
        </IconContainer>
        <MetricContent>
          <MetricValue>{formatCurrency(summary.totalInventoryValue)}</MetricValue>
          <MetricLabel>Total Inventory Value</MetricLabel>
          <MetricSubtext>
            {summary.topCategories.length > 0 && 
              `${summary.topCategories[0].category} leads with ${summary.topCategories[0].percentage}%`
            }
          </MetricSubtext>
        </MetricContent>
      </MetricCard>

      <MetricCard>
        <IconContainer $color="#059669" $bgColor="#ecfdf5">
          <FiPackage size={24} />
        </IconContainer>
        <MetricContent>
          <MetricValue>{formatNumber(summary.totalItems)}</MetricValue>
          <MetricLabel>Total Items in Stock</MetricLabel>
          <MetricSubtext>
            Across {summary.categoryBreakdown.length} categories
          </MetricSubtext>
        </MetricContent>
      </MetricCard>

      <MetricCard>
        <IconContainer $color={alertsColor} $bgColor={alertsBgColor}>
          <FiAlertTriangle size={24} />
        </IconContainer>
        <MetricContent>
          <MetricValue>{summary.activeAlerts}</MetricValue>
          <MetricLabel>Active Alerts</MetricLabel>
          <MetricSubtext>
            {summary.lowStockItems} low stock, {summary.outOfStockItems} out of stock
          </MetricSubtext>
        </MetricContent>
      </MetricCard>

      <MetricCard>
        <IconContainer $color="#dc2626" $bgColor="#fef2f2">
          <FiTrendingUp size={24} />
        </IconContainer>
        <MetricContent>
          <MetricValue>{summary.lowStockItems + summary.outOfStockItems}</MetricValue>
          <MetricLabel>Items Need Attention</MetricLabel>
          <MetricSubtext>
            {summary.expiredItems > 0 && `${summary.expiredItems} expired items`}
          </MetricSubtext>
        </MetricContent>
      </MetricCard>
    </OverviewGrid>
  );
};