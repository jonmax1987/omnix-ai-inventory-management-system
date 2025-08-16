import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  minThreshold: number
  price: number
  supplier: string
  lastUpdated: string
}

export interface Alert {
  id: string
  type: 'low-stock' | 'out-of-stock' | 'forecast-warning'
  productId: string
  productName: string
  message: string
  severity: 'high' | 'medium' | 'low'
  timestamp: string
}

export interface Forecast {
  productId: string
  productName: string
  predictedDemand: number
  confidenceScore: number
  period: string
}

interface AppState {
  // Products
  products: Product[]
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  // Alerts
  alerts: Alert[]
  setAlerts: (alerts: Alert[]) => void
  dismissAlert: (id: string) => void
  
  // Forecasts
  forecasts: Forecast[]
  setForecasts: (forecasts: Forecast[]) => void
  
  // UI State
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Products
      products: [],
      setProducts: (products) => set({ products }),
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updates } : product
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      
      // Alerts
      alerts: [],
      setAlerts: (alerts) => set({ alerts }),
      dismissAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        })),
      
      // Forecasts
      forecasts: [],
      setForecasts: (forecasts) => set({ forecasts }),
      
      // UI State
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      error: null,
      setError: (error) => set({ error }),
    }),
    { name: 'omnix-store' }
  )
)