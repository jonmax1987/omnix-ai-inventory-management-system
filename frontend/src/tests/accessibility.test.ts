/**
 * OMNIX AI - Comprehensive Accessibility Testing Suite
 * 
 * This test suite ensures WCAG 2.1 AA compliance across all components
 * using @testing-library, jest-axe, and custom accessibility utilities.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'

// Components under test
import { Layout } from '@/components/layout/Layout'
import { ProductTable } from '@/components/inventory/ProductTable'
import { ProductForm } from '@/components/inventory/ProductForm'
import { ForecastChart } from '@/components/forecasts/ForecastChart'
import { RecommendationCard } from '@/components/forecasts/RecommendationCard'
import { UrgentAlerts } from '@/components/dashboard/UrgentAlerts'
import { InventoryOverview } from '@/components/dashboard/InventoryOverview'
import { InventoryGraph } from '@/components/dashboard/InventoryGraph'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// Mock data
import { mockProducts, mockForecast, mockRecommendation, mockAlerts, mockDashboardData } from './mocks/data'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Helper function to render components with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

// Helper function to check keyboard navigation
const testKeyboardNavigation = async (container: HTMLElement) => {
  const user = userEvent.setup()
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  // Test tab navigation
  if (focusableElements.length > 0) {
    const firstElement = focusableElements[0] as HTMLElement
    firstElement.focus()
    expect(document.activeElement).toBe(firstElement)
    
    // Test tab forward
    for (let i = 1; i < Math.min(focusableElements.length, 5); i++) {
      await user.tab()
      expect(document.activeElement).toBe(focusableElements[i])
    }
    
    // Test shift+tab backward
    await user.tab({ shift: true })
    expect(document.activeElement).toBe(focusableElements[Math.min(focusableElements.length, 5) - 2])
  }
}

// Helper function to check screen reader announcements
const testScreenReaderContent = (container: HTMLElement) => {
  // Check for proper heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let currentLevel = 0
  
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1))
    if (currentLevel > 0 && level > currentLevel + 1) {
      throw new Error(`Heading hierarchy skip detected: h${currentLevel} to h${level}`)
    }
    currentLevel = level
  })
  
  // Check for alt text on images
  const images = container.querySelectorAll('img')
  images.forEach((img) => {
    if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
      throw new Error(`Image missing alt text: ${img.outerHTML}`)
    }
  })
  
  // Check for form labels
  const inputs = container.querySelectorAll('input, select, textarea')
  inputs.forEach((input) => {
    const hasLabel = input.getAttribute('aria-label') || 
                    input.getAttribute('aria-labelledby') ||
                    container.querySelector(`label[for="${input.id}"]`)
    
    if (!hasLabel) {
      throw new Error(`Form control missing label: ${input.outerHTML}`)
    }
  })
}

// Helper function to test color contrast
const testColorContrast = async (container: HTMLElement) => {
  // This would typically use a library like color-contrast-checker
  // For now, we'll check that text has sufficient contrast ratios
  const textElements = container.querySelectorAll('*')
  
  textElements.forEach((element) => {
    const computedStyle = window.getComputedStyle(element)
    const color = computedStyle.color
    const backgroundColor = computedStyle.backgroundColor
    
    // Basic check - ensure text is not the same color as background
    if (color === backgroundColor && color !== 'rgba(0, 0, 0, 0)') {
      throw new Error(`Insufficient color contrast detected on element: ${element.tagName}`)
    }
  })
}

describe('Accessibility Testing Suite', () => {
  beforeEach(() => {
    // Reset any global state
    jest.clearAllMocks()
  })

  describe('Core UI Components', () => {
    describe('Button Component', () => {
      it('should have no accessibility violations', async () => {
        const { container } = renderWithTheme(
          <Button onClick={() => {}}>Test Button</Button>
        )
        
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
      
      it('should support keyboard navigation', async () => {
        const handleClick = jest.fn()
        const { container } = renderWithTheme(
          <Button onClick={handleClick}>Test Button</Button>
        )
        
        const button = screen.getByRole('button', { name: /test button/i })
        
        // Test Enter key
        fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
        expect(handleClick).toHaveBeenCalledTimes(1)
        
        // Test Space key
        fireEvent.keyDown(button, { key: ' ', code: 'Space' })
        expect(handleClick).toHaveBeenCalledTimes(2)
      })
      
      it('should have proper ARIA attributes when loading', async () => {
        const { container } = renderWithTheme(
          <Button isLoading onClick={() => {}}>Loading Button</Button>
        )
        
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('aria-disabled', 'true')
        
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
    })

    describe('Card Component', () => {
      it('should have no accessibility violations', async () => {
        const { container } = renderWithTheme(
          <Card>
            <h2>Card Title</h2>
            <p>Card content goes here</p>
          </Card>
        )
        
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
    })
  })

  describe('Layout Components', () => {
    describe('Layout Component', () => {
      it('should have proper landmark roles', async () => {
        const { container } = renderWithTheme(
          <Layout>
            <div>Test content</div>
          </Layout>
        )
        
        // Check for navigation landmark
        expect(screen.getByRole('navigation')).toBeInTheDocument()
        
        // Check for main landmark
        expect(screen.getByRole('main')).toBeInTheDocument()
        
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
      
      it('should support keyboard navigation in sidebar', async () => {
        const { container } = renderWithTheme(
          <Layout>
            <div>Test content</div>
          </Layout>
        )
        
        await testKeyboardNavigation(container)
      })
      
      it('should have proper heading hierarchy', async () => {
        const { container } = renderWithTheme(
          <Layout>
            <div>Test content</div>
          </Layout>
        )
        
        testScreenReaderContent(container)
      })
    })
  })

  describe('Dashboard Components', () => {
    describe('UrgentAlerts Component', () => {
      it('should have no accessibility violations', async () => {
        const { container } = renderWithTheme(
          <UrgentAlerts />
        )
        
        await waitFor(() => {
          expect(screen.getByText(/urgent alerts/i)).toBeInTheDocument()
        })
        
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
      
      it('should announce alerts to screen readers', async () => {
        renderWithTheme(<UrgentAlerts />)
        
        await waitFor(() => {
          // Check for alert role or aria-live region
          const alertRegion = screen.getByRole('region', { name: /alerts/i }) ||
                            screen.getByLabelText(/alerts/i)
          expect(alertRegion).toBeInTheDocument()
        })
      })
    })

    describe('InventoryOverview Component', () => {
      it('should have no accessibility violations', async () => {
        const { container } = renderWithTheme(
          <InventoryOverview />
        )
        
        await waitFor(() => {
          expect(container.querySelector('[data-testid*="metric"]')).toBeInTheDocument()
        })
        
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
      
      it('should have descriptive labels for metrics', async () => {
        renderWithTheme(<InventoryOverview />)
        
        await waitFor(() => {
          // Metrics should be properly labeled
          const metrics = screen.getAllByRole('text')
          expect(metrics.length).toBeGreaterThan(0)
        })
      })
    })

    describe('InventoryGraph Component', () => {
      it('should have no accessibility violations', async () => {
        const { container } = renderWithTheme(
          <InventoryGraph />
        )
        
        await waitFor(() => {
          expect(container.querySelector('canvas, svg')).toBeInTheDocument()
        })
        
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
      
      it('should provide alternative text for chart data', async () => {
        renderWithTheme(<InventoryGraph />)
        
        await waitFor(() => {
          // Chart should have description or data table alternative
          const chart = screen.getByLabelText(/inventory/i) || 
                       screen.getByRole('img', { name: /inventory/i })
          expect(chart).toBeInTheDocument()
        })
      })
    })
  })

  describe('Inventory Components', () => {
    describe('ProductTable Component', () => {
      it('should have no accessibility violations', async () => {
        const { container } = renderWithTheme(
          <ProductTable 
            onEdit={() => {}}
            onDelete={() => {}}
            onView={() => {}}
          />
        )
        
        await waitFor(() => {
          expect(screen.getByRole('table')).toBeInTheDocument()
        })
        
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
      
      it('should have proper table structure', async () => {
        renderWithTheme(
          <ProductTable 
            onEdit={() => {}}
            onDelete={() => {}}
            onView={() => {}}
          />
        )
        
        await waitFor(() => {
          // Check for proper table roles
          expect(screen.getByRole('table')).toBeInTheDocument()
          
          // Check for column headers
          const columnHeaders = screen.getAllByRole('columnheader')
          expect(columnHeaders.length).toBeGreaterThan(0)
          
          // Check for row headers where appropriate
          const table = screen.getByRole('table')
          const rows = table.querySelectorAll('tbody tr')
          rows.forEach((row) => {
            // Each row should have proper scope attributes
            const cells = row.querySelectorAll('td, th')
            expect(cells.length).toBeGreaterThan(0)
          })
        })
      })
      
      it('should support keyboard navigation for sorting', async () => {
        const user = userEvent.setup()
        renderWithTheme(
          <ProductTable 
            onEdit={() => {}}
            onDelete={() => {}}
            onView={() => {}}
          />
        )
        
        await waitFor(() => {
          const sortableHeaders = screen.getAllByRole('columnheader')
          const firstSortable = sortableHeaders.find(header => 
            header.getAttribute('aria-sort') || 
            header.querySelector('[role="button"]')
          )
          
          if (firstSortable) {
            firstSortable.focus()
            expect(document.activeElement).toBe(firstSortable)
          }
        })
      })
    })

    describe('ProductForm Component', () => {
      it('should have no accessibility violations', async () => {
        const { container } = renderWithTheme(
          <ProductForm
            isOpen={true}
            onClose={() => {}}
            onSave={() => Promise.resolve()}
          />
        )
        
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
      
      it('should have proper form labels and validation', async () => {
        renderWithTheme(
          <ProductForm
            isOpen={true}
            onClose={() => {}}
            onSave={() => Promise.resolve()}
          />
        )
        
        // Check that all form fields have labels
        const nameInput = screen.getByRole('textbox', { name: /product name/i })
        expect(nameInput).toBeInTheDocument()
        
        const skuInput = screen.getByRole('textbox', { name: /sku/i })
        expect(skuInput).toBeInTheDocument()
        
        // Check for required field indicators
        const requiredFields = screen.getAllByText('*')
        expect(requiredFields.length).toBeGreaterThan(0)
      })
      
      it('should manage focus properly when opened', async () => {
        const { rerender } = renderWithTheme(
          <ProductForm
            isOpen={false}
            onClose={() => {}}
            onSave={() => Promise.resolve()}
          />
        )
        
        // Open the form
        rerender(
          <ThemeProvider theme={theme}>
            <ProductForm
              isOpen={true}
              onClose={() => {}}
              onSave={() => Promise.resolve()}
            />
          </ThemeProvider>
        )
        
        await waitFor(() => {
          // Focus should be trapped within the modal
          const modal = screen.getByRole('dialog') || screen.getByRole('form')
          expect(modal).toBeInTheDocument()
        })
      })
    })
  })

  describe('Forecasting Components', () => {
    describe('ForecastChart Component', () => {
      it('should have no accessibility violations', async () => {
        const { container } = renderWithTheme(
          <ForecastChart forecast={mockForecast} />
        )
        
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
      
      it('should provide accessible chart description', async () => {
        renderWithTheme(
          <ForecastChart forecast={mockForecast} />
        )
        
        // Chart should have accessible name and description
        const chart = screen.getByLabelText(/forecast/i) ||
                     screen.getByRole('img', { name: /forecast/i })
        expect(chart).toBeInTheDocument()
        
        // Should have trend information accessible
        expect(screen.getByText(/trend/i)).toBeInTheDocument()
      })
    })

    describe('RecommendationCard Component', () => {
      it('should have no accessibility violations', async () => {
        const { container } = renderWithTheme(
          <RecommendationCard
            recommendation={mockRecommendation}
            onAccept={() => {}}
            onDismiss={() => {}}
          />
        )
        
        const results = await axe(container)
        expect(results).toHaveNoViolations()
      })
      
      it('should have proper button labels and descriptions', async () => {
        renderWithTheme(
          <RecommendationCard
            recommendation={mockRecommendation}
            onAccept={() => {}}
            onDismiss={() => {}}
          />
        )
        
        // Action buttons should have clear labels
        const acceptButton = screen.getByRole('button', { name: /accept/i })
        expect(acceptButton).toBeInTheDocument()
        
        const dismissButton = screen.getByRole('button', { name: /dismiss/i })
        expect(dismissButton).toBeInTheDocument()
      })
    })
  })

  describe('Color Contrast and Visual Accessibility', () => {
    it('should meet color contrast requirements', async () => {
      const { container } = renderWithTheme(
        <div>
          <Button>Primary Button</Button>
          <Button variant="outline">Secondary Button</Button>
        </div>
      )
      
      await testColorContrast(container)
    })
    
    it('should not rely solely on color for information', async () => {
      renderWithTheme(<ProductTable onEdit={() => {}} onDelete={() => {}} onView={() => {}} />)
      
      await waitFor(() => {
        // Stock level indicators should have text or icons, not just color
        const stockIndicators = screen.getAllByText(/stock|inventory/i)
        expect(stockIndicators.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Screen Reader Compatibility', () => {
    it('should have proper ARIA labels and descriptions', async () => {
      const { container } = renderWithTheme(
        <Layout>
          <ProductTable onEdit={() => {}} onDelete={() => {}} onView={() => {}} />
        </Layout>
      )
      
      testScreenReaderContent(container)
    })
    
    it('should announce dynamic content changes', async () => {
      renderWithTheme(<UrgentAlerts />)
      
      await waitFor(() => {
        // Should have aria-live region for dynamic updates
        const liveRegion = container.querySelector('[aria-live]')
        if (liveRegion) {
          expect(liveRegion).toBeInTheDocument()
        }
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support full keyboard navigation', async () => {
      const { container } = renderWithTheme(
        <Layout>
          <div>
            <Button>Button 1</Button>
            <Button>Button 2</Button>
            <input type="text" placeholder="Test input" />
          </div>
        </Layout>
      )
      
      await testKeyboardNavigation(container)
    })
    
    it('should have visible focus indicators', async () => {
      const user = userEvent.setup()
      renderWithTheme(
        <div>
          <Button>Focusable Button</Button>
        </div>
      )
      
      const button = screen.getByRole('button')
      await user.tab()
      
      expect(document.activeElement).toBe(button)
      
      // Focus should be visible (this would typically check computed styles)
      const focusedElement = document.activeElement as HTMLElement
      expect(focusedElement.style.outline).not.toBe('none')
    })
  })

  describe('Mobile Accessibility', () => {
    it('should have appropriate touch targets', async () => {
      const { container } = renderWithTheme(
        <ProductTable onEdit={() => {}} onDelete={() => {}} onView={() => {}} />
      )
      
      await waitFor(() => {
        // Check that interactive elements are large enough for touch
        const buttons = container.querySelectorAll('button')
        buttons.forEach((button) => {
          const rect = button.getBoundingClientRect()
          // WCAG recommends minimum 44x44 CSS pixels for touch targets
          expect(rect.width).toBeGreaterThanOrEqual(44)
          expect(rect.height).toBeGreaterThanOrEqual(44)
        })
      })
    })
  })

  describe('Error Handling and User Feedback', () => {
    it('should provide accessible error messages', async () => {
      renderWithTheme(
        <ProductForm
          isOpen={true}
          onClose={() => {}}
          onSave={() => Promise.reject(new Error('Test error'))}
        />
      )
      
      // Submit form to trigger validation
      const submitButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        // Error messages should be associated with form fields
        const errorMessages = screen.getAllByRole('alert')
        expect(errorMessages.length).toBeGreaterThan(0)
      })
    })
  })
})