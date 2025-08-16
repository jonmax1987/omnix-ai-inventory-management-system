/**
 * OMNIX AI - Accessibility Testing Utilities
 * 
 * Comprehensive utilities for testing WCAG 2.1 AA compliance
 * and ensuring consistent accessibility across all components.
 */

import { getByRole, getAllByRole, queryByRole } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// WCAG 2.1 AA color contrast ratios
export const CONTRAST_RATIOS = {
  NORMAL_TEXT: 4.5,
  LARGE_TEXT: 3.0, // 18pt+ or 14pt+ bold
  NON_TEXT: 3.0    // UI components, graphics
}

// Minimum touch target size (CSS pixels)
export const MIN_TOUCH_TARGET_SIZE = 44

/**
 * Test keyboard navigation through focusable elements
 */
export const testKeyboardNavigation = async (container: HTMLElement) => {
  const user = userEvent.setup()
  
  // Get all focusable elements
  const focusableElements = getFocusableElements(container)
  
  if (focusableElements.length === 0) {
    return { success: true, message: 'No focusable elements found' }
  }
  
  // Test sequential focus navigation
  const firstElement = focusableElements[0] as HTMLElement
  firstElement.focus()
  
  let currentIndex = 0
  
  // Tab forward through elements
  for (let i = 1; i < focusableElements.length; i++) {
    await user.tab()
    const expectedElement = focusableElements[i]
    
    if (document.activeElement !== expectedElement) {
      return {
        success: false,
        message: `Tab navigation failed at index ${i}. Expected ${expectedElement.tagName}, got ${document.activeElement?.tagName}`
      }
    }
    currentIndex = i
  }
  
  // Tab backward through elements
  for (let i = currentIndex - 1; i >= 0; i--) {
    await user.tab({ shift: true })
    const expectedElement = focusableElements[i]
    
    if (document.activeElement !== expectedElement) {
      return {
        success: false,
        message: `Shift+Tab navigation failed at index ${i}. Expected ${expectedElement.tagName}, got ${document.activeElement?.tagName}`
      }
    }
  }
  
  return { success: true, message: `Successfully navigated ${focusableElements.length} focusable elements` }
}

/**
 * Get all focusable elements in container
 */
export const getFocusableElements = (container: HTMLElement): Element[] => {
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'summary',
    'details[open] summary',
    '[contenteditable="true"]'
  ].join(', ')
  
  return Array.from(container.querySelectorAll(focusableSelector)).filter(
    el => !isHidden(el as HTMLElement)
  )
}

/**
 * Check if element is hidden from assistive technology
 */
export const isHidden = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element)
  
  return (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0' ||
    element.hasAttribute('hidden') ||
    element.getAttribute('aria-hidden') === 'true'
  )
}

/**
 * Test heading hierarchy (h1 -> h2 -> h3, etc.)
 */
export const testHeadingHierarchy = (container: HTMLElement) => {
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  
  if (headings.length === 0) {
    return { success: true, message: 'No headings found' }
  }
  
  const levels = headings.map(h => parseInt(h.tagName.substring(1)))
  let currentLevel = 0
  
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i]
    
    // First heading should be h1 or start at reasonable level
    if (i === 0 && level > 2) {
      return {
        success: false,
        message: `First heading is h${level}, should start with h1 or h2`
      }
    }
    
    // Don't skip levels (h1 -> h3 is not allowed)
    if (currentLevel > 0 && level > currentLevel + 1) {
      return {
        success: false,
        message: `Heading level skip: h${currentLevel} to h${level} at index ${i}`
      }
    }
    
    currentLevel = Math.max(currentLevel, level)
  }
  
  return { success: true, message: `Heading hierarchy is valid (${headings.length} headings)` }
}

/**
 * Test that all images have alt text
 */
export const testImageAltText = (container: HTMLElement) => {
  const images = Array.from(container.querySelectorAll('img'))
  const missingAlt: HTMLImageElement[] = []
  
  images.forEach(img => {
    const hasAlt = img.hasAttribute('alt')
    const hasAriaLabel = img.hasAttribute('aria-label')
    const hasAriaLabelledby = img.hasAttribute('aria-labelledby')
    const isDecorative = img.getAttribute('role') === 'presentation' || 
                        img.getAttribute('role') === 'none' ||
                        img.getAttribute('alt') === ''
    
    if (!hasAlt && !hasAriaLabel && !hasAriaLabelledby && !isDecorative) {
      missingAlt.push(img)
    }
  })
  
  if (missingAlt.length > 0) {
    return {
      success: false,
      message: `${missingAlt.length} images missing alt text`,
      elements: missingAlt
    }
  }
  
  return { success: true, message: `All ${images.length} images have appropriate alt text` }
}

