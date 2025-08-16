'use client'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import styled from 'styled-components'
import { FiGlobe } from 'react-icons/fi'

const SwitcherContainer = styled.div`
  position: relative;
  display: inline-block;
`

const SwitcherButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[300]};
  }

  &:focus {
    outline: none;
    ring: 2px solid ${({ theme }) => theme.colors.primary[500]};
  }
`

const DropdownMenu = styled.div<{ $isOpen: boolean; $isRTL: boolean }>`
  position: absolute;
  top: 100%;
  ${({ $isRTL }) => $isRTL ? 'right: 0;' : 'left: 0;'}
  margin-top: 4px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 50;
  min-width: 120px;
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transform: translateY(${({ $isOpen }) => $isOpen ? '0' : '-8px'});
  transition: all 0.2s;
`

const DropdownItem = styled.button<{ $isActive?: boolean }>`
  display: block;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: ${({ $isActive, theme }) => $isActive ? theme.colors.primary[50] : 'transparent'};
  color: ${({ $isActive, theme }) => $isActive ? theme.colors.primary[700] : theme.colors.gray[700]};
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
  }

  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
  }

  [dir="rtl"] & {
    text-align: right;
  }
`

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    he: { name: 'עברית', flag: '🇮🇱' }
  }

  const isRTL = locale === 'he'
  const currentLanguage = languages[locale as keyof typeof languages] || languages.en

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return

    // Remove the current locale from the pathname if it exists
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    
    // Add the new locale to the pathname
    const newPath = newLocale === 'en' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`
    
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <SwitcherContainer className={className}>
      <SwitcherButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch language"
      >
        <FiGlobe size={16} />
        <span>{currentLanguage.flag} {currentLanguage.name}</span>
      </SwitcherButton>
      
      <DropdownMenu $isOpen={isOpen} $isRTL={isRTL}>
        {Object.entries(languages).map(([code, language]) => (
          <DropdownItem
            key={code}
            $isActive={code === locale}
            onClick={() => switchLanguage(code)}
          >
            {language.flag} {language.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </SwitcherContainer>
  )
}

