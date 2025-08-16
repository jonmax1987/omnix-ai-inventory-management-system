'use client'
import styled from 'styled-components'
import { useState } from 'react'
import { FiTrendingUp, FiTrendingDown, FiMinus, FiInfo } from 'react-icons/fi'
import { Card } from '@/components/ui/Card'
import { DemandForecast } from '@/services/forecasts'

const ChartContainer = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`

const ProductInfo = styled.div`
  flex: 1;
`

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`

const ProductSku = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0;
`

const ForecastMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 14px;
`

const TrendIcon = styled.div<{ $trend: 'increasing' | 'decreasing' | 'stable' }>`
  display: flex;
  align-items: center;
  color: ${({ $trend, theme }) => {
    switch ($trend) {
      case 'increasing': return theme.colors.success[500];
      case 'decreasing': return theme.colors.error[500];
      default: return theme.colors.gray[500];
    }
  }};
`

const AccuracyBadge = styled.div<{ $accuracy: number }>`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $accuracy, theme }) => {
    if ($accuracy >= 80) return theme.colors.success[50];
    if ($accuracy >= 60) return theme.colors.warning[50];
    return theme.colors.error[50];
  }};
  color: ${({ $accuracy, theme }) => {
    if ($accuracy >= 80) return theme.colors.success[700];
    if ($accuracy >= 60) return theme.colors.warning[700];
    return theme.colors.error[700];
  }};
`

const ChartArea = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
`

const ChartGrid = styled.g`
  stroke: ${({ theme }) => theme.colors.gray[200]};
  stroke-width: 1;
`

const ChartLine = styled.path<{ $type: 'predicted' | 'actual' }>`
  fill: none;
  stroke: ${({ $type, theme }) => 
    $type === 'predicted' ? theme.colors.primary[500] : theme.colors.success[500]};
  stroke-width: 2;
`

const ChartArea_Fill = styled.path`
  fill: ${({ theme }) => theme.colors.primary[100]};
  opacity: 0.3;
`

const ConfidenceBand = styled.path`
  fill: ${({ theme }) => theme.colors.primary[100]};
  opacity: 0.2;
`

const ChartTooltip = styled.div<{ $visible: boolean; $x: number; $y: number }>`
  position: absolute;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: 12px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 10;
  display: ${({ $visible }) => $visible ? 'block' : 'none'};
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  transform: translate(-50%, -100%);
  white-space: nowrap;
`

const Legend = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 14px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
  }
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const LegendColor = styled.div<{ $color: string }>`
  width: 16px;
  height: 3px;
  background-color: ${({ $color }) => $color};
  border-radius: 2px;
`

const RecommendationBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const RecommendationTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const RecommendationText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 14px;
  line-height: 1.4;
`

