import styled from 'styled-components'
import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { useMotionSettings } from '@/hooks/useMotionSettings'
import { BUTTON_VARIANTS } from '@/utils/animations'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const StyledButton = styled(motion.button)<{
  $variant: ButtonProps['variant']
  $size: ButtonProps['size']
  $isLoading: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  position: relative;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Sizes */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return `
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: 14px;
          gap: ${theme.spacing.xs};
        `
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: 16px;
          gap: ${theme.spacing.sm};
        `
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 14px;
          gap: ${theme.spacing.xs};
        `
    }
  }}

  /* Variants */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background-color: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[200]};
          }
        `
      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.colors.primary[600]};
          border: 1px solid ${theme.colors.primary[200]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[50]};
            border-color: ${theme.colors.primary[300]};
          }
        `
      case 'ghost':
        return `
          background-color: transparent;
          color: ${theme.colors.gray[600]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[100]};
          }
        `
      default:
        return `
          background-color: ${theme.colors.primary[600]};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary[700]};
          }
        `
    }
  }}

  ${({ $isLoading }) =>
    $isLoading &&
    `
      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    `}

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const { shouldAnimate } = useMotionSettings();
    
    // Animation props based on motion preferences
    const motionProps = shouldAnimate('interaction') ? {
      variants: BUTTON_VARIANTS,
      initial: "rest",
      whileHover: disabled || isLoading ? "rest" : "hover",
      whileTap: disabled || isLoading ? "rest" : "tap",
    } : {};

    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $isLoading={isLoading}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...motionProps}
        {...props}
      >
        <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
          {children}
        </span>
      </StyledButton>
    );
  }
)

Button.displayName = 'Button'