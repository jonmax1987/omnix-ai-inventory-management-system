# AI Frontend Development Training - Comprehensive Guide

## Table of Contents
1. [Modern Frontend Architecture](#modern-frontend-architecture)
2. [Next.js 15+ Best Practices](#nextjs-15-best-practices)
3. [TypeScript Advanced Patterns](#typescript-advanced-patterns)
4. [Styled Components & Design Systems](#styled-components--design-systems)
5. [State Management with Zustand](#state-management-with-zustand)
6. [Accessibility & WCAG Compliance](#accessibility--wcag-compliance)
7. [Performance Optimization](#performance-optimization)
8. [Component Architecture](#component-architecture)
9. [API Integration Patterns](#api-integration-patterns)
10. [Testing Strategies](#testing-strategies)
11. [OMNIX AI Specific Patterns](#omnix-ai-specific-patterns)

---

## Modern Frontend Architecture

### Atomic Design Methodology
```
Atoms → Molecules → Organisms → Templates → Pages
```

**Implementation Structure:**
```
src/
  components/
    ui/           # Atoms (Button, Input, Card)
    forms/        # Molecules (SearchBar, FilterPanel)
    features/     # Organisms (ProductTable, Dashboard)
    layout/       # Templates (Layout, Sidebar)
  app/            # Pages (Next.js App Router)
```

### Key Architectural Principles
1. **Single Responsibility** - Each component has one clear purpose
2. **Composition over Inheritance** - Build complex UIs from simple components
3. **Separation of Concerns** - UI, state, and business logic are separate
4. **Progressive Enhancement** - Works without JavaScript, better with it
5. **Mobile-First Design** - Start with mobile, enhance for larger screens

---

## Next.js 15+ Best Practices

### App Router Patterns
```typescript
// app/dashboard/page.tsx - Server Component by default
export default async function DashboardPage() {
  const data = await fetchDashboardData();
  
  return (
    <main>
      <DashboardMetrics data={data} />
      <ClientInteractiveChart />
    </main>
  );
}

// Use 'use client' only when needed
'use client';
export function InteractiveChart({ data }: ChartProps) {
  const [filter, setFilter] = useState('all');
  // Client-side interactivity
}
```

### Static vs Dynamic Rendering
```typescript
// Static Generation (default)
export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductList products={products} />;
}

// Dynamic with revalidation
export const revalidate = 3600; // 1 hour

// Force dynamic for real-time data
export const dynamic = 'force-dynamic';
```

### Loading and Error States
```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}

// app/dashboard/error.tsx
'use client';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Metadata API
```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | OMNIX AI',
    default: 'OMNIX AI - Smart Inventory Management'
  },
  description: 'AI-powered inventory optimization platform',
  keywords: ['inventory', 'AI', 'forecasting', 'management'],
  authors: [{ name: 'OMNIX AI Team' }],
  openGraph: {
    title: 'OMNIX AI',
    description: 'Smart inventory management with AI forecasting',
    type: 'website',
  },
};
```

---

## TypeScript Advanced Patterns

### Strict Type Safety
```typescript
// Global type definitions
interface Product {
  readonly id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  currentStock: number;
  minThreshold: number;
  price: number;
  lastUpdated: Date;
}

// Utility types for API responses
type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

type ProductsResponse = ApiResponse<Product[]>;
```

### Component Props with Generic Types
```typescript
interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  error?: string | null;
}

interface TableColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  sortable?: boolean;
}

// Usage
<Table<Product>
  data={products}
  columns={productColumns}
  onRowClick={handleProductSelect}
/>
```

### Custom Hooks with TypeScript
```typescript
interface UseApiOptions<T> {
  initialData?: T;
  revalidateOnFocus?: boolean;
  errorRetryCount?: number;
}

function useApi<T>(
  url: string,
  options: UseApiOptions<T> = {}
): {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  mutate: () => void;
} {
  // Implementation
}

// Strongly typed usage
const { data, error, isLoading } = useApi<Product[]>('/api/products');
```

---

## Styled Components & Design Systems

### Theme System Architecture
```typescript
// styles/theme.ts
const theme = {
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    neutral: {
      white: '#ffffff',
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        500: '#6b7280',
        900: '#111827',
      },
    },
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    xxl: '3rem',    // 48px
  },
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
} as const;

export type Theme = typeof theme;
export default theme;
```

### Component Styling Patterns
```typescript
// components/ui/Button.tsx
import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary[500]};
    color: ${({ theme }) => theme.colors.neutral.white};
    border: 1px solid ${({ theme }) => theme.colors.primary[500]};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary[600]};
      border-color: ${({ theme }) => theme.colors.primary[600]};
    }
  `,
  secondary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary[500]};
    border: 1px solid ${({ theme }) => theme.colors.primary[500]};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary[50]};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.neutral.gray[700]};
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.neutral.gray[100]};
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    height: 2rem;
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    height: 2.5rem;
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    height: 3rem;
  `,
};

const StyledButton = styled.button<ButtonProps>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;
  white-space: nowrap;
  
  /* Focus styles for accessibility */
  &:focus-visible {
    ring: 2px solid ${({ theme }) => theme.colors.primary[500]};
    ring-offset: 2px;
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Full width variant */
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  /* Apply variant styles */
  ${({ variant = 'primary' }) => variantStyles[variant]}
  
  /* Apply size styles */
  ${({ size = 'md' }) => sizeStyles[size]}
  
  /* Loading state */
  ${({ loading }) => loading && css`
    opacity: 0.7;
    cursor: wait;
  `}
`;

export const Button: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  loading,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      disabled={disabled || loading}
      loading={loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </StyledButton>
  );
};
```

### Responsive Design Patterns
```typescript
// utilities/responsive.ts
import { css } from 'styled-components';

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const media = {
  sm: (styles: TemplateStringsArray | string) => css`
    @media (min-width: ${breakpoints.sm}px) {
      ${styles}
    }
  `,
  md: (styles: TemplateStringsArray | string) => css`
    @media (min-width: ${breakpoints.md}px) {
      ${styles}
    }
  `,
  lg: (styles: TemplateStringsArray | string) => css`
    @media (min-width: ${breakpoints.lg}px) {
      ${styles}
    }
  `,
  xl: (styles: TemplateStringsArray | string) => css`
    @media (min-width: ${breakpoints.xl}px) {
      ${styles}
    }
  `,
  '2xl': (styles: TemplateStringsArray | string) => css`
    @media (min-width: ${breakpoints['2xl']}px) {
      ${styles}
    }
  `,
};

// Usage in components
const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  
  ${media.md`
    grid-template-columns: repeat(2, 1fr);
  `}
  
  ${media.lg`
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.lg};
  `}
`;
```

---

## State Management with Zustand

### Store Architecture
```typescript
// store/types.ts
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  price: number;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'stockout' | 'overstock';
  productId: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

export interface AppState {
  // Product management
  products: Product[];
  selectedProduct: Product | null;
  productsLoading: boolean;
  productsError: string | null;
  
  // Alerts
  alerts: Alert[];
  alertsCount: number;
  
  // UI state
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  
  fetchProducts: () => Promise<void>;
  
  dismissAlert: (alertId: string) => void;
  
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

### Store Implementation
```typescript
// store/index.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { productsApi } from '../services/api';
import type { AppState } from './types';

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        products: [],
        selectedProduct: null,
        productsLoading: false,
        productsError: null,
        alerts: [],
        alertsCount: 0,
        sidebarOpen: true,
        theme: 'light',
        
        // Product actions
        setProducts: (products) => 
          set({ products }, false, 'setProducts'),
          
        addProduct: async (productData) => {
          try {
            set({ productsLoading: true }, false, 'addProduct/pending');
            const newProduct = await productsApi.create(productData);
            set(
              (state) => ({
                products: [...state.products, newProduct],
                productsLoading: false,
                productsError: null,
              }),
              false,
              'addProduct/fulfilled'
            );
          } catch (error) {
            set(
              {
                productsLoading: false,
                productsError: error instanceof Error ? error.message : 'Unknown error',
              },
              false,
              'addProduct/rejected'
            );
          }
        },
        
        updateProduct: async (id, updates) => {
          try {
            const updatedProduct = await productsApi.update(id, updates);
            set(
              (state) => ({
                products: state.products.map((p) =>
                  p.id === id ? updatedProduct : p
                ),
                selectedProduct:
                  state.selectedProduct?.id === id
                    ? updatedProduct
                    : state.selectedProduct,
              }),
              false,
              'updateProduct'
            );
          } catch (error) {
            set(
              {
                productsError: error instanceof Error ? error.message : 'Update failed',
              },
              false,
              'updateProduct/error'
            );
          }
        },
        
        deleteProduct: async (id) => {
          try {
            await productsApi.delete(id);
            set(
              (state) => ({
                products: state.products.filter((p) => p.id !== id),
                selectedProduct:
                  state.selectedProduct?.id === id ? null : state.selectedProduct,
              }),
              false,
              'deleteProduct'
            );
          } catch (error) {
            set(
              {
                productsError: error instanceof Error ? error.message : 'Delete failed',
              },
              false,
              'deleteProduct/error'
            );
          }
        },
        
        setSelectedProduct: (product) =>
          set({ selectedProduct: product }, false, 'setSelectedProduct'),
          
        fetchProducts: async () => {
          try {
            set({ productsLoading: true, productsError: null }, false, 'fetchProducts/pending');
            const products = await productsApi.getAll();
            set(
              { products, productsLoading: false },
              false,
              'fetchProducts/fulfilled'
            );
          } catch (error) {
            set(
              {
                productsLoading: false,
                productsError: error instanceof Error ? error.message : 'Fetch failed',
              },
              false,
              'fetchProducts/rejected'
            );
          }
        },
        
        // Alert actions
        dismissAlert: (alertId) =>
          set(
            (state) => ({
              alerts: state.alerts.filter((alert) => alert.id !== alertId),
              alertsCount: Math.max(0, state.alertsCount - 1),
            }),
            false,
            'dismissAlert'
          ),
          
        // UI actions
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),
          
        setTheme: (theme) =>
          set({ theme }, false, 'setTheme'),
      }),
      {
        name: 'omnix-app-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'OmnixApp' }
  )
);

// Selectors for optimized re-renders
export const useProducts = () => useAppStore((state) => state.products);
export const useProductsLoading = () => useAppStore((state) => state.productsLoading);
export const useSelectedProduct = () => useAppStore((state) => state.selectedProduct);
export const useAlerts = () => useAppStore((state) => state.alerts);
export const useAlertsCount = () => useAppStore((state) => state.alertsCount);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useTheme = () => useAppStore((state) => state.theme);

// Actions
export const useProductActions = () =>
  useAppStore((state) => ({
    addProduct: state.addProduct,
    updateProduct: state.updateProduct,
    deleteProduct: state.deleteProduct,
    setSelectedProduct: state.setSelectedProduct,
    fetchProducts: state.fetchProducts,
  }));
```

### Custom Hooks for Complex State Logic
```typescript
// hooks/useProducts.ts
import { useEffect, useCallback } from 'react';
import { useAppStore, useProducts, useProductActions } from '../store';

export function useProductsWithFiltering() {
  const products = useProducts();
  const { fetchProducts } = useProductActions();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [products, searchTerm, categoryFilter, sortBy, sortOrder]);
  
  const updateFilters = useCallback((filters: {
    search?: string;
    category?: string;
    sortBy?: 'name' | 'stock' | 'price';
    sortOrder?: 'asc' | 'desc';
  }) => {
    if (filters.search !== undefined) setSearchTerm(filters.search);
    if (filters.category !== undefined) setCategoryFilter(filters.category);
    if (filters.sortBy !== undefined) setSortBy(filters.sortBy);
    if (filters.sortOrder !== undefined) setSortOrder(filters.sortOrder);
  }, []);
  
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setCategoryFilter('all');
    setSortBy('name');
    setSortOrder('asc');
  }, []);
  
  return {
    products: filteredProducts,
    filters: { searchTerm, categoryFilter, sortBy, sortOrder },
    updateFilters,
    clearFilters,
    totalProducts: products.length,
    filteredCount: filteredProducts.length,
  };
}
```

---

## Accessibility & WCAG Compliance

### Semantic HTML Structure
```typescript
// components/layout/Layout.tsx
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <div className="app-container">
        <header role="banner">
          <nav role="navigation" aria-label="Main navigation">
            <NavigationMenu />
          </nav>
        </header>
        
        <aside role="complementary" aria-label="Sidebar navigation">
          <Sidebar />
        </aside>
        
        <main id="main-content" role="main" tabIndex={-1}>
          {children}
        </main>
        
        <footer role="contentinfo">
          <FooterContent />
        </footer>
      </div>
    </>
  );
};
```

### ARIA Labels and Descriptions
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-pressed'?: boolean;
  'aria-expanded'?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  loading,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const buttonId = useId();
  
  return (
    <>
      <StyledButton
        id={buttonId}
        disabled={disabled || loading}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span aria-hidden="true">
            <LoadingSpinner size="sm" />
          </span>
        )}
        {children}
      </StyledButton>
      
      {loading && (
        <span id={`${buttonId}-loading`} className="sr-only">
          Loading, please wait
        </span>
      )}
    </>
  );
};
```

### Focus Management
```typescript
// hooks/useFocusManagement.ts
export function useFocusManagement() {
  const focusElementById = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.focus();
    }
  }, []);
  
  const focusFirstFocusableElement = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
    }
  }, []);
  
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);
  
  return {
    focusElementById,
    focusFirstFocusableElement,
    trapFocus,
  };
}
```

### Screen Reader Support
```typescript
// components/ui/Table.tsx
export const Table = <T extends Record<string, any>>({
  data,
  columns,
  caption,
  'aria-label': ariaLabel,
}: TableProps<T>) => {
  const tableId = useId();
  
  return (
    <TableContainer>
      <StyledTable
        id={tableId}
        role="table"
        aria-label={ariaLabel}
        aria-rowcount={data.length + 1} // +1 for header
      >
        {caption && (
          <caption className="sr-only">
            {caption}
          </caption>
        )}
        
        <thead role="rowgroup">
          <tr role="row">
            {columns.map((column, index) => (
              <th
                key={column.key as string}
                role="columnheader"
                scope="col"
                aria-sort={
                  column.sortable
                    ? sortBy === column.key
                      ? sortOrder === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                    : undefined
                }
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    aria-label={`Sort by ${column.header}`}
                  >
                    {column.header}
                    <SortIcon direction={getSortDirection(column.key)} />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody role="rowgroup">
          {data.map((item, rowIndex) => (
            <tr
              key={item.id || rowIndex}
              role="row"
              aria-rowindex={rowIndex + 2} // +2 because header is row 1
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${rowIndex}-${column.key as string}`}
                  role="gridcell"
                  aria-describedby={`${tableId}-col-${colIndex}`}
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
      
      {/* Hidden column descriptions for screen readers */}
      {columns.map((column, index) => (
        <div
          key={column.key as string}
          id={`${tableId}-col-${index}`}
          className="sr-only"
        >
          {column.header} column
        </div>
      ))}
    </TableContainer>
  );
};
```

---

## Performance Optimization

### Code Splitting and Lazy Loading
```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { lazy } from 'react';

// Lazy load heavy components
const InventoryChart = lazy(() => import('../../components/charts/InventoryChart'));
const ForecastAnalytics = lazy(() => import('../../components/analytics/ForecastAnalytics'));

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader />
      
      <Suspense fallback={<ChartSkeleton />}>
        <InventoryChart />
      </Suspense>
      
      <Suspense fallback={<AnalyticsSkeleton />}>
        <ForecastAnalytics />
      </Suspense>
    </div>
  );
}
```

### Memoization Patterns
```typescript
// components/ProductTable.tsx
import { memo, useMemo, useCallback } from 'react';

interface ProductTableProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const ProductTable = memo<ProductTableProps>(({
  products,
  onProductSelect,
  sortBy,
  sortOrder
}) => {
  // Memoize expensive calculations
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aVal = a[sortBy as keyof Product];
      const bVal = b[sortBy as keyof Product];
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });
  }, [products, sortBy, sortOrder]);
  
  // Memoize event handlers
  const handleRowClick = useCallback((product: Product) => {
    onProductSelect(product);
  }, [onProductSelect]);
  
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Stock</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {sortedProducts.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onClick={handleRowClick}
          />
        ))}
      </tbody>
    </table>
  );
});

// Memoize individual rows to prevent unnecessary re-renders
const ProductRow = memo<{
  product: Product;
  onClick: (product: Product) => void;
}>(({ product, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(product);
  }, [product, onClick]);
  
  return (
    <tr onClick={handleClick}>
      <td>{product.name}</td>
      <td>{product.currentStock}</td>
      <td>${product.price}</td>
    </tr>
  );
});
```

### Image Optimization
```typescript
// components/ui/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  className,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div 
        className={`image-placeholder ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span>Image not available</span>
      </div>
    );
  }
  
  return (
    <div className={`image-container ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={isLoading ? 'image-loading' : 'image-loaded'}
        onLoadingComplete={() => setLoading(false)}
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {isLoading && (
        <div className="image-skeleton" aria-hidden="true" />
      )}
    </div>
  );
};
```

---

## Component Architecture

### Compound Components Pattern
```typescript
// components/ui/Modal/Modal.tsx
interface ModalContextType {
  isOpen: boolean;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within Modal');
  }
  return context;
};

// Main Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
} = ({ isOpen, onClose, children }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted || !isOpen) return null;
  
  return (
    <ModalContext.Provider value={{ isOpen, close: onClose }}>
      <Portal>
        <ModalOverlay onClick={onClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {children}
          </ModalContent>
        </ModalOverlay>
      </Portal>
    </ModalContext.Provider>
  );
};

// Modal sub-components
const ModalHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { close } = useModalContext();
  
  return (
    <ModalHeaderContainer>
      {children}
      <button onClick={close} aria-label="Close modal">
        <X size={20} />
      </button>
    </ModalHeaderContainer>
  );
};

const ModalBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ModalBodyContainer>{children}</ModalBodyContainer>
);

const ModalFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ModalFooterContainer>{children}</ModalFooterContainer>
);

// Attach sub-components
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

// Usage
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header>
    <h2>Edit Product</h2>
  </Modal.Header>
  <Modal.Body>
    <ProductForm product={selectedProduct} />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleSave}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>
```

### Render Props Pattern
```typescript
// components/data/DataFetcher.tsx
interface DataFetcherProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }) => React.ReactNode;
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return <>{children({ data, loading, error, refetch: fetchData })}</>;
}

// Usage
<DataFetcher<Product[]> url="/api/products">
  {({ data: products, loading, error, refetch }) => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;
    if (!products) return <EmptyState />;
    
    return <ProductTable products={products} />;
  }}
</DataFetcher>
```

---

## API Integration Patterns

### Type-Safe API Client
```typescript
// services/api/client.ts
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || 'Request failed',
          response.status,
          errorData
        );
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error', 0, { originalError: error });
    }
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await this.request<T>(endpoint, { method: 'GET' });
    return response.data;
  }
  
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }
  
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }
  
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.request<T>(endpoint, { method: 'DELETE' });
    return response.data;
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'
);
```

### Service Layer Pattern
```typescript
// services/products.ts
export interface CreateProductRequest {
  name: string;
  sku: string;
  category: string;
  price: number;
  minThreshold: number;
  currentStock: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: 'name' | 'stock' | 'price';
  sortOrder?: 'asc' | 'desc';
}

class ProductsService {
  async getAll(params?: ProductsQueryParams): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    
    const query = searchParams.toString();
    const endpoint = query ? `/products?${query}` : '/products';
    
    return apiClient.get<PaginatedResponse<Product>>(endpoint);
  }
  
  async getById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  }
  
  async create(data: CreateProductRequest): Promise<Product> {
    return apiClient.post<Product>('/products', data);
  }
  
  async update(id: string, data: Partial<CreateProductRequest>): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, data);
  }
  
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/products/${id}`);
  }
  
  async bulkUpdate(updates: UpdateProductRequest[]): Promise<Product[]> {
    return apiClient.post<Product[]>('/products/bulk-update', { updates });
  }
}

export const productsService = new ProductsService();
```

### React Query Integration
```typescript
// hooks/api/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService, type CreateProductRequest } from '../services/products';

// Query keys factory
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductsQueryParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Get all products with filtering
export function useProducts(params?: ProductsQueryParams) {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => productsService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get single product
export function useProduct(id: string, enabled = true) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsService.getById(id),
    enabled: enabled && !!id,
  });
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsService.create(data),
    onSuccess: (newProduct) => {
      // Update the products list cache
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      
      // Optionally add the new product to existing cache
      queryClient.setQueryData(
        productKeys.detail(newProduct.id),
        newProduct
      );
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
    },
  });
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<CreateProductRequest>) =>
      productsService.update(id, data),
    onSuccess: (updatedProduct) => {
      // Update the specific product cache
      queryClient.setQueryData(
        productKeys.detail(updatedProduct.id),
        updatedProduct
      );
      
      // Update products in any list cache
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from all caches
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Usage in components
export function ProductsList() {
  const [params, setParams] = useState<ProductsQueryParams>({});
  
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = useProducts(params);
  
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  
  const handleCreateProduct = async (data: CreateProductRequest) => {
    try {
      await createMutation.mutateAsync(data);
      // Success handled by mutation's onSuccess
    } catch (error) {
      // Error handling
      toast.error('Failed to create product');
    }
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  
  return (
    <div>
      <ProductFilters onChange={setParams} />
      <ProductTable
        products={productsResponse?.data || []}
        onUpdate={(id, updates) => updateMutation.mutate({ id, ...updates })}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
      <CreateProductForm onSubmit={handleCreateProduct} />
    </div>
  );
}
```

---

## OMNIX AI Specific Patterns

### Dashboard Components Architecture
```typescript
// components/dashboard/DashboardMetrics.tsx
interface DashboardMetricsProps {
  timeRange: '24h' | '7d' | '30d';
  refreshInterval?: number;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  timeRange,
  refreshInterval = 30000, // 30 seconds
}) => {
  const {
    data: metrics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard', 'metrics', timeRange],
    queryFn: () => dashboardService.getMetrics({ timeRange }),
    refetchInterval: refreshInterval,
    staleTime: 15000, // 15 seconds
  });
  
  if (isLoading) return <MetricsSkeleton />;
  if (error) return <ErrorBoundary error={error} />;
  
  return (
    <MetricsGrid>
      <MetricCard
        title="Total Inventory Value"
        value={metrics?.totalValue}
        format="currency"
        trend={metrics?.valueTrend}
        icon={<DollarSign />}
      />
      <MetricCard
        title="Total Items"
        value={metrics?.totalItems}
        format="number"
        trend={metrics?.itemsTrend}
        icon={<Package />}
      />
      <MetricCard
        title="Low Stock Alerts"
        value={metrics?.lowStockCount}
        format="number"
        trend={metrics?.alertsTrend}
        icon={<AlertTriangle />}
        status={metrics?.lowStockCount > 0 ? 'warning' : 'success'}
      />
      <MetricCard
        title="Forecast Accuracy"
        value={metrics?.forecastAccuracy}
        format="percentage"
        icon={<TrendingUp />}
        status={metrics?.forecastAccuracy > 85 ? 'success' : 'warning'}
      />
    </MetricsGrid>
  );
};
```

### AI Integration Components
```typescript
// components/forecasts/ForecastChart.tsx
interface ForecastChartProps {
  productId: string;
  forecastDays: number;
  historicalData: HistoricalDataPoint[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  productId,
  forecastDays,
  historicalData,
}) => {
  const {
    data: forecastData,
    isLoading: forecastLoading,
    error: forecastError,
  } = useQuery({
    queryKey: ['forecast', productId, forecastDays],
    queryFn: () =>
      aiService.generateForecast({
        product_id: productId,
        product_name: 'Product Name', // Get from product data
        historical_data: historicalData,
        forecast_days: forecastDays,
      }),
    enabled: !!productId && historicalData.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const chartData = useMemo(() => {
    if (!forecastData) return null;
    
    // Combine historical and forecast data for chart
    const historical = historicalData.map((point) => ({
      date: point.date,
      actual: point.demand,
      type: 'historical' as const,
    }));
    
    const forecast = forecastData.forecast_data.map((point) => ({
      date: point.date,
      predicted: point.predicted,
      confidence: point.confidence,
      type: 'forecast' as const,
    }));
    
    return [...historical, ...forecast];
  }, [historicalData, forecastData]);
  
  if (forecastLoading) return <ChartSkeleton />;
  if (forecastError) return <ChartError error={forecastError} />;
  if (!chartData) return <EmptyChart />;
  
  return (
    <ChartContainer>
      <ChartHeader>
        <h3>Demand Forecast</h3>
        <ChartLegend>
          <LegendItem color="#3b82f6" label="Historical" />
          <LegendItem color="#10b981" label="Forecast" />
          <LegendItem color="#f59e0b" label="Confidence Interval" />
        </ChartLegend>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), 'MMM dd')}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
            formatter={(value, name) => [
              typeof value === 'number' ? value.toFixed(0) : value,
              name === 'actual' ? 'Actual Demand' : 'Predicted Demand',
            ]}
          />
          
          {/* Historical line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          
          {/* Forecast line */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
          />
          
          {/* Confidence area */}
          <Area
            type="monotone"
            dataKey="confidence"
            stroke="none"
            fill="#f59e0b"
            fillOpacity={0.2}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <ForecastInsights forecast={forecastData} />
    </ChartContainer>
  );
};
```

### Inventory Management Patterns
```typescript
// components/inventory/ProductTable.tsx
interface ProductTableProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  filters,
  onFiltersChange,
}) => {
  const { data, isLoading, error } = useProducts(filters);
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
      render: (value, product) => (
        <ProductNameCell>
          <ProductName>{value as string}</ProductName>
          <ProductSKU>{product.sku}</ProductSKU>
        </ProductNameCell>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
    },
    {
      key: 'currentStock',
      header: 'Current Stock',
      sortable: true,
      render: (value, product) => (
        <StockCell>
          <StockValue stock={value as number} threshold={product.minThreshold}>
            {value as number}
          </StockValue>
          <StockIndicator
            level={getStockLevel(value as number, product.minThreshold)}
          />
        </StockCell>
      ),
    },
    {
      key: 'minThreshold',
      header: 'Min Threshold',
      sortable: true,
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (value) => formatCurrency(value as number),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, product) => (
        <ActionButtons>
          <IconButton
            icon={<Edit />}
            aria-label={`Edit ${product.name}`}
            onClick={() => setEditingProduct(product)}
          />
          <IconButton
            icon={<Trash2 />}
            aria-label={`Delete ${product.name}`}
            variant="danger"
            onClick={() => handleDeleteProduct(product.id)}
          />
        </ActionButtons>
      ),
    },
  ];
  
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };
  
  const handleBulkAction = async (action: 'delete' | 'export') => {
    if (action === 'delete') {
      if (window.confirm(`Delete ${selectedProducts.length} selected products?`)) {
        // Implement bulk delete
      }
    } else if (action === 'export') {
      // Implement export functionality
    }
  };
  
  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>Products ({data?.total || 0})</TableTitle>
        <TableActions>
          {selectedProducts.length > 0 && (
            <BulkActions>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleBulkAction('delete')}
              >
                Delete Selected ({selectedProducts.length})
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleBulkAction('export')}
              >
                Export Selected
              </Button>
            </BulkActions>
          )}
          <Button onClick={() => setEditingProduct({} as Product)}>
            Add Product
          </Button>
        </TableActions>
      </TableHeader>
      
      <ProductFilters filters={filters} onChange={onFiltersChange} />
      
      <Table
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        error={error}
        selectable
        selectedRows={selectedProducts}
        onSelectionChange={setSelectedProducts}
        emptyState={<EmptyProductsState />}
      />
      
      {data && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          pageSize={data.limit}
          totalItems={data.total}
          onPageChange={(page) => onFiltersChange({ ...filters, page })}
        />
      )}
      
      {editingProduct && (
        <ProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(productData) => {
            // Handle save
            setEditingProduct(null);
          }}
        />
      )}
    </TableContainer>
  );
};
```

This comprehensive training guide covers:

1. **Modern architecture patterns** for scalable React applications
2. **Next.js 15+ best practices** including App Router and server components
3. **Advanced TypeScript patterns** for type safety and developer experience
4. **Styled Components design systems** with comprehensive theming
5. **Zustand state management** with proper patterns and selectors
6. **Complete accessibility implementation** following WCAG guidelines
7. **Performance optimization techniques** for production applications
8. **Component architecture patterns** for maintainable code
9. **API integration strategies** with React Query and type safety
10. **OMNIX AI specific patterns** for inventory management applications

Each section includes practical, production-ready code examples that can be directly applied to building high-quality frontend applications. The patterns emphasize maintainability, accessibility, performance, and developer experience.

Would you like me to expand on any particular section or add additional patterns for specific use cases?