/**
 * Test that all form controls have labels
 */
export const testFormLabels = (container: HTMLElement) => {
  const formControls = Array.from(container.querySelectorAll(
    'input:not([type="hidden"]), select, textarea'
  )) as HTMLElement[]
  
  const unlabeled: HTMLElement[] = []
  
  formControls.forEach(control => {
    const hasLabel = hasAccessibleLabel(control)
    
    if (!hasLabel) {
      unlabeled.push(control)
    }
  })
  
  if (unlabeled.length > 0) {
    return {
      success: false,
      message: `${unlabeled.length} form controls missing labels`,
      elements: unlabeled
    }
  }
  
  return { success: true, message: `All ${formControls.length} form controls have labels` }
}

/**
 * Check if element has an accessible label
 */
export const hasAccessibleLabel = (element: HTMLElement): boolean => {
  // Check for aria-label
  if (element.hasAttribute('aria-label')) {
    return element.getAttribute('aria-label')?.trim() !== ''
  }
  
  // Check for aria-labelledby
  if (element.hasAttribute('aria-labelledby')) {
    const labelIds = element.getAttribute('aria-labelledby')?.split(' ') || []
    return labelIds.some(id => {
      const labelElement = document.getElementById(id)
      return labelElement && labelElement.textContent?.trim() !== ''
    })
  }
  
  // Check for associated label element
  const id = element.id
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`)
    if (label && label.textContent?.trim() !== '') {
      return true
    }
  }
  
  // Check if wrapped in label
  const parentLabel = element.closest('label')
  if (parentLabel && parentLabel.textContent?.trim() !== '') {
    return true
  }
  
  // Check for title attribute (not ideal but acceptable)
  if (element.hasAttribute('title')) {
    return element.getAttribute('title')?.trim() !== ''
  }
  
  return false
}

/**
 * Test color contrast ratios
 */
export const testColorContrast = (container: HTMLElement) => {
  const textElements = Array.from(container.querySelectorAll('*')).filter(
    el => el.textContent && el.textContent.trim() !== ''
  ) as HTMLElement[]
  
  const contrastIssues: { element: HTMLElement; contrast: number; required: number }[] = []
  
  textElements.forEach(element => {
    const style = window.getComputedStyle(element)
    const color = style.color
    const backgroundColor = getEffectiveBackgroundColor(element)
    
    if (color && backgroundColor && color !== backgroundColor) {
      const contrast = calculateContrastRatio(color, backgroundColor)
      const required = getRequiredContrastRatio(element, style)
      
      if (contrast < required) {
        contrastIssues.push({ element, contrast, required })
      }
    }
  })
  
  if (contrastIssues.length > 0) {
    return {
      success: false,
      message: `${contrastIssues.length} color contrast issues found`,
      issues: contrastIssues
    }
  }
  
  return { success: true, message: `Color contrast is adequate for ${textElements.length} elements` }
}

/**
 * Get effective background color (walking up DOM tree)
 */
export const getEffectiveBackgroundColor = (element: HTMLElement): string | null => {
  let current: HTMLElement | null = element
  
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current)
    const bgColor = style.backgroundColor
    
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      return bgColor
    }
    
    current = current.parentElement
  }
  
  return 'rgb(255, 255, 255)' // Default to white
}

/**
 * Calculate color contrast ratio
 */
export const calculateContrastRatio = (foreground: string, background: string): number => {
  const fgLum = getRelativeLuminance(foreground)
  const bgLum = getRelativeLuminance(background)
  
  const lighter = Math.max(fgLum, bgLum)
  const darker = Math.min(fgLum, bgLum)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Get relative luminance of a color
 */
export const getRelativeLuminance = (color: string): number => {
  // This is a simplified implementation
  // In a real application, you'd use a proper color parsing library
  const rgb = parseColor(color)
  if (!rgb) return 0
  
  const [r, g, b] = rgb.map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Parse color string to RGB values
 */
export const parseColor = (color: string): [number, number, number] | null => {
  // Handle rgb(r, g, b) format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (rgbMatch) {
    return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])]
  }
  
  // Handle rgba(r, g, b, a) format
  const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/)
  if (rgbaMatch) {
    return [parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3])]
  }
  
  // Handle hex colors
  const hexMatch = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hexMatch) {
    const hex = hexMatch[1]
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16)
      ]
    } else {
      return [
        parseInt(hex.substr(0, 2), 16),
        parseInt(hex.substr(2, 2), 16),
        parseInt(hex.substr(4, 2), 16)
      ]
    }
  }
  
  return null
}

/**
 * Get required contrast ratio for element
 */
export const getRequiredContrastRatio = (element: HTMLElement, style: CSSStyleDeclaration): number => {
  const fontSize = parseFloat(style.fontSize)
  const fontWeight = style.fontWeight
  
  // Large text: 18pt+ or 14pt+ bold (18pt = 24px, 14pt = ~18.7px)
  const isLargeText = fontSize >= 24 || (fontSize >= 18.7 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700))
  
  return isLargeText ? CONTRAST_RATIOS.LARGE_TEXT : CONTRAST_RATIOS.NORMAL_TEXT
}

/**
 * Test touch target sizes for mobile accessibility
 */
export const testTouchTargetSizes = (container: HTMLElement) => {
  const interactiveElements = Array.from(container.querySelectorAll(
    'button, a, input, select, textarea, [onclick], [role="button"], [role="link"]'
  )) as HTMLElement[]
  
  const smallTargets: { element: HTMLElement; width: number; height: number }[] = []
  
  interactiveElements.forEach(element => {
    const rect = element.getBoundingClientRect()
    
    if (rect.width < MIN_TOUCH_TARGET_SIZE || rect.height < MIN_TOUCH_TARGET_SIZE) {
      smallTargets.push({
        element,
        width: rect.width,
        height: rect.height
      })
    }
  })
  
  if (smallTargets.length > 0) {
    return {
      success: false,
      message: `${smallTargets.length} touch targets are smaller than ${MIN_TOUCH_TARGET_SIZE}px`,
      targets: smallTargets
    }
  }
  
  return { success: true, message: `All ${interactiveElements.length} touch targets meet minimum size requirements` }
}

/**
 * Test ARIA attributes validity
 */
export const testAriaAttributes = (container: HTMLElement) => {
  const elementsWithAria = Array.from(container.querySelectorAll('[aria-*]')) as HTMLElement[]
  const issues: { element: HTMLElement; attribute: string; issue: string }[] = []
  
  elementsWithAria.forEach(element => {
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('aria-')) {
        const issue = validateAriaAttribute(element, attr.name, attr.value)
        if (issue) {
          issues.push({ element, attribute: attr.name, issue })
        }
      }
    })
  })
  
  if (issues.length > 0) {
    return {
      success: false,
      message: `${issues.length} ARIA attribute issues found`,
      issues
    }
  }
  
  return { success: true, message: `All ARIA attributes are valid` }
}

/**
 * Validate individual ARIA attribute
 */
export const validateAriaAttribute = (element: HTMLElement, attribute: string, value: string): string | null => {
  // Basic validation for common ARIA attributes
  switch (attribute) {
    case 'aria-hidden':
      if (value !== 'true' && value !== 'false') {
        return `aria-hidden must be 'true' or 'false', got '${value}'`
      }
      break
      
    case 'aria-expanded':
      if (value !== 'true' && value !== 'false') {
        return `aria-expanded must be 'true' or 'false', got '${value}'`
      }
      break
      
    case 'aria-labelledby':
    case 'aria-describedby':
      const ids = value.split(' ')
      const missingIds = ids.filter(id => !document.getElementById(id))
      if (missingIds.length > 0) {
        return `${attribute} references non-existent IDs: ${missingIds.join(', ')}`
      }
      break
      
    case 'aria-label':
      if (!value.trim()) {
        return `aria-label cannot be empty`
      }
      break
  }
  
  return null
}

/**
 * Comprehensive accessibility test runner
 */
export interface AccessibilityTestResult {
  success: boolean
  message: string
  details?: any
}

export interface AccessibilityTestSuite {
  keyboardNavigation: AccessibilityTestResult
  headingHierarchy: AccessibilityTestResult
  imageAltText: AccessibilityTestResult
  formLabels: AccessibilityTestResult
  colorContrast: AccessibilityTestResult
  touchTargets: AccessibilityTestResult
  ariaAttributes: AccessibilityTestResult
}

export const runAccessibilityTests = (container: HTMLElement): AccessibilityTestSuite => {
  return {
    keyboardNavigation: testKeyboardNavigation(container) as AccessibilityTestResult,
    headingHierarchy: testHeadingHierarchy(container),
    imageAltText: testImageAltText(container),
    formLabels: testFormLabels(container),
    colorContrast: testColorContrast(container),
    touchTargets: testTouchTargetSizes(container),
    ariaAttributes: testAriaAttributes(container)
  }
}