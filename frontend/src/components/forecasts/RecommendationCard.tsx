'use client'
import styled from 'styled-components'
import { FiPackage, FiTrendingUp, FiAlertTriangle, FiTag, FiCheck, FiX, FiClock, FiDollarSign } from 'react-icons/fi'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Recommendation } from '@/services/forecasts'

const RecommendationContainer = styled(Card)<{ $priority: 'high' | 'medium' | 'low' }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid ${({ $priority, theme }) => {
    switch ($priority) {
      case 'high': return theme.colors.error[500];
      case 'medium': return theme.colors.warning[500];
      default: return theme.colors.primary[500];
    }
  }};
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`

const RecommendationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`

const RecommendationMeta = styled.div`
  flex: 1;
`

const RecommendationType = styled.div<{ $type: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ $type, theme }) => {
    switch ($type) {
      case 'reorder': return theme.colors.primary[600];
      case 'optimize': return theme.colors.success[600];
      case 'discontinue': return theme.colors.error[600];
      case 'promotion': return theme.colors.warning[600];
      default: return theme.colors.gray[600];
    }
  }};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const RecommendationTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  line-height: 1.3;
`

const ProductInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[600]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const PriorityBadge = styled.div<{ $priority: 'high' | 'medium' | 'low' }>`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${({ $priority, theme }) => {
    switch ($priority) {
      case 'high': return theme.colors.error[50];
      case 'medium': return theme.colors.warning[50];
      default: return theme.colors.primary[50];
    }
  }};
  color: ${({ $priority, theme }) => {
    switch ($priority) {
      case 'high': return theme.colors.error[700];
      case 'medium': return theme.colors.warning[700];
      default: return theme.colors.primary[700];
    }
  }};
`

const RecommendationDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.5;
  margin: ${({ theme }) => theme.spacing.md} 0;
`

const ImpactMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.md} 0;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const ImpactMetric = styled.div`
  text-align: center;
`

const MetricValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 2px;
`

const MetricLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ConfidenceBar = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0;
`

const ConfidenceLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const ConfidenceTrack = styled.div`
  height: 6px;
  background-color: ${({ theme }) => theme.colors.gray[200]};
  border-radius: 3px;
  overflow: hidden;
`

const ConfidenceFill = styled.div<{ $confidence: number }>`
  height: 100%;
  width: ${({ $confidence }) => $confidence}%;
  background-color: ${({ $confidence, theme }) => {
    if ($confidence >= 80) return theme.colors.success[500];
    if ($confidence >= 60) return theme.colors.warning[500];
    return theme.colors.error[500];
  }};
  transition: width 0.3s ease;
`

const ActionSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

const ActionText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[700]};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-weight: 500;
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`

const Timestamp = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray[400]};
`

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAccept?: (id: string) => void;
  onDismiss?: (id: string) => void;
  loading?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onAccept,
  onDismiss,
  loading = false,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reorder':
        return <FiPackage size={14} />;
      case 'optimize':
        return <FiTrendingUp size={14} />;
      case 'discontinue':
        return <FiAlertTriangle size={14} />;
      case 'promotion':
        return <FiTag size={14} />;
      default:
        return <FiPackage size={14} />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <RecommendationContainer $priority={recommendation.priority}>
      <Timestamp>{formatTimeAgo(recommendation.createdAt)}</Timestamp>
      
      <RecommendationHeader>
        <RecommendationMeta>
          <RecommendationType $type={recommendation.type}>
            {getTypeIcon(recommendation.type)}
            {recommendation.type}
          </RecommendationType>
          <RecommendationTitle>{recommendation.title}</RecommendationTitle>
          <ProductInfo>
            <FiPackage size={14} />
            {recommendation.productName} (SKU: {recommendation.productSku})
          </ProductInfo>
        </RecommendationMeta>
        <PriorityBadge $priority={recommendation.priority}>
          {recommendation.priority}
        </PriorityBadge>
      </RecommendationHeader>

      <RecommendationDescription>
        {recommendation.description}
      </RecommendationDescription>

      <ImpactMetrics>
        <ImpactMetric>
          <MetricValue>{recommendation.impact}</MetricValue>
          <MetricLabel>Impact</MetricLabel>
        </ImpactMetric>
        {recommendation.estimatedSavings && (
          <ImpactMetric>
            <MetricValue>
              <FiDollarSign size={14} style={{ display: 'inline', marginRight: '2px' }} />
              {formatCurrency(recommendation.estimatedSavings)}
            </MetricValue>
            <MetricLabel>Est. Savings</MetricLabel>
          </ImpactMetric>
        )}
        {recommendation.daysUntilAction && (
          <ImpactMetric>
            <MetricValue>
              <FiClock size={14} style={{ display: 'inline', marginRight: '2px' }} />
              {recommendation.daysUntilAction} days
            </MetricValue>
            <MetricLabel>Time Left</MetricLabel>
          </ImpactMetric>
        )}
      </ImpactMetrics>

      <ConfidenceBar>
        <ConfidenceLabel>
          <span>Confidence</span>
          <span>{(recommendation.confidence * 100).toFixed(0)}%</span>
        </ConfidenceLabel>
        <ConfidenceTrack>
          <ConfidenceFill $confidence={recommendation.confidence * 100} />
        </ConfidenceTrack>
      </ConfidenceBar>

      <ActionSection>
        <ActionText>
          <strong>Recommended Action:</strong> {recommendation.action}
        </ActionText>
        <ActionButtons>
          {onAccept && (
            <Button
              onClick={() => onAccept(recommendation.id)}
              disabled={loading}
              size="sm"
            >
              <FiCheck size={16} />
              Accept
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="outline"
              onClick={() => onDismiss(recommendation.id)}
              disabled={loading}
              size="sm"
            >
              <FiX size={16} />
              Dismiss
            </Button>
          )}
        </ActionButtons>
      </ActionSection>
    </RecommendationContainer>
  );
};