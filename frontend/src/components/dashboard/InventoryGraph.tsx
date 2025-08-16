'use client'
import styled from 'styled-components'
import { useState, useEffect, useMemo } from 'react'
import { FiTrendingUp, FiFilter } from 'react-icons/fi'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { InventoryGraphData, dashboardService } from '@/services/dashboard'

const GraphContainer = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const GraphHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`

const GraphTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray[900]};
    margin: 0;
  }
`

const GraphControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
    width: 100%;
  }
`

const FilterButton = styled(Button)<{ $active: boolean }>`
  background-color: ${({ $active, theme }) => 
    $active ? theme.colors.primary[600] : 'transparent'};
  color: ${({ $active, theme }) => 
    $active ? 'white' : theme.colors.gray[600]};
  border: 1px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary[600] : theme.colors.gray[300]};
    
  &:hover {
    background-color: ${({ $active, theme }) => 
      $active ? theme.colors.primary[700] : theme.colors.gray[100]};
  }
`

const GraphContent = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  position: relative;
  overflow: hidden;
`

const SimpleChart = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  gap: 4px;
`

const ChartBar = styled.div<{ $height: number; $color: string }>`
  flex: 1;
  height: ${({ $height }) => $height}%;
  background: linear-gradient(to top, ${({ $color }) => $color}, ${({ $color }) => $color}aa);
  border-radius: 2px 2px 0 0;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
`

const ChartTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: white;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 10;
  margin-bottom: 4px;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.gray[900]};
  }
  
  ${ChartBar}:hover & {
    opacity: 1;
  }
`

const GraphStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

const StatItem = styled.div`
  text-align: center;
  
  .value {
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: 4px;
  }
  
  .label {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.gray[500]};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const LoadingState = styled.div`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 14px;
`

const ErrorState = styled.div`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: 14px;
  text-align: center;
`

interface InventoryGraphProps {
  className?: string;
}

export const InventoryGraph: React.FC<InventoryGraphProps> = ({ className }) => {
  const [graphData, setGraphData] = useState<InventoryGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  const loadGraphData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getInventoryGraphData(timeRange);
      setGraphData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load graph data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraphData();
  }, [timeRange]);

  const chartData = useMemo(() => {
    if (!graphData) return [];
    
    return graphData.dataPoints.map(point => {
      const maxValue = Math.max(...graphData.dataPoints.map(p => p.inventoryValue));
      const height = (point.inventoryValue / maxValue) * 80 + 10; // 10-90% height range
      
      return {
        ...point,
        height,
        formattedValue: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(point.inventoryValue),
        formattedDate: new Date(point.timestamp).toLocaleDateString([], { 
          month: 'short', 
          day: 'numeric' 
        }),
      };
    });
  }, [graphData]);

  const stats = useMemo(() => {
    if (!graphData) return null;
    
    const values = graphData.dataPoints.map(p => p.inventoryValue);
    const itemCounts = graphData.dataPoints.map(p => p.itemCount);
    
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    const avgItems = itemCounts.reduce((a, b) => a + b, 0) / itemCounts.length;
    const trend = values[values.length - 1] - values[0];
    const trendPercent = (trend / values[0]) * 100;
    
    return {
      avgValue: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(avgValue),
      avgItems: Math.round(avgItems).toLocaleString(),
      trend: trend > 0 ? '+' : '',
      trendPercent: `${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}%`,
      dataPoints: graphData.dataPoints.length,
    };
  }, [graphData]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <GraphContainer className={className}>
      <GraphHeader>
        <GraphTitle>
          <FiTrendingUp />
          <h3>Inventory Value Trend</h3>
        </GraphTitle>
        <GraphControls>
          <FilterButton
            size="sm"
            $active={timeRange === 'week'}
            onClick={() => setTimeRange('week')}
          >
            7 Days
          </FilterButton>
          <FilterButton
            size="sm"
            $active={timeRange === 'month'}
            onClick={() => setTimeRange('month')}
          >
            30 Days
          </FilterButton>
          <FilterButton
            size="sm"
            $active={timeRange === 'quarter'}
            onClick={() => setTimeRange('quarter')}
          >
            90 Days
          </FilterButton>
        </GraphControls>
      </GraphHeader>

      <GraphContent>
        {loading ? (
          <LoadingState>Loading graph data...</LoadingState>
        ) : error ? (
          <ErrorState>
            Error loading graph data: {error}
            <div style={{ marginTop: '8px' }}>
              <Button size="sm" variant="outline" onClick={loadGraphData}>
                Retry
              </Button>
            </div>
          </ErrorState>
        ) : chartData.length > 0 ? (
          <SimpleChart>
            {chartData.map((dataPoint, index) => (
              <ChartBar
                key={index}
                $height={dataPoint.height}
                $color="#3b82f6"
              >
                <ChartTooltip>
                  {dataPoint.formattedDate}<br />
                  {dataPoint.formattedValue}<br />
                  {dataPoint.itemCount.toLocaleString()} items
                </ChartTooltip>
              </ChartBar>
            ))}
          </SimpleChart>
        ) : (
          <div>No data available for the selected time range</div>
        )}
      </GraphContent>

      {stats && (
        <GraphStats>
          <StatItem>
            <div className="value">{stats.avgValue}</div>
            <div className="label">Average Value</div>
          </StatItem>
          <StatItem>
            <div className="value">{stats.avgItems}</div>
            <div className="label">Average Items</div>
          </StatItem>
          <StatItem>
            <div className="value" style={{ color: stats.trendPercent.startsWith('+') ? '#059669' : '#dc2626' }}>
              {stats.trendPercent}
            </div>
            <div className="label">Trend</div>
          </StatItem>
          <StatItem>
            <div className="value">{stats.dataPoints}</div>
            <div className="label">Data Points</div>
          </StatItem>
        </GraphStats>
      )}
    </GraphContainer>
  );
};