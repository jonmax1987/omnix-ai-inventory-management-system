'use client'
import { OriginalLayout } from '@/components/layout/OriginalLayout'
import { UrgentAlerts } from '@/components/dashboard/UrgentAlerts'
import { InventoryOverview } from '@/components/dashboard/InventoryOverview'
import { InventoryGraph } from '@/components/dashboard/InventoryGraph'

export default function DashboardPage() {
  return (
    <OriginalLayout>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px', color: '#111827' }}>
          Dashboard
        </h1>
        
        <UrgentAlerts />
        <InventoryOverview />
        <InventoryGraph />
      </div>
    </OriginalLayout>
  )
}