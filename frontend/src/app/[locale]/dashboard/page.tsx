'use client'
import { BilingualLayout } from '@/components/layout/BilingualLayout'
import { UrgentAlerts } from '@/components/dashboard/UrgentAlerts'
import { InventoryOverview } from '@/components/dashboard/InventoryOverview'
import { InventoryGraph } from '@/components/dashboard/InventoryGraph'
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations('dashboard')

  return (
    <BilingualLayout>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px', color: '#111827' }}>
          {t('title')}
        </h1>
        
        <UrgentAlerts />
        <InventoryOverview />
        <InventoryGraph />
      </div>
    </BilingualLayout>
  )
}