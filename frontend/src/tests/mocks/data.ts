// Mock data for accessibility testing

export const mockProducts = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    sku: 'COF-001',
    barcode: '1234567890123',
    category: 'Beverages',
    quantity: 150,
    minThreshold: 50,
    price: 12.99,
    cost: 8.50,
    supplier: 'Global Coffee Co',
    description: 'Premium arabica coffee beans from Colombia',
    unit: 'lb',
    expirationDate: '2025-12-31',
    location: 'Warehouse A, Shelf 3',
    createdAt: '2025-07-01T00:00:00Z',
    updatedAt: '2025-08-01T00:00:00Z',
    lastUpdated: '2025-08-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Organic Flour 25lb',
    sku: 'FLR-025',
    category: 'Baking',
    quantity: 25,
    minThreshold: 20,
    price: 18.99,
    cost: 12.00,
    supplier: 'Organic Mills Inc',
    description: 'Certified organic all-purpose flour',
    unit: 'bag',
    location: 'Warehouse B, Shelf 1',
    createdAt: '2025-06-15T00:00:00Z',
    updatedAt: '2025-07-20T00:00:00Z',
    lastUpdated: '2025-07-20T00:00:00Z'
  }
]

export const mockForecast = {
  productId: '1',
  productName: 'Premium Coffee Beans',
  productSku: 'COF-001',
  forecastDays: 30,
  data: [
    {
      date: '2025-08-11',
      predicted: 48,
      actual: 45,
      confidence: 0.87
    },
    {
      date: '2025-08-12',
      predicted: 52,
      confidence: 0.89
    },
    {
      date: '2025-08-13',
      predicted: 46,
      confidence: 0.85
    }
  ],
  trend: 'increasing' as const,
  seasonality: 'medium' as const,
  accuracy: 89.2,
  nextOrderDate: '2025-08-20',
  recommendedQuantity: 150
}

export const mockRecommendation = {
  id: 'rec_1',
  type: 'reorder' as const,
  priority: 'high' as const,
  productId: '1',
  productName: 'Premium Coffee Beans',
  productSku: 'COF-001',
  title: 'Urgent Reorder Required',
  description: 'Stock levels are critically low and demand is increasing.',
  impact: 'High risk of stockout',
  action: 'Order 150 units immediately to maintain service levels',
  estimatedSavings: 2400,
  daysUntilAction: 3,
  confidence: 0.92,
  createdAt: '2025-08-10T10:00:00Z'
}

export const mockAlerts = [
  {
    id: 'alert_1',
    type: 'low-stock',
    priority: 'high',
    productId: '2',
    productName: 'Organic Flour 25lb',
    message: 'Stock level is below minimum threshold',
    createdAt: '2025-08-10T09:00:00Z',
    dismissed: false
  },
  {
    id: 'alert_2',
    type: 'expiring-soon',
    priority: 'medium',
    productId: '1',
    productName: 'Premium Coffee Beans',
    message: 'Product expires in 30 days',
    createdAt: '2025-08-10T08:30:00Z',
    dismissed: false
  }
]

export const mockDashboardData = {
  summary: {
    totalValue: 4256.97,
    totalItems: 203,
    activeAlerts: 2,
    lowStockItems: 1
  },
  inventoryGraph: {
    data: [
      { date: '2025-08-01', value: 4100.50 },
      { date: '2025-08-02', value: 4150.25 },
      { date: '2025-08-03', value: 4200.75 },
      { date: '2025-08-04', value: 4180.90 },
      { date: '2025-08-05', value: 4220.15 },
      { date: '2025-08-06', value: 4256.97 }
    ]
  },
  categoryBreakdown: [
    { category: 'Beverages', value: 3856.12, percentage: 90.5 },
    { category: 'Baking', value: 400.85, percentage: 9.5 }
  ]
}