interface ForecastChartProps {
  forecast: DemandForecast;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecast }) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: '' });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <FiTrendingUp size={16} />;
      case 'decreasing':
        return <FiTrendingDown size={16} />;
      default:
        return <FiMinus size={16} />;
    }
  };

  // Chart dimensions and calculations
  const chartWidth = 100; // SVG viewBox width
  const chartHeight = 100; // SVG viewBox height
  const padding = 10;

  const dataPoints = forecast.data;
  const maxValue = Math.max(...dataPoints.map(d => Math.max(d.predicted, d.actual || 0)));
  const minValue = Math.min(...dataPoints.map(d => Math.min(d.predicted, d.actual || 0)));
  const valueRange = maxValue - minValue || 1;

  // Create SVG path for predicted line
  const predictedPath = dataPoints
    .map((point, index) => {
      const x = padding + (index / (dataPoints.length - 1)) * (chartWidth - 2 * padding);
      const y = chartHeight - padding - ((point.predicted - minValue) / valueRange) * (chartHeight - 2 * padding);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Create SVG path for actual line (if available)
  const actualPath = dataPoints
    .filter(point => point.actual !== undefined)
    .map((point, index) => {
      const actualIndex = dataPoints.indexOf(point);
      const x = padding + (actualIndex / (dataPoints.length - 1)) * (chartWidth - 2 * padding);
      const y = chartHeight - padding - ((point.actual! - minValue) / valueRange) * (chartHeight - 2 * padding);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Create confidence band
  const confidenceBandPath = dataPoints
    .map((point, index) => {
      const x = padding + (index / (dataPoints.length - 1)) * (chartWidth - 2 * padding);
      const yHigh = chartHeight - padding - ((point.predicted + point.confidence * 0.1 - minValue) / valueRange) * (chartHeight - 2 * padding);
      const yLow = chartHeight - padding - ((point.predicted - point.confidence * 0.1 - minValue) / valueRange) * (chartHeight - 2 * padding);
      
      if (index === 0) {
        return `M ${x} ${yHigh} L ${x} ${yLow}`;
      } else {
        return `L ${x} ${yHigh}`;
      }
    })
    .join(' ') + ' ' + dataPoints
    .slice()
    .reverse()
    .map((point, index) => {
      const actualIndex = dataPoints.length - 1 - index;
      const x = padding + (actualIndex / (dataPoints.length - 1)) * (chartWidth - 2 * padding);
      const yLow = chartHeight - padding - ((point.predicted - point.confidence * 0.1 - minValue) / valueRange) * (chartHeight - 2 * padding);
      return `L ${x} ${yLow}`;
    })
    .join(' ') + ' Z';

  const handleMouseMove = (event: React.MouseEvent, point: any, index: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setTooltip({
      visible: true,
      x,
      y,
      content: `Date: ${new Date(point.date).toLocaleDateString()}\nPredicted: ${point.predicted}\n${point.actual ? `Actual: ${point.actual}\n` : ''}Confidence: ${(point.confidence * 100).toFixed(1)}%`,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <ProductInfo>
          <ProductName>{forecast.productName}</ProductName>
          <ProductSku>SKU: {forecast.productSku}</ProductSku>
        </ProductInfo>
        <ForecastMeta>
          <MetaItem>
            <TrendIcon $trend={forecast.trend}>
              {getTrendIcon(forecast.trend)}
            </TrendIcon>
            <span>
              {forecast.trend.charAt(0).toUpperCase() + forecast.trend.slice(1)} trend
            </span>
          </MetaItem>
          <MetaItem>
            <AccuracyBadge $accuracy={forecast.accuracy}>
              {forecast.accuracy}% accuracy
            </AccuracyBadge>
          </MetaItem>
          <MetaItem>
            <span>{forecast.forecastDays} days</span>
          </MetaItem>
        </ForecastMeta>
      </ChartHeader>

      <ChartArea>
        <ChartSvg viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Grid lines */}
          <ChartGrid>
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} />
            ))}
            {[0, 25, 50, 75, 100].map(x => (
              <line key={x} x1={x} y1="0" x2={x} y2="100" />
            ))}
          </ChartGrid>

          {/* Confidence band */}
          <ConfidenceBand d={confidenceBandPath} />

          {/* Predicted line */}
          <ChartLine $type="predicted" d={predictedPath} />

          {/* Actual line (if available) */}
          {actualPath && <ChartLine $type="actual" d={actualPath} />}

          {/* Data points */}
          {dataPoints.map((point, index) => {
            const x = padding + (index / (dataPoints.length - 1)) * (chartWidth - 2 * padding);
            const y = chartHeight - padding - ((point.predicted - minValue) / valueRange) * (chartHeight - 2 * padding);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="0.5"
                fill="#3b82f6"
                style={{ cursor: 'pointer' }}
                onMouseMove={(e) => handleMouseMove(e, point, index)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </ChartSvg>

        <ChartTooltip 
          $visible={tooltip.visible} 
          $x={tooltip.x} 
          $y={tooltip.y}
        >
          {tooltip.content.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </ChartTooltip>
      </ChartArea>

      <Legend>
        <LegendItem>
          <LegendColor $color="#3b82f6" />
          <span>Predicted demand</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $color="#10b981" />
          <span>Actual demand</span>
        </LegendItem>
        <LegendItem>
          <div style={{ width: '16px', height: '8px', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: '2px' }} />
          <span>Confidence interval</span>
        </LegendItem>
      </Legend>

      <RecommendationBox>
        <RecommendationTitle>
          <FiInfo size={16} />
          Recommendation
        </RecommendationTitle>
        <RecommendationText>
          Based on the {forecast.trend} trend, we recommend ordering{' '}
          <strong>{forecast.recommendedQuantity} units</strong> by{' '}
          <strong>{new Date(forecast.nextOrderDate).toLocaleDateString()}</strong> to maintain optimal stock levels.
        </RecommendationText>
      </RecommendationBox>
    </ChartContainer>
  );
};