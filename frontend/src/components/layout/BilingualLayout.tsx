'use client'
import styled from 'styled-components'
import { useState } from 'react'
import { FiMenu, FiX, FiHome, FiPackage, FiTrendingUp, FiBell } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { LoadingBar } from './LoadingBar'
import { RouteTransition } from './RouteTransition'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'

const LayoutContainer = styled.div<{ $isRTL: boolean }>`
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
  direction: ${({ $isRTL }) => $isRTL ? 'rtl' : 'ltr'};
`

const Sidebar = styled.aside<{ $isOpen: boolean; $isRTL: boolean }>`
  position: fixed;
  top: 0;
  ${({ $isRTL }) => $isRTL ? 'right: 0;' : 'left: 0;'}
  height: 100vh;
  width: 280px;
  background-color: white;
  border-${({ $isRTL }) => $isRTL ? 'left' : 'right'}: 1px solid #e5e7eb;
  z-index: 20;
  transform: translateX(${({ $isOpen, $isRTL }) => $isOpen ? '0' : ($isRTL ? '100%' : '-100%')});
  transition: transform 0.3s ease-in-out;

  @media (min-width: 1024px) {
    position: static;
    transform: translateX(0);
  }
`

const SidebarHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  
  h1 {
    font-size: 20px;
    font-weight: 700;
    color: #2563eb;
    margin: 0;
  }
`

const Navigation = styled.nav`
  padding: 16px 0;
`

const NavItem = styled.div<{ $isActive: boolean; $isRTL: boolean }>`
  padding: 12px 24px;
  margin: 0 16px;
  border-radius: 8px;
  transition: background-color 0.2s;
  background-color: ${({ $isActive }) => $isActive ? '#dbeafe' : 'transparent'};
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  a {
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${({ $isActive }) => $isActive ? '#2563eb' : '#374151'};
    font-weight: ${({ $isActive }) => $isActive ? 500 : 400};
    text-decoration: none;
    flex-direction: ${({ $isRTL }) => $isRTL ? 'row-reverse' : 'row'};
    
    svg {
      flex-shrink: 0;
      margin-${({ $isRTL }) => $isRTL ? 'left' : 'right'}: 12px;
      margin-${({ $isRTL }) => $isRTL ? 'right' : 'left'}: 0;
    }
  }
`

const MainContent = styled.main<{ $isRTL: boolean }>`
  flex: 1;
  margin-${({ $isRTL }) => $isRTL ? 'right' : 'left'}: 0;
  
  @media (min-width: 1024px) {
    margin-${({ $isRTL }) => $isRTL ? 'right' : 'left'}: 280px;
    margin-${({ $isRTL }) => $isRTL ? 'left' : 'right'}: 0;
  }
`

const Header = styled.header`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 10;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const MobileMenuButton = styled.button`
  display: block;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  
  @media (min-width: 1024px) {
    display: none;
  }
  
  &:hover {
    color: #111827;
  }
`

const ContentArea = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const Overlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  
  @media (min-width: 1024px) {
    display: none;
  }
`

interface LayoutProps {
  children: React.ReactNode
}

export const BilingualLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('nav')
  const isRTL = locale === 'he'

  const navigation = [
    { name: t('dashboard'), href: `/${locale}/dashboard`, icon: FiHome },
    { name: t('inventory'), href: `/${locale}/inventory`, icon: FiPackage },
    { name: t('forecasts'), href: `/${locale}/forecasts`, icon: FiTrendingUp },
    { name: t('notifications'), href: `/${locale}/alerts`, icon: FiBell },
  ]

  return (
    <LayoutContainer $isRTL={isRTL}>
      <LoadingBar />      
      <Overlay 
        $isVisible={sidebarOpen} 
        onClick={() => setSidebarOpen(false)} 
        aria-hidden="true"
      />
      
      <Sidebar $isOpen={sidebarOpen} $isRTL={isRTL} role="navigation" aria-label="Main navigation">
        <SidebarHeader>
          <h1>OMNIX AI</h1>
        </SidebarHeader>
        
        <Navigation>
          {navigation.map((item) => (
            <NavItem key={item.name} $isActive={pathname === item.href} $isRTL={isRTL}>
              <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                <item.icon size={20} aria-hidden="true" />
                {item.name}
              </Link>
            </NavItem>
          ))}
        </Navigation>
      </Sidebar>

      <MainContent $isRTL={isRTL}>
        <Header>
          <MobileMenuButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </MobileMenuButton>
          
          <LanguageSwitcher />
        </Header>
        
        <ContentArea>
          <RouteTransition>
            {children}
          </RouteTransition>
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  )
}