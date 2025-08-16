'use client'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { FiAlertTriangle, FiAlertCircle, FiX } from 'react-icons/fi'
// import { useTranslations } from 'next-intl' // Disabled for now
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert, alertsService } from '@/services/alerts'

const AlertsContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

const AlertsHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const AlertItem = styled(Card)<{ $severity: 'high' | 'medium' | 'low' }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-left: 4px solid ${({ $severity, theme }) => {
    switch ($severity) {
      case 'high':
        return theme.colors.error[500];
      case 'medium':
        return theme.colors.warning[500];
      default:
        return theme.colors.primary[500];
    }
  }};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`

const AlertContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`

const AlertIcon = styled.div<{ $severity: 'high' | 'medium' | 'low' }>`
  color: ${({ $severity, theme }) => {
    switch ($severity) {
      case 'high':
        return theme.colors.error[500];
      case 'medium':
        return theme.colors.warning[500];
      default:
        return theme.colors.primary[500];
    }
  }};
  margin-top: 2px;
`

const AlertDetails = styled.div`
  flex: 1;
`

const AlertMessage = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: 14px;
`

const AlertMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray[500]};
`

const SeverityBadge = styled.span<{ $severity: 'high' | 'medium' | 'low' }>`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${({ $severity, theme }) => {
    switch ($severity) {
      case 'high':
        return theme.colors.error[50];
      case 'medium':
        return theme.colors.warning[50];
      default:
        return theme.colors.primary[50];
    }
  }};
  color: ${({ $severity, theme }) => {
    switch ($severity) {
      case 'high':
        return theme.colors.error[700];
      case 'medium':
        return theme.colors.warning[700];
      default:
        return theme.colors.primary[700];
    }
  }};
`

const DismissButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.xs};
  min-width: auto;
`

const LoadingState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
`

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
`

interface UrgentAlertsProps {
  className?: string;
}

export const UrgentAlerts: React.FC<UrgentAlertsProps> = ({ className }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const t = useTranslations('dashboard'); // Disabled for now

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { alerts: alertsData } = await alertsService.getAlerts(undefined, undefined, 10);
      setAlerts(alertsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    try {
      await alertsService.dismissAlert(alertId);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  };

  useEffect(() => {
    loadAlerts();
    // Refresh alerts every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: Alert['type'], severity: Alert['severity']) => {
    if (severity === 'high') {
      return <FiAlertTriangle size={18} />;
    }
    return <FiAlertCircle size={18} />;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (error) {
    return (
      <AlertsContainer className={className}>
        <AlertsHeader>
          <Title>
            <FiAlertTriangle />
            Urgent Alerts
          </Title>
        </AlertsHeader>
        <Card padding="lg">
          <p style={{ color: 'red', textAlign: 'center' }}>
            Error: {error}
          </p>
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Button onClick={loadAlerts} variant="outline">
              Retry
            </Button>
          </div>
        </Card>
      </AlertsContainer>
    );
  }

  return (
    <AlertsContainer className={className}>
      <AlertsHeader>
        <Title>
          <FiAlertTriangle />
          Urgent Alerts
          {alerts.length > 0 && (
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '14px', 
              fontWeight: 'normal',
              color: '#6b7280' 
            }}>
              ({alerts.length})
            </span>
          )}
        </Title>
      </AlertsHeader>

      {loading ? (
        <Card>
          <LoadingState>Loading alerts...</LoadingState>
        </Card>
      ) : alerts.length === 0 ? (
        <Card>
          <EmptyState>
            ✅ No urgent alerts at this time
          </EmptyState>
        </Card>
      ) : (
        <AlertsList>
          {alerts.map((alert) => (
            <AlertItem key={alert.id} $severity={alert.severity}>
              <AlertContent>
                <AlertIcon $severity={alert.severity}>
                  {getAlertIcon(alert.type, alert.severity)}
                </AlertIcon>
                <AlertDetails>
                  <AlertMessage>{alert.message}</AlertMessage>
                  <AlertMeta>
                    <SeverityBadge $severity={alert.severity}>
                      {alert.severity}
                    </SeverityBadge>
                    <span>{formatTime(alert.createdAt)}</span>
                    {alert.productName && <span>{alert.productName}</span>}
                  </AlertMeta>
                </AlertDetails>
              </AlertContent>
              <DismissButton
                variant="ghost"
                size="sm"
                onClick={() => handleDismissAlert(alert.id)}
                aria-label={`Dismiss ${alert.message}`}
              >
                <FiX size={16} />
              </DismissButton>
            </AlertItem>
          ))}
        </AlertsList>
      )}
    </AlertsContainer>
  );
};