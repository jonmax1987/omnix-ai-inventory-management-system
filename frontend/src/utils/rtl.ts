import { css } from 'styled-components'

export const rtlMixin = css<{ $isRTL?: boolean }>`
  direction: ${({ $isRTL }) => ($isRTL ? 'rtl' : 'ltr')};
  text-align: ${({ $isRTL }) => ($isRTL ? 'right' : 'left')};
`

export const marginMixin = css<{ $isRTL?: boolean }>`
  margin-left: ${({ $isRTL }) => ($isRTL ? 'auto' : '0')};
  margin-right: ${({ $isRTL }) => ($isRTL ? '0' : 'auto')};
`

export const paddingMixin = (left: string, right: string) => css<{ $isRTL?: boolean }>`
  padding-left: ${({ $isRTL }) => ($isRTL ? right : left)};
  padding-right: ${({ $isRTL }) => ($isRTL ? left : right)};
`

export const borderMixin = (side: 'left' | 'right') => css<{ $isRTL?: boolean }>`
  border-${({ $isRTL }) => ($isRTL && side === 'left') || (!$isRTL && side === 'right') ? 'right' : 'left'}: ${props => props.theme.colors.gray[200]} 1px solid;
`

export const transformMixin = (translateX: string) => css<{ $isRTL?: boolean }>`
  transform: translateX(${({ $isRTL }) => $isRTL ? `-${translateX}` : translateX});
`

// Helper function to get direction-aware properties
export const getDirectionalStyle = (isRTL: boolean, ltrValue: string, rtlValue: string) => {
  return isRTL ? rtlValue : ltrValue
}